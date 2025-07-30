import { Container, Sprite } from 'pixi.js-legacy'

import { statsWindowTexture, teamStatus } from './Graphics'

class TeamStatus {
  x: number
  y: number
  flip: boolean
  windowSpr: Sprite
  balls: Sprite[]
  stage: Container

  constructor(stage: Container, x: number, y: number, flip: boolean) {
    this.stage = stage
    this.x = x
    this.y = y
    this.flip = flip
    this.windowSpr = new Sprite(statsWindowTexture)
    this.windowSpr.x = x
    this.windowSpr.y = y
    if (flip) this.windowSpr.scale.x = -1
    this.balls = []
  }

  show(hp: number[]) {
    this.stage.addChild(this.windowSpr)
    for (let i = 0; i < 6; i++) {
      let j = undefined
      if (i < hp.length) {
        if (hp[i] <= 0) {
          j = 2
        } else {
          j = 0
        }
      } else {
        j = 3
      }
      const spr = new Sprite(teamStatus[j])
      spr.x = this.flip ? this.x - 64 + 8 * i : this.x + 56 - 8 * i
      spr.y = this.y
      this.balls.push(spr)
      this.stage.addChild(spr)
    }
  }

  hide() {
    this.balls.forEach(b => this.stage.removeChild(b))
    this.stage.removeChild(this.windowSpr)
  }
}

export class PlayerTeamStatus extends TeamStatus {
  constructor(stage: Container) {
    super(stage, screen.width - 8, 80, true)
  }
}

export class OpponentTeamStatus extends TeamStatus {
  constructor(stage: Container) {
    super(stage, 8, 16, false)
  }
}
