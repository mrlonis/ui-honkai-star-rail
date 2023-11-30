export interface RelicBreakdown {
  id: string
  name: string
  imageUrl: string | null | undefined
  twoPieceSetEffect: string | null | undefined
  fourPieceSetEffect: string | null | undefined
  characters: RelicBreakdownCharacter[] | null | undefined
  bodyStats: RelicBreakdownMap | null | undefined
  feetStats: RelicBreakdownMap | null | undefined
}

export interface RelicBreakdownMap {
  [key: string]: RelicBreakdownCharacter[]
}

export interface RelicBreakdownCharacter {
  [key: string]: string | string[] | null | undefined
  id: string
  name: string
  imageUrl: string | null | undefined
  substats: string[] | null | undefined
}
