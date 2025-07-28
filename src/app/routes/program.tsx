import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { api } from '~/server/convex/_generated/api'

import { ScreenContainer } from '../components/show/screen'
import { GameBoyFrame } from '../components/ui/gameboy'
import { StartMenu } from '../components/ui/startMenu'

export const Route = createFileRoute('/program')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))

  return (
    <GameBoyFrame>
      <div className="relative grid">
        <div className="grid place-content-center rounded bg-black">
          <ScreenContainer>
            <div>Program will go here</div>
          </ScreenContainer>
        </div>
        <div className="absolute inset-0">
          <div className="relative grid h-full">
            <StartMenu id={data._id} showId={data.showId} />
          </div>
        </div>
      </div>
    </GameBoyFrame>
  )
}
