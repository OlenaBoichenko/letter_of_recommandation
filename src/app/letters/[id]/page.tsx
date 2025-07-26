import { notFound } from 'next/navigation'

interface Letter {
  id: string
  content: string
}

export default async function LetterPage({
  params,
}: {
    // Route parameters, where id is the letter identifier
  params: Promise<{ id: string }>
}) {
    // Wait for permission Promise
  const { id } = await params

// Request to the API to receive a letter by id
  const res = await fetch(`/api/letters/${id}`)
  if (!res.ok) return notFound()

  const letter: Letter = await res.json()

  return (
    <div>
      <h1>Letter № {letter.id}</h1>
      <p>{letter.content}</p>
    </div>
  )
}

