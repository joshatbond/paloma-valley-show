import * as PIXI from 'pixi.js-legacy'

import GameV2 from './pixi/GameV2'
import { GAMEBOY_HEIGHT, GAMEBOY_WIDTH } from './pixi/Graphics'
import * as Input from './pixi/Input'
import Resources from './pixi/Resources'
import View from './pixi/View'
import {
  type BattleInfo,
  type MemberObject,
  type TeamObject,
} from './pixi/types'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

let app: PIXI.Application | null = null
let renderTexture: PIXI.RenderTexture | null = null

export function run(elementId: string) {
  if (!app) {
    scaffoldApp(elementId)
  }

  return () => {
    app?.destroy()
    document.removeEventListener('keydown', Input.keyDown)
    document.removeEventListener('keyup', Input.keyUp)
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
    scale -= 0.5
  }
  console.log(scale)
  return { height: GAMEBOY_HEIGHT * scale, width: GAMEBOY_WIDTH * scale }
}
function scaffoldApp(elementId: string) {
  const { width, height } = calculateDimensions(elementId)
  console.log(width, height)
  app = new PIXI.Application({ width, height, backgroundColor: 0xf8f8f8 })
  renderTexture = PIXI.RenderTexture.create({
    width: GAMEBOY_WIDTH,
    height: GAMEBOY_HEIGHT,
  })
  createResources()

  const sprite = new PIXI.Sprite(renderTexture)
  sprite.width = width
  sprite.height = height

  app.stage.addChild(sprite)

  Input.focus()

  document.getElementById(elementId)?.appendChild(app.view)
  document.addEventListener('keydown', Input.keyDown)
  document.addEventListener('keyup', Input.keyUp)
}
function createResources() {
  const exampleMember1: MemberObject = {
    id: 'demo1',
    level: 36,
    gender: 'none',
    moves: ['METRONOME'],
    name: 'BLASTOISE',
  }
  const exampleMember2: MemberObject = {
    id: 'demo2',
    level: 25,
    gender: 'none',
    moves: ['METRONOME'],
    name: 'GENGAR',
  }
  const battleInfo: BattleInfo = {
    info: {
      player: {
        name: 'PLAYER',
        trainer: 'demoback.png',
        team: [
          exampleMember1,
          exampleMember1,
          exampleMember1,
          exampleMember1,
          exampleMember1,
          exampleMember1,
        ],
      },
      opponent: {
        name: 'OPPONENT',
        trainer: 'demofront.png',
        team: [exampleMember2, exampleMember2, exampleMember2, exampleMember2],
      },
    },
    data: {
      demo1: {
        baseAtk: 5,
        baseDef: 5,
        baseHp: 5,
        baseSpAtk: 5,
        baseSpDef: 5,
        baseSpd: 5,
        cry: '',
        front: 'demofront.png',
        back: 'demoback.png',
        name: 'BLASTOISE',
        types: ['NORMAL'],
        anim: { delay: [0], ref: [0] },
      },
      demo2: {
        baseAtk: 5,
        baseDef: 5,
        baseHp: 5,
        baseSpAtk: 5,
        baseSpDef: 5,
        baseSpd: 5,
        cry: '',
        front: 'demofront.png',
        back: 'demoback.png',
        name: 'MEW',
        types: ['NORMAL'],
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
