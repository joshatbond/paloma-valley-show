import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { PropsWithChildren, useState } from 'react'

import { useHaptic } from '~/app/hooks/useHaptic'
import { adminAuth } from '~/server/auth'
import { api } from '~/server/convex/_generated/api'

import { pollDuration } from '../components/stateMachine'
import { Button } from '../components/ui/button'
import { useTimer } from '../hooks/useTimer'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isAuthed, isAuthedAssign] = useState(false)
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))
  const toggleShowState = useConvexMutation(api.appState.setActiveState)
  const nextPhase = useConvexMutation(api.appState.updatePhaseState)

  return (
    <main className="font-inter box-border flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-green-900 p-4">
      {isAuthed ? (
        <Card title="Admin Panel">
          <div className="flex items-center justify-between self-stretch rounded-lg bg-white/10 p-3">
            <label
              htmlFor="sound-effects"
              className="text-base font-semibold text-gray-100"
            >
              Show is Active?
            </label>
            <label className="toggle-switch relative inline-block h-[34px] w-[60px]">
              <input
                type="checkbox"
                id="sound-effects"
                className="peer sr-only"
                checked={!!data.showId}
                onChange={() =>
                  toggleShowState({
                    id: data._id,
                    state: data.showId ? null : Date.now(),
                  })
                }
              />
              <span className="bg-maroon-700 peer-focus:shadow-green-toggle peer-checked:bg-green-toggle absolute inset-0 cursor-pointer rounded-full duration-400 peer-focus:shadow-2xs before:absolute before:bottom-[4px] before:left-[4px] before:h-[26px] before:w-[26px] before:rounded-full before:bg-white before:transition-all peer-checked:before:translate-x-[26px]"></span>
            </label>
          </div>

          {data.currentPhase >= 0 && (
            <div className="flex items-center justify-between self-stretch rounded-lg bg-white/10 p-3">
              <span className="text-base font-semibold text-gray-100">
                Current Phase:{' '}
                <span id="current-phase">{data.currentPhase}</span>
              </span>
              <button
                id="next-phase-button"
                className="border-maroon-800 active:shadow-poke-btn-depress hover:shadow-poke-btn-elevate relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border-2 bg-(image:--gradient-poke-btn) px-4 py-2 text-lg font-bold text-white uppercase transition-all duration-200 ease-in-out before:absolute before:top-0 before:-left-full before:h-full before:w-full before:-skew-x-[20deg] before:bg-white/20 before:transition-all before:duration-300 before:ease-in-out hover:-translate-y-[3px] hover:before:left-full active:translate-y-0"
                onClick={() =>
                  nextPhase({
                    id: data._id,
                    state: data.currentPhase === 2 ? 0 : data.currentPhase + 1,
                  })
                }
              >
                +
              </button>
            </div>
          )}

          {data.currentPhase === 1 && data.pollStarted ? (
            <Poll pollStarted={data.pollStarted} pollEnded={data.pollEnded} />
          ) : null}
        </Card>
      ) : (
        <Card title="Gym Leader Login">
          <AuthForm setAdminStatus={f => isAuthedAssign(f)} />
        </Card>
      )}
    </main>
  )
}

function Card(props: PropsWithChildren<{ title: string }>) {
  return (
    <div className="flex w-full max-w-[450px] flex-col items-center gap-6 rounded-2xl border border-white/30 bg-white/20 p-4 shadow-xl backdrop-blur-md md:rounded-xl md:p-6">
      <h1 className="mb-4 w-full text-center text-3xl font-bold text-white md:text-[1.75rem]">
        {props.title}
      </h1>

      {props.children}
    </div>
  )
}

function AuthForm(props: { setAdminStatus: (flag: boolean) => void }) {
  const haptics = useHaptic()
  const [errorState, errorStateAssign] = useState('')
  const [username, usernameAssign] = useState('')
  const [password, passwordAssign] = useState('')

  return (
    <form
      className="flex w-full flex-col gap-6"
      onSubmit={async event => {
        event.preventDefault()
        haptics.once()
        try {
          const response = await adminAuth({ data: { username, password } })
          props.setAdminStatus(response)
          if (response === false) {
            errorStateAssign('Invalid User')
            haptics.pulse({ count: 3, gap: 50 })
          }
        } catch (e) {
          if (e instanceof Error) errorStateAssign(e.message)
        }
      }}
    >
      <div className="flex flex-col">
        <label
          htmlFor="username"
          className="mb-1 text-sm font-semibold text-gray-200"
        >
          Username
        </label>
        <input
          className="w-full rounded-md border border-gray-400 bg-white/10 p-3 text-white placeholder-gray-300 focus:border-transparent focus:ring-2 focus:ring-[#651d32] focus:outline-none"
          type="text"
          required
          id="username"
          name="username"
          placeholder="Enter your username"
          autoComplete="username"
          onChange={e => {
            usernameAssign(e.currentTarget.value)
          }}
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="password"
          className="mb-1 text-sm font-semibold text-gray-200"
        >
          Password
        </label>
        <input
          className="w-full rounded-md border border-gray-400 bg-white/10 p-3 text-white placeholder-gray-300 focus:border-transparent focus:ring-2 focus:ring-[#651d32] focus:outline-none"
          name="password"
          id="password"
          type="password"
          required
          placeholder="Enter your password"
          autoComplete="current-password"
          onChange={e => {
            passwordAssign(e.currentTarget.value)
          }}
        />
      </div>

      {errorState && (
        <div className="rounded-md bg-red-800/20 p-2 text-center text-sm font-medium text-red-400">
          {errorState}
        </div>
      )}

      <Button type="submit">Submit</Button>
    </form>
  )
}

function Poll(props: { pollStarted: number; pollEnded?: number }) {
  const timeLeft = useTimer({
    duration: pollDuration,
    startTime: props.pollStarted,
    endTime: props.pollEnded,
  })

  return (
    <div className="flex justify-between gap-3 self-stretch rounded-lg bg-white/10 p-3">
      {props.pollEnded || timeLeft <= 0 ? (
        <span className="text-base font-semibold text-gray-100">
          Poll Ended!
        </span>
      ) : (
        <>
          <span className="text-base font-semibold text-gray-100">
            Poll Timer
          </span>
          <span className="text-base font-semibold text-gray-100">
            {timeLeft}s left
          </span>
        </>
      )}
    </div>
  )
}
