import * as PIXI_SOUND from '@pixi/sound'
import * as PIXI from 'pixi.js-legacy'

export type DeepEvent = (() => void) | TEvent | DeepEvent[] | undefined
export type TEvent = {
  init?: (() => void) | ((state: EventState) => void)
  done?: (tick: number, state: EventState) => boolean
  next?: TEvent
  /**
   * reference to last event, this allows O(1) appending to list
   */
  last?: TEvent
}
export type EventState = {
  /**
   * used if a certain event has a flag for waiting
   */
  waiting: boolean
  /**
   * used for health bar changes
   */
  hpStart: number
  hpEnd: number
  /**
   * used to wait until an event ends
   */
  duration: number
  /**
   * store any reference here (NOT TYPE-CHECKED!)
   */
  object: any
  /**
   * remember IDs for player/opponent
   */
  playerId?: string
  opponentId?: string
}

export type IGame = {
  pass(): void
  showOptions(): void
  showMoves(move: string[]): void
  forcePlayerSwitch(): void
  getPlayerTeamHealth(): number[]
  getOpponentTeamHealth(): number[]
  loadMove(move: string): Promise<void>
}
export type IView = {
  resources: Resource

  update(): void

  getPlayerStatus(): Status
  getOpponentStatus(): Status
  setStatus(isPlayer: boolean, status: Partial<Status>): void

  setPlayerTexture(id?: string): void
  setOpponentTexture(id?: string): void

  slideInTrainers(): TEvent
  slideInOpponentTrainer(): TEvent
  slideOutPlayerTrainer(): TEvent
  slideOutOpponentTrainer(): TEvent
  showPlayerTeamStatus(hp: number[]): TEvent
  showOpponentTeamStatus(hp: number[]): TEvent
  hidePlayerTeamStatus(): TEvent
  hideOpponentTeamStatus(): TEvent
  showPlayerStats(member?: MemberObject): TEvent
  showOpponentStats(member?: MemberObject): TEvent
  hidePlayerStats(): TEvent
  hideOpponentStats(): TEvent
  showPlayer(): TEvent
  showOpponent(): TEvent
  hidePlayer(): TEvent
  hideOpponent(): TEvent
  screenShake(): TEvent
  invertColors(): TEvent
  toggleGrayScale(): TEvent
  clearTextbox(): TEvent
  text(text: string[], auto?: boolean): TEvent
  effect(name: string, isPlayer: boolean): TEvent | undefined
  sfx(name: string, wait?: boolean, panning?: number): TEvent
  cry(id: string, wait: boolean, isPlayer: boolean): TEvent
  shader(
    isPlayer: boolean,
    name: string,
    steps: number,
    delay: number,
    reverse: boolean
  ): TEvent
  particle(t: string, ...args: (number | string | string[])[]): TEvent
  anim(id: string, anim: AnimObject): TEvent

  startMusic(music: Music): void
}
export type Music = 'battle' | 'victory'
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
