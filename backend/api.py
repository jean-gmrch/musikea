from functools import lru_cache

from bs4 import BeautifulSoup

import requests
from fastapi import APIRouter, Request
from pydantic import BaseModel

from .config import settings

router = APIRouter(prefix="/api")


class TrackResult(BaseModel):
    id: str
    name: str
    artists: str
    image: str


@lru_cache(maxsize=1)
def spotify_access_token():
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "client_credentials",
        "client_id": settings.SPOTIFY_CLIENT_ID,
        "client_secret": settings.SPOTIFY_CLIENT_SECRET,
    }

    response = requests.post(settings.SPOTIFY_AUTH_URL, headers=headers, data=data)
    response_data = response.json()
    return response_data.get("access_token")


def spotify_call(request: requests.Request) -> requests.Response:
    token = spotify_access_token()
    request.headers["Authorization"] = f"Bearer {token}"

    with requests.Session() as session:
        prepared_request = request.prepare()
        print(prepared_request.url)
        response = session.send(prepared_request)

    if response.status_code == 401:
        spotify_access_token.cache_clear()
        return spotify_call(request)

    return response


def unpack_track(track: dict) -> TrackResult:
    return TrackResult(
        id=track["id"],
        name=track["name"],
        artists=", ".join(artist["name"] for artist in track["artists"]),
        image=track["album"]["images"][0]["url"] if track["album"]["images"] else None,
    )


@router.get("/search")
def search(query: str, limit: int = 10, offset: int = 0, request: Request = None):
    result = spotify_call(
        requests.Request(
            method="GET",
            url=settings.SPOTIFY_API_URL + "/search",
            params={"q": query, "type": "track", "offset": offset, "limit": limit},
        )
    )

    if result.status_code != 200:
        return result.json()

    tracks = map(unpack_track, result.json()["tracks"]["items"])

    total = result.json()["tracks"]["total"]
    if offset + limit < total:
        next_url = (
            f"{request.url.path}?query={query}&limit={limit}&offset={offset + limit}"
        )
    else:
        next_url = None

    if offset - limit >= 0:
        previous_url = (
            f"{request.url.path}?query={query}&limit={limit}&offset={offset - limit}"
        )
    else:
        previous_url = None

    return {
        "tracks": list(tracks),
        "total": total,
        "next": next_url,
        "previous": previous_url,
    }


@router.get("/search/random")
def get_random_track():
    result = requests.get(
        url="https://europe-west1-randommusicgenerator-34646.cloudfunctions.net/appV2/getRandomTrack",
        params={
            "market": "random",
            "genre": "random",
            "decade": "all",
            "tag_new": "false",
            "exclude_singles": "false",
        },
    )

    if result.status_code != 200:
        return result.json()

    return result.json()["data"]["track"]["id"]


@router.get("/track/{track_id}")
def get_track(track_id: str):
    result = spotify_call(
        requests.Request(
            method="GET", url=settings.SPOTIFY_API_URL + f"/tracks/{track_id}"
        )
    )

    if result.status_code != 200:
        return result.json()

    return unpack_track(result.json())


def lyrics_from_song_api_path(song_api_path):
    song_url = settings.GENIUS_API_URL + song_api_path
    response = requests.get(
        song_url, headers={"Authorization": f"Bearer {settings.GENIUS_ACCESS_TOKEN}"}
    )
    json = response.json()
    path = json["response"]["song"]["path"]
    
    page_url = "http://genius.com" + path
    page = requests.get(page_url)
    soup = BeautifulSoup(page.text, "html.parser")
    
    lyrics_divs = soup.find_all("div", {"data-lyrics-container": "true"})
    lyrics = "\n".join(div.get_text(separator="\n", strip=True) for div in lyrics_divs)
    
    return lyrics


@router.get("/lyrics/{track_id}")
def lyrics(track_id: str):
    track = get_track(track_id)
    response = requests.get(
        settings.GENIUS_API_URL + "/search",
        params={"q": track.name},
        headers={"Authorization": f"Bearer {settings.GENIUS_ACCESS_TOKEN}"},
    )

    if response.status_code != 200:
        return response.json()

    result = response.json()["response"]["hits"]
    if not result:
        return {"lyrics": "No lyrics found"}

    first = result[0]["result"]

    return lyrics_from_song_api_path(first["api_path"])
