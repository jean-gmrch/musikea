import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleSearch = async () => {
    // Simuler un appel API (remplacer par un vrai fetch à l'API Spotify)
    const mockResults = [
      {
        id: "1",
        name: "Song 1",
        artist: "Artist 1",
        image: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
      },
      {
        id: "2",
        name: "Song 2",
        artist: "Artist 2",
        image: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
      },
    ];
    setResults(mockResults);
  };

  return (
    <div className="search-container">
      <div className="search-box">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une musique..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Rechercher
        </button>
      </div>
      <ul className="search-results">
        {results.map((track) => (
          <li
            key={track.id}
            className="search-result-item"
            onClick={() => router.push(`/track/${track.id}`)}
          >
            <img src={track.image} alt={track.name} className="track-image" />
            <div>
              <p className="track-name">{track.name}</p>
              <p className="track-artist">{track.artist}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
