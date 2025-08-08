import { State } from '~/app/hooks/useGameMachine'

import { getLines } from './lines'
import { Text } from './screen'

export function Starter(props: {
  type: 'bulbasaur' | 'squirtle' | 'charmander'
  state: State
}) {
  return (
    <div className="grid h-full grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] bg-black/30 backdrop-blur-xs">
      <div className="col-start-1 row-start-1 grid items-center justify-end">
        <img src="/images/arrow.png" className="w-8 rotate-90" />
      </div>

      <img
        src={`/images/frame_${props.type}.png`}
        className="col-start-2 row-start-1"
      />

      <div className="col-start-3 row-start-1 grid items-center justify-start">
        <img src="/images/arrow.png" className="w-8 -rotate-90" />
      </div>

      <div className="relative col-span-3 col-start-1 row-start-2 px-[2%] pb-[1%]">
        <img src="/images/exposition.png" />

        <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
          <Text text={getLines(props.state, props.type)} />
        </div>

        <div className="absolute right-[1.75rem] bottom-[0.75rem]">
          <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
        </div>
      </div>
    </div>
  )
}
