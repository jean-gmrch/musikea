Projet dans le cadre du cours de CI/CD, Formation INFRES, IMT Mines Alès

Ce projet est un site web conteneurisé qui utilise l'API Spotify pour proposer les fonctionnalités suivantes :
- Morceau de musique aléatoire
- Recherche d'un morceau de musique
- Affichage des paroles

## Getting Started

Creez un fichier `.env` à la racine du projet et ajoutez-y les variables d'environnement suivantes :
```
IMAGES_VERSION=3.0.0

SPOTIPY_CLIENT_ID=your_spotify_client_id
SPOTIPY_CLIENT_SECRET=your_spotify_client_secret

GENIUS_ACCESS_TOKEN=your_genius_api_token
```

Pour lancer le projet, exécutez la commande suivante :
```bash
docker-compose up
```

## Development

Pour lancer le projet en mode développement, exécutez la commande suivante :
```bash
docker-compose -f docker-compose.dev.yml up
```

## GitHub workflow

Le workflow GitHub est déclenché à chaque merge sur la branche `main`. Il construit l'image Docker, la pousse sur Docker Hub.
Lors d'une release, le workflow met le tag correspondant sur l'image Docker.
