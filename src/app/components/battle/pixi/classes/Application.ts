import * as PIXI from 'pixi.js-legacy'

import { GAMEBOY_HEIGHT, GAMEBOY_WIDTH } from '../Graphics'
import * as Input from '../Input'

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
  private pixiRenderTexture: PIXI.RenderTexture | null = null

  /**
   * The HTMLDivElement that serves as the parent container for the PixiJS canvas.
   */
  private parentElement: HTMLDivElement | null = null

  /**
   * The KeyboardInputManager instance for handling keyboard interactions.
   */
  // private keyboardInput: KeyboardInputManager | null = null

  /**
   * A cleanup function returned by `initWindow` to properly destroy the PixiJS app
   * and remove event listeners.
   */
  private cleanupFunction: (() => void) | null = null

  /**
   * The private constructor prevents direct instantiation of the class,
   * enforcing the Singleton pattern.
   */
  private constructor() {
    // Private constructor to prevent direct instantiation
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

    if (!this.parentElement) {
      const proposedElement = document.getElementById(parentElementId)
      if (!proposedElement) {
        throw new Error(
          `Parent node with id ${parentElementId} not found. Aborting.`
        )
      }
      this.parentElement = proposedElement as HTMLDivElement
    }

    const { height, width } = calculateAppSize(this.parentElement)

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

    this.pixiApp = new PIXI.Application({
      height,
      width,
      backgroundColor: 0xf8f8f8,
    })
    console.log(this.pixiApp)
    this.parentElement.appendChild(this.pixiApp.view)

    if (!this.pixiRenderTexture) {
      this.pixiRenderTexture = PIXI.RenderTexture.create({
        height: screen.height,
        width: screen.width,
      })
    }

    // if (!this.keyboardInput) {
    //   this.keyboardInput = new KeyboardInputManager()
    // }

    const sprite = new PIXI.Sprite(this.pixiRenderTexture)
    sprite.height = height
    sprite.width = width

    this.pixiApp.stage.addChild(sprite)
    this.pixiApp.stage.interactive = true

    // this.keyboardInput.focus()
    Input.focus()
    document.addEventListener(
      'keydown',
      // this.keyboardInput.keyDown.bind(this.keyboardInput)
      Input.keyDown
    )
    document.addEventListener(
      'keyup',
      // this.keyboardInput.keyUp.bind(this.keyboardInput)
      Input.keyUp
    )

    this.cleanupFunction = () => {
      if (this.pixiApp) {
        this.pixiApp.destroy(true)
        this.pixiApp = null
      }
      this.pixiRenderTexture = null
      this.parentElement = null
      document.removeEventListener('keydown', Input.keyDown)
      document.removeEventListener('keyup', Input.keyUp)
      // if (this.keyboardInput) {
      //   document.removeEventListener(
      //     'keydown',
      //     this.keyboardInput.keyDown.bind(this.keyboardInput)
      //   )
      //   document.removeEventListener(
      //     'keyup',
      //     this.keyboardInput.keyUp.bind(this.keyboardInput)
      //   )
      //   this.keyboardInput = null
      // }
      App.instance = null
    }
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
    return this.pixiRenderTexture
  }

  /**
   * Retrieves the current KeyboardInputManager instance.
   * @returns The KeyboardInputManager instance, or null if not initialized.
   */
  // public getKeyboardInput() {
  //   return this.keyboardInput
  // }

  /**
   * Destroys the PixiJS application and cleans up all associated resources.
   * This should be called when the application is no longer needed to prevent memory leaks.
   */
  public destroy() {
    if (this.cleanupFunction) {
      this.cleanupFunction()
      this.cleanupFunction = null
      console.log('PixiJS App and resources destroyed.')
    } else {
      console.log('No PixiJS App to destroy or already destroyed.')
    }
  }
}

export const getInstance = App.getInstance

/**
 * Calculates the appropriate size for the PixiJS application based on its parent element's dimensions.
 * It attempts to scale the application to fit within the parent while maintaining aspect ratio,
 * using a decreasing scale factor.
 * @param el The HTML element that will contain the PixiJS application view.
 * @returns An object containing the calculated height and width for the app.
 */
function calculateAppSize<T extends HTMLElement>(el: T) {
  const box = el.getBoundingClientRect()

  let scale = 6
  // Continuously reduce scale until the app fits within the parent dimensions
  while (
    GAMEBOY_HEIGHT * scale > box.height ||
    GAMEBOY_WIDTH * scale > box.width
  ) {
    scale -= 0.5
  }
  return { height: GAMEBOY_HEIGHT * scale, width: GAMEBOY_WIDTH * scale }
}
