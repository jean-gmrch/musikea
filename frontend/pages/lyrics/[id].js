import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import styles from '@/styles/Search.module.css';
import axios from 'axios';


export default function Page() {
  const router = useRouter()
  const [track, setTrack] = useState("");
  const [lyrics, setLyrics] = useState("");


  async function fetchTrack() {
    if (!router.query.id) {
      return;
    }

    try {
      let apiTrackUrl = "/api/tracks/" + router.query.id;

      const response = await axios.get(apiTrackUrl);
      console.log(response.data);
      setTrack(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }

  async function fetchLyrics() {
    if (!router.query.id) {
      return;
    }

    try {
      let apiLyricsUrl = "/api/lyrics/" + router.query.id;
      const response = await axios.get(apiLyricsUrl);
      setLyrics(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }

  useEffect(() => {
    fetchTrack();
    fetchLyrics();
  }, [router.query.id])

  return (
    <div>
      <h2>Lyrics </h2>
      <p>Post: {track.name}</p>

      <div className={styles.searchResultContainer} style={{ whiteSpace: "pre-line" }}>
        {lyrics == "" ? <p>loading ...</p> : lyrics}
      </div>
    </div>
  )
}
