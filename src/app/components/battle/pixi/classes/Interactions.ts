import { getState, subscribe } from '~/app/components/show/store'
import { type Store } from '~/app/components/show/store'
import { detectiOS } from '~/app/hooks/useHaptic/utils'

const THROTTLE_DURATION = 0.1e3

class InputManager {
  /**
   * Singleton instance of the InputManager.
   */
  private static instance: InputManager | null = null
  /**
   * The last time each button was pressed.
   * Used to throttle button presses.
   */
  private lastUsed: { [key in keyof Store['buttons']]?: number } = {}
  /**
   * Which buttons are currently pressed.
   * Used to track the state of each button.
   */
  private pressedButtons: { [key in keyof Store['buttons']]?: boolean } = {}

  /**
   * The private constructor prevents direct instantiation.
   * Use `InputManager.getInstance()` to access the singleton instance.
   */
  private constructor() {}
  private initializeButtonListener() {
    const buttonStateAssign = getState().buttonStateAssign

    subscribe((newState, oldState) => {
      if (newState.menu.show) return
      if (oldState.battle === 'done') return

      for (const button of Object.keys(
        newState.buttons
      ) as (keyof Store['buttons'])[]) {
        const newButtonState = newState.buttons[button]
        const oldButtonState = oldState.buttons[button]
        const wasJustPressed =
          newButtonState === 'pressed' && oldButtonState !== 'pressed'

        if (!wasJustPressed) continue

        const now = Date.now()
        const lastUsedTime = this.lastUsed[button] ?? 0
        if (now - lastUsedTime < THROTTLE_DURATION) continue

        this.lastUsed[button] = now
        triggerHaptic()
        this.pressedButtons[button] = true
        buttonStateAssign(button, 'ready')
      }
    })
  }

  public static getInstance() {
    if (InputManager.instance) return InputManager.instance

    InputManager.instance = new InputManager()
    InputManager.instance.initializeButtonListener()
    return InputManager.instance
  }

  /**
   * Checks if a button is currently pressed.
   */
  get selected() {
    return this.pressedButtons['a']
  }
  /**
   * Checks if the back button is currently pressed.
   */
  get back() {
    return this.pressedButtons['b']
  }
  /**
   * Checks if the A or B button is currently pressed.
   */
  get AorB() {
    return this.pressedButtons['a'] || this.pressedButtons['b']
  }
  /**
   * Used in some cases to advance text boxes regardless of the button state.
   */
  get advance() {
    return this.selected || this.back
  }
  /**
   * Checks if the up button is currently pressed.
   */
  get up() {
    return this.pressedButtons['up']
  }
  /**
   * Checks if the down button is currently pressed.
   */
  get down() {
    return this.pressedButtons['down']
  }
  /**
   * Checks if the left button is currently pressed.
   */
  get left() {
    return this.pressedButtons['left']
  }
  /**
   * Checks if the right button is currently pressed.
   */
  get right() {
    return this.pressedButtons['right']
  }

  /**
   * Forcefully sets the A button as pressed.
   */
  forceAdvance() {
    this.pressedButtons['a'] = true
  }
  /**
   * Forcefully sets the B button as pressed.
   */
  forceBack() {
    this.pressedButtons['b'] = true
  }
  /**
   * Releases the state of a specific button.
   * @param key The button key to release.
   */
  release(key: keyof Store['buttons']) {
    this.pressedButtons[key] = false
  }
  /**
   * Releases the state of all arrow buttons.
   */
  releaseArrows() {
    this.release('up')
    this.release('down')
    this.release('left')
    this.release('right')
  }
  /**
   * Releases the state of the select button.
   */
  releaseSelect() {
    this.release('a')
  }
  /**
   * Releases the state of the back button.
   */
  releaseBack() {
    this.release('b')
  }
}
export const getInstance = InputManager.getInstance.bind(InputManager)

const hapticElement = document.getElementById(
  'haptic-label'
) as HTMLLabelElement
/**
 * Triggers a single haptic feedback event
 * @param duration Duration in milliseconds for the haptic feedback.
 */
function triggerHaptic(duration = 100) {
  const isIOS = detectiOS()

  if (!isIOS && 'vibrate' in navigator) {
    navigator.vibrate(duration)
  } else if (isIOS && 'webkit' in navigator) {
    // iOS uses webkit for haptic feedback
    ;(navigator as any).webkitVibrate(duration)
  } else {
    hapticElement.click()
  }
}
