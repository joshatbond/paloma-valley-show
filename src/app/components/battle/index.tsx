import { useEffect, useRef } from 'react'

import { getInstance } from './pixi'

export function BattleSimulator() {
  const parentEl = useRef<HTMLDivElement>(null)
  const appRef = useRef<ReturnType<typeof getInstance>>()

  useEffect(() => {
    if (parentEl) {
      appRef.current = getInstance()
    }

    return () => {
      appRef.current?.destroy()
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
