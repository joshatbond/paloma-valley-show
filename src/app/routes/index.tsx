import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { PropsWithChildren, useEffect, useState } from 'react'

import { api } from '~/server/convex/_generated/api'

import { useStore } from '../components/show/store'
import { Carousel } from '../components/ui/carousel'
import { GameBoyFrame } from '../components/ui/gameboy'
import { Menu, MenuIndicator, MenuItem, MenuList } from '../components/ui/menu'
import { StartMenu } from '../components/ui/startMenu'
import { useButton } from '../hooks/useButtons'

const getBgURL = createServerFn({ method: 'GET' }).handler(() => {
  const backgroundUrls = ['/images/bg-1.png', '/images/bg-2.png']
  return Math.random() > 0.5 ? backgroundUrls[0] : backgroundUrls[1]
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getBgURL(),
})

function Home() {
  const bgURL = Route.useLoaderData()
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))

  return (
    <GameBoyFrame>
      <ScreenContainer>
        <LayerBg url={bgURL} />
        <LayerCarousel />
        <LayerTop />

        <StartMenu id={data._id} showId={data.showId} />
      </ScreenContainer>
    </GameBoyFrame>
  )
}

function ScreenContainer(props: PropsWithChildren) {
  return (
    <div className="relative flex h-full flex-col overflow-clip rounded bg-black pt-8">
      {props.children}
    </div>
  )
}
function LayerBg(props: { url: string }) {
  return (
    <div className="absolute inset-x-0 top-[20%] bottom-[20%]">
      <img src={props.url} className="h-full w-screen object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  )
}
function LayerCarousel() {
  return (
    <div className="absolute inset-x-2 bottom-2 h-[20vh]">
      <Carousel />
    </div>
  )
}

function LayerTop() {
  return (
    <div className="relative flex-grow">
      <Logo />
      <NavMenu />
    </div>
  )
}
function Logo() {
  return (
    <div className="relative flex justify-center">
      <img src="/images/logo.png" className="w-[75%]" />
      <div className="absolute inset-0"></div>
    </div>
  )
}
function NavMenu() {
  const navigate = useNavigate()
  const { data } = useSuspenseQuery(convexQuery(api.appState.get, {}))
  const startMenuFocus = useStore(state => state.menu.show)
  const [selected, selectedAssign] = useState(0)
  const [items, itemsAssign] = useState([
    { label: 'View Program', disabled: false },
    { label: 'Start Show', disabled: true },
  ])

  useEffect(() => {
    if (!data) return
    itemsAssign(p => [p[0], { ...p[1], disabled: !!!data.showId }])
  }, [data, itemsAssign])

  useButton('a', {
    cond: () => !startMenuFocus,
    onPress: () => navigate({ to: selected === 0 ? '/program' : '/show' }),
  })

  return (
    <Menu
      items={items}
      hasFocus={!startMenuFocus}
      onNavigation={selectedAssign}
    >
      <div className="relative h-full w-fit p-2 pl-4">
        <MenuList className="relative m-0 list-none p-0">
          <MenuIndicator className="ease-accel absolute left-2 transition-all duration-100">
            <img src="/images/arrow.png" className="w-4 -rotate-90" />
          </MenuIndicator>

          {items.map((item, index) => (
            <MenuItem
              key={item.label}
              index={index}
              className={`font-poke cursor-pointer px-8 py-2 text-xs select-none ${item.disabled ? 'cursor-not-allowed text-neutral-400' : 'text-white'}`}
            >
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </div>
    </Menu>
  )
}
