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
import { OrnamentsResponse } from './ornaments-response'

const columns: {
  name: string
  uid: string
}[] = [
  { name: 'NAME', uid: 'name' },
  { name: 'EFFECT', uid: 'effect' },
]

function buildImageUrl(imageUrl: string | null | undefined) {
  if (!imageUrl) {
    return ''
  }
  return `http://localhost:9003/api/${imageUrl}`
}

export default function OrnamentsComponent(
  props: PropsWithChildren<{
    ornaments: OrnamentsResponse[]
  }>,
) {
  const router = useRouter()
  const defaultSelection = new Set('') as Selection
  const [selectedKeys, setSelectedKeys] = React.useState(defaultSelection)
  const [nameFilter, setNameFilter] = React.useState('')
  const [ornamentsData, setOrnamentsData] = React.useState(props.ornaments)

  const filterData = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('filterData(): Starting...')
    console.log(e.target.value)
    setNameFilter(e.target.value)
    const filteredData = props.ornaments.filter(
      (ornament) => ornament.name?.toLowerCase().includes(e.target.value.toLowerCase()),
    )
    console.log(filteredData)
    setOrnamentsData(filteredData)
  }

  const renderCell = React.useCallback((ornament: OrnamentsResponse, columnKey: Key) => {
    if (typeof columnKey !== 'string') {
      return <p>ERROR</p>
    }
    const cellValue = ornament[columnKey]

    switch (columnKey) {
      case 'name':
        return <User avatarProps={{ radius: 'lg', src: buildImageUrl(ornament.imageUrl) }} name={cellValue} />
      case 'effect':
        if (ornament.twoPieceSetEffect) {
          return <p>{ornament.twoPieceSetEffect}</p>
        }
        return <p>No Effect Available</p>
      default:
        return cellValue
    }
  }, [])

  return (
    <div>
      <Input label="Ornament" placeholder="Filter by Ornament Name" value={nameFilter} onChange={filterData} />
      <Table
        aria-label="Example table with custom cells"
        color="success"
        selectionMode="single"
        selectionBehavior="toggle"
        selectedKeys={selectedKeys}
        onSelectionChange={(value) => {
          const testValue = value as Set<string>
          setSelectedKeys(value)
          const selectedUser = ornamentsData.find((relic) => relic.id === testValue.entries().next().value[0])
          if (selectedUser) {
            router.push(`/ornaments/breakdown/${selectedUser.name ?? 'error/error'}`)
          } else {
            alert('ERROR: Could not find ornament')
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
        <TableBody items={ornamentsData}>
          {(item) => (
            <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
