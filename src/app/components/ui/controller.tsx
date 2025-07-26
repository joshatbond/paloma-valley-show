import { ComponentPropsWithoutRef, useCallback, useEffect, useRef } from 'react'

import { type Store, useStore } from '~/app/components/show/store'
import { useHaptic } from '~/app/hooks/useHaptic'

export function Controller() {
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
          />

          <Button
            className="absolute top-[53%] left-[16%] size-full h-[14%] w-[13%] select-none"
            kind="down"
          />

          <Button
            className="absolute top-[36%] left-[2%] size-full h-[17%] w-[13%] select-none"
            kind="left"
          />

          <Button
            className="absolute top-[36%] left-[30%] size-full h-[17%] w-[13%] select-none"
            kind="right"
          />

          <Button
            className="absolute top-[22%] left-[75%] h-[25%] w-[21%] rounded-full select-none"
            kind="a"
          />

          <Button
            className="absolute top-[44%] left-[54%] h-[25%] w-[21%] rounded-full select-none"
            kind="b"
          />

          <Button
            className="absolute top-[77%] left-[53%] h-[6%] w-[12%] rounded"
            kind="start"
          />
        </div>
      </div>
    </div>
  )
}
function Button({
  kind,
  ...props
}: ComponentPropsWithoutRef<'button'> & {
  kind: keyof Store['buttons']
}) {
  const state = useStore(state => state.buttons[kind])
  const stateAssign = useStore(state => state.buttonStateAssign)
  const haptics = useHaptic()

  const lastDownRef = useRef(0)
  const lastUpRef = useRef(0)
  const throttleDelay = 2.5e3

  const handleDown = useCallback(() => {
    switch (state) {
      case 'disabled':
        haptics.pulse({ count: 2, gap: 10 })
        break
      case 'ready':
        stateAssign(kind, 'pressed')
        haptics.once()
        break
      default:
        break
    }
  }, [state, haptics, stateAssign])
  const handleUp = useCallback(() => {
    if (state === 'pressed') stateAssign(kind, 'ready')
  }, [state, stateAssign])

  useEffect(() => {
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    function keyMap(key: string) {
      switch (key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          return key.substring(5).toLocaleLowerCase()
        case 'a':
        case 'Enter':
          return 'a'
        case 'b':
        case 'Backspace':
          return 'b'
        case 'Escape':
          return 'start'
      }
    }
    function keyDown(e: KeyboardEvent) {
      if (Date.now() - lastDownRef.current < throttleDelay) return
      lastDownRef.current = Date.now()

      const key = keyMap(e.key)

      if (key !== kind) return
      handleDown()
    }
    function keyUp(e: KeyboardEvent) {
      if (Date.now() - lastUpRef.current < throttleDelay) return
      lastUpRef.current = Date.now()

      const key = keyMap(e.key)
      if (key !== kind) return

      handleUp()
    }

    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
    }
  }, [kind, handleDown, handleUp])

  return <button onPointerDown={handleDown} onPointerUp={handleUp} {...props} />
}
