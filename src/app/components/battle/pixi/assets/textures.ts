import * as PIXI from 'pixi.js-legacy'

import { basePath } from '.'

export const textureAttack = factory('attacks')
export const textureDemoBack = factory('demoback')
export const textureDemoFront = factory('demofront')
export const textureFont = factory('font')
export const textureHPBar = factory('hpbar')
export const textureIcon = factory('icons')
export const textureMenu = factory('menu')
export const textureMessage = factory('message')
export const textureMoves = factory('moves')
export const textureOpen = factory('open')
export const texturePlayerStats = factory('playerstats')
export const textureSwitchStats = factory('switchstats')
export const textureStatsWindow = factory('statswindow')
export const textureTeamStatus = factory('teamstatus')
export const textureTextbox = factory('textbox')

/**
 *
 * @param fileName The base name of the file. Don't include any paths or extensions
 */
function factory(fileName: string) {
  return PIXI.Texture.from(`${basePath}/texture/${fileName}.png`)
}
