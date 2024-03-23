import { ICharacter } from '@/components/characters-response'
import CharactersComponent from '@/components/characters.component'

// TODO - Eventually we'll want to remove this when the backend is deployed somewhere
export const dynamic = 'force-dynamic'

async function getData(): Promise<ICharacter[]> {
  const res = await fetch('http://localhost:9003/api/v2/characters?sort=rarity,desc&sort=name,asc', {
    next: { revalidate: 1 },
  })
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function App() {
  const data = await getData()

  return <CharactersComponent characters={data}></CharactersComponent>
}
