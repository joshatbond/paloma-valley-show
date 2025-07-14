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
  pulse: (props: { count: number; gap: number }) => Promise<() => void>
} {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const labelRef = useRef<HTMLLabelElement | null>(null)
  const isIOS = useMemo(() => detectiOS(), [])

  useEffect(() => {
    const inputEl = document.getElementById('haptic-switch')
    const labelEl = document.getElementById('haptic-label')

    if (inputEl) {
      inputRef.current = inputEl as HTMLInputElement
    } else {
      const input = document.createElement('input')
      input.type = 'checkbox'
      input.id = 'haptic-switch'
      input.setAttribute('switch', '')
      input.style.display = 'none'
      document.body.appendChild(input)
      inputRef.current = input
    }

    if (labelEl) {
      labelRef.current = labelEl as HTMLLabelElement
    } else {
      const label = document.createElement('label')
      label.htmlFor = 'haptic-switch'
      label.id = 'haptic-label'
      label.style.display = 'none'
      document.body.appendChild(label)
      labelRef.current = label
    }
  }, [])

  const triggerHaptic = useCallback(() => {
    if (!isIOS && navigator?.vibrate) {
      navigator.vibrate(duration)
    } else {
      labelRef.current?.click()
    }
  }, [isIOS])

  const pulseHaptics = useCallback(
    async ({ count, gap }: { count: number; gap: number }) => {
      let isMounted = true

      const internalPulseCb = () => {
        if (!isMounted) return
        triggerHaptic()
      }

      try {
        await pulse(count, duration + gap, internalPulseCb)
      } catch (error) {
      } finally {
      }

      return () => {
        isMounted = false
      }
    },
    [isIOS]
  )

  return { once: triggerHaptic, pulse: pulseHaptics }
}

/**
 * Delays execution for a specified number of milliseconds.
 * @param ms The number of milliseconds to wait.
 * @returns A Promise that resolves after the specified delay.
 */
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function pulse(times: number, gap: number, cb: () => void) {
  if (
    times < 0 ||
    gap < 0 ||
    !Number.isInteger(times) ||
    !Number.isInteger(gap)
  )
    return

  for (let i = 0; i < times; i++) {
    cb()
    if (i < times - 1) {
      await delay(gap)
    }
  }
}
