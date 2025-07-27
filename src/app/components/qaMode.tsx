import clsx from 'clsx'

import { useStore } from './show/store'

export function QAMode() {
  const isEnabled = useStore(state => state.qaMode.enabled)
  const isShown = useStore(state => state.qaMode.shown)

  if (!isEnabled) return null

  return (
    <div
      className={clsx(
        'border-menu-500 before:border-menu-800 bg-menu-100 inset-ring-menu-200 after:border-menu-400 absolute inset-y-2 right-2 w-1/2 rounded border-4 inset-ring-3 transition-all before:absolute before:inset-0 before:-right-[5px] before:-bottom-[6px] before:rounded before:border-r-2 before:border-b-2 after:absolute after:inset-0 after:-top-[5px] after:-left-[5px] after:rounded after:border-t-2 after:border-l-2',
        isShown ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    ></div>
  )
}
