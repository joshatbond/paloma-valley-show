import * as PIXI_SOUND from '@pixi/sound'
import * as PIXI from 'pixi.js-legacy'

export type IGame = {
  pass(): void
  showOptions(): void
  showMoves(move: string[]): void
  forcePlayerSwitch(): void
  getPlayerTeamHealth(): number[]
  getOpponentTeamHealth(): number[]
  loadMove(move: string): Promise<void>
}
export type Resource = {
  uniforms: { [index: string]: { step: number } }
  playingMusic: PIXI_SOUND.Sound | null
  getMusic(music: Music): PIXI_SOUND.Sound | undefined
  getShader(name: string): PIXI.Filter | undefined
  getCry(id: string): string | undefined
  getOpponentTrainerTexture(): PIXI.Texture | undefined
  getPlayerTrainerTexture(): PIXI.Texture | undefined
  getFront(id: string): PIXI.Texture[]
  getBack(id: string): PIXI.Texture
}
export type Music = 'battle' | 'victory'
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
