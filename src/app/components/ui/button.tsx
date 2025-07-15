import clsx from 'clsx'
import { ComponentProps } from 'react'

import { useHaptic } from '~/app/hooks/useHaptic'

export function Button(props: ComponentProps<'button'>) {
  const haptics = useHaptic()

  return (
    <button
      onClick={() => haptics.once()}
      className={clsx(
        'poke-button font-poke relative flex min-w-[176px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-[#3a131f] px-8 py-4 font-bold text-white uppercase transition-all duration-200 ease-in-out',
        props.className
      )}
    >
      {props.children}
    </button>
  )
}
