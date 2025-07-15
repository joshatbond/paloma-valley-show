import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { api } from '~/server/convex/_generated/api'
import { Controller } from '../components/ui/controller'
import { Carousel } from '../components/ui/carousel'
import { useEffect, useMemo, useState } from 'react'
import { useHaptic } from '../hooks/useHaptic'
const backgroundUrls = ['/images/bg-1.png', '/images/bg-2.png']

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))
  const navigation = useNavigate()
  const haptics = useHaptic()
  const [showSelected, showSelectedAssign] = useState(false)
  const bgSrc = useMemo(() => {
    return Math.random() > 0.5 ? backgroundUrls[0] : backgroundUrls[1]
  }, [])

  useEffect(() => {
    showSelectedAssign(!!data.showId)
  }, [data])

  return (
    <main className='min-h-screen grid grid-rows-[1fr_auto]'>
      <div className='bg-[#222] text-white px-8 py-4 grid'>
        <div className='relative overflow-clip flex flex-col pt-8 h-full bg-black rounded'>
          <div className='absolute inset-x-0 top-[20%] bottom-[20%]'>
            <img src={bgSrc} className='h-full object-cover w-screen' />
            <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent'></div>
          </div>
          <div className='absolute inset-x-2 bottom-2 h-[20vh]'>
            <Carousel />
          </div>

          <div className='relative flex justify-center'>
            <img src='/images/logo.png' className='w-[75%]' />
          </div>

          <div className='relative flex-grow'>
            <div className='p-2 pl-4 w-fit h-full'>
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
