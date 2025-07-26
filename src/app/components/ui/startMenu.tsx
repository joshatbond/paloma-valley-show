import { useEffect, useRef, useState } from 'react'

import { useStore } from '~/components/show/store'

import { Menu, MenuIndicator, MenuItem, MenuList } from './menu'

export function StartMenu() {
  const menuHasFocus = useStore(state => state.menu.show)
  const backButtonState = useStore(state => state.buttons.b)
  const nextButtonState = useStore(state => state.buttons.a)
  const startButtonState = useStore(state => state.buttons.start)
  const buttonStateAssign = useStore(state => state.buttonStateAssign)
  const toggleMenu = useStore(state => state.showMenu)

  const menu = {
    root: {
      label: 'Main Menu',
      items: [
        import.meta.env.DEV && {
          label: 'QA Mode',
          to: 'qaMode',
          desc: 'Show QA Mode Menu',
        },
        {
          label: 'EXIT',
          desc: 'Close this MENU window',
          action: () => toggleMenu(false),
        },
      ],
    },
    ...(import.meta.env.DEV
      ? {
          qaMode: {
            label: 'QA Mode',
            items: [{ label: '', desc: '' }],
          },
        }
      : {}),
  } as Menu
  const [menuRoot, menuRootAssign] = useState(menu.root)
  const [selectedItemIndex, selectedItemIndexAssign] = useState(0)
  const pressThrottle = useRef<{ back: number; next: number; start: number }>({
    back: 0,
    next: 0,
    start: 0,
  })
  const throttleDuration = 0.1e3

  // menu visibility
  useEffect(() => {
    if (backButtonState === 'pressed') {
      if (Date.now() - pressThrottle.current.back < throttleDuration) return
      pressThrottle.current.back = Date.now()
      if (menuHasFocus) toggleMenu(false)
    }
    if (startButtonState === 'pressed') {
      if (Date.now() - pressThrottle.current.start < throttleDuration) return
      pressThrottle.current.start = Date.now()
      toggleMenu()
    }
  }, [
    backButtonState,
    startButtonState,
    throttleDuration,
    menuHasFocus,
    toggleMenu,
  ])

  // actions
  useEffect(() => {
    if (
      nextButtonState !== 'pressed' ||
      Date.now() - pressThrottle.current.next < throttleDuration
    )
      return
    pressThrottle.current.next = Date.now()
    buttonStateAssign('a', 'ready')

    const currentItem = menuRoot.items[selectedItemIndex]
    currentItem.action?.()
  }, [
    nextButtonState,
    throttleDuration,
    menuRoot,
    selectedItemIndex,
    buttonStateAssign,
  ])

  if (!menuHasFocus) return null

  return (
    <Menu
      items={menuRoot.items}
      hasFocus={menuHasFocus}
      onNavigation={selectedItemIndexAssign}
    >
      <div className="absolute inset-0 grid grid-cols-12 bg-black/30 p-1 backdrop-blur-xs">
        <div className="border-menu-500 before:border-menu-800 bg-menu-100 inset-ring-menu-200 after:border-menu-400 col-span-6 col-start-7 space-y-2 rounded border-4 inset-ring-3 transition-all before:absolute before:inset-0 before:-right-[5px] before:-bottom-[6px] before:rounded before:border-r-2 before:border-b-2 after:absolute after:inset-0 after:-top-[5px] after:-left-[5px] after:rounded after:border-t-2 after:border-l-2">
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
