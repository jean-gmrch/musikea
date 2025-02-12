import { useRouter } from 'next/router'
import { useEffect } from 'react';
 
export default function Page() {
  const router = useRouter()
  const [track, setTrack] = useState(null);

  const apiTrackUrl = "/api/track/" + router.query.id;

  async function fetchTrack() {
    try {
      const response = await axios.get(apiTrackUrl);
      console.log(response.data);
      setTrack(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }

  useEffect(() => {
    fetchTrack();
  })
  

  return (
    <div>
      <h2>Lyrics </h2>
      <p>Post: {router.query.id}</p>
    </div>
  )
}
