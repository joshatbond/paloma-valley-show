import { type PropsWithChildren } from 'react'

import { Controller } from './controller'

export function GameBoyFrame(props: PropsWithChildren) {
  return (
    <main className="grid min-h-screen grid-rows-[1fr_auto]">
      <ScreenFrame>{props.children}</ScreenFrame>

      <Controller />
    </main>
  )
}

function ScreenFrame(props: PropsWithChildren) {
  return (
    <div className="grid bg-[#222] px-8 py-6 text-white">
      <div className="grid place-content-center rounded bg-black">
        {props.children}
      </div>
    </div>
  )
}
