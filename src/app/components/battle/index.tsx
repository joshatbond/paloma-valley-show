import { useEffect, useRef } from 'react'

import { run } from './run'

export function BattleSimulator() {
  const parentEl = useRef<HTMLDivElement>(null)
  const appRef = useRef<ReturnType<typeof run>>()

  useEffect(() => {
    if (parentEl) {
      setTimeout(() => {
        appRef.current = run('battle-container')
      }, 0.1e3)
    }

    return () => {
      appRef.current?.()
    }
  }, [parentEl.current])

  return (
    <div
      id="battle-container"
      ref={parentEl}
      className="absolute inset-0 grid place-content-center"
    />
  )
}
