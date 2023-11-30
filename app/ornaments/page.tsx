import { OrnamentsResponse } from '@/components/ornaments/ornaments-response'
import OrnamentsComponent from '@/components/ornaments/ornaments.component'

// TODO - Eventually we'll want to remove this when the backend is deployed somewhere
export const dynamic = 'force-dynamic'

async function getData(): Promise<OrnamentsResponse[]> {
  const res = await fetch('http://localhost:9003/api/v2/ornaments', { next: { revalidate: 1 } })
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Ornaments() {
  const data = await getData()

  return <OrnamentsComponent ornaments={data} />
}
