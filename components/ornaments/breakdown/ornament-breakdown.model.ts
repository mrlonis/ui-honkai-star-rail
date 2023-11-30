export interface OrnamentBreakdown {
  id: string
  name: string
  imageUrl: string | null | undefined
  twoPieceSetEffect: string | null | undefined
  characters: OrnamentBreakdownCharacter[] | null | undefined
  planarSphereStats: OrnamentBreakdownMap | null | undefined
  linkRopeStats: OrnamentBreakdownMap | null | undefined
}

export interface OrnamentBreakdownMap {
  [key: string]: OrnamentBreakdownCharacter[] | null | undefined
}

export interface OrnamentBreakdownCharacter {
  [key: string]: string | string[] | null | undefined
  id: string
  name: string
  imageUrl: string | null | undefined
  substats: string[] | null | undefined
}
