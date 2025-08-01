export type IGame = {
  pass(): void
  showOptions(): void
  showMoves(move: string[]): void
  forcePlayerSwitch(): void
  getPlayerTeamHealth(): number[]
  getOpponentTeamHealth(): number[]
  loadMove(move: string): Promise<void>
}
export type Status = {
  maxHp: number
  hp: number
  condition: string
}

/**
 * Schematics for Battle JSON
 */

export type AnimObject = {
  delay: number[]
  ref: number[]
}
export type BattleInfo = {
  info: BattleObject
  data: { [url: string]: FighterObject }
}
export type BattleObject = {
  player: TeamObject
  opponent: TeamObject
  winMessage?: string
  battleMusic?: string
}
export type FighterObject = {
  baseAtk: number
  baseDef: number
  baseHp: number
  baseSpAtk: number
  baseSpDef: number
  baseSpd: number
  cry: string
  front: string
  back: string
  name: string
  types: string[]
  icon?: number
  music?: string
  anim: AnimObject
}
export type MemberObject = {
  id: string
  level: number
  gender: 'male' | 'female' | 'none'
  moves: string[]
  name: string
}
export type TeamObject = {
  name: string
  trainer: string
  team: MemberObject[]
}
