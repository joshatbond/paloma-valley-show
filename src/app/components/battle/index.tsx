import { Stage } from '@pixi/react'
import { useEffect, useRef, useState } from 'react'

export function BattleSimulator() {
  const [width, widthAssign] = useState(160)
  const [height, heightAssign] = useState(144)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const { clientWidth, clientHeight } = ref.current
      let scale = 4
      while (clientHeight < 144 * scale || clientWidth < 160 * scale) {
        scale -= 1
      }
      widthAssign(160 * scale)
      heightAssign(144 * scale)
    }
  }, [ref.current])

  return (
    <div ref={ref} className="absolute inset-0 grid place-content-center">
      <Stage
        width={width}
        height={height}
        options={{
          backgroundColor: 0xf8f8f8,
          resizeTo: ref.current ?? undefined,
        }}
      ></Stage>
    </div>
  )
}
