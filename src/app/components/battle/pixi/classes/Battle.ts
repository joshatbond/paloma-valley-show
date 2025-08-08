import { getState } from '~/app/components/show/store'

import { BattleInfo, FighterObject, TeamObject } from '../types'

const pokemon = {
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
    oppId: '004',
    moves: ['TACKLE', 'GROWL', 'VINE WHIP'],
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
    name: 'charmander',
    types: ['FIRE'],
    anim: { delay: [0], ref: [0] },
    oppId: '007',
    moves: ['SCRATCH', 'GROWL', 'EMBER'],
  },
  '007': {
    baseAtk: 48,
    baseDef: 65,
    baseHp: 44,
    baseSpAtk: 50,
    baseSpDef: 64,
    baseSpd: 43,
    cry: '007.mp3',
    front: '007_front.png',
    back: '007_back.png',
    name: 'squirtle',
    types: ['WATER'],
    anim: { delay: [0], ref: [0] },
    oppId: '001',
    moves: ['TACKLE', 'TAIL WHIP', 'BUBBLE'],
  },
} as Record<string, FighterObject & { oppId: string; moves: string[] }>

/**
 * uses the poll choice to generate the info for the
 * upcoming battle
 */
export class Battle {
  private _playerChoice: keyof typeof pokemon

  constructor() {
    const starter = getState().starter
    this._playerChoice =
      starter === 'bulbasaur' ? '001' : starter === 'charmander' ? '004' : '007'
  }

  /**
   * Gets the battle information for the current showdown
   * @returns The battleInfo object
   * @throws If the starter or rival starter can't be found
   *
   */
  get info(): BattleInfo {
    if (!pokemon[this._playerChoice]) {
      throw new Error("Couldn't find the chosen starter!")
    }
    if (!pokemon[pokemon[this._playerChoice].oppId]) {
      throw new Error("Couldn't find the opponent starter!")
    }
    return {
      info: {
        player: {
          name: 'PLAYER',
          trainer: 'ethan.png',
          team: [
            {
              id: this._playerChoice,
              level: 12,
              gender: 'none',
              moves: pokemon[this._playerChoice].moves,
              name: pokemon[this._playerChoice].name.toUpperCase(),
            },
          ],
        },
        opponent: {
          name: 'RIVAL',
          trainer: 'blue.png',
          team: [
            {
              id: pokemon[this._playerChoice].oppId,
              level: 8,
              gender: 'none',
              moves: pokemon[pokemon[this._playerChoice].oppId].moves,
              name: pokemon[
                pokemon[this._playerChoice].oppId
              ].name.toUpperCase(),
            },
          ],
        },
        winMessage: 'GARY: What?! I picked the wrong pokémon!',
      },
      data: { ...pokemon },
    }
  }
  /**
   * a flattened list representing all the unique moves in the battle
   * @returns a set containing all the moves for the upcoming battle
   */
  get moves() {
    return new Set(
      [
        this._getMovesFromTeam(this.info.info.player),
        this._getMovesFromTeam(this.info.info.opponent),
      ].flat()
    )
  }

  private _getMovesFromTeam(team: TeamObject) {
    return team.team.flatMap(member => member.moves).filter(Boolean)
  }
}
