import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { api } from '~/server/convex/_generated/api'
import { ShowLoader } from '~/app/components/show/loader'
import { Button } from '../components/ui/button'
import { Controller } from '../components/ui/controller'
import { Carousel } from '../components/ui/carousel'
import { useEffect, useState } from 'react'
import { useHaptic } from '../hooks/useHaptic'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))
  const navigation = useNavigate()
  const haptics = useHaptic()
  const [showSelected, showSelectedAssign] = useState(false)

  useEffect(() => {
    showSelectedAssign(!!data.showId)
  }, [data])

  return (
    <main className='min-h-screen grid grid-rows-[1fr_auto]'>
      <div className='bg-[#222] text-white px-8 py-4 grid'>
        <div className='relative overflow-clip flex flex-col pt-8 h-full bg-black rounded'>
          <div className='absolute inset-x-2 bottom-2 h-[20vh]'>
            <Carousel />
          </div>

          <div className='flex justify-center'>
            <img src='/images/logo.png' className='w-[75%]' />
          </div>

          <div className='relative flex-grow'>
            <div className='bg-black p-2 pl-4 w-fit h-full'>
              <div className='grid gap-2 grid-cols-[repeat(2,auto)] grid-rows-[repeat(2,auto)]'>
                <label className='relative col-start-1 row-start-1 row-span-2 inline-block w-4'>
                  <input
                    type='checkbox'
                    id='sound-effects'
                    className='sr-only peer'
                    checked={!showSelected}
                    onChange={() => {}}
                  />
                  <span className='absolute peer-checked:translate-y-3/5 cursor-pointer inset-0 transition-all duration-50 ease-accel rounded-full'>
                    <img src='/images/arrow.png' className='-rotate-90 w-4' />
                  </span>
                </label>

                <p
                  className={`font-poke text-xs w-fit col-start-2 row-start-1 ${data.showId ? 'text-white' : 'text-neutral-500'}`}
                >
                  Start Show
                </p>
                <p className='font-poke text-xs w-fit col-start-2 row-start-2'>
                  See Program
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Controller
        onUp={() => {
          if (showSelected || !data.showId) {
            haptics.pulse({ count: 2, gap: 10 })
            return
          }
          haptics.once()
          showSelectedAssign(true)
        }}
        onDown={() => {
          if (!showSelected) {
            haptics.pulse({ count: 2, gap: 10 })
            return
          }
          haptics.once()
          showSelectedAssign(false)
        }}
        onLeft={() => {}}
        onRight={() => {}}
        onA={() => {
          navigation({ to: showSelected ? '/show' : '/program' })
        }}
        onB={() => {}}
      />
    </main>
  )
}
