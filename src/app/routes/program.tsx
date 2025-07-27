import { createFileRoute } from '@tanstack/react-router'

import { ScreenContainer } from '../components/show/screen'
import { GameBoyFrame } from '../components/ui/gameboy'
import { StartMenu } from '../components/ui/startMenu'

export const Route = createFileRoute('/program')({
  component: RouteComponent,
})

function RouteComponent() {
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
            <StartMenu />
          </div>
        </div>
      </div>
    </GameBoyFrame>
  )
}
