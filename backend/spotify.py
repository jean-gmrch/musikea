from functools import lru_cache

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
def access_token():
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "client_credentials",
        "client_id": settings.SPOTIFY_CLIENT_ID,
        "client_secret": settings.SPOTIFY_CLIENT_SECRET,
    }

    response = requests.post(settings.SPOTIFY_AUTH_URL, headers=headers, data=data)
    response_data = response.json()
    return response_data.get("access_token")


def call(request: requests.Request) -> requests.Response:
    token = access_token()
    request.headers["Authorization"] = f"Bearer {token}"

    with requests.Session() as session:
        prepared_request = request.prepare()
        print(prepared_request.url)
        response = session.send(prepared_request)

    if response.status_code == 401:
        access_token.cache_clear()
        return call(request)

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
    result = call(
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


@router.get("/track/{track_id}")
def track(track_id: str):
    result = call(
        requests.Request(
            method="GET", url=settings.SPOTIFY_API_URL + f"/tracks/{track_id}"
        )
    )

    if result.status_code != 200:
        return result.json()

    return unpack_track(result.json())


@router.get("/search/random")
def random_track():
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
