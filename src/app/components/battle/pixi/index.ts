import * as PIXI from 'pixi.js-legacy'

import { BattleInfo, MemberObject, TeamObject } from './BattleObjects'
import GameV2 from './GameV2'
import { GAMEBOY_HEIGHT, GAMEBOY_WIDTH } from './Graphics'
import * as Input from './Input'
import Resources from './Resources'
import View from './View'

// import { getInstance as getApp } from './classes/Application';

// const bulbasaur: MemberObject = {
//   id: '001',
//   level: 5,
//   gender: 'none',
//   moves: ['TACKLE', 'GROWL'],
//   name: 'BULBASAUR',
// }
// const charmander: MemberObject = {
//   id: '004',
//   level: 5,
//   gender: 'none',
//   moves: ['SCRATCH', 'GROWL'],
//   name: 'CHARMANDER',
// }
// const squirtle: MemberObject = {
//   id: '007',
//   level: 5,
//   gender: 'none',
//   moves: ['TACKLE', 'TAIL WHIP'],
//   name: 'SQUIRTLE',
// }

// const battleInfo: BattleInfo = {
//   info: {
//     player: {
//       name: 'PLAYER',
//       trainer: 'ethan.png',
//       team: [bulbasaur],
//     },
//     opponent: {
//       name: 'OPPONENT',
//       trainer: 'blue.png',
//       team: [charmander],
//     },
//   },
//   data: {
//     '001': {
//       baseAtk: 49,
//       baseDef: 49,
//       baseHp: 45,
//       baseSpAtk: 65,
//       baseSpDef: 65,
//       baseSpd: 45,
//       cry: '',
//       front: '001_front.png',
//       back: '001_back.png',
//       name: 'BULBASAUR',
//       types: ['GRASS', 'POISON'],
//       anim: { delay: [0], ref: [0] },
//     },
//     '004': {
//       baseAtk: 52,
//       baseDef: 43,
//       baseHp: 39,
//       baseSpAtk: 60,
//       baseSpDef: 50,
//       baseSpd: 65,
//       cry: '',
//       front: '004_front.png',
//       back: '004_back.png',
//       name: 'CHARMANDER',
//       types: ['FIRE'],
//       anim: { delay: [0], ref: [0] },
//     },
//     '007': {
//       baseAtk: 48,
//       baseDef: 65,
//       baseHp: 44,
//       baseSpAtk: 50,
//       baseSpDef: 64,
//       baseSpd: 43,
//       cry: '',
//       front: '007_front.png',
//       back: '007_back.png',
//       name: 'SQUIRTLE',
//       types: ['WATER'],
//       anim: { delay: [0], ref: [0] },
//     },
//   },
// }
const exampleMember1: MemberObject = {
  id: 'demo1',
  level: 25,
  gender: 'none',
  moves: ['METRONOME'],
  name: 'COOL GUY',
}

const exampleMember2: MemberObject = {
  id: 'demo2',
  level: 25,
  gender: 'none',
  moves: ['METRONOME'],
  name: 'BAD GUY',
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
let app: PIXI.Application | null = null
let renderTexture: PIXI.RenderTexture | null = null
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

export function run(elementId: string) {
  // const singleton = getApp()
  // singleton.initWindow(elementId)
  // app = singleton.app
  // renderTexture = singleton.renderTexture
  // const el = document.getElementById(elementId)
  // if (!el) return
  // const box = el.getBoundingClientRect()
  // let scale = 6
  // while (
  //   GAMEBOY_WIDTH * scale > box.width ||
  //   GAMEBOY_HEIGHT * scale > box.height
  // ) {
  //   scale -= 0.5
  // }
  // const APP_WIDTH = Math.floor(box.width * scale)
  // const APP_HEIGHT = Math.floor(box.height * scale)
  const APP_WIDTH = GAMEBOY_WIDTH * 3
  const APP_HEIGHT = GAMEBOY_HEIGHT * 3

  app = new PIXI.Application({
    width: APP_WIDTH,
    height: APP_HEIGHT,
    backgroundColor: 0xf8f8f8,
    // resizeTo: el,
    // clearBeforeRender: true,
  })

  document.getElementById(elementId)?.appendChild(app.view)
  renderTexture = PIXI.RenderTexture.create({
    width: GAMEBOY_WIDTH,
    height: GAMEBOY_HEIGHT,
  })

  const sprite = new PIXI.Sprite(renderTexture)
  sprite.width = APP_WIDTH
  sprite.height = APP_HEIGHT
  app.stage.addChild(sprite)
  app.stage.interactive = true
  Input.focus()
  document.addEventListener('keydown', (e: any) => Input.keyDown(e))
  document.addEventListener('keyup', (e: any) => Input.keyUp(e))

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
        console.log('LOADING MOVE ' + move)
        resources.loadMoves([move])
        return resources.forceLoad()
      },
      true
    )
    view.setPlayerTexture('demo')
    view.setOpponentTexture('demo')

    function tick() {
      if (!app || !renderTexture) return
      game.update()
      app.renderer.render(view.getFullStage(), { renderTexture })
    }

    app.ticker.add(tick)
    app.ticker.maxFPS = 60
  })

  return () => app?.destroy()
}

function getMovesFromTeam(team: TeamObject) {
  return team.team
    .map(member => member.moves)
    .flat()
    .filter(Boolean)
}
