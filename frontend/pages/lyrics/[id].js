import { useRouter } from 'next/router'
 
export default function Page() {
  const router = useRouter()
  

  return (
    <div>
      <h2>Lyrics </h2>
      <p>Post: {router.query.id}</p>
    </div>
  )
}
