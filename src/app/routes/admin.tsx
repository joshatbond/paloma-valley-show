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

  return (
    <main>
      <button
        onClick={() =>
          toggleShowState({ id: data._id, state: !data.showIsActive })
        }
      >
        Toggle Show State {data.showIsActive ? 'Off' : 'On'}
      </button>
    </main>
  )
}
