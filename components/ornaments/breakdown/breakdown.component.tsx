'use client'

import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import React from 'react'
import useSWR from 'swr'
import { OrnamentBreakdown, OrnamentBreakdownCharacter, OrnamentBreakdownMap } from './ornament-breakdown.model'
import { build_substats_string, getImageUrl } from './utils'

interface AccordionData {
  [key: string]: string | number | OrnamentBreakdownCharacter[]
  id: number
  stat: string
  characters: OrnamentBreakdownCharacter[]
}

function createAccordionData(ornamentBreakdownMap: OrnamentBreakdownMap | null | undefined): AccordionData[] {
  if (!ornamentBreakdownMap) {
    return []
  }
  let returnValue: AccordionData[] = []
  let i = 0
  for (const [key, value] of Object.entries(ornamentBreakdownMap)) {
    if (value !== null && value !== undefined) {
      returnValue.push({ id: i, stat: key, characters: value })
      i += 1
    }
  }
  return returnValue
}

const substatColumns = [
  { name: 'NAME', uid: 'name' },
  { name: 'SUBSTATS', uid: 'substats' },
]

const relicDepths = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
]

const fetcher = (ornamentId: string, ornamentDepth: string) => {
  const url = `http://localhost:9003/api/v2/ornamentBreakdown?ornamentId=${ornamentId}&ornamentDepth=${ornamentDepth}`
  return fetch(url, { next: { revalidate: 1 } }).then((res) => res.json())
}

export default function OrnamentBreakdownComponent(props: { ornamentId: string }) {
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  const [ornamentDepth, setOrnamentDepth] = React.useState('1')

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target) {
      setOrnamentDepth(e.target.value)
    }
  }

  const {
    data: ornamentBreakdown,
    error,
    isLoading,
  } = useSWR<OrnamentBreakdown, any, string[]>([props.ornamentId, ornamentDepth], ([ornamentId, ornamentDepth]) =>
    fetcher(ornamentId, ornamentDepth),
  )

  const renderSubstatsCell = React.useCallback((item: OrnamentBreakdownCharacter, columnKey: string | number) => {
    switch (columnKey) {
      case 'name':
        return (
          <p>
            <b>{item.name}</b>
          </p>
        )
      case 'substats':
        return (
          <p>
            <b>Substats:</b> {build_substats_string(item.substats)}
          </p>
        )
      default:
        return <p>Default</p>
    }
  }, [])

  const renderPieceEffect = React.useCallback((relicBreakdown: OrnamentBreakdown | null | undefined) => {
    if (!relicBreakdown) {
      return <p>No Relic to Display</p>
    }
    if (relicBreakdown.twoPieceSetEffect) {
      return (
        <p>
          <b>2-Piece:</b> {relicBreakdown.twoPieceSetEffect}
        </p>
      )
    }
    return <p>Default</p>
  }, [])

  const buildAccordion = React.useCallback(
    (accordionData: AccordionData[]) => {
      if (!accordionData || accordionData.length === 0) {
        return <p>No Relic to Display</p>
      }
      const accordionItems = accordionData.map((data) => {
        return (
          <AccordionItem key={data.id} aria-label={data.stat} title={data.stat}>
            <Table hideHeader aria-label="Example static collection table">
              <TableHeader columns={substatColumns}>
                {(column) => (
                  <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={data.characters} emptyContent={'No rows to display.'}>
                {(relicBreakdownCharacter) => (
                  <TableRow key={relicBreakdownCharacter.id}>
                    {(columnKey) => (
                      <TableCell className={columnKey === 'name' ? 'text-right w-[20%]' : 'text-left w-[85%]'}>
                        {renderSubstatsCell(relicBreakdownCharacter, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </AccordionItem>
        )
      })
      return (
        <Accordion variant="splitted" selectionMode="multiple">
          {accordionItems}
        </Accordion>
      )
    },
    [renderSubstatsCell],
  )

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return (
    <Card className="max-w-[100%]">
      <CardHeader className="flex gap-3">
        <Image alt="relic logo" height={40} radius="sm" src={getImageUrl(ornamentBreakdown?.imageUrl)} width={40} />
        <div className="flex flex-col">
          <p className="text-md">{ornamentBreakdown?.name}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {renderPieceEffect(ornamentBreakdown)}
        <br />
        <Select
          label="Select Relic Depth"
          selectedKeys={[ornamentDepth]}
          className="max-w-xs"
          onChange={handleSelectionChange}
        >
          {relicDepths.map((relicDepth) => (
            <SelectItem key={relicDepth.value} value={relicDepth.value}>
              {relicDepth.label}
            </SelectItem>
          ))}
        </Select>
      </CardBody>
      <Divider className="my-4" />
      <CardFooter>
        <Table isStriped aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>STAT TYPE</TableColumn>
            <TableColumn>BREAKDOWN</TableColumn>
          </TableHeader>
          <TableBody emptyContent={'No rows to display.'}>
            <TableRow key="1">
              <TableCell className="w-[20%]">
                <b>General Substats</b>
              </TableCell>
              <TableCell className="w-[80%]">
                {buildAccordion(
                  createAccordionData({
                    Substats: ornamentBreakdown?.characters,
                  } as OrnamentBreakdownMap),
                )}
              </TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell className="w-[20%]">
                <b>Planar Sphere Stats</b>
              </TableCell>
              <TableCell className="w-[80%]">
                {buildAccordion(createAccordionData(ornamentBreakdown?.planarSphereStats))}
              </TableCell>
            </TableRow>
            <TableRow key="3">
              <TableCell className="w-[20%]">
                <b>Link Rope Stats</b>
              </TableCell>
              <TableCell className="w-[80%]">
                {buildAccordion(createAccordionData(ornamentBreakdown?.linkRopeStats))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardFooter>
    </Card>
  )
}
