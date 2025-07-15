import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/program')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
      <Link to="/">&lt; Home</Link>
      <p>Program Goes Here</p>
    </main>
  )
}
