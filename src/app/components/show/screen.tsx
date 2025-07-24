import { type PropsWithChildren, useEffect } from 'react'

import { useTypewriter } from '~/app/hooks/useTypewriter'

import { useStore } from './store'

export function ScreenContainer(props: PropsWithChildren) {
  return <div className="relative">{props.children}</div>
}
export function ScreenBackground(props: { url: string }) {
  return <img src={props.url} className="render-pixelated" />
}
export function MidLayer(props: PropsWithChildren) {
  return <div className="absolute inset-0">{props.children}</div>
}
export function TextContainer(props: PropsWithChildren) {
  return (
    <div className="absolute inset-x-0 bottom-0">
      <div className="relative px-[2%] pb-[1%]">
        <img src="/images/exposition.png" className="render-pixelated" />

        <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-[2.3vw] text-black">
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
  const [line2, { isDone: isLine2Done, start: startLine2 }] = useTypewriter(
    [t2],
    {
      autoplay: false,
    }
  )

  useEffect(() => {
    if (isLine1Done) setTimeout(startLine2, 0.4e3)
    if (isLine2Done) typingStateAssign('ready')
  }, [isLine1Done, isLine2Done, typingStateAssign, startLine2])

  useEffect(() => {
    if (typingState === 'ready' && !isLine2Done) typingStateAssign('typing')
  }, [isLine2Done, typingState, typingStateAssign])

  return (
    <>
      <p>{typingState === 'typing' ? line1 : t1}</p>
      <p>
        {typingState === 'userOverride'
          ? hasEllipses
            ? ''
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
