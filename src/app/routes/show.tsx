import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MutableRefObject, PropsWithChildren, useEffect, useRef } from 'react'

import { api } from '~/server/convex/_generated/api'

import {
  MidLayer,
  ScreenBackground,
  ScreenContainer,
} from '../components/show/screen'
import { useStore } from '../components/show/store'
import { Controller } from '../components/ui/controller'
import { SendParams, State, useGameMachine } from '../hooks/useGameMachine'
import { useHaptic } from '../hooks/useHaptic'
import { useTimer } from '../hooks/useTimer'
import { useTypewriter } from '../hooks/useTypewriter'

export const Route = createFileRoute('/show')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigation = useNavigate()
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))
  const [state, send, ref] = useGameMachine({
    currentPhase: data.currentPhase,
    pollEndDate: data.pollEnded ?? null,
    pollStartDate: data.pollStarted,
  })
  const { mutate: confirmStarter } = useMutation({
    mutationFn: useConvexMutation(api.appState.selectStarter),
  })
  const haptics = useHaptic()
  const typingState = useStore(s => s.typing)
  const typingStateAssign = useStore(s => s.typingStateAssign)

  if (!data.showId) navigation({ to: '/' })

  const nav =
    (type: Exclude<SendParams, 'pollEnded' | 'updatePhase'>) => () => {
      haptics.once()
      send({ type })
    }

  useEffect(() => {
    typingStateAssign('ready')
  }, [state, typingStateAssign])

  return (
    <main className="grid min-h-screen grid-rows-[1fr_auto]">
      <div className="grid bg-[#222] px-8 py-4 text-white">
        <div className="grid place-content-center rounded bg-black">
          <ScreenContainer>
            <ScreenBackground url={getBgImage(state)} />

            <MidLayer />

            <TextLayer />
          </ScreenContainer>
          {/* <Game
            poll={{
              duration: ref.getSnapshot().context.pollDuration,
              start: data.pollStarted,
              end: data.pollEnded,
              id: data.showId!,
              onNext: nav('next'),
            }}
            state={state}
          /> */}
        </div>
      </div>

      <Controller
        onUp={nav('navRight')}
        onDown={nav('navLeft')}
        onLeft={nav('navLeft')}
        onRight={nav('navRight')}
        onA={() => {
          if (typingState === 'typing') {
            haptics.once()
            typingStateAssign('userOverride')
          }
          if (typingState === 'userOverride') {
            typingStateAssign('ready')
            nav('next')()
          }
        }}
        onB={nav('back')}
      />
    </main>
  )
}

function Game() {}

// function Game(props: {
//   poll: {
//     duration: number
//     end?: number
//     id: number
//     start: number | null
//     onNext: () => void
//   }
//   state: ReturnType<typeof useGameMachine>[0]
//   onStarterSelect: (
//     selection: (typeof api.appState.selectStarter)['_args']['selection']
//   ) => void
// }) {
//   const selectedStarter = useRef<
//     (typeof api.appState.selectStarter)['_args']['selection'] | null
//   >(null)

//   switch (props.state) {
//     case 'phase0.introduction.screen1':
//       return (
//         <Phase0IntroContainer>
//           <Phase0IntroScreen1 />
//         </Phase0IntroContainer>
//       )
//     case 'phase0.introduction.screen2':
//       return (
//         <Phase0IntroContainer>
//           <Phase0IntroScreen2 />
//         </Phase0IntroContainer>
//       )
//     case 'phase0.introduction.screen3':
//       return (
//         <Phase0IntroContainer>
//           <Phase0IntroScreen3 />
//         </Phase0IntroContainer>
//       )
//     case 'phase0.introduction.screen4':
//       return (
//         <Phase0IntroContainer>
//           <Phase0IntroScreen4 />
//         </Phase0IntroContainer>
//       )
//     case 'phase0.waitingPhase1':
//       return <Phase0Waiting />
//     case 'phase0.readyPhase1':
//       return <Phase0Ready />
//     case 'phase1.introduction.screen1':
//       return <Phase1Intro1 />
//     case 'phase1.introduction.screen2':
//       return <Phase1Intro2 />
//     case 'phase1.introduction.screen3':
//       return <Phase1Intro3 />
//     case 'phase1.starter1.introduction':
//       return <Phase1Starter1Intro />
//     case 'phase1.starter2.introduction':
//       return <Phase1Starter2Intro />
//     case 'phase1.starter3.introduction':
//       return <Phase1Starter3Intro />
//     case 'phase1.starter1.description':
//       return <Phase1Starter1Description />
//     case 'phase1.starter2.description':
//       return <Phase1Starter2Description />
//     case 'phase1.starter3.description':
//       return <Phase1Starter3Description />
//     case 'phase1.starter1.confirmChoice':
//       selectedStarter.current = 'one'
//       return <Phase1Starter1ConfirmChoice />
//     case 'phase1.starter2.confirmChoice':
//       selectedStarter.current = 'two'
//       return <Phase1Starter2ConfirmChoice />
//     case 'phase1.starter3.confirmChoice':
//       selectedStarter.current = 'three'
//       return <Phase1Starter3ConfirmChoice />
//     case 'phase1.poll':
//       if (selectedStarter.current) {
//         props.onStarterSelect(selectedStarter.current)
//         selectedStarter.current = null
//       }
//       return (
//         <Phase1Poll
//           selection={
//             selectedStarter.current
//               ? selectedStarter.current === 'one'
//                 ? 'bulbasaur'
//                 : selectedStarter.current === 'two'
//                   ? 'squirtle'
//                   : 'charmander'
//               : ''
//           }
//           {...props.poll}
//         />
//       )
//     case 'phase1.pollClosed':
//       return <Phase1PollClosed />
//     case 'phase1.rivalSelect':
//       return <Phase1RivalSelect />
//     case 'phase2.playVideo':
//       return <Phase2Battle />
//     case 'phase2.epilogue.screen1':
//       return <Phase2Epilogue1 />
//     case 'phase2.epilogue.screen2':
//       return <Phase2Epilogue2 />
//     case 'phase2.epilogue.screen3':
//       return <Phase2Epilogue3 />
//     case 'phase2.epilogue.screen4':
//       return <Phase2Epilogue4 />
//     case 'phase2.epilogue.screen5':
//       return <Phase2Epilogue5 />
//     case 'phase2.epilogue.screen6':
//       return <Phase2Epilogue6 />
//     case 'phase2.epilogue.screen7':
//       return <Phase2Epilogue7 />
//     default:
//       return null
//   }
// }

function getBgImage(state: State) {
  return state?.includes('phase1') ? 'phase_1_bg.png' : 'phase_0_bg.png'
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
  const [line1, { isDone: isLine1Done }] = useTypewriter([p0.screen1.line1])
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [p0.screen1.line2],
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
      <p>{props.isTyping.current ? line1 : p0.screen1.line1}</p>
      <p>
        {!props.isTyping.current ? p0.screen1.line2 : isLine1Done ? line2 : ''}
      </p>
    </div>
  )
}
function Phase0IntroScreen2(props: { isTyping: MutableRefObject<boolean> }) {
  const [line1, { isDone: isLine1Done }] = useTypewriter([p0.screen2.line1])
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [p0.screen2.line2],
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
      <p>{props.isTyping.current ? line1 : p0.screen2.line1}</p>
      <p>
        {!props.isTyping.current ? p0.screen2.line2 : isLine1Done ? line2 : ''}
      </p>
    </div>
  )
}
function Phase0IntroScreen3(props: { isTyping: MutableRefObject<boolean> }) {
  const [line1, { isDone: isLine1Done }] = useTypewriter([p0.screen3.line1])
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [p0.screen3.line2],
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
      <p>{props.isTyping.current ? line1 : p0.screen3.line1}</p>
      <p>
        {!props.isTyping.current ? p0.screen3.line2 : isLine1Done ? line2 : ''}
      </p>
    </div>
  )
}
function Phase0IntroScreen4(props: { isTyping: MutableRefObject<boolean> }) {
  const [line1, { isDone: isLine1Done }] = useTypewriter([p0.screen4.line1])
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [p0.screen4.line2],
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
      <p>{props.isTyping.current ? line1 : p0.screen4.line1}</p>
      <p>
        {!props.isTyping.current ? p0.screen4.line2 : isLine1Done ? line2 : ''}
      </p>
    </div>
  )
}
function Phase0Waiting(props: { isTyping: MutableRefObject<boolean> }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isLooping = useRef(false)
  const [line1, { isDone }] = useTypewriter([p0.waiting.line1])
  const [ellipses, { start }] = useTypewriter(['...'], {
    totalIterations: 0,
    typingSpeed: 1e3,
    autoplay: false,
  })

  useEffect(() => {
    if (isDone) setTimeout(start, 0.4e3)
  }, [isDone, start])

  useEffect(() => {
    if (!videoRef.current) return
    const handleTimeUpdate = () => {
      if (!videoRef.current || isLooping.current) return
      const { currentTime, duration } = videoRef.current

      const threshold = 0.1
      if (duration > 0 && currentTime >= duration - threshold) {
        isLooping.current = true
      }
    }
    videoRef.current.addEventListener('timeupdate', handleTimeUpdate)

    return () =>
      videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate)
  }, [])

  return (
    <div className="relative">
      <img src="/images/phase_0_bg.png" className="opacity-0" />
      <video
        ref={videoRef}
        width="720"
        height="540"
        autoPlay={true}
        controls={false}
        muted={isLooping.current}
        loop={true}
        className="absolute inset-0"
        playsInline={true}
      >
        <source src="/images/waiting.mp4" />
      </video>

      <div className="absolute inset-x-0 top-[calc(100%-0.5rem)]">
        <div className="relative px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{props.isTyping.current ? line1 : p0.waiting.line1}</p>
            <p>{ellipses}</p>
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
function Phase0Ready(props: { isTyping: MutableRefObject<boolean> }) {
  const [line1, { isDone: isLine1Done }] = useTypewriter([p0.ready.line1])
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [p0.ready.line2],
    { autoplay: false }
  )

  useEffect(() => {
    if (isLine1Done) {
      setTimeout(startLine2, 0.4e3)
    }
    if (isLine2Done) props.isTyping.current = false
  }, [isLine1Done, isLine2Done, startLine2])
  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_0_bg.png" className="render-pixelated" />

      <div className="absolute inset-x-0 bottom-0">
        <div className="relative px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{props.isTyping.current ? line1 : p0.ready.line1}</p>
            <p>
              {!props.isTyping.current
                ? p0.ready.line2
                : isLine1Done
                  ? line2
                  : ''}
            </p>
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
const p1 = {
  intro1: {
    line1: 'Every great Trainer needs a partner.',
  },
  intro2: {
    line1: 'So before we begin, I have an',
    line2: 'important question for you:',
  },
  intro3: {
    line1: 'Which Pokémon will you choose?',
  },
  s1: {
    intro: 'Press LEFT or RIGHT to choose your companion',
    desc: {
      line1: 'I see! Bulbasaur is your choice.',
      line2: "It's very easy to raise.",
    },
    confirm: 'So, you want to go with the GRASS POKéMON BULBASAUR?',
  },
  s2: {
    intro: 'Press LEFT or RIGHT to choose your companion',
    desc: {
      line1: 'Hm! SQUIRTLE is your choice.',
      line2: "It's one worth raising.",
    },
    confirm: "So, you've decided on the WATER POKéMON SQUIRTLE?",
  },
  s3: {
    intro: 'Press LEFT or RIGHT to choose your companion',
    desc: {
      line1: 'Ah! CHARMANDER is your choice.',
      line2: 'You should raise it patiently.',
    },
    confirm: "So, you're claiming the FIRE POKéMON CHARMANDER?",
  },
  poll: (s: string) => `You chose ${s}! Let's see if the group agrees`,
}
function Phase1Intro1(props: { isTyping: MutableRefObject<boolean> }) {
  const [line1, { isDone }] = useTypewriter([p1.intro1.line1])
  useEffect(() => {
    if (isDone) props.isTyping.current = false
  }, [isDone])

  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_1_bg.png" className="render-pixelated" />

      <div className="absolute inset-x-0 bottom-0 translate-y-4">
        <div className="relative px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{props.isTyping.current ? line1 : p1.intro1.line1}</p>
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
function Phase1Intro2(props: { isTyping: MutableRefObject<boolean> }) {
  const [line1, { isDone: isLine1Done }] = useTypewriter([p1.intro2.line1])
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [p1.intro2.line2],
    { autoplay: false }
  )

  useEffect(() => {
    if (isLine1Done) {
      setTimeout(startLine2, 0.4e3)
    }
    if (isLine2Done) props.isTyping.current = false
  }, [isLine1Done, isLine2Done, startLine2])
  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_1_bg.png" className="render-pixelated" />

      <div className="t absolute inset-x-0 bottom-0 translate-y-4">
        <div className="relative px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{props.isTyping.current ? line1 : p1.intro2.line1}</p>
            <p>
              {!props.isTyping.current
                ? p1.intro2.line2
                : isLine1Done
                  ? line2
                  : ''}
            </p>
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
function Phase1Intro3(props: { isTyping: MutableRefObject<boolean> }) {
  const [line1, { isDone }] = useTypewriter([p1.intro3.line1])

  useEffect(() => {
    if (isDone) props.isTyping.current = false
  }, [isDone])

  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_1_bg.png" className="render-pixelated" />

      <div className="t absolute inset-x-0 bottom-0 translate-y-4">
        <div className="relative px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{props.isTyping.current ? line1 : p1.intro3.line1}</p>
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
function Phase1Starter1Intro(props: { isTyping: MutableRefObject<boolean> }) {
  const [line1, { isDone }] = useTypewriter([p1.s1.intro])

  useEffect(() => {
    if (isDone) props.isTyping.current = false
  }, [isDone])

  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_1_bg.png" className="render-pixelated" />

      <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] bg-black/30 backdrop-blur-xs">
        <div className="col-start-1 row-start-1 grid items-center justify-end">
          <img src="/images/arrow.png" className="w-8 rotate-90" />
        </div>
        <img
          src="/images/frame_bulbasaur.png"
          className="col-start-2 row-start-1"
        />
        <div className="col-start-3 row-start-1 grid items-center justify-start">
          <img src="/images/arrow.png" className="w-8 -rotate-90" />
        </div>

        <div className="relative col-span-3 col-start-1 row-start-2 px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{props.isTyping.current ? line1 : p1.s1.intro}</p>
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
function Phase1Starter1Description(props: {
  isTyping: MutableRefObject<boolean>
}) {
  const [line1, { isDone: isLine1Done }] = useTypewriter([p1.s1.desc.line1])
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [p1.s1.desc.line2],
    { autoplay: false }
  )

  useEffect(() => {
    if (isLine1Done) {
      setTimeout(startLine2, 0.4e3)
    }
    if (isLine2Done) props.isTyping.current = false
  }, [isLine1Done, isLine2Done, startLine2])

  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_1_bg.png" className="render-pixelated" />

      <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] bg-black/30 backdrop-blur-xs">
        <div className="col-start-1 row-start-1 grid items-center justify-end">
          <img src="/images/arrow.png" className="w-8 rotate-90" />
        </div>
        <img
          src="/images/frame_bulbasaur.png"
          className="col-start-2 row-start-1"
        />
        <div className="col-start-3 row-start-1 grid items-center justify-start">
          <img src="/images/arrow.png" className="w-8 -rotate-90" />
        </div>

        <div className="relative col-span-3 col-start-1 row-start-2 px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{props.isTyping.current ? line1 : p1.s1.desc.line1}</p>
            <p>
              {!props.isTyping.current
                ? p1.s1.desc.line2
                : isLine1Done
                  ? line2
                  : ''}
            </p>
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
function Phase1Starter1ConfirmChoice(props: {
  isTyping: MutableRefObject<boolean>
}) {
  const [line1, { isDone }] = useTypewriter([p1.s1.confirm])
  useEffect(() => {
    if (isDone) props.isTyping.current = false
  }, [isDone])

  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_1_bg.png" className="render-pixelated" />

      <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] bg-black/30 backdrop-blur-xs">
        <div className="col-start-1 row-start-1 grid items-center justify-end">
          <img src="/images/arrow.png" className="w-8 rotate-90" />
        </div>
        <img
          src="/images/frame_bulbasaur.png"
          className="col-start-2 row-start-1"
        />
        <div className="col-start-3 row-start-1 grid items-center justify-start">
          <img src="/images/arrow.png" className="w-8 -rotate-90" />
        </div>

        <div className="relative col-span-3 col-start-1 row-start-2 px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{props.isTyping.current ? line1 : p1.s1.confirm}</p>
            {!props.isTyping || isDone ? (
              <div className="flex justify-between pr-12">
                <span>A: YES</span>
                <span>B: NO</span>
              </div>
            ) : null}
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Phase1Starter2Intro() {
  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_1_bg.png" className="render-pixelated" />

      <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] bg-black/30 backdrop-blur-xs">
        <div className="col-start-1 row-start-1 grid items-center justify-end">
          <img src="/images/arrow.png" className="w-8 rotate-90" />
        </div>
        <img
          src="/images/frame_squirtle.png"
          className="col-start-2 row-start-1"
        />
        <div className="col-start-3 row-start-1 grid items-center justify-start">
          <img src="/images/arrow.png" className="w-8 -rotate-90" />
        </div>

        <div className="relative col-span-3 col-start-1 row-start-2 px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{p1.s2.intro}</p>
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
function Phase1Starter2Description(props: {
  isTyping: MutableRefObject<boolean>
}) {
  const [line1, { isDone: isLine1Done }] = useTypewriter([p1.s2.desc.line1])
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [p1.s2.desc.line2],
    { autoplay: false }
  )

  useEffect(() => {
    if (isLine1Done) {
      setTimeout(startLine2, 0.4e3)
    }
    if (isLine2Done) props.isTyping.current = false
  }, [isLine1Done, isLine2Done, startLine2])

  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_1_bg.png" className="render-pixelated" />

      <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] bg-black/30 backdrop-blur-xs">
        <div className="col-start-1 row-start-1 grid items-center justify-end">
          <img src="/images/arrow.png" className="w-8 rotate-90" />
        </div>
        <img
          src="/images/frame_squirtle.png"
          className="col-start-2 row-start-1"
        />
        <div className="col-start-3 row-start-1 grid items-center justify-start">
          <img src="/images/arrow.png" className="w-8 -rotate-90" />
        </div>

        <div className="relative col-span-3 col-start-1 row-start-2 px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{props.isTyping.current ? line1 : p1.s2.desc.line1}</p>
            <p>
              {!props.isTyping.current
                ? p1.s2.desc.line2
                : isLine1Done
                  ? line2
                  : ''}
            </p>
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
function Phase1Starter2ConfirmChoice(props: {
  isTyping: MutableRefObject<boolean>
}) {
  const [line1, { isDone }] = useTypewriter([p1.s2.confirm])
  useEffect(() => {
    if (isDone) props.isTyping.current = false
  }, [isDone])

  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_1_bg.png" className="render-pixelated" />

      <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] bg-black/30 backdrop-blur-xs">
        <div className="col-start-1 row-start-1 grid items-center justify-end">
          <img src="/images/arrow.png" className="w-8 rotate-90" />
        </div>
        <img
          src="/images/frame_squirtle.png"
          className="col-start-2 row-start-1"
        />
        <div className="col-start-3 row-start-1 grid items-center justify-start">
          <img src="/images/arrow.png" className="w-8 -rotate-90" />
        </div>

        <div className="relative col-span-3 col-start-1 row-start-2 px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{props.isTyping.current ? line1 : p1.s2.confirm}</p>
            {!props.isTyping || isDone ? (
              <div className="flex justify-between pr-12">
                <span>A: YES</span>
                <span>B: NO</span>
              </div>
            ) : null}
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Phase1Starter3Intro() {
  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_1_bg.png" className="render-pixelated" />

      <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] bg-black/30 backdrop-blur-xs">
        <div className="col-start-1 row-start-1 grid items-center justify-end">
          <img src="/images/arrow.png" className="w-8 rotate-90" />
        </div>
        <img
          src="/images/frame_charmander.png"
          className="col-start-2 row-start-1"
        />
        <div className="col-start-3 row-start-1 grid items-center justify-start">
          <img src="/images/arrow.png" className="w-8 -rotate-90" />
        </div>

        <div className="relative col-span-3 col-start-1 row-start-2 px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{p1.s3.intro}</p>
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
function Phase1Starter3Description(props: {
  isTyping: MutableRefObject<boolean>
}) {
  const [line1, { isDone: isLine1Done }] = useTypewriter([p1.s3.desc.line1])
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [p1.s3.desc.line2],
    { autoplay: false }
  )

  useEffect(() => {
    if (isLine1Done) {
      setTimeout(startLine2, 0.4e3)
    }
    if (isLine2Done) props.isTyping.current = false
  }, [isLine1Done, isLine2Done, startLine2])

  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_1_bg.png" className="render-pixelated" />

      <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] bg-black/30 backdrop-blur-xs">
        <div className="col-start-1 row-start-1 grid items-center justify-end">
          <img src="/images/arrow.png" className="w-8 rotate-90" />
        </div>
        <img
          src="/images/frame_charmander.png"
          className="col-start-2 row-start-1"
        />
        <div className="col-start-3 row-start-1 grid items-center justify-start">
          <img src="/images/arrow.png" className="w-8 -rotate-90" />
        </div>

        <div className="relative col-span-3 col-start-1 row-start-2 px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{props.isTyping.current ? line1 : p1.s3.desc.line1}</p>
            <p>
              {!props.isTyping.current
                ? p1.s3.desc.line2
                : isLine1Done
                  ? line2
                  : ''}
            </p>
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
function Phase1Starter3ConfirmChoice(props: {
  isTyping: MutableRefObject<boolean>
}) {
  const [line1, { isDone }] = useTypewriter([p1.s3.confirm])
  useEffect(() => {
    if (isDone) props.isTyping.current = false
  }, [isDone])

  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_1_bg.png" className="render-pixelated" />

      <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] bg-black/30 backdrop-blur-xs">
        <div className="col-start-1 row-start-1 grid items-center justify-end">
          <img src="/images/arrow.png" className="w-8 rotate-90" />
        </div>
        <img
          src="/images/frame_charmander.png"
          className="col-start-2 row-start-1"
        />
        <div className="col-start-3 row-start-1 grid items-center justify-start">
          <img src="/images/arrow.png" className="w-8 -rotate-90" />
        </div>

        <div className="relative col-span-3 col-start-1 row-start-2 px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>{props.isTyping.current ? line1 : p1.s3.confirm}</p>
            {!props.isTyping || isDone ? (
              <div className="flex justify-between pr-12">
                <span>A: YES</span>
                <span>B: NO</span>
              </div>
            ) : null}
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
function Phase1Poll(props: {
  selection: string
  duration: number
  end?: number
  id: number
  start: number | null
  isTyping: MutableRefObject<boolean>
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
  const [line1, { isDone }] = useTypewriter([p1.poll(props.selection)])
  const [ellipses, { start }] = useTypewriter(['...'], {
    totalIterations: 0,
    typingSpeed: 1e3,
    autoplay: false,
  })

  useEffect(() => {
    if (isDone) setTimeout(start, 0.4e3)
  }, [isDone, start])

  if (props.end || timeLeft <= 0) props.onNext()

  const totalItems = data ? data.reduce((a, v) => a + v, 0) : 1

  return (
    <div className="relative h-full w-full">
      <img src="/images/phase_1_bg.png" className="render-pixelated" />

      <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] bg-black/30 backdrop-blur-xs">
        <div className="col-start-2 row-start-1 grid grid-flow-col place-items-center gap-2 px-8">
          <div
            className="relative"
            style={{
              '--mask-height': `${data ? (data[0] / totalItems) * 100 : 0}%`,
            }}
          >
            <img src="/images/frame_bulbasaur.png" />

            <img
              src="/images/frame_bulbasaur_mask.png"
              className="absolute inset-0 mask-linear-[0deg,black_var(--mask-height),transparent_var(--mask-height)]"
            />
          </div>

          <div
            className="relative"
            style={{
              '--mask-height': `${data ? (data[1] / totalItems) * 100 : 0}%`,
            }}
          >
            <img src="/images/frame_squirtle.png" />

            <img
              src="/images/frame_squirtle_mask.png"
              className="absolute inset-0 mask-linear-[0deg,black_var(--mask-height),transparent_var(--mask-height)]"
            />
          </div>

          <div
            className="relative"
            style={{
              '--mask-height': `${data ? (data[2] / totalItems) * 100 : 0}%`,
            }}
          >
            <img src="/images/frame_charmander.png" />
            <img
              src="/images/frame_charmander_mask.png"
              className="absolute inset-0 mask-linear-[0deg,black_var(--mask-height),transparent_var(--mask-height)]"
            />
          </div>
        </div>

        <div className="relative col-span-3 col-start-1 row-start-2 px-[2%] pb-[1%]">
          <img src="/images/exposition.png" className="render-pixelated" />

          <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
            <p>
              {props.isTyping.current ? line1 : p1.poll(props.selection)}
              <span>
                {!props.isTyping.current
                  ? p1.s3.desc.line2
                  : isDone
                    ? ellipses
                    : ''}
              </span>
            </p>
          </div>

          <div className="absolute right-[1.75rem] bottom-[0.75rem]">
            <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
