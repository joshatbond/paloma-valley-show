import { useEffect, useRef } from 'react'

import { Store, useStore } from '../components/show/store'
import { useHaptic } from './useHaptic'

export function useButton(
  button: Button,
  {
    throttleDuration = 0.1e3,
    disabled = false,
    cond,
    onPress,
  }: {
    throttleDuration?: number
    disabled?: boolean
    cond?: () => boolean
    onPress: () => void
  } = {
    cond: () => true,
    onPress: () => {},
  }
) {
  const haptics = useHaptic()
  const buttonState = useStore(state => state.buttons[button])
  const buttonStateAssign = useStore(state => state.buttonStateAssign)
  const lastUsed = useRef(0)

  useEffect(() => {
    if (disabled) return

    const now = Date.now()
    const tooSoon = now - lastUsed.current < throttleDuration
    if (buttonState !== 'pressed' || tooSoon) return

    lastUsed.current = now
    buttonStateAssign(button, 'ready')
    if (cond?.() || !cond) {
      haptics.once()
      onPress()
    }
  }, [
    button,
    buttonState,
    disabled,
    haptics,
    throttleDuration,
    buttonStateAssign,
    onPress,
    cond,
  ])
}
type Button = keyof Store['buttons']
