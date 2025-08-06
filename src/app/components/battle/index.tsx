import { useEffect, useRef } from 'react'

import { useStore } from '../show/store'
import { run } from './run'

export function BattleSimulator() {
  const parentEl = useRef<HTMLDivElement>(null)
  const appRef = useRef<ReturnType<typeof run>>()
  const battleState = useStore(state => state.battle)
  const battleStateAssign = useStore(state => state.updateBattleState)

  useEffect(() => {
    if (parentEl) {
      setTimeout(() => {
        appRef.current = run('battle-container')
      }, 0.1e3)
    }
    if (battleState === 'done') {
      setTimeout(() => {
        battleStateAssign('exit')
      }, 9e3)
    }

    return () => {
      appRef.current?.()
    }
  }, [parentEl.current, battleState, battleStateAssign])

  return (
    <div
      id="battle-container"
      ref={parentEl}
      className="absolute inset-0 grid place-content-center"
    />
  )
}
