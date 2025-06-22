import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from '~/server/convex/_generated/api'
import { ShowLoader } from '~/app/components/show/loader'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))

  return (
    <main>
      <p>Paloma Valley High School Marching Band</p>
      <p>presents</p>
      <h2>PokéBand</h2>
      {data.showId && <ShowLoader />}
      <Link to='/program'>View the program</Link>
    </main>
  )
}
