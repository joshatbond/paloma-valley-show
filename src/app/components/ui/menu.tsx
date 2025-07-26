import {
  type Dispatch,
  type HTMLProps,
  type MouseEventHandler,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useStore } from '../show/store'

const MenuContext = createContext<MenuContext | null>(null)

export function Menu({
  items,
  hasFocus,
  onNavigation,
  onSelect,
  ...props
}: PropsWithChildren<{
  /** the list of items to render */
  items: MenuContext['menuItems']
  /**
   * a callback function whenever a selection is made.
   * @params the item Index that was selected
   */
  onSelect?: (index: number) => void
  /**
   * a callback function that triggers when a menu navigation occurs
   * @params the previous and current index of the navigation
   */
  onNavigation?: (index: number) => void
  /** whether or not the current menu should handle interactions */
  hasFocus?: boolean
}>) {
  const upKeyState = useStore(state => state.buttons.up)
  const downKeyState = useStore(state => state.buttons.down)
  const [selectedItemIndex, selectedItemAssign] = useState(0)
  const prevSelection = useRef<number>(0)

  const lastDownRef = useRef(0)
  const lastUpRef = useRef(0)
  const throttleDelay = 0.1e3

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDow)
    if (!hasFocus) return
    if (upKeyState === 'pressed') {
      if (Date.now() - lastUpRef.current < throttleDelay) return
      lastDownRef.current = Date.now()
      selectedItemAssign(findPreviousEnabled)
    }
    if (downKeyState === 'pressed') {
      if (Date.now() - lastDownRef.current < throttleDelay) return
      lastUpRef.current = Date.now()
      selectedItemAssign(findNextEnabled)
    }

    function handleKeyDow(e: KeyboardEvent) {
      if (!hasFocus) return
      if (e.key === 'ArrowDown') {
        if (Date.now() - lastDownRef.current < throttleDelay) return
        lastDownRef.current = Date.now()
        selectedItemAssign(findNextEnabled)
      }
      if (e.key === 'ArrowUp') {
        if (Date.now() - lastUpRef.current < throttleDelay) return
        lastUpRef.current = Date.now()
        selectedItemAssign(findPreviousEnabled)
      }
      if (e.key === 'Enter') onSelect?.(selectedItemIndex)
    }
    function findNextEnabled(current: number) {
      let next = (current + 1) % items.length
      while (next !== current) {
        if (!items[next].disabled) return next
        next = (next + 1) % items.length
      }
      return current
    }
    function findPreviousEnabled(current: number) {
      let prev = (current - 1 + items.length) % items.length
      while (prev !== current) {
        if (!items[prev].disabled) return prev
        prev = (prev - 1 + items.length) % items.length
      }
      return current
    }

    return () => window.removeEventListener('keydown', handleKeyDow)
  }, [items, hasFocus, upKeyState, downKeyState, onSelect, selectedItemAssign])

  useEffect(() => {
    if (selectedItemIndex === prevSelection.current) return

    onNavigation?.(selectedItemIndex)
    prevSelection.current = selectedItemIndex
  }, [selectedItemIndex, onNavigation])

  const getItemProps: MenuContext['getItemProps'] = (index, userProps) => ({
    ...userProps,
    onMouseEnter: e => {
      if (!items[index] || items[index].disabled) return

      selectedItemAssign(index)
      userProps.onMouseEnter?.(e)
    },
    onClick: e => {
      if (!items[index] || items[index].disabled) return
      onSelect?.(selectedItemIndex)
      userProps.onClick?.(e)
    },
    role: 'menuitem' as const,
    'aria-selected': index === selectedItemIndex,
    'aria-disabled': items[index]?.disabled ?? false,
  })

  return (
    <MenuContext.Provider
      value={{
        selectedItemAssign,
        selectedItemIndex,
        menuItems: items,
        getItemProps,
      }}
    >
      {props.children}
    </MenuContext.Provider>
  )
}

const MenuList = forwardRef<HTMLUListElement, HTMLProps<HTMLUListElement>>(
  (props, ref) => {
    return <ul ref={ref} {...props} />
  }
)
MenuList.displayName = 'MenuList'

const MenuItem = forwardRef<
  HTMLLIElement,
  HTMLProps<HTMLLIElement> & { index: number }
>(({ index, ...props }, ref) => {
  const { getItemProps } = useMenuContext()
  return <li ref={ref} {...getItemProps(index, props)} />
})
MenuItem.displayName = 'MenuItem'

const MenuIndicator = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  (props, ref) => {
    const { selectedItemIndex } = useMenuContext()

    return (
      <div
        style={{ top: `${selectedItemIndex * 2.2 + 0.3}rem` }}
        aria-hidden="true"
        ref={ref}
        {...props}
      />
    )
  }
)
MenuIndicator.displayName = 'MenuIndicator'

export { MenuIndicator, MenuItem, MenuList }

function useMenuContext() {
  const context = useContext(MenuContext)

  if (!context)
    throw new Error('useMenuContext must be used within a menu provider')

  return context
}

type MenuContext = {
  selectedItemIndex: number
  selectedItemAssign: Dispatch<SetStateAction<number>>
  menuItems: Array<{ label: string; disabled?: boolean }>
  getItemProps: (
    index: number,
    userProps: HTMLProps<HTMLLIElement>
  ) => {
    onMouseEnter: MouseEventHandler<HTMLLIElement>
    onClick: MouseEventHandler<HTMLLIElement>
    role: 'menuitem'
    'aria-selected': boolean
    'aria-disabled': boolean
  }
}
export type MenuItem = MenuContext['menuItems'][number]
