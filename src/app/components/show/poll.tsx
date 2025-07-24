import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'

import { useTimer } from '~/app/hooks/useTimer'
import { api } from '~/server/convex/_generated/api'

export function Poll(props: {
  duration: number
  end?: number
  id: number
  start: number | null
  onNext: () => void
}) {
  const timeLeft = useTimer({
    duration: props.duration,
    startTime: props.start,
    endTime: props.end,
  })

  const { data } = useQuery(
    convexQuery(api.appState.pollState, { showId: props.id })
  )
  const totalItems = data ? data.reduce((a, v) => a + v, 0) : 1

  if (props.end || timeLeft <= 0) props.onNext()

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] bg-black/30 backdrop-blur-xs">
      <div className="col-start-2 row-start-1 grid grid-flow-col place-items-center gap-2 px-8">
        <PollItem
          type="bulbasaur"
          percent={data ? (data[0] / totalItems) * 100 : 0}
        />
        <PollItem
          type="squirtle"
          percent={data ? (data[1] / totalItems) * 100 : 0}
        />
        <PollItem
          type="charmander"
          percent={data ? (data[2] / totalItems) * 100 : 0}
        />
      </div>

      <div className="col-span-3 col-start-1 row-start-2 px-[2%] pb-[1%]" />
    </div>
  )
}

function PollItem(props: {
  percent: number
  type: 'bulbasaur' | 'squirtle' | 'charmander'
}) {
  return (
    <div
      className="relative"
      style={{
        '--mask-height': `${props.percent}%`,
      }}
    >
      <img src={`/images/frame_${props.type}.png`} />

      <img
        src={`/images/frame_${props.type}_mask.png`}
        className="absolute inset-0 mask-linear-[0deg,black_var(--mask-height),transparent_var(--mask-height)]"
      />
    </div>
  )
}
