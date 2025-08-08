import { useEffect, useRef } from 'react'

import { useStore } from '../show/store'
import { run } from './run'

export function BattleSimulator() {
  const parentEl = useRef<HTMLDivElement>(null)
  const battleState = useStore(state => state.battle)
  const battleStateAssign = useStore(state => state.updateBattleState)
  const typingStateAssign = useStore(state => state.typingStateAssign)
  const typingState = useStore(state => state.typing)

  useEffect(() => {
    if (parentEl) {
      setTimeout(() => {
        run('battle-container')
      }, 0.1e3)
    }
    if (battleState === 'done') {
      setTimeout(() => {
        battleStateAssign('exit')
      }, 9e3)
    }
  }, [parentEl.current, battleState, battleStateAssign])

  useEffect(() => {
    if (typingState === 'userOverride') {
      typingStateAssign('ready')
    }
  }, [typingState, typingStateAssign])

  return (
    <div
      id="battle-container"
      ref={parentEl}
      className="absolute inset-0 grid place-content-center"
    />
  )
}
