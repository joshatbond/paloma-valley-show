import { Sound } from '@pixi/sound'
import { Filter, Resource, Texture } from 'pixi.js-legacy'

import { Move, moveInfo } from '../constants/moveInfo'
import { type IResource, type Music } from '../types'
import { createPIXILoader } from '../util/Context'

const SFX = [
  'pressab',
  'psn',
  'ballpoof',
  'hit',
  'hitresisted',
  'hitsupereffective',
  'faint',
]
const SHADERS = ['oppAppear', 'plyAppear', 'faint']

export class Resources implements IResource {
  uniforms: { [index: string]: { step: number } } = {}
  playingMusic: Sound | null = null

  private readonly demoFrontTexture: Texture
  private readonly demoBackTexture: Texture

  private readonly loader = createPIXILoader()

  private filters: Map<string, Filter> = new Map()
  private shaderNames: Set<string> = new Set()

  private moveCache: Set<string> = new Set()

  constructor(moves: Move[]) {
    this.demoFrontTexture = Texture.from('demofront.png')
    this.demoBackTexture = Texture.from('demoback.png')

    for (const sfx of SFX) {
      this.loader.add(sfx, sfx + '.wav')
    }

    for (const fs of SHADERS) {
      this.shaderNames.add(fs)
      this.loader.add(`shaders/${fs}.fs`)
    }
    this.loadMoves(moves)
  }

  load(callback: (resources: IResource) => any) {
    this.loader.load((_, resources) => {
      this.createShaders(resources)
      callback(this)
      this.loader.reset()
    })
  }

  forceLoad(): Promise<IResource> {
    return new Promise((resolve, reject) => {
      this.loader.onError.add(err => console.error(err))
      this.load(resolve)
    })
  }

  loadMoves(moves: Move[]) {
    for (const move of moves) {
      if (this.moveCache.has(move)) continue
      this.moveCache.add(move)
      const moveStill = (move + '_STILL') as Move
      if (moveInfo[moveStill] != null) {
        moves.push(moveStill)
      }
      const moveData = moveInfo[move]
      if ('sfx' in moveData) {
        console.log(`Loading sfx "${moveData.sfx}"`)
        this.loader.add(moveData.sfx, `attacksfx/${moveData.sfx}.wav`)
      }
      if ('shaders' in moveData) {
        moveData.shaders.forEach(s => {
          const file = `shaders/${s}.fs`
          console.log(`Trying to load shader "${s}" at "${file}"`)
          this.loader.add(file)
          this.shaderNames.add(s)
        })
      }
    }
  }

  private createShaders(resources: any) {
    this.shaderNames.forEach(s => {
      if (this.filters.get(s) != null) return
      console.log(`Created filter for ${s}`)
      this.uniforms[s] = { step: 0 }
      this.filters.set(
        s,
        new Filter(
          undefined,
          resources[`shaders/${s}.fs`].data as string,
          this.uniforms[s]
        )
      )
    })
  }

  getMusic(music: Music): Sound | undefined {
    throw new Error('Method not implemented.')
  }

  getShader(name: string): Filter | undefined {
    if (!this.filters.has(name)) {
      throw new Error(`filter ${name}`)
    }
    return this.filters.get(name)!
  }
  getCry(id: string): string | undefined {
    return undefined
  }
  getOpponentTrainerTexture(): Texture<Resource> | undefined {
    return undefined
  }
  getPlayerTrainerTexture(): Texture<Resource> | undefined {
    return undefined
  }
  getFront(id: string): Texture<Resource>[] {
    return [this.demoFrontTexture]
  }
  getBack(id: string): Texture<Resource> {
    return this.demoBackTexture
  }
}
