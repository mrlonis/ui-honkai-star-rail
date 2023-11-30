import { RelicsResponse } from '@/components/relics/relics-response'
import RelicsComponent from '@/components/relics/relics.component'

// TODO - Eventually we'll want to remove this when the backend is deployed somewhere
export const dynamic = 'force-dynamic'

async function getData(): Promise<RelicsResponse[]> {
  const res = await fetch('http://localhost:9003/api/v2/relics', { next: { revalidate: 1 } })
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Relics() {
  const data = await getData()

  return <RelicsComponent relics={data} />
}
