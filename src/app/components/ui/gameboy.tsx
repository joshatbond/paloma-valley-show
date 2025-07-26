import { type PropsWithChildren } from 'react'

import { Controller } from './controller'

export function GameBoyFrame(props: PropsWithChildren) {
  return (
    <main className="grid h-screen grid-cols-[1fr_minmax(auto,500px)_1fr] md:bg-blue-200 md:py-12">
      <div />
      <div className="grid grid-rows-[1fr_auto] overflow-clip md:rounded-b-lg md:shadow-xl/50">
        <ScreenFrame>{props.children}</ScreenFrame>

        <Controller />
      </div>
      <div />
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
