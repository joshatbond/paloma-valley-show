import { Sound } from '@pixi/sound'
import { Filter, Texture } from 'pixi.js-legacy'

export type IGame = {
  pass(): void
  showOptions(): void
  showMoves(move: string[]): void
  forcePlayerSwitch(): void
  getPlayerTeamHealth(): number[]
  getOpponentTeamHealth(): number[]
  loadMove(move: string): Promise<void>
}
export type IResource = {
  uniforms: { [index: string]: { step: number } }
  playingMusic: Sound | null
  getMusic(music: Music): Sound | undefined
  getShader(name: string): Filter | undefined
  getCry(id: string): string | undefined
  getOpponentTrainerTexture(): Texture | undefined
  getPlayerTrainerTexture(): Texture | undefined
  getFront(id: string): Texture[]
  getBack(id: string): Texture
}
export type IView = {
  resources: IResource

  update(): void

  getPlayerStatus(): Status
  getOpponentStatus(): Status
  setStatus(isPlayer: boolean, status: Partial<Status>): void

  setPlayerTexture(id?: string): void
  setOpponentTexture(id?: string): void

  slideInTrainers(): Event
  slideInOpponentTrainer(): Event
  slideOutPlayerTrainer(): Event
  slideOutOpponentTrainer(): Event
  showPlayerTeamStatus(hp: number[]): Event
  showOpponentTeamStatus(hp: number[]): Event
  hidePlayerTeamStatus(): Event
  hideOpponentTeamStatus(): Event
  showPlayerStats(member?: MemberObject): Event
  showOpponentStats(member?: MemberObject): Event
  hidePlayerStats(): Event
  hideOpponentStats(): Event
  showPlayer(): Event
  showOpponent(): Event
  hidePlayer(): Event
  hideOpponent(): Event
  screenShake(): Event
  invertColors(): Event
  toggleGrayScale(): Event
  clearTextbox(): Event
  text(text: string[], auto?: boolean): Event
  effect(name: string, isPlayer: boolean): Event | undefined
  sfx(name: string, wait?: boolean, panning?: number): Event
  cry(id: string, wait: boolean, isPlayer: boolean): Event
  shader(
    isPlayer: boolean,
    name: string,
    steps: number,
    delay: number,
    reverse: boolean
  ): Event
  particle(t: string, ...args: (number | string | string[])[]): Event
  anim(id: string, anim: AnimObject): Event

  startMusic(music: Music): void
}
export type Music = 'battle' | 'victory'
export type Status = {
  maxHp: number
  hp: number
  condition: string
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
export type BattleObject = {
  player: TeamObject
  opponent: TeamObject
  winMessage?: string
  battleMusic?: string
}
export type AnimObject = {
  delay: number[]
  ref: number[]
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
export type BattleInfo = {
  info: BattleObject
  data: { [url: string]: FighterObject }
}
