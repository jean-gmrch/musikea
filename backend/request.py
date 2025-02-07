import os
import requests
import time
import random
from fastapi import FastAPI
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

# Initialisation de FastAPI
app = FastAPI()

# Variables globales pour le token Spotify
ACCESS_TOKEN = None
TOKEN_EXPIRATION = 0  # Timestamp d'expiration du token


def get_access_token():
    """Récupère un nouveau token si l'ancien a expiré"""
    global ACCESS_TOKEN, TOKEN_EXPIRATION

    if ACCESS_TOKEN and time.time() < TOKEN_EXPIRATION:
        return ACCESS_TOKEN  # Retourne le token actuel s'il est encore valide

    url = "https://accounts.spotify.com/api/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "client_credentials",
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET
    }

    response = requests.post(url, headers=headers, data=data)
    response_data = response.json()

    ACCESS_TOKEN = response_data.get("access_token")
    expires_in = response_data.get("expires_in", 3600)  # Par défaut : 1h
    TOKEN_EXPIRATION = time.time() + expires_in  # Calcul de l'expiration

    return ACCESS_TOKEN


@app.get("/random-track")
def get_random_track():
    """Retourne un morceau aléatoire depuis Spotify"""
    token = get_access_token()

    # Générer une lettre aléatoire pour la recherche
    random_letter = random.choice("abcdefghijklmnopqrstuvwxyz")

    url = f"https://api.spotify.com/v1/search?q={random_letter}&type=track&limit=50"
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)
    data = response.json()

    tracks = data.get("tracks", {}).get("items", [])
    
    if not tracks:
        return {"message": "Aucun morceau trouvé, nouvelle tentative..."}

    # Sélectionner un morceau aléatoire
    random_track = random.choice(tracks)

    return {
        "title": random_track["name"],
        "artists": ", ".join(artist["name"] for artist in random_track["artists"]),
        "url": random_track["external_urls"]["spotify"],
        "album_cover": track["album"]["images"][0]["url"] if track["album"]["images"] else None
    }


@app.get("/search-track")
def search_track(query: str, start_index: int = 0):
    """Effectue une recherche de morceaux sur Spotify"""
    token = get_access_token()
    url = f"https://api.spotify.com/v1/search?q={query}&type=track&limit=10&offset={start_index}"
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)
    data = response.json()

    tracks = data.get("tracks", {}).get("items", [])
    
    if not tracks:
        return {"message": "Aucun résultat trouvé pour cette recherche."}

    results = []
    for track in tracks:
        results.append({
            "title": track["name"],
            "artists": ", ".join(artist["name"] for artist in track["artists"]),
            "url": track["external_urls"]["spotify"],
            "album_cover": track["album"]["images"][0]["url"] if track["album"]["images"] else None
        })

    return results
