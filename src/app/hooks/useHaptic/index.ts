import { useCallback, useEffect, useMemo, useRef } from 'react'
import { detectiOS } from './utils'

const HAPTIC_DURATION = 100

/**
 * React hook for triggering haptic feedback on mobile devices
 *
 * This hook creates hidden DOM elements to trigger haptic feedback using the `input[switch]`
 * element for iOS devices and falls back to the Vibration API for other supported devices.
 *
 * @param duration - The duration of the vibration in milliseconds (default: 100ms)
 * @returns An object containing the `triggerHaptic` function to trigger haptic feedback
 *
 * @example
 * ```tsx
 * import { useHaptic } from "use-haptic";
 *
 * function HapticButton() {
 *   const { triggerHaptic } = useHaptic(200); // 200ms vibration
 *   return <button onClick={triggerHaptic}>Vibrate</button>;
 * }
 * ```
 */
export function useHaptic(duration = HAPTIC_DURATION): {
  once: () => void
  doubleTap: () => void
} {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const labelRef = useRef<HTMLLabelElement | null>(null)
  const isIOS = useMemo(() => detectiOS(), [])

  useEffect(() => {
    // Create and append input element
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.id = 'haptic-switch'
    input.setAttribute('switch', '')
    input.style.display = 'none'
    document.body.appendChild(input)
    inputRef.current = input

    // Create and append label element
    const label = document.createElement('label')
    label.htmlFor = 'haptic-switch'
    label.style.display = 'none'
    document.body.appendChild(label)
    labelRef.current = label

    // Cleanup function
    return () => {
      document.body.removeChild(input)
      document.body.removeChild(label)
    }
  }, [])

  const triggerHaptic = useCallback(() => {
    if (isIOS) {
      labelRef.current?.click()
    } else {
      if (navigator?.vibrate) {
        navigator.vibrate(duration)
      } else {
        labelRef.current?.click()
      }
    }
  }, [isIOS])

  const twice = useCallback(() => {
    setTimeout(() => {
      triggerHaptic()
    }, duration + 20)
    triggerHaptic()
  }, [isIOS])

  return { once: triggerHaptic, doubleTap: twice }
}
