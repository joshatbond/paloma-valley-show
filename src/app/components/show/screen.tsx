import { clsx } from 'clsx'
import { type HTMLProps, type PropsWithChildren, useEffect } from 'react'

import { useTypewriter } from '~/app/hooks/useTypewriter'

import { useStore } from './store'

export function ScreenContainer(props: PropsWithChildren) {
  return <div className="relative">{props.children}</div>
}
export function ScreenBackground({
  className,
  ...props
}: HTMLProps<HTMLImageElement>) {
  return <img className={clsx('render-pixelated', className)} {...props} />
}
export function MidLayer(props: PropsWithChildren) {
  return <div className="absolute inset-0">{props.children}</div>
}
export function TextContainer(
  props: PropsWithChildren & { isWaiting?: boolean; hide: boolean }
) {
  return (
    <div
      className={clsx(
        'absolute inset-x-0',
        props.isWaiting ? 'top-full' : 'bottom-0',
        props.hide && 'opacity-0'
      )}
    >
      <div className="relative px-[2%] pb-[1%]">
        <img src="/images/exposition.png" className="render-pixelated" />

        <div className="absolute inset-0 px-8 py-[0.6rem]">
          {props.children}
        </div>

        <div className="absolute right-[1.75rem] bottom-[0.75rem]">
          <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
        </div>
      </div>
    </div>
  )
}
export function Text({
  text: [t1, t2],
  hasEllipses,
}: {
  text: [string, string]
  hasEllipses?: boolean
}) {
  const typingState = useStore(state => state.typing)
  const typingStateAssign = useStore(state => state.typingStateAssign)

  const [line1, { isDone: isLine1Done }] = useTypewriter([t1])
  const [
    line2,
    { isDone: isLine2Done, isStarted: isLine2Started, start: startLine2 },
  ] = useTypewriter([t2], {
    autoplay: false,
    ...(hasEllipses
      ? {
          totalIterations: 0,
          typingSpeed: 0.5e3,
          pauseDuration: 1e3,
        }
      : {}),
  })

  useEffect(() => {
    if (isLine1Done || (typingState === 'userOverride' && !isLine2Started))
      setTimeout(
        startLine2,
        typingState === 'userOverride' && !isLine2Started ? 10 : 0.4e3
      )
    if (isLine2Done) typingStateAssign('ready')
  }, [
    isLine1Done,
    isLine2Done,
    isLine2Started,
    typingState,
    typingStateAssign,
    startLine2,
  ])

  useEffect(() => {
    if (typingState === 'ready' && !isLine2Done) typingStateAssign('typing')
  }, [isLine2Done, typingState, typingStateAssign])

  return (
    <>
      <p className="font-poke text-[min(2.3vw,10px)] text-black">
        {typingState === 'typing' ? line1 : t1}
      </p>
      <p className="font-poke text-[min(2.3vw,10px)] text-black">
        {typingState === 'userOverride'
          ? hasEllipses
            ? line2
            : t2
          : isLine1Done
            ? typingState === 'typing'
              ? line2
              : t2
            : ''}
      </p>
    </>
  )
}
