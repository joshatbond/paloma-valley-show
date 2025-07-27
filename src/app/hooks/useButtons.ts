import { useEffect, useRef } from 'react'

import { Store, useStore } from '../components/show/store'

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
  const buttonState = useStore(state => state.buttons[button])
  const buttonStateAssign = useStore(state => state.buttonStateAssign)
  const lastUsed = useRef(0)

  useEffect(() => {
    if (
      buttonState !== 'pressed' ||
      Date.now() - lastUsed.current < throttleDuration ||
      (cond && !cond())
    )
      return
    lastUsed.current = Date.now()
    buttonStateAssign(button, 'ready')
    onPress()
  }, [button, buttonState, throttleDuration, buttonStateAssign, onPress, cond])
}
type Button = keyof Store['buttons']
