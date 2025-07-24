import { ComponentPropsWithoutRef, useEffect } from 'react'

import { type Store, useStore } from '~/app/components/show/store'
import { useHaptic } from '~/app/hooks/useHaptic'

export function Controller(props: {
  onUp: () => void
  onDown: () => void
  onLeft: () => void
  onRight: () => void
  onA: () => void
  onB: () => void
}) {
  return (
    <div className="relative bg-[#f9cb1c]">
      <div className="flex justify-center">
        <div className="relative">
          <img
            className="max-h-[430px] object-contain"
            src="/images/controller.jpg"
          />
          <div className="absolute inset-0"></div>

          <Button
            className="absolute top-[21%] left-[16%] h-[14%] w-[13%] select-none"
            kind="up"
            cb={props.onUp}
          />

          <Button
            className="absolute top-[53%] left-[16%] size-full h-[14%] w-[13%] select-none"
            kind="down"
            cb={props.onDown}
          />

          <Button
            className="absolute top-[36%] left-[2%] size-full h-[17%] w-[13%] select-none"
            kind="left"
            cb={props.onLeft}
          />

          <Button
            className="absolute top-[36%] left-[30%] size-full h-[17%] w-[13%] select-none"
            kind="right"
            cb={props.onRight}
          />

          <Button
            className="absolute top-[22%] left-[75%] h-[25%] w-[21%] rounded-full select-none"
            kind="a"
            cb={props.onA}
          />

          <Button
            className="absolute top-[44%] left-[54%] h-[25%] w-[21%] rounded-full select-none"
            kind="b"
            cb={props.onB}
          />
        </div>
      </div>
    </div>
  )
}
function Button({
  kind,
  cb,
  ...props
}: ComponentPropsWithoutRef<'button'> & {
  kind: keyof Store['buttons']
  cb: () => void
}) {
  const state = useStore(state => state.buttons[kind])
  const stateAssign = useStore(state => state.buttonStateAssign)
  const haptics = useHaptic()

  const handleDown = () => {
    switch (state) {
      case 'disabled':
        haptics.pulse({ count: 2, gap: 10 })
        break
      case 'ready':
        stateAssign(kind, 'pressed')
        haptics.once()
        cb()
        break
      default:
        break
    }
  }
  const handleUp = () => {
    if (state === 'pressed') stateAssign(kind, 'ready')
  }

  useEffect(() => {
    function keyDown(e: KeyboardEvent) {
      const key = e.key.includes('Arrow')
        ? e.key.substring(5).toLocaleLowerCase()
        : e.key === 'Enter'
          ? 'a'
          : e.key

      if (key !== kind) return
      handleDown()
    }
    window.addEventListener('keydown', keyDown)

    return () => window.removeEventListener('keydown', keyDown)
  }, [])

  return <button onPointerDown={handleDown} onPointerUp={handleUp} {...props} />
}
