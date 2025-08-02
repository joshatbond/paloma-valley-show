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

const fromFont = textureFrom(textureFont)
/**
 * Gets a specific character from the font texture
 * @param x The left edge of the character
 * @param y The top edge of the character
 * @returns A Texture representing the character
 */
export const charTex = (x: number, y: number) => fromFont(x * 8, y * 8, 8, 8)

const fromAttack = textureFrom(textureAttack)
/**
 * Gets a specific attack texture from the attack texture
 * @param x The left edge of the attack
 * @param y The top edge of the attack
 * @param w The right edge of the attack
 * @param h The bottom edge of the attack
 * @returns A texture representing the specific attack
 */
export const attack = (...rect: [x: number, y: number, w: number, h: number]) =>
  fromAttack(...rect)
/**
 * Get a list of textures from a base texture
 * @param texture The texture to generate the list from
 * @param w The width of the element texture
 * @param h The height of the element texture
 * @param n The number of element textures to generate
 * @returns The list of sub-textures
 */
export const tileHorizontal = (
  texture: PIXI.Texture,
  w: number,
  h: number,
  n: number
) => {
  const subTexture = textureFrom(texture)
  return Array(n)
    .fill(0)
    .map((_, i) => subTexture(i * w, 0, w, h))
}
const FONT_STR =
  'ABCDEFGHIJKLMNOP' +
  'QRSTUVWXYZ():;[]' +
  'abcdefghijklmnop' +
  'qrstuvwxyz      ' +
  'ÄÖÜäöü          ' +
  "'  -?!.&é   * /," +
  '$0123456789     '
/**
 * An object containing font textures
 */
export const font = Array(FONT_STR.length)
  .fill(0)
  .map((_, i) => [FONT_STR[i], i % 16, Math.floor(i / 16)] as const)
  .concat([
    ["'d", 6, 4],
    ["'l", 7, 4],
    ["'m", 8, 4],
    ["'r", 9, 4],
    ["'s", 10, 4],
    ["'t", 11, 4],
    ["'v", 12, 4],
    ['...', 11, 6],
  ])
  .reduce(
    (a, [char, ...v]) => {
      a[char] = charTex(...v)
      return a
    },
    {} as Record<string, PIXI.Texture>
  )

const teamStatusTexture = textureFrom(textureTeamStatus)
/**
 * A list of textures representing the textures for a team member status ball
 */
export const StatusTexture = new Array(4)
  .fill(0)
  .map((_, i) => teamStatusTexture(0, i * 8, 8, 8))

/**
 *
 * @param fileName The base name of the file. Don't include any paths or extensions
 */
function factory(fileName: string) {
  return PIXI.Texture.from(`${basePath}/texture/${fileName}.png`)
}
/**
 * Creates a wrapper over a texture to generate sub-textures from it
 * @param texture The base texture to use
 * @returns A function that returns the sub texture
 */
function textureFrom(texture: PIXI.Texture) {
  return function subTexture(
    ...rect: ConstructorParameters<typeof PIXI.Rectangle>
  ) {
    return new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(...rect))
  }
}
