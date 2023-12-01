import { Card, CardBody } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { Character } from './characters-response'
import { buildImageUrl } from './utils'

export default function CharactersComponent(
  props: PropsWithChildren<{
    characters: Character[]
  }>,
) {
  return (
    <Card>
      <CardBody>
        <div className="flex flex-wrap items-start">
          {props.characters.map((character) => {
            let linkValue = `/${character.name}`
            let imageUrl = ''
            if (character.imageUrl) {
              imageUrl = buildImageUrl(character.imageUrl)
            }
            return (
              <Link
                key={character.id}
                href={linkValue}
                className="relative flex flex-col justify-center items-center w-[12.5%] p-15"
              >
                <Image
                  width={160}
                  height={188}
                  style={{
                    width: '50%',
                    height: 'auto',
                  }}
                  src={imageUrl}
                  alt={character.name}
                />
                <div className="text-center">{character.name}</div>
              </Link>
            )
          })}
        </div>
      </CardBody>
    </Card>
  )
}
