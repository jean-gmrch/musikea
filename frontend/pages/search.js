import axios from 'axios';
import { useState, useEffect } from "react";
import styles from '@/styles/Search.module.css';
import MusicCard from "@/components/MusicCard";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [nextLink, setNextLink] = useState("");
  const [previousLink, setPreviousLink] = useState("");
  const [results, setResults] = useState([]);
  const [timer, setTimer] = useState(null); // État pour gérer le timer
  const apiSearchTrackURL = '/api/search/';

  const handleSearch = async (term) => {
    try {
      console.log(term)
      const response = await axios.get(apiSearchTrackURL, {
        params: {
          query: term
        },
      });
      // Remplace cette partie par l'appel API si nécessaire
      // const response = [
      //   {
      //     "idSpotify": "1",
      //     "name": "Le Guide du Dev",
      //     "author": "Jean Dupont",
      //     "image": "https://source.unsplash.com/random/200x300?book"
      //   },
      //   {
      //     "idSpotify": "1",
      //     "name": "React pour les Pros",
      //     "author": "Marie Curie",
      //     "image": "https://source.unsplash.com/random/200x300?react"
      //   },
      //   {
      //     "idSpotify": "1",
      //     "name": "Next.js Mastery",
      //     "author": "Albert Einstein",
      //     "image": "https://source.unsplash.com/random/200x300?nextjs"
      //   },
      //   {
      //     "idSpotify": "1",
      //     "name": "JavaScript Moderne",
      //     "author": "Isaac Newton",
      //     "image": "https://source.unsplash.com/random/200x300?javascript"
      //   },
      //   {
      //     "idSpotify": "1",
      //     "name": "CSS Avancé",
      //     "author": "Ada Lovelace",
      //     "image": "https://source.unsplash.com/random/200x300?css"
      //   },
      //   {
      //     "idSpotify": "1",
      //     "name": "HTML de A à Z",
      //     "author": "Nikola Tesla",
      //     "image": "https://source.unsplash.com/random/200x300?html"
      //   },
      //   {
      //     "idSpotify": "1",
      //     "name": "Node.js et Express",
      //     "author": "Elon Musk",
      //     "image": "https://source.unsplash.com/random/200x300?nodejs"
      //   },
      //   {
      //     "idSpotify": "1",
      //     "name": "Base de Données SQL",
      //     "author": "Alan Turing",
      //     "image": "https://source.unsplash.com/random/200x300?database"
      //   },
      //   {
      //     "idSpotify": "1",
      //     "name": "Développement Mobile",
      //     "author": "Steve Jobs",
      //     "image": "https://source.unsplash.com/random/200x300?mobile"
      //   },
      //   {
      //     "idSpotify": "1",
      //     "name": "Cybersécurité 101",
      //     "author": "Edward Snowden",
      //     "image": "https://source.unsplash.com/random/200x300?security"
      //   }
      // ];

      // setResults(response.data); // Stocke la réponse dans `results`
      let results = response.data.tracks ? response.data.tracks : []
      setResults(results);
      setNextLink(response.data.next);
      setPreviousLink(response.data.previous)
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);

    // Si un précédent timer existe, on le nettoie
    if (timer) {
      clearTimeout(timer);
    }

    // Définir un nouveau timer pour attendre 1,5s avant d'exécuter la fonction
    const newTimer = setTimeout(() => {
      handleSearch(e.target.value);
    }, 1500);

    setTimer(newTimer); // Sauvegarder le timer pour pouvoir le nettoyer plus tard
  };

  const handleSearchFromUrl = async (url) => {
    try {
      const response = await axios.get(url);
      let results = response.data.tracks ? response.data.tracks : []
      setResults(results);
      setNextLink(response.data.next);
      setPreviousLink(response.data.previous)

    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);

    }
  }

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={handleChange} // Utilise la méthode handleChange
      />
      <button className={styles.searchButton}>Aléatoire</button>

      {/* Affichage des résultats */}
      <div className={styles.searchResultContainer}>
        {results.map((item, index) => (
          <MusicCard key={index} music={item} /> // Ajout de key pour l'optimisation des listes
        ))}
      </div>
      <div className={styles.footerButton}>
        {previousLink &&
          (<button className={styles.searchButton} onClick={() => handleSearchFromUrl(previousLink)}>Previous</button>)
        }
        
        {nextLink &&
          (<button className={styles.searchButton} onClick={() => handleSearchFromUrl(nextLink)}>Next</button>)
        }
      </div>

    </div>
  );
}
