import RelicBreakdownComponent from '@/components/relics/breakdown/breakdown.component'
import { RelicsResponse } from '@/components/relics/relics-response'

// TODO - Eventually we'll want to remove this when the backend is deployed somewhere
export const dynamic = 'force-dynamic'

async function getRelic(name: string): Promise<RelicsResponse> {
  const res = await fetch(`http://localhost:9002/api/v2/artifact?name=${name}`, { next: { revalidate: 1 } })
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function RelicBreakdown({ params }: { params: { name: string } }) {
  const relic = await getRelic(params.name)

  return (
    <div>
      <RelicBreakdownComponent relicId={relic.id} />
    </div>
  )
}
