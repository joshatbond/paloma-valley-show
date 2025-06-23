import { createFileRoute } from '@tanstack/react-router'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { api } from '~/server/convex/_generated/api'
import { useSuspenseQuery } from '@tanstack/react-query'
import { adminAuth } from '~/server/auth'
import { useState } from 'react'

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
    <form
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
      className='grid min-h-screen place-content-center gap-4'
    >
      <div className='flex gap-4'>
        <label htmlFor='username'>Username:</label>
        <input
          className='border-b min-w-32 bg-neutral-400 hover:bg-neutral-200 active:bg-neutral-50 focus-within:bg-neutral-50'
          name='username'
          type='text'
          required
          onChange={(e) => {
            usernameAssign(e.currentTarget.value)
          }}
        />
      </div>
      <div className='flex gap-4'>
        <label htmlFor='password'>Password:</label>
        <input
          className='border-b min-w-32 bg-neutral-400 hover:bg-neutral-200 active:bg-neutral-50 focus-within:bg-neutral-50'
          name='password'
          type='password'
          required
          onChange={(e) => {
            passwordAssign(e.currentTarget.value)
          }}
        />
      </div>
      <button
        className='bg-neutral-300 rounded px-3 py-1 hover:bg-neutral-200 active:bg-neutral-200 focus-within:bg-neutral-200'
        type='submit'
      >
        Submit
      </button>
      {errorState && <div className='text-red-500'>{errorState}</div>}
    </form>
  )
}
