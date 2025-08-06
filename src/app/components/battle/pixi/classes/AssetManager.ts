import * as PIXI_SOUND from '@pixi/sound'
import * as PIXI from 'pixi.js-legacy'

/**
 * Manages all assets, implemented as a singleton to ensure only one render
 * texture is active at any given time
 */
class AssetManager {
  /**
   * The single instance of the RenderTexture class
   */
  private static instance: AssetManager | null = null
  private readonly basePath = '/battle'
  /**
   * A reference to the Pixi Loader
   */
  private readonly _loader = new PIXI.Loader()
  /**
   * Stores the loaded textures
   */
  private _textures = {} as Record<string, PIXI.Texture>
  private _audio = {} as Record<string, PIXI_SOUND.Sound>

  /**
   * A private constructor to prevent direct instantiation of the class
   */
  private constructor() {}
  private _loadTextures() {}
  private _loadSfx() {
    this._loader.add('sfxSpriteData', `${this.basePath}/sfx_sprite.json`)
    this._loader.add('sfxSprite', `${this.basePath}/sfx_sprite.mp3`)
  }
  private _loadFilters() {}
  private _loadShaders() {}
  private _compileLoads() {}

  /**
   * Provides the global access point to the single instance of the RenderTexture.
   * If the instance doesn't already exist - it creates it.
   * @returns The instance of the RenderTexture
   */
  public static getInstance() {
    if (AssetManager.instance === null) {
      AssetManager.instance = new AssetManager()
    }

    return AssetManager.instance
  }
  /**
   * Destroys the render texture in memory.
   * Call this when the render texture is no longer needed
   */
  public destroy() {
    AssetManager.instance = null
  }

  /**
   * Get a specific texture
   * @param id the of the texture to get
   * @returns The texture associated with the id, if it exists
   * @throws If the texture doesn't exist
   */
  public texture(id: string) {
    if (this._textures[id]) return this._textures[id]
    throw new Error(`Texture ${id} does not exist!`)
  }

  /**
   * A function to load all assets.
   * @returns A promise that will resolve once all assets are loaded are loaded
   */
  public loadAssets() {
    return new Promise<void>((resolve, reject) => {
      this._loader.onError.add(reject)
      this._loader.load((_, resources) => {
        for (const name in resources) {
          if ('texture' in resources[name] && resources[name].texture) {
            this._textures[name] = resources[name].texture
          }
          if ('sound' in resources[name]) {
          }
        }
        resolve()
      })
    })
  }
}

export const assetManager = AssetManager.getInstance()
