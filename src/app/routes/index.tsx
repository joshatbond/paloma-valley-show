import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from '~/server/convex/_generated/api'
import { ShowLoader } from '~/app/components/show/loader'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))

  return (
    <main className='grid place-content-center min-h-screen gap-4'>
      <div>
        <p className='text-center'>Paloma Valley High School</p>
        <p className='text-center'>Marching Band presents</p>
      </div>

      <h2 className='my-12 text-xl text-center'>PokéBand</h2>

      {data.showId && <ShowLoader />}

      <Link to='/program'>
        <Button>View the program</Button>
      </Link>
    </main>
  )
}
