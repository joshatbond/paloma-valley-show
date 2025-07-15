import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from '~/server/convex/_generated/api'
import { ShowLoader } from '~/app/components/show/loader'
import { Button } from '../components/ui/button'
import { Controller } from '../components/ui/controller'
import { Carousel } from '../components/ui/carousel'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))

  return (
    <main className='min-h-screen grid grid-rows-[1fr_auto]'>
      <div className='bg-[#222] text-white px-8 py-4 grid'>
        <div className='relative overflow-clip flex flex-col pt-12 h-full bg-black rounded'>
          <div className='absolute inset-x-0 bottom-0 h-[20vh]'>
            <Carousel />
          </div>

          <div className='flex justify-center'>
            <img src='/images/logo.png' className='w-[80%]' />
          </div>
          {data.showId && <ShowLoader />}

          <Link to='/program'>
            <Button>View the program</Button>
          </Link>
        </div>
      </div>

      <Controller
        onUp={() => {}}
        onDown={() => {}}
        onLeft={() => {}}
        onRight={() => {}}
        onA={() => {}}
        onB={() => {}}
      />
    </main>
  )
}
