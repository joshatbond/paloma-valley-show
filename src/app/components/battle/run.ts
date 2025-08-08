import * as PIXI from 'pixi.js-legacy'

import { Battle } from './pixi/classes/Battle'
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
  const battle = new Battle()

  const resources = new Resources([...battle.moves])
  resources.load(() => {
    if (!app || !renderTexture) return
    const view = new View(app, resources, true)
    const game = new GameV2(
      view,
      battle.info,
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
