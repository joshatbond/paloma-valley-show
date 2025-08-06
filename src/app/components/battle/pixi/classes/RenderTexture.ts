import * as PIXI from 'pixi.js-legacy'

import { GAMEBOY_HEIGHT, GAMEBOY_WIDTH } from '../constants'

/**
 * Manages the render texture instance, implemented as a singleton
 * to ensure only one render texture is active at any given time
 */
class RenderTexture {
  /**
   * The single instance of the RenderTexture class
   */
  private static instance: RenderTexture | null = null
  /**
   * The texture instance
   */
  private _texture: PIXI.RenderTexture | null = null
  /**
   * The sprite based on the render texture
   */
  private _sprite: PIXI.Sprite | null = null

  /**
   * A private constructor to prevent direct instantiation of the class
   */
  private constructor() {}

  /**
   * The current render texture
   * @throws If accessed before `getInstance()` is called
   */
  get texture() {
    if (!this._texture)
      throw new Error('Render texture used before initialized')

    return this._texture
  }
  /**
   * The current render texture sprite
   * @throws If accessed before `getInstance()` is called
   */
  get sprite() {
    if (!this._sprite)
      throw new Error('render texture sprite called before initialized')
    return this._sprite
  }

  /**
   * Provides the global access point to the single instance of the RenderTexture.
   * If the instance doesn't already exist - it creates it.
   * @returns The instance of the RenderTexture
   */
  public static getInstance() {
    if (RenderTexture.instance === null) {
      RenderTexture.instance = new RenderTexture()
    }

    return RenderTexture.instance
  }
  /**
   * Initializes the render texture and associated sprite
   * @param height The height of the canvas we are rendering into
   * @param width The width of the canvas we are rendering into
   */
  public init(height: number, width: number) {
    this._texture = PIXI.RenderTexture.create({
      height: GAMEBOY_HEIGHT,
      width: GAMEBOY_WIDTH,
    })
    this._sprite = new PIXI.Sprite(this._texture)
    this._sprite.height = height
    this._sprite.width = width
  }
  /**
   * Destroys the render texture in memory.
   * Call this when the render texture is no longer needed
   */
  public destroy() {
    this._sprite = null
    this._texture = null
    RenderTexture.instance = null
  }
}

export const renderTexture = RenderTexture.getInstance()
