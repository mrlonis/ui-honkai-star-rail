import OrnamentBreakdownComponent from '@/components/ornaments/breakdown/breakdown.component'
import { OrnamentsResponse } from '@/components/ornaments/ornaments-response'

// TODO - Eventually we'll want to remove this when the backend is deployed somewhere
export const dynamic = 'force-dynamic'

async function getOrnament(name: string): Promise<OrnamentsResponse> {
  const res = await fetch(`http://localhost:9003/api/v2/ornament?name=${name}`, { next: { revalidate: 1 } })
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function OrnamentBreakdown({ params }: { params: { name: string } }) {
  const ornament = await getOrnament(params.name)

  return (
    <div>
      <OrnamentBreakdownComponent ornamentId={ornament.id} />
    </div>
  )
}
