import { Ornament } from './ornaments/ornaments-response'
import { Relic } from './relics/relics-response'

export interface ICharacter {
  id: string
  name: string
  imageUrl: string | null | undefined
  rarity: number
  combatPathId: string
  combatPath: CombatPath
  bodyMainStatOne: string | null | undefined
  bodyMainStatTwo: string | null | undefined
  feetMainStatOne: string | null | undefined
  feetMainStatTwo: string | null | undefined
  planarSphereMainStat: string | null | undefined
  linkRopeMainStatOne: string | null | undefined
  linkRopeMainStatTwo: string | null | undefined
  substatOne: string | null | undefined
  substatTwo: string | null | undefined
  substatThree: string | null | undefined
  substatFour: string | null | undefined
  relicSetOneIdFirst: string | null | undefined
  relicSetOneFirst: Relic | null | undefined
  relicSetOneIdSecond: string | null | undefined
  relicSetOneSecond: Relic | null | undefined
  relicSetTwoIdFirst: string | null | undefined
  relicSetTwoFirst: Relic | null | undefined
  relicSetTwoIdSecond: string | null | undefined
  relicSetTwoSecond: Relic | null | undefined
  relicSetThreeIdFirst: string | null | undefined
  relicSetThreeFirst: Relic | null | undefined
  ornamentSetOneId: string | null | undefined
  ornamentSetOne: Ornament | null | undefined
  ornamentSetTwoId: string | null | undefined
  ornamentSetTwo: Ornament | null | undefined
  lightConeOneId: string | null | undefined
  lightConeOne: LightCone | null | undefined
  lightConeTwoId: string | null | undefined
  lightConeTwo: LightCone | null | undefined
  lightConeThreeId: string | null | undefined
  lightConeThree: LightCone | null | undefined
  lightConeFourId: string | null | undefined
  lightConeFour: LightCone | null | undefined
  lightConeFiveId: string | null | undefined
  lightConeFive: LightCone | null | undefined
}

export interface CombatPath {
  id: string
  name: string
  imageUrl: string | null | undefined
  description: string | null | undefined
}

export interface LightCone {
  id: string
  name: string
  imageUrl: string | null | undefined
  rarity: number
  combatPathId: string | null | undefined
  combatPath: CombatPath | null | undefined
  skill: string | null | undefined
}
