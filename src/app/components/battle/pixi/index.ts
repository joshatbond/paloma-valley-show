import { Application, RenderTexture, Sprite } from 'pixi.js-legacy'

import { KeyboardInputManager } from './classes/Input'
import { screen } from './constants/index'

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
  private pixiApp: Application | null = null

  /**
   * The PixiJS RenderTexture used for primary rendering.
   */
  private pixiRenderTexture: RenderTexture | null = null

  /**
   * The HTMLDivElement that serves as the parent container for the PixiJS canvas.
   */
  private parentElement: HTMLDivElement | null = null

  /**
   * The KeyboardInputManager instance for handling keyboard interactions.
   */
  private keyboardInput: KeyboardInputManager | null = null

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
    this.pixiApp = new Application({ height, width, backgroundColor: 0xf8f8f8 })
    this.parentElement.appendChild(this.pixiApp.view)

    if (!this.pixiRenderTexture) {
      this.pixiRenderTexture = RenderTexture.create({
        height: screen.height,
        width: screen.width,
      })
    }

    if (!this.keyboardInput) {
      this.keyboardInput = new KeyboardInputManager()
    }

    const sprite = new Sprite(this.pixiRenderTexture)
    sprite.height = height
    sprite.width = width

    this.pixiApp.stage.addChild(sprite)
    this.pixiApp.stage.interactive = true

    this.keyboardInput.focus()
    document.addEventListener(
      'keydown',
      this.keyboardInput.keyDown.bind(this.keyboardInput)
    )
    document.addEventListener(
      'keyup',
      this.keyboardInput.keyUp.bind(this.keyboardInput)
    )

    this.cleanupFunction = () => {
      if (this.pixiApp) {
        this.pixiApp.destroy(true)
        this.pixiApp = null
      }
      this.pixiRenderTexture = null
      this.parentElement = null
      if (this.keyboardInput) {
        document.removeEventListener(
          'keydown',
          this.keyboardInput.keyDown.bind(this.keyboardInput)
        )
        document.removeEventListener(
          'keyup',
          this.keyboardInput.keyUp.bind(this.keyboardInput)
        )
        this.keyboardInput = null
      }
      App.instance = null
    }

    console.log('PixiJS App initialized successfully.')
  }

  /**
   * Retrieves the current PixiJS Application instance.
   * @returns The PixiJS Application instance, or null if not initialized.
   */
  public getPixiApp() {
    return this.pixiApp
  }

  /**
   * Retrieves the current KeyboardInputManager instance.
   * @returns The KeyboardInputManager instance, or null if not initialized.
   */
  public getKeyboardInput() {
    return this.keyboardInput
  }

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
  const { height: parentHeight, width: parentWidth } =
    el.getBoundingClientRect()
  let scale = 6
  // Continuously reduce scale until the app fits within the parent dimensions
  while (
    screen.height * scale > parentHeight ||
    screen.width * scale > parentWidth
  ) {
    scale -= 0.5
  }
  return { height: screen.height * scale, width: screen.width * scale }
}
