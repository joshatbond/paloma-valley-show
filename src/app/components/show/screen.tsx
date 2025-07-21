import { type PropsWithChildren } from 'react'

export function ScreenContainer(props: PropsWithChildren) {
  return <div className="relative h-full w-full">{props.children}</div>
}
export function ScreenBackground(props: { url: string }) {
  return <img src={props.url} className="render-pixelated" />
}
export function MidLayer(props: PropsWithChildren) {
  return <div className="absolute inset-0">{props.children}</div>
}
export function TextLayer(props: PropsWithChildren) {
  return (
    <div className="absolute inset-x-0 bottom-0">
      <div className="relative px-[2%] pb-[1%]">
        <img src="/images/exposition.png" className="render-pixelated" />

        <div className="font-poke absolute inset-0 py-[0.6rem] pr-5 pl-6 text-black">
          {props.children}
        </div>

        <div className="absolute right-[1.75rem] bottom-[0.75rem]">
          <img src="/images/arrow.png" className="w-[12px] animate-bounce" />
        </div>
      </div>
    </div>
  )
}
