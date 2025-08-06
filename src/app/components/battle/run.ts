import * as PIXI from 'pixi.js-legacy'

import GameV2 from './pixi/classes/GameV2'
import { getInstance } from './pixi/classes/Interactions'
import Resources from './pixi/classes/Resources'
import { GAMEBOY_HEIGHT, GAMEBOY_WIDTH } from './pixi/constants'
import {
  type BattleInfo,
  type MemberObject,
  type TeamObject,
} from './pixi/types'
import View from './pixi/ui/View'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

let app: PIXI.Application | null = null
let renderTexture: PIXI.RenderTexture | null = null

export function run(elementId: string) {
  if (!app) {
    scaffoldApp(elementId)
  }

  return () => {
    // app?.destroy()
  }
}

function calculateDimensions(elementId: string) {
  const el = document.getElementById(elementId)
  if (!el) throw new Error(`No dom node with id: ${elementId}`)

  const box = el.getBoundingClientRect()

  let scale = 6
  while (
    GAMEBOY_HEIGHT * scale > box.height ||
    GAMEBOY_WIDTH * scale > box.width
  ) {
    scale -= 0.1
  }
  return { height: GAMEBOY_HEIGHT * scale, width: GAMEBOY_WIDTH * scale }
}
function scaffoldApp(elementId: string) {
  const { width, height } = calculateDimensions(elementId)
  app = new PIXI.Application({ width, height, backgroundColor: 0xf8f8f8 })
  renderTexture = PIXI.RenderTexture.create({
    width: GAMEBOY_WIDTH,
    height: GAMEBOY_HEIGHT,
  })
  createResources()
  getInstance()

  const sprite = new PIXI.Sprite(renderTexture)
  sprite.width = width
  sprite.height = height

  app.stage.addChild(sprite)

  document.getElementById(elementId)?.appendChild(app.view)
}
function createResources() {
  const exampleMember1: MemberObject = {
    id: '001',
    level: 12,
    gender: 'none',
    moves: ['TACKLE', 'GROWL', 'VINE WHIP'],
    name: 'BULBASAUR',
  }
  const exampleMember2: MemberObject = {
    id: '007',
    level: 12,
    gender: 'none',
    moves: ['TACKLE', 'GROWL', 'BUBBLE'],
    name: 'SQUIRTLE',
  }
  const battleInfo: BattleInfo = {
    info: {
      player: {
        name: 'PLAYER',
        trainer: 'ethan.png',
        team: [exampleMember1],
      },
      opponent: {
        name: 'OPPONENT',
        trainer: 'blue.png',
        team: [exampleMember2],
      },
      winMessage: 'GARY: What?! I picked the wrong pokémon!',
    },
    data: {
      '001': {
        baseAtk: 49,
        baseDef: 49,
        baseHp: 45,
        baseSpAtk: 65,
        baseSpDef: 65,
        baseSpd: 45,
        cry: '001.mp3',
        front: '001_front.png',
        back: '001_back.png',
        name: 'bulbasaur',
        types: ['GRASS', 'POISON'],
        anim: { delay: [0], ref: [0] },
      },
      '004': {
        baseAtk: 52,
        baseDef: 43,
        baseHp: 39,
        baseSpAtk: 60,
        baseSpDef: 50,
        baseSpd: 65,
        cry: '004.mp3',
        front: '004_front.png',
        back: '004_back.png',
        name: 'CHARMANDER',
        types: ['FIRE'],
        anim: { delay: [0], ref: [0] },
      },
      '007': {
        baseAtk: 48,
        baseDef: 65,
        baseHp: 44,
        baseSpAtk: 50,
        baseSpDef: 64,
        baseSpd: 43,
        cry: '',
        front: '007_front.png',
        back: '007_back.png',
        name: 'SQUIRTLE',
        types: ['WATER'],
        anim: { delay: [0], ref: [0] },
      },
    },
  }
  const moves = new Set(
    [
      getMovesFromTeam(battleInfo.info.player),
      getMovesFromTeam(battleInfo.info.opponent),
    ].flat()
  )

  const resources = new Resources([...moves])
  resources.load(() => {
    if (!app || !renderTexture) return
    const view = new View(app, resources, true)
    const game = new GameV2(
      view,
      battleInfo,
      (move: string) => {
        console.log(`LOADING MOVE: ${move}`)
        resources.loadMoves([move])
        return resources.forceLoad()
      },
      true
    )

    view.setPlayerTexture('ethan')
    view.setOpponentTexture('blue')

    app.ticker.add(() => {
      if (!app || !renderTexture) return
      game.update()
      app.renderer.render(view.getFullStage(), { renderTexture })
    })
    app.ticker.maxFPS = 60
  })
}
function getMovesFromTeam(team: TeamObject) {
  return team.team
    .map(member => member.moves)
    .flat()
    .filter(Boolean)
}
