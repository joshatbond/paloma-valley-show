import * as PIXI from 'pixi.js-legacy'

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

export { removeAlpha }
