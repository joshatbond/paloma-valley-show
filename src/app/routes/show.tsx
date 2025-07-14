import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { api } from '~/server/convex/_generated/api'
import { useCallback, useRef } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useHaptic } from '../hooks/useHaptic'
import { useGameMachine } from '../hooks/useGameMachine'

export const Route = createFileRoute('/show')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigation = useNavigate()
  const [state, send, ref] = useGameMachine()
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))
  const haptics = useHaptic()

  if (!data.showId) {
    navigation({ to: '/' })
    return
  }
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

  const nav = useCallback(
    (type: 'navLeft' | 'navRight' | 'next' | 'back') => () => {
      haptics.once()
      send({ type })
    },
    [send]
  )

  return (
    <main className='min-h-screen grid grid-rows-[1fr_auto]'>
      <div className='bg-[#222] text-white px-8 py-4 grid'>
        <div className='grid place-content-center bg-black rounded'>
          <Game
            state={state}
            poll={{
              id: data.showId,
              start: data.pollStarted,
              end: data.pollEnded,
              duration: ref.getSnapshot().context.pollDuration,
              next: nav('next'),
            }}
          />
        </div>
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
              onClick={nav('navLeft')}
            />

            <button
              className='absolute w-[13%] h-[14%] left-[16%] top-[53%] select-none size-full'
              onClick={nav('navRight')}
            />

            <button
              className='absolute w-[13%] h-[17%]  left-[2%] top-[36%] select-none size-full'
              onClick={nav('navLeft')}
            />

            <button
              className='absolute w-[13%] h-[17%]  left-[30%] top-[36%] select-none size-full'
              onClick={nav('navRight')}
            />

            <button
              className='absolute top-[22%] left-[75%] w-[21%] h-[25%] rounded-full select-none'
              onClick={nav('next')}
            />

            <button
              className='absolute top-[44%] left-[54%] w-[21%] h-[25%] rounded-full select-none'
              onClick={nav('back')}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

function Game(props: {
  poll: {
    id: number
    duration: number
    start: number | null
    end?: number
    next: () => void
  }
  state: ReturnType<typeof useGameMachine>[0]
}) {
  const selectedStarter = useRef<'one' | 'two' | 'three' | null>(null)
  const { mutate: confirmStarter } = useMutation({
    mutationFn: useConvexMutation(api.appState.selectStarter),
  })

  switch (props.state) {
    case 'phase0.introduction.screen1':
      return <Phase0Intro1 />
    case 'phase0.introduction.screen2':
      return <Phase0Intro2 />
    case 'phase0.introduction.screen3':
      return <Phase0Intro3 />
    case 'phase0.introduction.screen4':
      return <Phase0Intro4 />
    case 'phase0.waitingPhase1':
      return <Phase0Waiting />
    case 'phase0.readyPhase1':
      return <Phase0Ready />
    case 'phase1.introduction.screen1':
      return <Phase1Intro1 />
    case 'phase1.introduction.screen2':
      return <Phase1Intro2 />
    case 'phase1.introduction.screen3':
      return <Phase1Intro3 />
    case 'phase1.starter1.introduction':
      return <Phase1Starter1Intro />
    case 'phase1.starter2.introduction':
      return <Phase1Starter2Intro />
    case 'phase1.starter3.introduction':
      return <Phase1Starter3Intro />
    case 'phase1.starter1.description':
      return <Phase1Starter1Description />
    case 'phase1.starter2.description':
      return <Phase1Starter2Description />
    case 'phase1.starter3.description':
      return <Phase1Starter3Description />
    case 'phase1.starter1.confirmChoice':
      selectedStarter.current = 'one'
      return <Phase1Starter1ConfirmChoice />
    case 'phase1.starter2.confirmChoice':
      selectedStarter.current = 'two'
      return <Phase1Starter2ConfirmChoice />
    case 'phase1.starter3.confirmChoice':
      selectedStarter.current = 'three'
      return <Phase1Starter3ConfirmChoice />
    case 'phase1.poll':
      if (selectedStarter.current) {
        confirmStarter({
          showId: props.poll.id,
          selection: selectedStarter.current,
        })
      }
      return (
        <Phase1Poll
          showId={props.poll.id}
          pollDuration={props.poll.duration}
          pollStarted={props.poll.start}
          pollEnded={props.poll.end}
          next={props.poll.next}
        />
      )
    case 'phase1.pollClosed':
      return <Phase1PollClosed />
    case 'phase1.rivalSelect':
      return <Phase1RivalSelect />
    case 'phase2.playVideo':
      return <Phase2Battle />
    case 'phase2.epilogue.screen1':
      return <Phase2Epilogue1 />
    case 'phase2.epilogue.screen2':
      return <Phase2Epilogue2 />
    case 'phase2.epilogue.screen3':
      return <Phase2Epilogue3 />
    case 'phase2.epilogue.screen4':
      return <Phase2Epilogue4 />
    case 'phase2.epilogue.screen5':
      return <Phase2Epilogue5 />
    case 'phase2.epilogue.screen6':
      return <Phase2Epilogue6 />
    case 'phase2.epilogue.screen7':
      return <Phase2Epilogue7 />
    default:
      return null
  }
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
  if (props.pollEnded || timeLeft <= 0) props.next()

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
