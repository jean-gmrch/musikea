import { useState, useEffect } from "react";
import styles from '@/styles/Search.module.css';
import MusicCard from "@/components/MusicCard";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  

  useEffect(() => {
    if (searchTerm.trim() === "") return; // Évite les requêtes inutiles

    const fetchResults = async () => {
      try {
        const response = [
          {
            "name": "Le Guide du Dev",
            "author": "Jean Dupont",
            "image": "https://source.unsplash.com/random/200x300?book"
          },
          {
            "name": "React pour les Pros",
            "author": "Marie Curie",
            "image": "https://source.unsplash.com/random/200x300?react"
          },
          {
            "name": "Next.js Mastery",
            "author": "Albert Einstein",
            "image": "https://source.unsplash.com/random/200x300?nextjs"
          },
          {
            "name": "JavaScript Moderne",
            "author": "Isaac Newton",
            "image": "https://source.unsplash.com/random/200x300?javascript"
          },
          {
            "name": "CSS Avancé",
            "author": "Ada Lovelace",
            "image": "https://source.unsplash.com/random/200x300?css"
          },
          {
            "name": "HTML de A à Z",
            "author": "Nikola Tesla",
            "image": "https://source.unsplash.com/random/200x300?html"
          },
          {
            "name": "Node.js et Express",
            "author": "Elon Musk",
            "image": "https://source.unsplash.com/random/200x300?nodejs"
          },
          {
            "name": "Base de Données SQL",
            "author": "Alan Turing",
            "image": "https://source.unsplash.com/random/200x300?database"
          },
          {
            "name": "Développement Mobile",
            "author": "Steve Jobs",
            "image": "https://source.unsplash.com/random/200x300?mobile"
          },
          {
            "name": "Cybersécurité 101",
            "author": "Edward Snowden",
            "image": "https://source.unsplash.com/random/200x300?security"
          }
        ]       
        // const data = await response.json();
        setResults(response); // Stocke la réponse dans `results`
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchResults();
  }, [searchTerm]); // L'effet s'exécute à chaque changement de `searchTerm`

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className={styles.searchButton}>Aléatoire</button>

      {/* Affichage des résultats */}
      <div className={styles.searchResultContainer}>
        {results.map((item, index) => (
          <MusicCard music={item}></MusicCard>
           // Modifie selon la structure de tes données
        ))}
      </div>
    </div>
  );
}
