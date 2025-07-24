import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PropsWithChildren, useEffect, useMemo, useRef } from 'react'

import { api } from '~/server/convex/_generated/api'

import { getLines } from '../components/show/lines'
import { Poll } from '../components/show/poll'
import {
  MidLayer,
  ScreenBackground,
  ScreenContainer,
  Text,
  TextContainer,
} from '../components/show/screen'
import { Starter } from '../components/show/starter'
import { getState, useStore } from '../components/show/store'
import { WaitingScreen } from '../components/show/waiting'
import { Controller } from '../components/ui/controller'
import { SendParams, State, useGameMachine } from '../hooks/useGameMachine'

export const Route = createFileRoute('/show')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigation = useNavigate()
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))
  const { mutate: confirmStarter } = useMutation({
    mutationFn: useConvexMutation(api.appState.selectStarter),
  })

  const [state, send, ref] = useGameMachine({
    currentPhase: data.currentPhase,
    pollEndDate: data.pollEnded ?? null,
    pollStartDate: data.pollStarted,
  })
  const bgImg = state?.includes('phase1') ? 'phase_1_bg.png' : 'phase_0_bg.png'

  const typingStateAssign = useStore(s => s.typingStateAssign)
  const prevState = useRef(state)
  const starter = useStore(s => s.starter)
  const starterAssign = useStore(s => s.starterAssign)

  const nav =
    (type: Exclude<SendParams, 'pollEnded' | 'updatePhase'>) => () => {
      if (state?.includes('confirmChoice') && type === 'next') {
        confirmStarter({
          showId: data.showId!,
          selection:
            state === 'phase1.starter1'
              ? 'one'
              : state === 'phase1.starter2'
                ? 'two'
                : 'three',
        })
        starterAssign(
          state === 'phase1.starter1'
            ? 'bulbasaur'
            : state === 'phase1.starter2'
              ? 'squirtle'
              : 'charmander'
        )
      }
      send({ type })
    }
  const lines = useMemo(() => getLines(state, starter), [state, starter])

  useEffect(() => {
    if (prevState.current === state) return

    prevState.current = state
    typingStateAssign('ready')
  }, [state, typingStateAssign])

  if (!data.showId) navigation({ to: '/' })

  return (
    <main className="grid min-h-screen grid-rows-[1fr_auto]">
      <div className="grid bg-[#222] px-8 py-4 text-white">
        <div className="grid place-content-center rounded bg-black">
          <ScreenContainer>
            <ScreenBackground url={`/images/${bgImg}`} />

            <MidLayer>
              <Overlay state={state}>
                <Poll
                  duration={ref.getSnapshot().context.pollDuration}
                  end={data.pollEnded}
                  id={data.showId ?? 0}
                  start={data.pollStarted}
                  onNext={nav('next')}
                />
              </Overlay>
            </MidLayer>

            <TextContainer>
              <Text
                text={lines}
                hasEllipses={
                  state === 'phase0.waitingPhase1' || state === 'phase1.poll'
                }
              />
            </TextContainer>
          </ScreenContainer>
        </div>
      </div>

      <GameController nav={nav} />
    </main>
  )
}

function GameController(props: {
  nav: (s: Exclude<SendParams, 'pollEnded' | 'updatePhase'>) => () => void
}) {
  const typingStateAssign = useStore(s => s.typingStateAssign)

  const onNext = () => {
    const typingState = getState().typing

    if (typingState === 'typing') {
      typingStateAssign('userOverride')
    } else {
      props.nav('next')()
    }
  }

  return (
    <Controller
      onUp={props.nav('navRight')}
      onDown={props.nav('navLeft')}
      onLeft={props.nav('navLeft')}
      onRight={props.nav('navRight')}
      onA={onNext}
      onB={props.nav('back')}
    />
  )
}

function Overlay(props: PropsWithChildren & { state: State }) {
  switch (props.state) {
    case 'phase0.waitingPhase1':
      return <WaitingScreen />
    case 'phase1.starter1':
      return <Starter type="bulbasaur" />
    case 'phase1.starter2':
      return <Starter type="squirtle" />
    case 'phase1.starter3':
      return <Starter type="charmander" />
    case 'phase1.poll':
      return props.children
    default:
      return null
  }
}
