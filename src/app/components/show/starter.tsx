export function Starter(props: {
  type: 'bulbasaur' | 'squirtle' | 'charmander'
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] bg-black/30 backdrop-blur-xs">
      <div className="col-start-1 row-start-1 grid items-center justify-end">
        <img src="/images/arrow.png" className="w-8 rotate-90" />
      </div>

      <img
        src={`/images/frame_${props.type}.png`}
        className="col-start-2 row-start-1"
      />

      <div className="col-start-3 row-start-1 grid items-center justify-end">
        <img src="/images/arrow.png" className="w-8 -rotate-90" />
      </div>

      <div className="col-span-3 col-start-1 row-start-2 px-[2%] pb-[1%]">
        <img src="/images/exposition.png" />
      </div>
    </div>
  )
}
