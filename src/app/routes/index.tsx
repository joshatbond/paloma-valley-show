import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

import { api } from '~/server/convex/_generated/api'

import { Carousel } from '../components/ui/carousel'
import { Controller } from '../components/ui/controller'
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
    <main className="grid min-h-screen grid-rows-[1fr_auto]">
      <div className="grid bg-[#222] px-8 py-4 text-white">
        <div className="relative flex h-full flex-col overflow-clip rounded bg-black pt-8">
          <div className="absolute inset-x-0 top-[20%] bottom-[20%]">
            <img src={bgSrc} className="h-full w-screen object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          </div>
          <div className="absolute inset-x-2 bottom-2 h-[20vh]">
            <Carousel />
          </div>

          <div className="relative flex justify-center">
            <img src="/images/logo.png" className="w-[75%]" />
            <div className="absolute inset-0"></div>
          </div>

          <div className="relative flex-grow">
            <div className="h-full w-fit p-2 pl-4">
              <div className="grid grid-cols-[repeat(2,auto)] grid-rows-[repeat(2,auto)] gap-2">
                <label className="relative col-start-1 row-span-2 row-start-1 inline-block w-4">
                  <input
                    type="checkbox"
                    id="sound-effects"
                    className="peer sr-only"
                    checked={!showSelected}
                    onChange={() => {}}
                  />
                  <span className="ease-accel absolute inset-0 cursor-pointer rounded-full transition-all duration-50 peer-checked:translate-y-3/5">
                    <img src="/images/arrow.png" className="w-4 -rotate-90" />
                  </span>
                </label>

                <p
                  className={`font-poke text-shadow-full col-start-2 row-start-1 w-fit text-xs select-none ${data.showId ? 'text-white' : 'text-neutral-500'}`}
                >
                  Start Show
                </p>
                <p className="font-poke text-shadow-full col-start-2 row-start-2 w-fit text-xs select-none">
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
