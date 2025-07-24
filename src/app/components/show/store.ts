import { createStore } from '~/app/hooks/store'

export const { useStore, getState } = createStore<Store>()(set => ({
  buttons: {
    a: 'ready',
    b: 'ready',
    up: 'ready',
    down: 'ready',
    left: 'ready',
    right: 'ready',
    start: 'disabled',
  },
  starter: null,
  typing: 'ready',
  buttonStateAssign: (button, newState) => {
    set(state => ({
      ...state,
      buttons: {
        ...state.buttons,
        [button]: newState,
      },
    }))
  },
  starterAssign: starter => {
    set(state => ({ ...state, starter }))
  },
  typingStateAssign: s => {
    set(state => ({
      ...state,
      typing: s,
    }))
  },
}))

export type Store = {
  buttons: {
    [K in 'a' | 'b' | 'up' | 'down' | 'left' | 'right' | 'start']: ButtonState
  }
  starter: 'charmander' | 'squirtle' | 'bulbasaur' | null
  typing: Typing | TypingDisabled | TypingReady
  buttonStateAssign: (b: keyof Store['buttons'], s: ButtonState) => void
  starterAssign: (c: Store['starter']) => void
  typingStateAssign: (s: Store['typing']) => void
}
type ButtonState = 'ready' | 'pressed' | 'disabled'
/** this state is when the system is currently rendering the typewriter effect */
type Typing = 'typing'
/** this state is when the user has overridden the typewriter rendering */
type TypingDisabled = 'userOverride'
/** this state is a staging state, telling us the typing effect CAN be done, but isn't currently running */
type TypingReady = 'ready'
