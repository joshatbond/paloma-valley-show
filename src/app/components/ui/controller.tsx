export function Controller(props: {
  onUp: () => void
  onDown: () => void
  onLeft: () => void
  onRight: () => void
  onA: () => void
  onB: () => void
}) {
  return (
    <div className='relative bg-[#f9cb1c]'>
      <div className='flex justify-center'>
        <div className='relative'>
          <img
            className='object-contain max-h-[430px]'
            src='/images/controller.jpg'
          />
          <div className='absolute inset-0'></div>

          <button
            className='absolute w-[13%] h-[14%] left-[16%] top-[21%] select-none'
            onClick={props.onUp}
          />

          <button
            className='absolute w-[13%] h-[14%] left-[16%] top-[53%] select-none size-full'
            onClick={props.onDown}
          />

          <button
            className='absolute w-[13%] h-[17%]  left-[2%] top-[36%] select-none size-full'
            onClick={props.onLeft}
          />

          <button
            className='absolute w-[13%] h-[17%]  left-[30%] top-[36%] select-none size-full'
            onClick={props.onRight}
          />

          <button
            className='absolute top-[22%] left-[75%] w-[21%] h-[25%] rounded-full select-none'
            onClick={props.onA}
          />

          <button
            className='absolute top-[44%] left-[54%] w-[21%] h-[25%] rounded-full select-none'
            onClick={props.onB}
          />
        </div>
      </div>
    </div>
  )
}
