import * as PIXI from 'pixi.js-legacy'

import {
  textureAttack,
  textureFont,
  textureIcon,
  textureTeamStatus,
} from './assets/textures'

/* Create font textures from spritesheet. */

const FONT_STR =
  'ABCDEFGHIJKLMNOP' +
  'QRSTUVWXYZ():;[]' +
  'abcdefghijklmnop' +
  'qrstuvwxyz      ' +
  'ÄÖÜäöü          ' +
  "'  -?!.&é   * /," +
  '$0123456789     '

const font: { [char: string]: PIXI.Texture } = {}

const charTex = (i: number, j: number) =>
  new PIXI.Texture(textureFont as any, new PIXI.Rectangle(i * 8, j * 8, 8, 8))

const attack = (i: number, j: number, w: number, h: number) =>
  new PIXI.Texture(
    textureAttack as any,
    new PIXI.Rectangle(i * 8, j * 8, 8 * w, 8 * h)
  )

for (let i = 0; i < FONT_STR.length; i++) {
  const x = i % 16
  const y = Math.floor(i / 16)
  font[FONT_STR[i]!] = charTex(x, y)
}

font["'d"] = charTex(6, 4)
font["'l"] = charTex(7, 4)
font["'m"] = charTex(8, 4)
font["'r"] = charTex(9, 4)
font["'s"] = charTex(10, 4)
font["'t"] = charTex(11, 4)
font["'v"] = charTex(12, 4)
font['...'] = charTex(11, 6)

/* Create textures for team member status balls. */

const teamStatus = []

for (let i = 0; i < 4; i++) {
  teamStatus.push(
    new PIXI.Texture(
      textureTeamStatus as any,
      new PIXI.Rectangle(0, i * 8, 8, 8)
    )
  )
}

/* Create textures for icon frames. */

const icons: [PIXI.Texture, PIXI.Texture][] = []

for (let i = 0; i < 37; i++) {
  icons.push([
    new PIXI.Texture(textureIcon as any, new PIXI.Rectangle(0, i * 16, 16, 16)),
    new PIXI.Texture(
      textureIcon as any,
      new PIXI.Rectangle(16, i * 16, 16, 16)
    ),
  ])
}

const removeAlpha = new PIXI.Filter(
  undefined,
  `
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  void main(void) {
      vec4 col = texture2D(uSampler, vTextureCoord.xy);
      if (col.w >= 0.9 && (col.x <= 0.95 || col.y <= 0.95 || col.z <= 0.95)) {
          gl_FragColor = col;
      } else {
          gl_FragColor = vec4(0.0);
      }
  }
`
)

export { charTex, font, teamStatus, icons, attack, removeAlpha }
