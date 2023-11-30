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
import { RelicBreakdown, RelicBreakdownCharacter, RelicBreakdownMap } from './relic-breakdown.model'
import { build_substats_string, getImageUrl } from './utils'

interface AccordionData {
  [key: string]: string | number | RelicBreakdownCharacter[]
  id: number
  stat: string
  characters: RelicBreakdownCharacter[]
}

function createAccordionData(relicBreakdownMap: RelicBreakdownMap | null | undefined): AccordionData[] {
  if (!relicBreakdownMap) {
    return []
  }
  let returnValue: AccordionData[] = []
  let i = 0
  for (const [key, value] of Object.entries(relicBreakdownMap)) {
    returnValue.push({ id: i, stat: key, characters: value })
    i += 1
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
  { label: '4', value: 4 },
  { label: '5', value: 5 },
]

const fetcher = (relicId: string, relicDepth: string) => {
  const url = `http://localhost:9003/api/v2/relicBreakdown?relicId=${relicId}&relicDepth=${relicDepth}`
  return fetch(url, { next: { revalidate: 1 } }).then((res) => res.json())
}

export default function RelicBreakdownComponent(props: { relicId: string }) {
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  const [relicDepth, setRelicDepth] = React.useState('1')

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target) {
      setRelicDepth(e.target.value)
    }
  }

  const {
    data: relicBreakdown,
    error,
    isLoading,
  } = useSWR<RelicBreakdown, any, string[]>([props.relicId, relicDepth], ([relicId, relicDepth]) =>
    fetcher(relicId, relicDepth),
  )

  const renderSubstatsCell = React.useCallback((item: RelicBreakdownCharacter, columnKey: string | number) => {
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

  const renderPieceEffect = React.useCallback((relicBreakdown: RelicBreakdown | null | undefined) => {
    if (!relicBreakdown) {
      return <p>No Relic to Display</p>
    }
    if (relicBreakdown.twoPieceSetEffect && relicBreakdown.fourPieceSetEffect) {
      return (
        <p>
          <b>2-Piece:</b> {relicBreakdown.twoPieceSetEffect}
          <br />
          <b>4-Piece:</b> {relicBreakdown.fourPieceSetEffect}
        </p>
      )
    }
    return <p>Default</p>
  }, [])

  const buildAccordion = React.useCallback(
    (accordionData: AccordionData[]) => {
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
      return <Accordion selectionMode="multiple">{accordionItems}</Accordion>
    },
    [renderSubstatsCell],
  )

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return (
    <Card className="max-w-[100%]">
      <CardHeader className="flex gap-3">
        <Image alt="relic logo" height={40} radius="sm" src={getImageUrl(relicBreakdown?.imageUrl)} width={40} />
        <div className="flex flex-col">
          <p className="text-md">{relicBreakdown?.name}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {renderPieceEffect(relicBreakdown)}
        <br />
        <Select
          label="Select Relic Depth"
          selectedKeys={[relicDepth]}
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
                <b>Flower & Plume Stats</b>
              </TableCell>
              <TableCell className="w-[80%]">
                {buildAccordion(
                  createAccordionData({
                    Substats: relicBreakdown?.characters,
                  } as RelicBreakdownMap),
                )}
              </TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell className="w-[20%]">
                <b>Body Stats</b>
              </TableCell>
              <TableCell className="w-[80%]">
                {buildAccordion(createAccordionData(relicBreakdown?.bodyStats))}
              </TableCell>
            </TableRow>
            <TableRow key="3">
              <TableCell className="w-[20%]">
                <b>Feet Stats</b>
              </TableCell>
              <TableCell className="w-[80%]">
                {buildAccordion(createAccordionData(relicBreakdown?.feetStats))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardFooter>
    </Card>
  )
}
