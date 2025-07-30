import { getInstance as getApp } from './classes/Application'
import { Resources } from './classes/Resource'
import { Move } from './constants/moveInfo'
import { BattleInfo, MemberObject, TeamObject } from './types'

const bulbasaur: MemberObject = {
  id: '001',
  level: 5,
  gender: 'none',
  moves: ['TACKLE', 'GROWL'],
  name: 'BULBASAUR',
}
const charmander: MemberObject = {
  id: '004',
  level: 5,
  gender: 'none',
  moves: ['SCRATCH', 'GROWL'],
  name: 'CHARMANDER',
}
const squirtle: MemberObject = {
  id: '007',
  level: 5,
  gender: 'none',
  moves: ['TACKLE', 'TAIL WHIP'],
  name: 'SQUIRTLE',
}

const battleInfo: BattleInfo = {
  info: {
    player: {
      name: 'PLAYER',
      trainer: 'ethan.png',
      team: [bulbasaur],
    },
    opponent: {
      name: 'OPPONENT',
      trainer: 'blue.png',
      team: [charmander],
    },
  },
  data: {
    '001': {
      baseAtk: 49,
      baseDef: 49,
      baseHp: 45,
      baseSpAtk: 65,
      baseSpDef: 65,
      baseSpd: 45,
      cry: '',
      front: '001_front.png',
      back: '001_back.png',
      name: 'BULBASAUR',
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
      cry: '',
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
export function run(elementId: string) {
  const singleton = getApp()
  if (!singleton.app) {
    singleton.initWindow(elementId)
  }
  const { app, renderTexture } = singleton

  const moves = new Set(
    [
      getMovesFromTeam(battleInfo.info.player),
      getMovesFromTeam(battleInfo.info.opponent),
    ].flat()
  )

  const resources = new Resources([...moves])
  resources.load(() => {
    const view = new View(app, resources, true)
    const game = new GameV2(
      view,
      battleInfo,
      (move: string) => {
        console.log('LOADING MOVE ' + move)
        resources.loadMoves([move as Move])
        return resources.forceLoad()
      },
      true
    )

    view.setPlayerTexture('demo')
    view.setOpponentTexture('demo')

    function tick() {
      game.update()
      app.renderer.render(view.getFullStage(), { renderTexture })
    }

    app.ticker.add(tick)
    app.ticker.maxFPS = 60
  })

  return () => app.destroy()
}

function getMovesFromTeam(team: TeamObject): Move[] {
  return team.team
    .map(member => member.moves)
    .flat()
    .filter(Boolean)
}
