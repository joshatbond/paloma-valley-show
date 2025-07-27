import { useEffect, useRef } from 'react'

import { Store, useStore } from '../components/show/store'
import { useHaptic } from './useHaptic'

export function useButton(
  button: Button,
  {
    throttleDuration = 0.1e3,
    cond,
    onPress,
  }: {
    throttleDuration?: number
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
    if (Date.now() - lastUsed.current < throttleDuration) return
    if (buttonState !== 'pressed' || (cond && !cond())) {
      lastUsed.current = Date.now()
      haptics.pulse({ count: 2, gap: 10 })
      return
    }

    lastUsed.current = Date.now()
    buttonStateAssign(button, 'ready')
    haptics.once()
    onPress()
  }, [
    button,
    buttonState,
    haptics,
    throttleDuration,
    buttonStateAssign,
    onPress,
    cond,
  ])
}
type Button = keyof Store['buttons']
