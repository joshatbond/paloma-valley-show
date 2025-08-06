import * as PIXI from 'pixi.js-legacy'

import { GAMEBOY_HEIGHT, GAMEBOY_WIDTH } from '../constants'
import { getInstance as initInteraction } from './Interactions'
import { renderTexture } from './RenderTexture'

/**
 * Manages the PixiJS application instance, including its initialization,
 * rendering, and interaction setup. This class is implemented as a Singleton
 * to ensure only one PixiJS application instance is active at any given time.
 */
class App {
  /**
   * The single instance of the App class.
   */
  private static instance: App | null = null
  /**
   * The PixiJS Application instance.
   */
  private pixiApp: PIXI.Application | null = null
  /**
   * The PixiJS RenderTexture used for primary rendering.
   */
  private pixiRenderTexture = renderTexture
  /**
   * The HTMLDivElement that serves as the parent container for the PixiJS canvas.
   */
  private parentElement: HTMLDivElement | null = null

  /**
   * The private constructor prevents direct instantiation of the class,
   * enforcing the Singleton pattern.
   */
  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  private parentDimensions(id: string) {
    if (!this.parentElement) {
      const proposedElement = document.getElementById(id)
      if (!proposedElement) {
        throw new Error(`Parent node with id ${id} not found. Aborting.`)
      }
      this.parentElement = proposedElement as HTMLDivElement
    }

    const box = this.parentElement.getBoundingClientRect()

    let scale = 6
    // Continuously reduce scale until the app fits within the parent dimensions
    while (
      GAMEBOY_HEIGHT * scale > box.height ||
      GAMEBOY_WIDTH * scale > box.width
    ) {
      scale -= 0.1
    }
    return { height: GAMEBOY_HEIGHT * scale, width: GAMEBOY_WIDTH * scale }
  }

  /**
   * Provides the global access point to the single instance of the App.
   * If the instance does not already exist, it creates it.
   * @returns The single instance of the App.
   */
  public static getInstance() {
    if (App.instance === null) {
      App.instance = new App()
    }

    return App.instance
  }

  /**
   * Initializes the PixiJS application within the specified parent element.
   * This method ensures the application is only initialized once per singleton instance.
   * It sets up the PixiJS application, render texture, input manager, and event listeners.
   * @param parentElementId The ID of the HTMLDivElement to append the PixiJS canvas to.
   * @throws If the parent element with the given ID is not found.
   */
  public initWindow(parentElementId: string): void {
    if (this.pixiApp) return

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
    const { height, width } = this.parentDimensions(parentElementId)

    this.pixiApp = new PIXI.Application({
      height,
      width,
      backgroundColor: 0xf8f8f8,
    })
    this.parentElement!.appendChild(this.pixiApp.view)

    this.pixiRenderTexture.init(height, width)
    this.pixiApp.stage.addChild(this.pixiRenderTexture.sprite)
    initInteraction()
  }

  /**
   * Retrieves the current PixiJS Application instance.
   * @returns The PixiJS Application instance, or null if not initialized.
   */
  get app() {
    if (!this.pixiApp)
      throw new Error('Getting the app before its initialized!')
    return this.pixiApp
  }
  get renderTexture() {
    if (!this.pixiRenderTexture)
      throw new Error('Getting the render texture before its initialized!')
    return this.pixiRenderTexture.texture
  }

  /**
   * Destroys the PixiJS application and cleans up all associated resources.
   * This should be called when the application is no longer needed to prevent memory leaks.
   */
  public destroy() {
    if (this.pixiApp) {
      this.pixiApp.destroy(true)
      this.pixiApp = null
    }
    this.pixiRenderTexture.destroy()
    this.parentElement = null
    App.instance = null
  }
}

export const appInstance = App.getInstance
