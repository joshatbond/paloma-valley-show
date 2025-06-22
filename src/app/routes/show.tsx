import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useActor } from '@xstate/react'
import { machine } from '../components/stateMachine'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '~/server/convex/_generated/api'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/show')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))
  const [state, send, ref] = useActor(machine)
  const navigation = useNavigate()

  useEffect(() => {
    if (data.currentPhase > 0 && ref.getSnapshot().context.currentPhase === 0) {
      send({
        type: 'updatePhase',
        phase: data.currentPhase,
        startTime: data.pollStarted,
      })
    } else if (
      data.currentPhase === 2 &&
      ref.getSnapshot().context.currentPhase === 1
    ) {
      send({ type: 'updatePhase' })
    }
  }, [data, state, send])

  let Game = <Phase0Intro1 />
  if (state.matches({ phase0: { introduction: 'screen1' } })) {
    Game = <Phase0Intro1 />
  } else if (state.matches({ phase0: { introduction: 'screen2' } })) {
    Game = <Phase0Intro2 />
  } else if (state.matches({ phase0: { introduction: 'screen3' } })) {
    Game = <Phase0Intro3 />
  } else if (state.matches({ phase0: { introduction: 'screen4' } })) {
    Game = <Phase0Intro4 />
  } else if (state.matches({ phase0: 'waitingPhase1' })) {
    Game = <Phase0Waiting />
  } else if (state.matches({ phase0: 'readyPhase1' })) {
    Game = <Phase0Ready />
  } else if (state.matches({ phase1: { introduction: 'screen1' } })) {
    Game = <Phase1Intro1 />
  } else if (state.matches({ phase1: { introduction: 'screen2' } })) {
    Game = <Phase1Intro2 />
  } else if (state.matches({ phase1: { introduction: 'screen3' } })) {
    Game = <Phase1Intro3 />
  } else if (state.matches({ phase1: { starter1: 'introduction' } })) {
    Game = <Phase1Starter1Intro />
  } else if (state.matches({ phase1: { starter1: 'description' } })) {
    Game = <Phase1Starter1Description />
  } else if (state.matches({ phase1: { starter1: 'confirmChoice' } })) {
    Game = <Phase1Starter1ConfirmChoice />
  } else if (state.matches({ phase1: { starter2: 'introduction' } })) {
    Game = <Phase1Starter2Intro />
  } else if (state.matches({ phase1: { starter2: 'description' } })) {
    Game = <Phase1Starter2Description />
  } else if (state.matches({ phase1: { starter2: 'confirmChoice' } })) {
    Game = <Phase1Starter2ConfirmChoice />
  } else if (state.matches({ phase1: { starter3: 'introduction' } })) {
    Game = <Phase1Starter3Intro />
  } else if (state.matches({ phase1: { starter3: 'description' } })) {
    Game = <Phase1Starter3Description />
  } else if (state.matches({ phase1: { starter3: 'confirmChoice' } })) {
    Game = <Phase1Starter3ConfirmChoice />
  } else if (state.matches({ phase1: 'poll' })) {
    Game = (
      <Phase1Poll
        pollDuration={ref.getSnapshot().context.pollDuration}
        pollStarted={data.pollStarted}
        next={() => send({ type: 'next' })}
      />
    )
  } else if (state.matches({ phase1: 'pollClosed' })) {
    Game = <Phase1PollClosed />
  } else if (state.matches({ phase1: 'rivalSelect' })) {
    Game = <Phase1RivalSelect />
  } else if (state.matches({ phase2: 'playVideo' })) {
    Game = <Phase2Battle />
  } else if (state.matches({ phase2: { epilogue: 'screen1' } })) {
    Game = <Phase2Epilogue1 />
  } else if (state.matches({ phase2: { epilogue: 'screen2' } })) {
    Game = <Phase2Epilogue2 />
  } else if (state.matches({ phase2: { epilogue: 'screen3' } })) {
    Game = <Phase2Epilogue3 />
  } else if (state.matches({ phase2: { epilogue: 'screen4' } })) {
    Game = <Phase2Epilogue4 />
  } else if (state.matches({ phase2: { epilogue: 'screen5' } })) {
    Game = <Phase2Epilogue5 />
  } else if (state.matches({ phase2: { epilogue: 'screen6' } })) {
    Game = <Phase2Epilogue6 />
  } else {
    Game = <Phase2Epilogue7 />
  }

  if (!data.showIsActive) {
    navigation({ to: '/' })
  }

  return (
    <main className='min-h-screen grid grid-rows-2'>
      <div className='grid place-content-center border-b'>{Game}</div>

      <div className='row-start-2 grid grid-cols-[1fr_48px_48px_48px_2fr_48px_48px_1fr] grid-rows-[1fr_48px_48px_48px_1fr]'>
        <div className='col-start-3 row-start-2 col-span-1 row-span-1 grid place-content-center border'>
          <button onClick={() => send({ type: 'navLeft' })}>Up</button>
        </div>

        <div className='col-start-3 row-start-4 col-span-1 row-span-1 grid place-content-center border'>
          <button onClick={() => send({ type: 'navRight' })}>Down</button>
        </div>

        <div className=' col-start-2 row-start-3 col-span-1 row-span-1 grid place-content-center border'>
          <button onClick={() => send({ type: 'navLeft' })}>Left</button>
        </div>

        <div className='col-start-4 row-start-3 col-span-1 row-span-1 grid place-content-center border'>
          <button onClick={() => send({ type: 'navRight' })}>Right</button>
        </div>

        <div className='col-start-6 row-start-3 col-span-1 row-span-1 grid place-content-center border rounded-full'>
          <button onClick={() => send({ type: 'next' })}>A</button>
        </div>

        <div className='col-start-7 row-start-3 col-span-1 row-span-1 grid place-content-center border rounded-full'>
          <button onClick={() => send({ type: 'back' })}>B</button>
        </div>
        <div className='col-start-8 row-start-5 col-span-1 row-span-1'></div>
      </div>
    </main>
  )
}

function Phase0Intro1() {
  return <p>phase 0: Intro Screen 1</p>
}
function Phase0Intro2() {
  return <p>phase 0: Intro Screen 2</p>
}
function Phase0Intro3() {
  return <p>phase 0: Intro Screen 3</p>
}
function Phase0Intro4() {
  return <p>phase 0: Intro Screen 4</p>
}
function Phase0Waiting() {
  return <p>phase 0: Waiting for phase 1</p>
}
function Phase0Ready() {
  return <p>phase 0: Ready for phase 1</p>
}
function Phase1Intro1() {
  return <p>phase 1: Intro Screen 1</p>
}
function Phase1Intro2() {
  return <p>phase 1: Intro Screen 2</p>
}
function Phase1Intro3() {
  return <p>phase 1: Intro Screen 3</p>
}
function Phase1Starter1Intro() {
  return <p>phase 1: Starter 1 Intro</p>
}
function Phase1Starter1Description() {
  return <p>phase 1: Starter 1 Description</p>
}
function Phase1Starter1ConfirmChoice() {
  return <p>phase 1: Starter 1 Confirm Choice</p>
}
function Phase1Starter2Intro() {
  return <p>phase 1: Starter 2 Intro</p>
}
function Phase1Starter2Description() {
  return <p>phase 1: Starter 2 Description</p>
}
function Phase1Starter2ConfirmChoice() {
  return <p>phase 1: Starter 2 Confirm Choice</p>
}
function Phase1Starter3Intro() {
  return <p>phase 1: Starter 3 Intro</p>
}
function Phase1Starter3Description() {
  return <p>phase 1: Starter 3 Description</p>
}
function Phase1Starter3ConfirmChoice() {
  return <p>phase 1: Starter 3 Confirm Choice</p>
}
function Phase1Poll(props: {
  pollStarted: number | null
  pollDuration: number
  next: () => void
}) {
  const [clock, clockAssign] = useState(props.pollDuration)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const currentTime = Date.now()
    const pollEndTime = props.pollStarted
      ? props.pollStarted + props.pollDuration
      : Infinity

    if (clock <= 0 || (props.pollStarted && currentTime >= pollEndTime)) {
      clockAssign(0)
      props.next()
      return
    }
    if (clock !== Math.floor((pollEndTime - currentTime) / 1000)) {
      clockAssign(Math.floor((pollEndTime - currentTime) / 1000))
    }

    timeoutId = setTimeout(() => {
      clockAssign((p) => p - 1)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [props.pollStarted, props.pollDuration, clock])

  return (
    <div>
      <p>Time left: {clock}s</p>
      <p>Poll Results</p>
    </div>
  )
}

function Phase1PollClosed() {
  return <p>phase 1: poll closed!</p>
}
function Phase1RivalSelect() {
  return <p>phase1: rival select</p>
}
function Phase2Battle() {
  return <p>phase 2: battle video plays here</p>
}
function Phase2Epilogue1() {
  return <p>phase 2: Epilogue 1</p>
}
function Phase2Epilogue2() {
  return <p>phase 2: Epilogue 2</p>
}
function Phase2Epilogue3() {
  return <p>phase 2: Epilogue 3</p>
}
function Phase2Epilogue4() {
  return <p>phase 2: Epilogue 4</p>
}
function Phase2Epilogue5() {
  return <p>phase 2: Epilogue 5</p>
}
function Phase2Epilogue6() {
  return <p>phase 2: Epilogue 6</p>
}
function Phase2Epilogue7() {
  return (
    <div>
      <p>phase 2: Epilogue 7</p>
      <Link to='/program'>View our program</Link>
    </div>
  )
}
