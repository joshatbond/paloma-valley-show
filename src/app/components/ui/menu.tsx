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

import { useButton } from '~/app/hooks/useButtons'

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
  const [selectedItemIndex, selectedItemIndexAssign] = useState(0)
  const previousItemIndex = useRef<number>(0)

  const itemsMemo = useRef(JSON.stringify(items))

  useButton('down', {
    cond: () => !!hasFocus,
    onPress: () => {
      selectedItemIndexAssign(current => {
        let next = (current + 1) % items.length
        while (next !== current) {
          if (!items[next].disabled) return next
          next = (next + 1) % items.length
        }
        return current
      })
    },
  })
  useButton('up', {
    cond: () => !!hasFocus,
    onPress: () => {
      selectedItemIndexAssign(current => {
        let prev = (current - 1 + items.length) % items.length
        while (prev !== current) {
          if (!items[prev].disabled) return prev
          prev = (prev - 1 + items.length) % items.length
        }
        return current
      })
    },
  })

  useEffect(() => {
    if (selectedItemIndex === previousItemIndex.current) return
    previousItemIndex.current = selectedItemIndex
    onNavigation?.(selectedItemIndex)

    return () => onNavigation?.(0)
  }, [selectedItemIndex, onNavigation])

  useEffect(() => {
    if (JSON.stringify(items) === itemsMemo.current) return
    itemsMemo.current = JSON.stringify(items)
    selectedItemIndexAssign(0)
  }, [items, selectedItemIndexAssign])
  useEffect(() => {
    if (!hasFocus) selectedItemIndexAssign(0)
  }, [hasFocus, selectedItemIndexAssign])

  const getItemProps: MenuContext['getItemProps'] = (index, userProps) => ({
    ...userProps,
    onMouseEnter: e => {
      if (!items[index] || items[index].disabled) return

      selectedItemIndexAssign(index)
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
        selectedItemAssign: selectedItemIndexAssign,
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
