import { useConvexMutation } from '@convex-dev/react-query'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { useButton } from '~/app/hooks/useButtons'
import { useGameMachine } from '~/app/hooks/useGameMachine'
import { useHaptic } from '~/app/hooks/useHaptic'
import { useStore } from '~/components/show/store'
import { api } from '~/server/convex/_generated/api'

import { Menu, MenuIndicator, MenuItem, MenuList } from './menu'

export function StartMenu(props: {
  send?: ReturnType<typeof useGameMachine>[1]
  id: (typeof api.appState.updatePhaseState)['_args']['id']
  showId: (typeof api.appState.setActiveState)['_args']['state']
}) {
  const location = useRouterState({ select: s => s.location })
  const navigate = useNavigate()
  const menuHasFocus = useStore(state => state.menu.show)
  const toggleMenu = useStore(state => state.showMenu)
  const haptics = useHaptic()
  const nextPhase = import.meta.env.DEV
    ? useConvexMutation(api.appState.updatePhaseState)
    : undefined
  const startShow = import.meta.env.DEV
    ? useConvexMutation(api.appState.setActiveState)
    : undefined

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
              desc: 'Go back to the home page',
              action: () => {
                toggleMenu()
                navigate({ to: '/' })
              },
            }
          : undefined,
        location.pathname !== '/program'
          ? {
              label: 'PROGRAM',
              desc: 'Go to the program page',
              action: () => {
                toggleMenu()
                navigate({ to: '/program' })
              },
            }
          : undefined,
        location.pathname !== '/show' && props.showId
          ? {
              label: 'SHOW',
              desc: 'Go to the show page',
              action: () => {
                toggleMenu()
                navigate({ to: '/show' })
              },
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
              nextPhase &&
                startShow && {
                  label: 'ADMIN',
                  desc: 'Quick access to the convex functions',
                  action: () => menuRootAssign(menu.admin),
                },
              location.pathname === '/show' &&
                props.send && {
                  label: 'GO TO',
                  desc: 'Specify the state you want to make current',
                  action: () => menuRootAssign(menu.qaModeNav),
                },
              {
                label: 'BACK',
                desc: 'Return to Main MENU',
                action: () => menuRootAssign(menu.root),
              },
            ].filter(Boolean),
          },
          admin: {
            label: 'ADMIN',
            items: [
              {
                label: 'Toggle Show',
                desc: "Toggle the show's active state",
                action: () => {
                  startShow!({
                    id: props.id,
                    state: props.showId ? null : Date.now(),
                  })
                  toggleMenu(false)
                },
              },
              {
                label: 'Phase 0',
                desc: 'Set experience to Phase 0',
                action: () => {
                  if (props.showId) {
                    nextPhase!({ id: props.id, state: 0, showId: props.showId })
                  }
                  toggleMenu(false)
                },
              },
              {
                label: 'Phase 1',
                desc: 'Set experience to Phase 1',
                action: () => {
                  if (props.showId) {
                    nextPhase!({ id: props.id, state: 1, showId: props.showId })
                  }
                  toggleMenu(false)
                },
              },
              {
                label: 'Phase 2',
                desc: 'Set experience to Phase 2',
                action: () => {
                  if (props.showId) {
                    nextPhase!({ id: props.id, state: 2, showId: props.showId })
                  }
                  toggleMenu(false)
                },
              },
              {
                label: 'BACK',
                desc: 'Go back to main menu',
                action: () => menuRootAssign(menu.root),
              },
            ],
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
                action: () =>
                  props.send!({
                    type: 'DEV_JUMP_TO_STATE',
                    path: 'phase0.introduction.screen1',
                  }),
              },
              {
                label: 'screen2',
                desc: 'Intro screen 2',
                action: () =>
                  props.send!({
                    type: 'DEV_JUMP_TO_STATE',
                    path: 'phase0.introduction.screen2',
                  }),
              },
              {
                label: 'screen3',
                desc: 'Intro screen 3',
                action: () =>
                  props.send!({
                    type: 'DEV_JUMP_TO_STATE',
                    path: 'phase0.introduction.screen3',
                  }),
              },
              {
                label: 'screen4',
                desc: 'Intro screen 4',
                action: () =>
                  props.send!({
                    type: 'DEV_JUMP_TO_STATE',
                    path: 'phase0.introduction.screen4',
                  }),
              },
              {
                label: 'waiting',
                desc: 'Waiting Screen',
                action: () =>
                  props.send!({
                    type: 'DEV_JUMP_TO_STATE',
                    path: 'phase0.waitingPhase1',
                  }),
              },
              {
                label: 'ready',
                desc: 'Ready for phase 1 screen',
                action: () =>
                  props.send!({
                    type: 'DEV_JUMP_TO_STATE',
                    path: 'phase0.readyPhase1',
                  }),
              },
            ],
          },
          qaModeNavP1: {
            label: 'Phase 1',
            items: [
              {
                label: 'Poll',
                desc: 'Go to the Poll page',
                action: () =>
                  props.send!({
                    type: 'DEV_JUMP_TO_STATE',
                    path: 'phase1.poll',
                  }),
              },
            ],
          },
          qaModeNavP2: { label: 'Phase 2', items: [] },
        }
      : {}),
  } as Menu
  const [menuRoot, menuRootAssign] = useState(menu.root)
  const [selectedItemIndex, selectedItemIndexAssign] = useState(0)

  useButton('b', {
    disabled: !menuHasFocus,
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
    disabled: !menuHasFocus,
    onPress: () => menuRoot.items[selectedItemIndex].action?.(),
  })

  useButton('left', {
    cond: () => menuHasFocus,
    onPress: () => haptics.pulse({ count: 2, gap: 10 }),
  })
  useButton('right', {
    cond: () => menuHasFocus,
    onPress: () => haptics.pulse({ count: 2, gap: 10 }),
  })

  useEffect(() => {
    return () => {
      selectedItemIndexAssign(0)
      menuRootAssign(menu.root)
    }
  }, [])

  if (!menuHasFocus) return null

  return (
    <Menu
      items={menuRoot.items}
      hasFocus={menuHasFocus}
      onNavigation={selectedItemIndexAssign}
    >
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-[1fr_auto] gap-y-4 bg-black/30 backdrop-blur-xs">
        <div className="border-menu-500 before:border-menu-800 bg-menu-100 inset-ring-menu-200 after:border-menu-400 relative col-span-6 col-start-7 m-2 space-y-2 rounded border-4 inset-ring-3 transition-all before:absolute before:inset-0 before:-right-[5px] before:-bottom-[6px] before:rounded before:border-r-2 before:border-b-2 after:absolute after:inset-0 after:-top-[5px] after:-left-[5px] after:rounded after:border-t-2 after:border-l-2">
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
                  className={`font-poke cursor-pointer py-2 pr-2 pl-8 text-[12px] select-none ${item.disabled ? 'cursor-not-allowed text-neutral-400' : 'text-black'}`}
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
            {menuRoot.items[selectedItemIndex]?.desc ?? 'Press A to select...'}
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
