import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useActor } from '@xstate/react'
import { machine } from '../components/stateMachine'
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { api } from '~/server/convex/_generated/api'
import { useEffect, useRef, useState } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useHaptic } from '../hooks/useHaptic'

export const Route = createFileRoute('/show')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigation = useNavigate()
  const [state, send, ref] = useActor(machine)
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))
  const { mutate: confirmStarter } = useMutation({
    mutationFn: useConvexMutation(api.appState.selectStarter),
  })
  const haptics = useHaptic()

  const selectedStarter = useRef<'one' | 'two' | 'three' | null>(null)

  useEffect(() => {
    if (data.pollEnded && ref.getSnapshot().context.pollEnded === null) {
      send({ type: 'pollEnded', endTime: data.pollEnded })
    }
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

  if (!data.showId) navigation({ to: '/' })

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
    selectedStarter.current = 'one'
    Game = <Phase1Starter1ConfirmChoice />
  } else if (state.matches({ phase1: { starter2: 'introduction' } })) {
    Game = <Phase1Starter2Intro />
  } else if (state.matches({ phase1: { starter2: 'description' } })) {
    Game = <Phase1Starter2Description />
  } else if (state.matches({ phase1: { starter2: 'confirmChoice' } })) {
    selectedStarter.current = 'two'
    Game = <Phase1Starter2ConfirmChoice />
  } else if (state.matches({ phase1: { starter3: 'introduction' } })) {
    Game = <Phase1Starter3Intro />
  } else if (state.matches({ phase1: { starter3: 'description' } })) {
    Game = <Phase1Starter3Description />
  } else if (state.matches({ phase1: { starter3: 'confirmChoice' } })) {
    selectedStarter.current = 'three'
    Game = <Phase1Starter3ConfirmChoice />
  } else if (state.matches({ phase1: 'poll' })) {
    if (selectedStarter.current) {
      confirmStarter({
        showId: data.showId!,
        selection: selectedStarter.current,
      })
      selectedStarter.current = null
    }
    Game = (
      <Phase1Poll
        pollDuration={ref.getSnapshot().context.pollDuration}
        pollStarted={data.pollStarted}
        pollEnded={data.pollEnded}
        showId={data.showId!}
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

  const navLeft = () => {
    haptics.once()
    send({ type: 'navLeft' })
  }
  const navRight = () => {
    haptics.once()
    send({ type: 'navRight' })
  }
  const goNext = () => {
    haptics.once()
    send({ type: 'next' })
  }
  const goBack = () => {
    haptics.once()
    send({ type: 'back' })
  }

  return (
    <main className='min-h-screen grid grid-rows-[1fr_auto]'>
      <div className='bg-[#222] text-white px-8 py-4 grid'>
        <div className='grid place-content-center bg-black rounded'>{Game}</div>
      </div>

      <div className='relative bg-[#f9cb1c]'>
        <div className='flex justify-center'>
          <div className='relative'>
            <img
              className='object-contain max-h-[430px]'
              src='/images/controller.jpg'
            />
            <div className='absolute inset-0'></div>

            <button
              className='absolute w-[13%] h-[14%] left-[16%] top-[21%] select-none'
              onClick={navLeft}
            />

            <button
              className='absolute w-[13%] h-[14%] left-[16%] top-[53%] select-none size-full'
              onClick={navRight}
            />

            <button
              className='absolute w-[13%] h-[17%]  left-[2%] top-[36%] select-none size-full'
              onClick={navLeft}
            />

            <button
              className='absolute w-[13%] h-[17%]  left-[30%] top-[36%] select-none size-full'
              onClick={navRight}
            />

            <button
              className='absolute top-[22%] left-[75%] w-[21%] h-[25%] rounded-full select-none'
              onClick={goNext}
            />

            <button
              className='absolute top-[44%] left-[54%] w-[21%] h-[25%] rounded-full select-none'
              onClick={goBack}
            />
          </div>
        </div>
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
  pollEnded?: number
  showId: number
  next: () => void
}) {
  const timeLeft = useTimer({
    duration: props.pollDuration,
    startTime: props.pollStarted,
    endTime: props.pollEnded,
  })
  const { data } = useQuery(
    convexQuery(api.appState.pollState, { showId: props.showId })
  )
  if (props.pollEnded) props.next()

  const totalItems = data ? data.reduce((a, v) => a + v, 0) : 1

  return (
    <div>
      <p>Time left: {timeLeft}s</p>
      {data ? (
        <div>
          <p>Poll Results</p>
          <div className='flex gap-4 justify-between'>
            {data.map((v, i) => (
              <div
                key={i}
                className='grid place-content-center poll-item size-10 border'
                style={{
                  '--fill-percentage': `${(v / totalItems) * 100}%`,
                  '--fill-color': i === 0 ? 'red' : i === 1 ? 'green' : 'blue',
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Waiting for results!</p>
      )}
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
