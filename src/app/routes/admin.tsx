import { createFileRoute } from '@tanstack/react-router'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { api } from '~/server/convex/_generated/api'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))
  const toggleShowState = useConvexMutation(api.appState.setActiveState)
  const nextPhase = useConvexMutation(api.appState.updatePhaseState)

  return (
    <main>
      <button
        className='border'
        onClick={() =>
          toggleShowState({ id: data._id, state: !data.showIsActive })
        }
      >
        Toggle Show State {data.showIsActive ? 'Off' : 'On'}
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
