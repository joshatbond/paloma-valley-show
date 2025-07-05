import { ComponentProps } from 'react'
import clsx from 'clsx'

export function Button(props: ComponentProps<'button'>) {
  return (
    <button
      className={clsx(
        'poke-button font-poke px-8 py-4 border-2 border-[#3a131f] cursor-pointer font-bold uppercase rounded-xl transition-all duration-200 ease-in-out flex items-center justify-center gap-2 min-w-[176px] text-white relative overflow-hidden',
        props.className
      )}
    >
      {props.children}
    </button>
  )
}
