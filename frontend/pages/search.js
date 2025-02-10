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
