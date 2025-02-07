import os
import requests
import time
import random
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

# Variables pour stocker le token et son expiration
ACCESS_TOKEN = None
TOKEN_EXPIRATION = 0  # Timestamp d'expiration du token

def get_access_token():
    """Récupère un nouveau token d'accès si l'ancien est expiré"""
    global ACCESS_TOKEN, TOKEN_EXPIRATION

    if ACCESS_TOKEN and time.time() < TOKEN_EXPIRATION:
        return ACCESS_TOKEN  # Retourne le token actuel s'il est encore valide

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "client_credentials",
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET
    }

    response = requests.post(url, headers=headers, data=data)
    response_data = response.json()

    ACCESS_TOKEN = response_data.get("access_token")
    expires_in = response_data.get("expires_in", 3600)  # Durée de validité par défaut : 1h
    TOKEN_EXPIRATION = time.time() + expires_in  # Calculer l'expiration

    return ACCESS_TOKEN

def get_random_track():
    """Récupère un morceau aléatoire depuis Spotify"""
    token = get_access_token()

    # Générer une lettre aléatoire pour la recherche
    random_letter = random.choice("abcdefghijklmnopqrstuvwxyz")

    url = f"https://api.spotify.com/v1/search?q={random_letter}&type=track&limit=50"
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)
    data = response.json()

    tracks = data.get("tracks", {}).get("items", [])
    
    if not tracks:
        print("Aucun morceau trouvé, nouvelle tentative...")
        return get_random_track()

    # Sélectionner un morceau aléatoire
    random_track = random.choice(tracks)

    # Extraire les infos utiles
    track_name = random_track["name"]
    artists = ", ".join(artist["name"] for artist in random_track["artists"])
    track_url = random_track["external_urls"]["spotify"]

    print(f"🎵 Titre : {track_name}")
    print(f"🎤 Artiste(s) : {artists}")
    print(f"🔗 Lien Spotify : {track_url}")

if __name__ == "__main__":
    get_random_track()
