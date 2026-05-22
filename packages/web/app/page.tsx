import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Bucket List</h1>
      <p>Web version coming soon!</p>
      <Link href="/auth">
        <button>Sign In</button>
      </Link>
    </main>
  )
}
