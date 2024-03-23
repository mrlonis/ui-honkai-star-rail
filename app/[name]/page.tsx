import { ICharacter } from '@/components/characters-response'

// TODO - Eventually we'll want to remove this when the backend is deployed somewhere
export const dynamic = 'force-dynamic'

async function getCharacter(name: string): Promise<ICharacter> {
  const res = await fetch(`http://localhost:9003/api/v2/character?name=${name}`, { next: { revalidate: 1 } })
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Character({ params }: { params: { name: string } }) {
  const character = await getCharacter(params.name)

  return (
    <div>
      <p>
        Character (ID: {character.id}) (Name: {params.name})
      </p>
    </div>
  )
}
