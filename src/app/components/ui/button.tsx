import { ComponentProps } from 'react'
import clsx from 'clsx'
import { useHaptic } from '~/app/hooks/useHaptic'

export function Button(props: ComponentProps<'button'>) {
  const haptics = useHaptic()

  return (
    <button
      onClick={() => haptics.once()}
      className={clsx(
        'poke-button font-poke px-8 py-4 border-2 border-[#3a131f] cursor-pointer font-bold uppercase rounded-xl transition-all duration-200 ease-in-out flex items-center justify-center gap-2 min-w-[176px] text-white relative overflow-hidden',
        props.className
      )}
    >
      {props.children}
    </button>
  )
}
