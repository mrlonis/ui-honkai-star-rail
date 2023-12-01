'use client'

import {
  Input,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React, { Key, PropsWithChildren } from 'react'
import { buildImageUrl } from '../utils'
import { Relic } from './relics-response'

const columns: {
  name: string
  uid: string
}[] = [
  { name: 'NAME', uid: 'name' },
  { name: 'EFFECT', uid: 'effect' },
]

export default function RelicsComponent(
  props: PropsWithChildren<{
    relics: Relic[]
  }>,
) {
  const router = useRouter()
  const defaultSelection = new Set('') as Selection
  const [selectedKeys, setSelectedKeys] = React.useState(defaultSelection)
  const [nameFilter, setNameFilter] = React.useState('')
  const [relicsData, setRelicsData] = React.useState(props.relics)

  const filterData = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('filterData(): Starting...')
    console.log(e.target.value)
    setNameFilter(e.target.value)
    const filteredData = props.relics.filter(
      (relic) => relic.name?.toLowerCase().includes(e.target.value.toLowerCase()),
    )
    console.log(filteredData)
    setRelicsData(filteredData)
  }

  const renderCell = React.useCallback((relic: Relic, columnKey: Key) => {
    if (typeof columnKey !== 'string') {
      return <p>ERROR</p>
    }
    const cellValue = relic[columnKey]

    switch (columnKey) {
      case 'name':
        return <User avatarProps={{ radius: 'lg', src: buildImageUrl(relic.imageUrl) }} name={cellValue} />
      case 'effect':
        if (relic.twoPieceSetEffect && relic.fourPieceSetEffect) {
          return (
            <div>
              <p>{relic.twoPieceSetEffect}</p>
              <p>{relic.fourPieceSetEffect}</p>
            </div>
          )
        }
        if (relic.twoPieceSetEffect) {
          return <p>{relic.twoPieceSetEffect}</p>
        }
        if (relic.fourPieceSetEffect) {
          return <p>{relic.fourPieceSetEffect}</p>
        }
        return <p>No Effect Available</p>
      default:
        return cellValue
    }
  }, [])

  return (
    <div>
      <Input label="Relic" placeholder="Filter by Relic Name" value={nameFilter} onChange={filterData} />
      <Table
        aria-label="Example table with custom cells"
        color="success"
        selectionMode="single"
        selectionBehavior="toggle"
        selectedKeys={selectedKeys}
        onSelectionChange={(value) => {
          const testValue = value as Set<string>
          setSelectedKeys(value)
          const selectedUser = relicsData.find((relic) => relic.id === testValue.entries().next().value[0])
          if (selectedUser) {
            router.push(`/relics/breakdown/${selectedUser.name ?? 'error/error'}`)
          } else {
            alert('ERROR: Could not find relic')
          }
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={relicsData}>
          {(item) => (
            <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
