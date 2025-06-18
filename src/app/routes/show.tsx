import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/show')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
      <div>Game Loop</div>

      <div>
        <button>Up</button>
        <button>Down</button>
        <button>Left</button>
        <button>Right</button>
        <button>A</button>
        <button>B</button>
      </div>
    </main>
  )
}
