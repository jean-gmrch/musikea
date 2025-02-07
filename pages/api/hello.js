// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const axios = require("axios");

// Vos identifiants Spotify (vous devez les obtenir depuis le Spotify Developer Dashboard)
const CLIENT_ID = "VOTRE_CLIENT_ID";
const CLIENT_SECRET = "VOTRE_CLIENT_SECRET";

// Fonction pour obtenir le token d'accès
async function getAccessToken() {
    const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({ grant_type: "client_credentials" }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
            },
        }
    );
    return response.data.access_token;
}

// Fonction pour récupérer un son aléatoire
async function getRandomTrack() {
    const accessToken = await getAccessToken();

    // Liste de mots-clés génériques pour une recherche variée
    const randomKeywords = ["music", "song", "track", "beat", "melody", "vibes"];
    const randomKeyword = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];

    const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${randomKeyword}&type=track&limit=50`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );

    const tracks = response.data.tracks.items;
    if (tracks.length === 0) {
        console.log("Aucun morceau trouvé.");
        return null;
    }

    // Sélection aléatoire d'un morceau
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];

    console.log(`🎵 Titre : ${randomTrack.name}`);
    console.log(`👨‍🎤 Artiste : ${randomTrack.artists.map((a) => a.name).join(", ")}`);
    console.log(`🔗 Lien : ${randomTrack.external_urls.spotify}`);

    return randomTrack;
}

// Exécuter la fonction
getRandomTrack();
