import * as PIXI_SOUND from '@pixi/sound'
import * as PIXI from 'pixi.js-legacy'

import {
  texture001Back,
  texture001Front,
  texture004Back,
  texture004Front,
  texture007Back,
  texture007Front,
  texture032Back,
  texture032Front,
  textureOpponent,
  texturePlayer,
} from '../assets/textures'
import { moveInfo } from '../constants/moves'
import { type Music, type Resource } from '../types'

const SFX = [
  'ballpoof',
  'faint',
  'hit',
  'hitresisted',
  'hitsupereffective',
  'pressab',
  'psn',
]
const SHADERS = ['oppAppear', 'plyAppear', 'faint', 'surf']
const music = ['']
const CRIES = ['001', '004', '007', '032']

export default class Resources implements Resource {
  uniforms: { [index: string]: { step: number } } = {}
  playingMusic: PIXI_SOUND.Sound | null = null

  private readonly frontTexture = {
    '001': [texture001Front],
    '004': [texture004Front],
    '007': [texture007Front],
    '032': [texture032Front],
    blue: [textureOpponent],
  } as Record<string, PIXI.Texture[]>
  private readonly backTexture = {
    '001': texture001Back,
    '004': texture004Back,
    '007': texture007Back,
    '032': texture032Back,
    ethan: texturePlayer,
  } as Record<string, PIXI.Texture>

  private readonly loader = new PIXI.Loader()

  private filters: Map<string, PIXI.Filter> = new Map()
  private shaderNames: Set<string> = new Set()

  private cryNames: Set<string> = new Set()

  private moveCache: Set<string> = new Set()

  constructor(moves: string[]) {
    for (const sfx of SFX) {
      this.loader.add(sfx, `/battle/audio/${sfx}.wav`)
    }
    for (const cry of CRIES) {
      this.cryNames.add(cry)
      this.loader.add(cry, `/battle/audio/${cry}.mp3`)
    }

    for (const fs of SHADERS) {
      this.shaderNames.add(fs)
      this.loader.add(`shaders/${fs}.fs`)
    }
    this.loadMoves(moves)
  }

  load(callback: (resources: Resource) => void) {
    this.loader.load((_, resources) => {
      this.createShaders(resources)
      callback(this)
      this.loader.reset()
    })
  }

  forceLoad() {
    return new Promise<Resource>((resolve, reject) => {
      this.loader.onError.add(err => console.error(err))
      this.load(resolve)
    })
  }

  loadMoves(moves: string[]) {
    for (const move of moves) {
      if (this.moveCache.has(move)) continue
      this.moveCache.add(move)

      const moveData = moveInfo[move]
      if (moveData.sfx) {
        console.log(`Loading sfx "${moveData.sfx}"`)
        this.loader.add(moveData.sfx, `battle/audio/${moveData.sfx}.wav`)
      }
    }
  }

  private createShaders(resources: PIXI.utils.Dict<PIXI.LoaderResource>) {
    console.log('shader: init')
    this.shaderNames.forEach(s => {
      console.log('shader: creating shader', s)
      if (this.filters.get(s) != null) return
      console.log(`Created filter for ${s}`)
      this.uniforms[s] = { step: 0 }
      this.filters.set(
        s,
        new PIXI.Filter(
          undefined,
          resources[`shaders/${s}.fs`].data as string,
          this.uniforms[s]
        )
      )
    })
  }

  getMusic(music: Music): PIXI_SOUND.Sound | undefined {
    throw new Error('Method not implemented.')
  }

  getShader(name: string): PIXI.Filter | undefined {
    if (!this.filters.has(name)) {
      throw new Error(`filter ${name}`)
    }
    return this.filters.get(name)!
  }
  getCry(id: string): string | undefined {
    return this.cryNames.has(id) ? id : undefined
  }
  getOpponentTrainerTexture(): PIXI.Texture<PIXI.Resource> | undefined {
    return textureOpponent
  }
  getPlayerTrainerTexture(): PIXI.Texture<PIXI.Resource> | undefined {
    return texturePlayer
  }
  getFront(id: string): PIXI.Texture<PIXI.Resource>[] {
    return this.frontTexture[id]
  }
  getBack(id: string): PIXI.Texture<PIXI.Resource> {
    return this.backTexture[id]
  }
}
