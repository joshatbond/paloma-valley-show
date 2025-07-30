import { Filter, Rectangle, Texture } from 'pixi.js-legacy'

const FONT_STR =
  'ABCDEFGHIJKLMNOP' +
  'QRSTUVWXYZ():;[]' +
  'abcdefghijklmnop' +
  'qrstuvwxyz      ' +
  'ÄÖÜäöü          ' +
  "'  -?!.&é   * /," +
  '$0123456789     '

const teamStatusTexture = Texture.from('teamstatus.png')
const iconTexture = Texture.from('icons.png')
const fontTexture = Texture.from('font.png')
const attackTexture = Texture.from('attacks.png')

export const playerStatsTexture = Texture.from('playerstats.png')
export const statsWindowTexture = Texture.from('statswindow.png')
export const removeAlpha = new Filter(
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
export const font = fontFactory()
export const teamStatus = teamStatusFactory()
export const icons = iconFactory()
export function charTex(i: number, j: number) {
  return new Texture(fontTexture as any, new Rectangle(i * 8, j * 8, 8, 8))
}
export function attack(i: number, j: number, w: number, h: number) {
  return new Texture(
    attackTexture as any,
    new Rectangle(i * 8, j * 8, 8 * w, 8 * h)
  )
}
export function tileHorizontal(tex: Texture, w: number, h: number, n: number) {
  return new Array(n)
    .fill(0)
    .map((_, i) => new Texture(tex as any, new Rectangle(i * w, 0, w, h)))
}

function fontFactory() {
  const font: { [char: string]: Texture } = {}
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
  return font
}
function teamStatusFactory() {
  return new Array(4)
    .fill(0)
    .map(
      (_, i) =>
        new Texture(teamStatusTexture as any, new Rectangle(0, i * 8, 8, 8))
    )
}
function iconFactory() {
  return new Array(37)
    .fill(0)
    .map(
      (_, i) =>
        [
          new Texture(iconTexture as any, new Rectangle(0, i * 16, 16, 16)),
          new Texture(iconTexture as any, new Rectangle(16, i * 16, 16, 16)),
        ] as const
    )
}
