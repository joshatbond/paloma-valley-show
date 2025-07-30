/**
 * Manages keyboard input, tracking pressed keys and providing convenient methods
 * for common key combinations and states. It also handles focus to enable or
 * disable key input processing.
 */
export class KeyboardInputManager {
  /**
   * Stores the current state of pressed keys, where the key is the KeyboardEvent.code
   * and the value is a boolean indicating whether the key is currently pressed.
   * @private
   */
  #pressed: Record<string, boolean> = {}

  /**
   * Indicates whether the keyboard input manager is currently focused.
   * When unfocused, keydown events will not be processed.
   * @private
   */
  #focused = false

  /**
   * Checks if the 'select' action keys (KeyX or Enter) are currently pressed.
   * @returns True if 'KeyX' or 'Enter' is pressed, false otherwise.
   */
  selected() {
    return this.#pressed['KeyX'] || this.#pressed['Enter']
  }

  /**
   * Checks if the 'back' action keys (KeyZ or Backspace) are currently pressed.
   * @returns True if 'KeyZ' or 'Backspace' is pressed, false otherwise.
   */
  back() {
    return this.#pressed['KeyZ'] || this.#pressed['Backspace']
  }

  /**
   * Checks if either 'KeyZ' or 'KeyX' is currently pressed.
   * @returns True if 'KeyZ' or 'KeyX' is pressed, false otherwise.
   */
  AorB() {
    return this.#pressed['KeyZ'] || this.#pressed['KeyX']
  }

  /**
   * Checks if either the 'select' or 'back' action keys are pressed,
   * typically used to advance through a textbox or similar input.
   * @returns True if selected() or back() is true, false otherwise.
   */
  advance() {
    return this.selected() || this.back()
  }

  /**
   * Forces the 'advance' state by programmatically setting 'KeyX' to true.
   * This can be used to simulate a selection without an actual key press.
   */
  forceAdvance() {
    this.#pressed['KeyX'] = true
  }

  /**
   * Forces the 'back' state by programmatically setting 'KeyZ' to true.
   * This can be used to simulate a back action without an actual key press.
   */
  forceBack() {
    this.#pressed['KeyZ'] = true
  }

  /**
   * Checks if the 'ArrowUp' key is currently pressed.
   * @returns True if 'ArrowUp' is pressed, false otherwise.
   */
  up() {
    return this.#pressed['ArrowUp']
  }

  /**
   * Checks if the 'ArrowDown' key is currently pressed.
   * @returns True if 'ArrowDown' is pressed, false otherwise.
   */
  down() {
    return this.#pressed['ArrowDown']
  }

  /**
   * Checks if the 'ArrowLeft' key is currently pressed.
   * @returns True if 'ArrowLeft' is pressed, false otherwise.
   */
  left() {
    return this.#pressed['ArrowLeft']
  }

  /**
   * Checks if the 'ArrowRight' key is currently pressed.
   * @returns True if 'ArrowRight' is pressed, false otherwise.
   */
  right() {
    return this.#pressed['ArrowRight']
  }

  /**
   * Releases a specific key, setting its pressed state to false.
   * @param {string} key The `KeyboardEvent.code` of the key to release.
   */
  release(key: string) {
    this.#pressed[key] = false
  }

  /**
   * Releases all arrow keys ('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight').
   */
  releaseArrows() {
    this.release('ArrowUp')
    this.release('ArrowDown')
    this.release('ArrowLeft')
    this.release('ArrowRight')
  }

  /**
   * Releases the 'select' action keys ('KeyX', 'Enter').
   */
  releaseSelect() {
    this.release('KeyX')
    this.release('Enter')
  }

  /**
   * Releases the 'back' action keys ('KeyZ', 'Backspace').
   */
  releaseBack() {
    this.release('KeyZ')
    this.release('Backspace')
  }

  /**
   * Handles the `keydown` event. If the manager is focused and the key is not
   * a repeat event, it sets the corresponding key's state to true.
   * @param e The keyboard event object.
   */
  keyDown(e: KeyboardEvent) {
    if (this.#focused && !e.repeat) {
      this.#pressed[e.code] = true
    }
  }

  /**
   * Handles the `keyup` event. Sets the corresponding key's state to false.
   * @param e The keyboard event object.
   */
  keyUp(e: KeyboardEvent) {
    this.#pressed[e.code] = false
  }

  /**
   * Sets the keyboard input manager to a focused state, allowing key events to be processed.
   */
  focus() {
    this.#focused = true
  }

  /**
   * Sets the keyboard input manager to an unfocused state, preventing key events from being processed.
   */
  unfocus() {
    this.#focused = false
  }

  /**
   * Returns the internal `pressed` object, showing the current state of all tracked keys.
   * This is primarily for inspection or advanced use cases.
   * @returns An object where keys are KeyboardEvent.code strings
   * and values are booleans indicating if the key is pressed.
   */
  get pressed() {
    return this.#pressed
  }
}
