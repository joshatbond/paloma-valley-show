import { Application } from '@pixi/react'
import { useRef } from 'react'

export function BattleSimulator() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} className="grid h-full">
      <Application
        width={ref.current?.clientWidth}
        height={ref.current?.clientHeight}
        sharedTicker
        autoStart
        resizeTo={ref}
      ></Application>
    </div>
  )
}
