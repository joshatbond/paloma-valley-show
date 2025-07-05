import { createFileRoute } from '@tanstack/react-router'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { api } from '~/server/convex/_generated/api'
import { useSuspenseQuery } from '@tanstack/react-query'
import { adminAuth } from '~/server/auth'
import { useState } from 'react'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isAuthed, isAuthedAssign] = useState(false)
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))
  const toggleShowState = useConvexMutation(api.appState.setActiveState)
  const nextPhase = useConvexMutation(api.appState.updatePhaseState)

  if (!isAuthed) return <NeedAuth setAdminStatus={(f) => isAuthedAssign(f)} />

  return (
    <main>
      <button
        className='border'
        onClick={() =>
          toggleShowState({
            id: data._id,
            state: data.showId ? null : Date.now(),
          })
        }
      >
        Toggle Show State {data.showId ? 'Off' : 'On'}
      </button>
      <button
        className='border'
        onClick={() =>
          nextPhase({
            id: data._id,
            state: data.currentPhase === 2 ? 0 : data.currentPhase + 1,
          })
        }
      >
        Go to phase {data.currentPhase === 2 ? 0 : data.currentPhase + 1}
      </button>
    </main>
  )
}

function NeedAuth(props: { setAdminStatus: (flag: boolean) => void }) {
  const [errorState, errorStateAssign] = useState('')
  const [username, usernameAssign] = useState('')
  const [password, passwordAssign] = useState('')

  return (
    <main className='font-inter bg-gradient-to-br from-gray-800 via-gray-900 to-green-900 flex justify-center items-center min-h-screen p-4 box-border'>
      <div className='flex flex-col gap-6 items-center w-full max-w-[450px] p-8 rounded-2xl shadow-xl md:p-6 md:rounded-xl bg-white/20 backdrop-blur-[10px] border border-white/30'>
        <h1 className='text-3xl font-bold text-white mb-4 w-full text-center md:text-[1.75rem]'>
          Gym Leader Login
        </h1>

        <form
          className='w-full flex flex-col gap-6'
          onSubmit={async (event) => {
            event.preventDefault()
            try {
              const response = await adminAuth({ data: { username, password } })
              props.setAdminStatus(response)
              if (response === false) {
                errorStateAssign('Invalid User')
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
      </div>
    </main>
  )
}
