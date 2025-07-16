import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { MutableRefObject, PropsWithChildren, useEffect, useRef } from 'react'

import { api } from '~/server/convex/_generated/api'

import { Controller } from '../components/ui/controller'
import { useGameMachine } from '../hooks/useGameMachine'
import { useHaptic } from '../hooks/useHaptic'
import { useTimer } from '../hooks/useTimer'
import { useTypewriter } from '../hooks/useTypewriter'

export const Route = createFileRoute('/show')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigation = useNavigate()
  const [state, send, ref] = useGameMachine()
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))
  const { mutate: confirmStarter } = useMutation({
    mutationFn: useConvexMutation(api.appState.selectStarter),
  })
  const haptics = useHaptic()
  const isTyping = useRef(true)

  if (!data.showId) navigation({ to: '/' })

  const nav =
    (
      type: Exclude<
        Parameters<typeof send>[0]['type'],
        'pollEnded' | 'updatePhase'
      >
    ) =>
    () => {
      haptics.once()
      send({ type })
    }

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

  useEffect(() => {
    document.documentElement.style.backgroundColor = '#222'

    return () => {
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  return (
    <main className="grid min-h-screen grid-rows-[1fr_auto]">
      <div className="grid bg-[#222] px-8 py-4 text-white">
        <div className="grid place-content-center rounded bg-black">
          <Game
            poll={{
              duration: ref.getSnapshot().context.pollDuration,
              start: data.pollStarted,
              end: data.pollEnded,
              id: data.showId!,
              onNext: nav('next'),
            }}
            state={state}
            isTyping={isTyping}
            onStarterSelect={(
              selection: (typeof api.appState.selectStarter)['_args']['selection']
            ) => confirmStarter({ showId: data.showId!, selection })}
          />
        </div>
      </div>

      <Controller
        onUp={nav('navRight')}
        onDown={nav('navLeft')}
        onLeft={nav('navLeft')}
        onRight={nav('navRight')}
        onA={() => {
          console.log(`pressing A.`)
          if (isTyping.current) {
            console.log('currently typing. Overriding')
            isTyping.current = false
          } else {
            console.log('not typing anymore, moving to next screen')
            isTyping.current = true
            nav('next')()
          }
        }}
        onB={nav('back')}
      />
    </main>
  )
}

function Game(props: {
  isTyping: MutableRefObject<boolean>
  poll: {
    duration: number
    end?: number
    id: number
    start: number | null
    onNext: () => void
  }
  state: ReturnType<typeof useGameMachine>[0]
  onStarterSelect: (
    selection: (typeof api.appState.selectStarter)['_args']['selection']
  ) => void
}) {
  const selectedStarter = useRef<
    (typeof api.appState.selectStarter)['_args']['selection'] | null
  >(null)

  switch (props.state) {
    case 'phase0.introduction.screen1':
      props.isTyping.current = true
      return (
        <Phase0IntroContainer>
          <Phase0IntroScreen1 isTyping={props.isTyping} />
        </Phase0IntroContainer>
      )
    case 'phase0.introduction.screen2':
      console.log('screen2')
      props.isTyping.current = true
      return (
        <Phase0IntroContainer>
          <Phase0IntroScreen2 isTyping={props.isTyping} />
        </Phase0IntroContainer>
      )
    case 'phase0.introduction.screen3':
      props.isTyping.current = true
      return (
        <Phase0IntroContainer>
          <Phase0IntroScreen3 isTyping={props.isTyping} />
        </Phase0IntroContainer>
      )
    case 'phase0.introduction.screen4':
      props.isTyping.current = true
      return (
        <Phase0IntroContainer>
          <Phase0IntroScreen4 isTyping={props.isTyping} />
        </Phase0IntroContainer>
      )
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
        props.onStarterSelect(selectedStarter.current)
        selectedStarter.current = null
      }
      return <Phase1Poll {...props.poll} />
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

const phase0Intro = {
  screen1: {
    line1: 'Hello there!',
    line2: 'Welcome to the world of Pokémon!',
  },
  screen2: {
    line1: 'My name is Oak-',
    line2: 'people call me the Pokémon Professor',
  },
  screen3: {
    line1: "Today, you're not just here",
    line2: 'to watch a show...',
  },
  screen4: {
    line1: "You're here to begin your",
    line2: 'very own journey!',
  },
}
function Phase0IntroContainer(props: PropsWithChildren) {
  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_0_bg.png" className="render-pixelated" />

      <div className="absolute inset-x-0 bottom-0">
        <div className="relative px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="absolute inset-0 py-[0.6rem] pr-5 pl-6 text-black">
            {props.children}
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
function Phase0IntroScreen1(props: { isTyping: MutableRefObject<boolean> }) {
  const [line1, { isDone: isLine1Done }] = useTypewriter([
    phase0Intro.screen1.line1,
  ])
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [phase0Intro.screen1.line2],
    { autoplay: false }
  )

  useEffect(() => {
    if (isLine1Done) {
      setTimeout(startLine2, 0.4e3)
    }
    if (isLine2Done) props.isTyping.current = false
  }, [isLine1Done, isLine2Done, startLine2])

  return (
    <div className="font-poke text-[2.3vw]">
      <p>{props.isTyping.current ? line1 : phase0Intro.screen1.line1}</p>
      <p>
        {!props.isTyping.current
          ? phase0Intro.screen1.line2
          : isLine1Done
            ? line2
            : ''}
      </p>
    </div>
  )
}
function Phase0IntroScreen2(props: { isTyping: MutableRefObject<boolean> }) {
  const [line1, { isDone: isLine1Done }] = useTypewriter([
    phase0Intro.screen2.line1,
  ])
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [phase0Intro.screen2.line2],
    { autoplay: false }
  )

  useEffect(() => {
    if (isLine1Done) {
      setTimeout(startLine2, 0.4e3)
    }
    if (isLine2Done) props.isTyping.current = false
  }, [isLine1Done, isLine2Done, startLine2])

  return (
    <div className="font-poke text-[2.3vw]">
      <p>{props.isTyping.current ? line1 : phase0Intro.screen2.line1}</p>
      <p>
        {!props.isTyping.current
          ? phase0Intro.screen2.line2
          : isLine1Done
            ? line2
            : ''}
      </p>
    </div>
  )
}
function Phase0IntroScreen3(props: { isTyping: MutableRefObject<boolean> }) {
  const [line1, { isDone: isLine1Done }] = useTypewriter([
    phase0Intro.screen3.line1,
  ])
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [phase0Intro.screen3.line2],
    { autoplay: false }
  )

  useEffect(() => {
    if (isLine1Done) {
      setTimeout(startLine2, 0.4e3)
    }
    if (isLine2Done) props.isTyping.current = false
  }, [isLine1Done, isLine2Done, startLine2])

  return (
    <div className="font-poke text-[2.3vw]">
      <p>{props.isTyping.current ? line1 : phase0Intro.screen3.line1}</p>
      <p>
        {!props.isTyping.current
          ? phase0Intro.screen3.line2
          : isLine1Done
            ? line2
            : ''}
      </p>
    </div>
  )
}
function Phase0IntroScreen4(props: { isTyping: MutableRefObject<boolean> }) {
  const [line1, { isDone: isLine1Done }] = useTypewriter([
    phase0Intro.screen4.line1,
  ])
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [phase0Intro.screen4.line2],
    { autoplay: false }
  )

  useEffect(() => {
    if (isLine1Done) {
      setTimeout(startLine2, 0.4e3)
    }
    if (isLine2Done) props.isTyping.current = false
  }, [isLine1Done, isLine2Done, startLine2])

  return (
    <div className="font-poke text-[2.3vw]">
      <p>{props.isTyping.current ? line1 : phase0Intro.screen4.line1}</p>
      <p>
        {!props.isTyping.current
          ? phase0Intro.screen4.line2
          : isLine1Done
            ? line2
            : ''}
      </p>
    </div>
  )
}
function Phase0Waiting() {
  return <p>phase 0: Waiting for phase 1</p>
}
function Phase0Ready() {
  return <p>phase 0: Ready for phase 1</p>
}
function Phase1Intro1() {
  return <p>Every great Trainer needs a partner. </p>
}
function Phase1Intro2() {
  return (
    <div>
      <p>So before we begin, I have an</p>
      <p>important question for you: </p>
    </div>
  )
}
function Phase1Intro3() {
  return <p>Which Pokémon will you choose?</p>
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
  if (props.end || timeLeft <= 0) props.onNext()

  const totalItems = data ? data.reduce((a, v) => a + v, 0) : 1

  return (
    <div>
      <p>Time left: {timeLeft}s</p>
      {data ? (
        <div>
          <p>Poll Results</p>
          <div className="flex justify-between gap-4">
            {data.map((v, i) => (
              <div
                key={i}
                className="gradient-poll grid size-10 place-content-center border"
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
      <Link to="/program">View our program</Link>
    </div>
  )
}
