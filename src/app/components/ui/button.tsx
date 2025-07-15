import clsx from 'clsx'
import { ComponentProps } from 'react'

import { useHaptic } from '~/app/hooks/useHaptic'

export function Button(props: ComponentProps<'button'>) {
  const haptics = useHaptic()

  return (
    <button
      onClick={() => haptics.once()}
      className={clsx(
        'font-poke shadow-poke-btn border-maroon-800 active:shadow-poke-btn-depress hover:shadow-poke-btn-elevate relative flex min-w-[176px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border-2 bg-(image:--gradient-poke-btn) px-8 py-4 font-bold text-white uppercase transition-all duration-200 ease-in-out before:absolute before:top-0 before:-left-full before:h-full before:w-full before:-skew-x-[20deg] before:bg-white/20 before:transition-all before:duration-300 before:ease-in-out hover:-translate-y-[3px] hover:before:left-full active:translate-y-0',
        props.className
      )}
    >
      {props.children}
    </button>
  )
}
