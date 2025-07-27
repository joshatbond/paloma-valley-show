import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'

import { useButton } from '~/app/hooks/useButtons'
import { useStore } from '~/components/show/store'

import { Menu, MenuIndicator, MenuItem, MenuList } from './menu'

export function StartMenu() {
  const location = useRouterState({ select: s => s.location })
  const navigate = useNavigate()
  const menuHasFocus = useStore(state => state.menu.show)
  const toggleMenu = useStore(state => state.showMenu)

  const menu = {
    root: {
      label: 'Main Menu',
      items: [
        import.meta.env.DEV && {
          label: 'QA Mode',
          desc: 'Show QA Mode Menu',
          action: () => menuRootAssign(menu.qaMode),
        },
        location.pathname !== '/'
          ? {
              label: 'HOME',
              action: () => navigate({ to: '/' }),
            }
          : undefined,
        {
          label: 'EXIT',
          desc: 'Close this MENU window',
          action: () => toggleMenu(false),
        },
      ].filter(Boolean),
    },
    ...(import.meta.env.DEV
      ? {
          qaMode: {
            label: 'QA Mode',
            items: [
              {
                label: 'BACK',
                desc: 'Return to Main MENU',
                action: () => menuRootAssign(menu.root),
              },
              location.pathname === '/show' && {
                label: 'GO TO',
                desc: 'Specify the state you want to make current',
                action: () => menuRootAssign(menu.qaModeNav),
              },
            ].filter(Boolean),
          },
          qaModeNav: {
            label: 'GO TO',
            items: [
              {
                label: 'BACK',
                desc: 'Go back to QA Mode Menu',
                action: () => menuRootAssign(menu.qaMode),
              },
              {
                label: 'phase 0',
                desc: 'Open Phase 0 Menu',
                action: () => menuRootAssign(menu.qaModeNavP0),
              },
              {
                label: 'phase 1',
                desc: 'Open Phase 1 Menu',
                action: () => menuRootAssign(menu.qaModeNavP1),
              },
              {
                label: 'phase 2',
                desc: 'Open Phase 2 Menu',
                action: () => menuRootAssign(menu.qaModeNavP2),
              },
            ],
          },
          qaModeNavP0: {
            label: 'Phase 0',
            items: [
              {
                label: 'screen1',
                desc: 'Intro screen 1',
                action: () => {},
              },
            ],
          },
          qaModeNavP1: { label: 'Phase 1', items: [] },
          qaModeNavP2: { label: 'Phase 2', items: [] },
        }
      : {}),
  } as Menu
  const [menuRoot, menuRootAssign] = useState(menu.root)
  const [selectedItemIndex, selectedItemIndexAssign] = useState(0)

  useButton('b', {
    cond: () => menuHasFocus,
    onPress: () => {
      toggleMenu(false)
      menuRootAssign(menu.root)
    },
  })
  useButton('start', {
    onPress: () => {
      if (menuHasFocus) menuRootAssign(menu.root)
      toggleMenu()
    },
  })
  useButton('a', {
    onPress: () => menuRoot.items[selectedItemIndex].action?.(),
  })

  if (!menuHasFocus) return null

  return (
    <Menu
      items={menuRoot.items}
      hasFocus={menuHasFocus}
      onNavigation={selectedItemIndexAssign}
    >
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-[1fr_auto] gap-y-4 bg-black/30 backdrop-blur-xs">
        <div className="border-menu-500 before:border-menu-800 bg-menu-100 inset-ring-menu-200 after:border-menu-400 col-span-6 col-start-7 m-2 space-y-2 rounded border-4 inset-ring-3 transition-all before:absolute before:inset-0 before:-right-[5px] before:-bottom-[6px] before:rounded before:border-r-2 before:border-b-2 after:absolute after:inset-0 after:-top-[5px] after:-left-[5px] after:rounded after:border-t-2 after:border-l-2">
          <div className="bg-black/10 px-4 py-1">
            <p className="font-poke text-center text-black">{menuRoot.label}</p>
          </div>

          {menuRoot.items.length > 0 ? (
            <MenuList className="relative m-0 list-none p-0">
              <MenuIndicator className="ease-accel absolute left-2 h-0 w-0 border-t-[0.5rem] border-b-[0.5rem] border-l-[0.75rem] border-t-transparent border-b-transparent border-l-black transition-all duration-200" />

              {menuRoot.items.map((item, index) => (
                <MenuItem
                  key={item.label}
                  index={index}
                  className={`font-poke cursor-pointer px-8 py-2 text-[12px] select-none ${item.disabled ? 'cursor-not-allowed text-neutral-400' : 'text-black'}`}
                  onClick={item.action}
                >
                  {item.label}
                </MenuItem>
              ))}
            </MenuList>
          ) : (
            <p className="font-poke px-4 text-[10px] text-neutral-400">
              Nothing to see here!
            </p>
          )}
        </div>

        <div className="bg-menu-desc-700 col-span-12 row-start-2 h-16 py-1">
          <p className="font-poke bg-menu-des-400 bg-menu-desc-400 border-t-menu-desc-100 border-b-menu-desc-300 h-full border-t-2 border-b-2 p-4 text-xs text-white">
            {menuRoot.items[selectedItemIndex].desc ?? 'Press A to select...'}
          </p>
        </div>
      </div>
    </Menu>
  )
}
type Menu = Record<
  string,
  {
    label: string
    items: Array<
      Parameters<typeof Menu>[0]['items'][number] & {
        to?: string
        desc?: string
        action?: () => void
      }
    >
  }
>
