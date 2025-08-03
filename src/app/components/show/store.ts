import { createStore } from '~/app/hooks/createStore'

export const { useStore, getState, subscribe } = createStore<Store>()(set => ({
  buttons: {
    a: 'ready',
    b: 'ready',
    up: 'ready',
    down: 'ready',
    left: 'ready',
    right: 'ready',
    start: 'ready',
  },
  menu: {
    show: false,
  },
  qaMode: {
    enabled: import.meta.env.DEV,
    shown: false,
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
  showMenu: f => {
    set(state => ({
      ...state,
      menu: {
        ...state.qaMode,
        show: f !== undefined ? f : !state.menu.show,
      },
    }))
  },
  showQAMode: f => {
    set(state => ({
      ...state,
      qaMode: {
        ...state.qaMode,
        shown: f !== undefined ? f : !state.qaMode.shown,
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
  menu: { show: boolean }
  starter: 'charmander' | 'squirtle' | 'bulbasaur' | null
  typing: Typing | TypingDisabled | TypingReady
  qaMode: {
    enabled: boolean
    shown: boolean
  }
  buttonStateAssign: (b: keyof Store['buttons'], s: ButtonState) => void
  starterAssign: (c: Store['starter']) => void
  typingStateAssign: (s: Store['typing']) => void
  showQAMode: (f?: boolean) => void
  showMenu: (f?: boolean) => void
}
type ButtonState = 'ready' | 'pressed' | 'disabled'
/** this state is when the system is currently rendering the typewriter effect */
type Typing = 'typing'
/** this state is when the user has overridden the typewriter rendering */
type TypingDisabled = 'userOverride'
/** this state is a staging state, telling us the typing effect CAN be done, but isn't currently running */
type TypingReady = 'ready'
