import {
  type Dispatch,
  type HTMLProps,
  type MouseEvent,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

const MenuContext = createContext<MenuContext | null>(null)

export function Menu({
  items,
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
  onNavigation?: (indexes: [prev: number, current: number]) => void
}>) {
  const [selectedItemIndex, selectedItemAssign] = useState(0)
  const prevSelection = useRef<number>(0)

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDow)

    function handleKeyDow(e: KeyboardEvent) {
      e.preventDefault()
      if (e.key === 'ArrowDown') {
        selectedItemAssign(p => (p + 1) % items.length)
      }
      if (e.key === 'ArrowUp') {
        selectedItemAssign(p => (p + 1 - items.length) % items.length)
      }
      if (e.key === 'Enter') onSelect?.(selectedItemIndex)
    }

    return () => window.removeEventListener('keydown', handleKeyDow)
  }, [items, onSelect, selectedItemAssign])

  useEffect(() => {
    if (selectedItemIndex === prevSelection.current) return

    onNavigation?.([prevSelection.current, selectedItemIndex])
    prevSelection.current = selectedItemIndex
  }, [selectedItemIndex, onNavigation])

  const getItemProps: MenuContext['getItemProps'] = (index, userProps) => ({
    ...userProps,
    onMouseEnter: e => {
      selectedItemAssign(index)
      userProps.onMouseEnter?.(e)
    },
    onClick: () => {
      onSelect?.(selectedItemIndex)
    },
    role: 'menuitem' as const,
    'aria-selected': index === selectedItemIndex,
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

const MenuItem = forwardRef<HTMLLIElement, HTMLProps<'li'> & { index: number }>(
  ({ index, ...props }, ref) => {
    const { getItemProps } = useMenuContext()
    return <li ref={ref} {...props} />
  }
)

export { MenuList }

function useMenuContext() {
  const context = useContext(MenuContext)

  if (!context)
    throw new Error('useMenuContext must be used within a menu provider')

  return context
}

type MenuContext = {
  selectedItemIndex: number
  selectedItemAssign: Dispatch<SetStateAction<number>>
  menuItems: string[]
  getItemProps: (
    index: number,
    userProps: HTMLProps<'li'>
  ) => {
    onMouseEnter: (e: MouseEvent<'li'>) => void
    onClick: (e: MouseEvent<'li'>) => void
    role: 'menuitem'
    'aria-selected': boolean
  }
}
