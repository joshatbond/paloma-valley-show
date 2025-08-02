import * as PIXI from 'pixi.js-legacy'

import { charTex, textureIcon, textureTeamStatus } from './assets/textures'

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

export { teamStatus, icons, removeAlpha }
