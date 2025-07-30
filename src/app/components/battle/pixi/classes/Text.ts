import { Container, Sprite } from 'pixi.js-legacy'

import { font } from './Graphics'

const APOSTROPHE_LETTERS = ['d', 'l', 'm', 'r', 's', 't', 'v']

/* Renders changeable text to the screen. */
export class Text {
  public x: number
  public y: number
  private padding: number | undefined
  private stage: Container
  private sprites: Sprite[]

  // show text at (x, y) right aligned to padding
  constructor(
    stage: Container,
    x: number,
    y: number,
    { padding = undefined }: TextConfig = { padding: undefined }
  ) {
    this.x = x
    this.y = y
    this.padding = padding
    this.sprites = []
    this.stage = stage
  }

  clear() {
    this.change('')
  }

  change(str: string) {
    // clear old text
    this.sprites.forEach(spr => this.stage.removeChild(spr))
    // add padding spaces before text
    if (this.padding !== undefined) {
      const len = str.length
      for (let i = 0; i < this.padding - len; i++) {
        str = ' ' + str
      }
    }

    let chars = 0
    for (let i = 0; i < str.length; i++) {
      const [j, sym] = special(i, str)
      i = j

      const spr = new Sprite(font[sym])
      spr.x = this.x + chars * 8
      spr.y = this.y
      this.sprites.push(spr)
      this.stage.addChild(spr)
      chars++
    }
  }
}

function special(i: number, str: string): [number, string] {
  if (
    str[i] === "'" &&
    i + 1 < str.length &&
    APOSTROPHE_LETTERS.includes(str[i + 1])
  ) {
    return [i + 1, "'" + str[i + 1]]
  } else if (
    str[i] === '.' &&
    i + 2 < str.length &&
    str[i + 1] === '.' &&
    str[i + 2] === '.'
  ) {
    return [i + 2, '...']
  }
  return [i, str[i]]
}
type TextConfig = {
  padding: number | undefined
}
