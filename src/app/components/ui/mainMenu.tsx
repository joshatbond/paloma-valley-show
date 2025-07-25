import { useStore } from '~/components/show/store'

export function Menu() {
  const menuHasFocus = useStore(state => state.menu.show)

  return menuHasFocus ? (
    <div className="absolute inset-0 grid grid-cols-12 bg-black/30 p-1 backdrop-blur-xs">
      <div className="border-menu-500 before:border-menu-800 bg-menu-100 inset-ring-menu-200 after:border-menu-400 col-span-6 col-start-7 grid rounded border-4 inset-ring-3 transition-all before:absolute before:inset-0 before:-right-[5px] before:-bottom-[6px] before:rounded before:border-r-2 before:border-b-2 after:absolute after:inset-0 after:-top-[5px] after:-left-[5px] after:rounded after:border-t-2 after:border-l-2"></div>
    </div>
  ) : null
}
