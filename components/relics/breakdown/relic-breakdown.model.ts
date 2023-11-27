export interface RelicBreakdown {
  id: string
  name: string
  imageUrl: string | null | undefined
  onePieceSetEffect: string | null | undefined
  twoPieceSetEffect: string | null | undefined
  fourPieceSetEffect: string | null | undefined
  characters: RelicBreakdownCharacter[] | null | undefined
  sandsStats: RelicBreakdownMap | null | undefined
  gobletStats: RelicBreakdownMap | null | undefined
  circletStats: RelicBreakdownMap | null | undefined
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
