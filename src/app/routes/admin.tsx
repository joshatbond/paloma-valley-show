import { createFileRoute } from '@tanstack/react-router'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { api } from '~/server/convex/_generated/api'
import { useSuspenseQuery } from '@tanstack/react-query'
import { adminAuth } from '~/server/auth'
import { PropsWithChildren, useState } from 'react'
import { Button } from '../components/ui/button'
import { pollDuration } from '../components/stateMachine'
import { useTimer } from '../hooks/useTimer'
import { useHaptic } from 'use-haptic'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isAuthed, isAuthedAssign] = useState(false)
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))
  const toggleShowState = useConvexMutation(api.appState.setActiveState)
  const nextPhase = useConvexMutation(api.appState.updatePhaseState)

  return (
    <main className='font-inter bg-gradient-to-br from-gray-800 via-gray-900 to-green-900 flex justify-center items-center min-h-screen p-4 box-border'>
      {isAuthed ? (
        <Card title='Admin Panel'>
          <div className='self-stretch flex items-center justify-between p-3 rounded-lg bg-white/10'>
            <label
              htmlFor='sound-effects'
              className='text-gray-100 text-base font-semibold'
            >
              Show is Active?
            </label>
            <label className='toggle-switch relative inline-block w-[60px] h-[34px]'>
              <input
                type='checkbox'
                id='sound-effects'
                className='opacity-0 w-0 h-0'
                checked={!!data.showId}
                onChange={() =>
                  toggleShowState({
                    id: data._id,
                    state: data.showId ? null : Date.now(),
                  })
                }
              />
              <span className='slider absolute cursor-pointer inset-0 transition-all duration-400 rounded-full'></span>
            </label>
          </div>

          {data.currentPhase >= 0 && (
            <div className='self-stretch flex items-center justify-between p-3 rounded-lg bg-white/10'>
              <span className='text-gray-100 text-base font-semibold'>
                Current Phase:{' '}
                <span id='current-phase'>{data.currentPhase}</span>
              </span>
              <button
                id='next-phase-button'
                className='poke-button px-4 py-2 border-2 border-[#3a131f] cursor-pointer font-bold uppercase rounded-full transition-all duration-200 ease-in-out flex items-center justify-center gap-2 text-lg text-white relative overflow-hidden shadow-md hover:translate-y-[-3px] hover:shadow-lg active:translate-y-0 active:shadow-sm'
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
            <Poll pollStarted={data.pollStarted} />
          ) : null}
        </Card>
      ) : (
        <Card title='Gym Leader Login'>
          <AuthForm setAdminStatus={(f) => isAuthedAssign(f)} />
        </Card>
      )}
    </main>
  )
}

function Card(props: PropsWithChildren<{ title: string }>) {
  return (
    <div className='flex flex-col gap-6 items-center w-full max-w-[450px] p-4 rounded-2xl shadow-xl md:p-6 md:rounded-xl bg-white/20 backdrop-blur-md border border-white/30'>
      <h1 className='text-3xl font-bold text-white mb-4 w-full text-center md:text-[1.75rem]'>
        {props.title}
      </h1>

      {props.children}
    </div>
  )
}

function AuthForm(props: { setAdminStatus: (flag: boolean) => void }) {
  const { triggerHaptic } = useHaptic()
  const [errorState, errorStateAssign] = useState('')
  const [username, usernameAssign] = useState('')
  const [password, passwordAssign] = useState('')

  return (
    <form
      className='w-full flex flex-col gap-6'
      onSubmit={async (event) => {
        event.preventDefault()
        triggerHaptic()
        try {
          const response = await adminAuth({ data: { username, password } })
          props.setAdminStatus(response)
          if (response === false) {
            errorStateAssign('Invalid User')
            triggerHaptic()
            setTimeout(() => {
              triggerHaptic()
            }, 120)
          }
        } catch (e) {
          if (e instanceof Error) errorStateAssign(e.message)
        }
      }}
    >
      <div className='flex flex-col'>
        <label
          htmlFor='username'
          className='text-gray-200 text-sm font-semibold mb-1'
        >
          Username
        </label>
        <input
          className='p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#651d32] focus:border-transparent text-white w-full bg-white/10 placeholder-gray-300'
          type='text'
          required
          id='username'
          name='username'
          placeholder='Enter your username'
          autoComplete='username'
          onChange={(e) => {
            usernameAssign(e.currentTarget.value)
          }}
        />
      </div>

      <div className='flex flex-col'>
        <label
          htmlFor='password'
          className='text-gray-200 text-sm font-semibold mb-1'
        >
          Password
        </label>
        <input
          className='p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#651d32] focus:border-transparent text-white w-full bg-white/10 placeholder-gray-300'
          name='password'
          id='password'
          type='password'
          required
          placeholder='Enter your password'
          autoComplete='current-password'
          onChange={(e) => {
            passwordAssign(e.currentTarget.value)
          }}
        />
      </div>

      {errorState && (
        <div className='text-red-400 text-sm font-medium text-center bg-red-800/20 p-2 rounded-md'>
          {errorState}
        </div>
      )}

      <Button type='submit'>Submit</Button>
    </form>
  )
}

function Poll(props: { pollStarted: number }) {
  const timeLeft = useTimer({
    duration: pollDuration,
    startTime: props.pollStarted,
  })

  return (
    <div className='self-stretch flex gap-3 p-3 rounded-lg bg-white/10 justify-between'>
      <span className='text-gray-100 text-base font-semibold'>Poll Timer</span>
      <span className='text-gray-100 text-base font-semibold'>
        {timeLeft}s left
      </span>
    </div>
  )
}
