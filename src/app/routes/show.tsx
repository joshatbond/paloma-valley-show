import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PropsWithChildren, useEffect, useMemo, useRef } from 'react'

import { api } from '~/server/convex/_generated/api'

import { BattleSimulator } from '../components/battle'
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
import { useStore } from '../components/show/store'
import { WaitingScreen } from '../components/show/waiting'
import { GameBoyFrame } from '../components/ui/gameboy'
import { StartMenu } from '../components/ui/startMenu'
import { useButton } from '../hooks/useButtons'
import { State, useGameMachine } from '../hooks/useGameMachine'
import { useHaptic } from '../hooks/useHaptic'

export const Route = createFileRoute('/show')({
  ssr: false,
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
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

  const typingState = useStore(s => s.typing)
  const typingStateAssign = useStore(s => s.typingStateAssign)
  const prevState = useRef(state)
  const starter = useStore(s => s.starter)
  const starterAssign = useStore(s => s.starterAssign)
  const menuHasFocus = useStore(state => state.menu.show)
  const haptics = useHaptic()
  const battleState = useStore(state => state.battle)

  const inBattle = state?.includes('battle') && battleState !== 'exit'

  useButton('a', {
    cond: () => !menuHasFocus || !inBattle,
    onPress: () => {
      if (typingState === 'typing') {
        typingStateAssign('userOverride')
        return
      }
      if (state?.includes('confirmChoice')) {
        const selection = state.includes('phase1.starter1')
          ? (['one', 'bulbasaur'] as const)
          : state.includes('phase1.starter2')
            ? (['two', 'squirtle'] as const)
            : (['three', 'charmander'] as const)
        confirmStarter({
          showId: data.showId!,
          selection: selection[0],
        })
        starterAssign(selection[1])
      }
      
      send({ type: 'next' })
    },
  })
  useButton('b', {
    cond: () => !menuHasFocus || !inBattle,
    onPress: () => {
      if (state?.includes('confirmChoice')) {
        send({ type: 'back' })
      } else {
        haptics.pulse({ count: 2, gap: 10 })
      }
    },
  })
  useButton('left', {
    cond: () => !menuHasFocus || !inBattle,
    onPress: () => {
      if (state?.includes('starter') && state.includes('introduction')) {
        send({ type: 'navLeft' })
      } else {
        haptics.pulse({ count: 2, gap: 10 })
      }
    },
  })
  useButton('right', {
    cond: () => !menuHasFocus || !inBattle,
    onPress: () => {
      if (state?.includes('starter') && state.includes('introduction')) {
        send({ type: 'navRight' })
      } else {
        haptics.pulse({ count: 2, gap: 10 })
      }
    },
  })
  useButton('up', {
    cond: () => !menuHasFocus || !inBattle,
    onPress: () => haptics.pulse({ count: 2, gap: 10 }),
  })
  useButton('down', {
    cond: () => !menuHasFocus || !inBattle,
    onPress: () => haptics.pulse({ count: 2, gap: 10 }),
  })

  const lines = useMemo(() => getLines(state, starter), [state, starter])

  useEffect(() => {
    if (prevState.current === state) return

    prevState.current = state
    typingStateAssign('ready')
  }, [state, typingStateAssign])
  useEffect(() => {
    if (data.pollChoice) {
      starterAssign(
        data.pollChoice === 'one'
          ? 'bulbasaur'
          : data.pollChoice === 'two'
            ? 'squirtle'
            : 'charmander'
      )
    }
  }, [data])

  if (!data.showId) navigate({ to: '/' })

  return (
    <GameBoyFrame>
      <div
        className={`relative grid ${!inBattle || state?.includes('waiting') ? 'place-content-center' : ''} rounded bg-black`}
      >
        <ScreenContainer>
          <ScreenBackground
            src={`/images/${bgImg}`}
            className={inBattle ? 'opacity-0' : ''}
          />

          <MidLayer>
            <Overlay state={state}>
              <Poll
                duration={ref.getSnapshot().context.pollDuration}
                end={data.pollEnded}
                id={data.showId ?? 0}
                start={data.pollStarted}
                onNext={() => send({ type: 'next' })}
              />
            </Overlay>
          </MidLayer>

          <TextContainer
            isWaiting={state === 'phase0.waitingPhase1'}
            hide={
              (state?.includes('starter') || state?.includes('battle')) ?? false
            }
          >
            <Text
              text={lines}
              hasEllipses={
                state === 'phase0.waitingPhase1' || state === 'phase1.poll'
              }
            />
          </TextContainer>
        </ScreenContainer>

        <div className="absolute inset-0">
          <div className="relative grid h-full w-full">
            <StartMenu send={send} id={data._id} showId={data.showId} />
          </div>
        </div>
      </div>
    </GameBoyFrame>
  )
}

function Overlay(props: PropsWithChildren & { state: State }) {
  switch (props.state) {
    case 'phase0.waitingPhase1':
      return <WaitingScreen />
    case 'phase1.starter1.confirmChoice':
    case 'phase1.starter1.description':
    case 'phase1.starter1.introduction':
      return <Starter type="bulbasaur" state={props.state} />
    case 'phase1.starter2.confirmChoice':
    case 'phase1.starter2.description':
    case 'phase1.starter2.introduction':
      return <Starter type="squirtle" state={props.state} />
    case 'phase1.starter3.confirmChoice':
    case 'phase1.starter3.description':
    case 'phase1.starter3.introduction':
      return <Starter type="charmander" state={props.state} />
    case 'phase1.poll':
      return props.children
    case 'phase2.battle':
      return <BattleSimulator />
    default:
      return null
  }
}
