export function Controller(props: {
  onUp: () => void
  onDown: () => void
  onLeft: () => void
  onRight: () => void
  onA: () => void
  onB: () => void
}) {
  return (
    <div className="relative bg-[#f9cb1c]">
      <div className="flex justify-center">
        <div className="relative">
          <img
            className="max-h-[430px] object-contain"
            src="/images/controller.jpg"
          />
          <div className="absolute inset-0"></div>

          <button
            className="absolute top-[21%] left-[16%] h-[14%] w-[13%] select-none"
            onClick={props.onUp}
          />

          <button
            className="absolute top-[53%] left-[16%] size-full h-[14%] w-[13%] select-none"
            onClick={props.onDown}
          />

          <button
            className="absolute top-[36%] left-[2%] size-full h-[17%] w-[13%] select-none"
            onClick={props.onLeft}
          />

          <button
            className="absolute top-[36%] left-[30%] size-full h-[17%] w-[13%] select-none"
            onClick={props.onRight}
          />

          <button
            className="absolute top-[22%] left-[75%] h-[25%] w-[21%] rounded-full select-none"
            onClick={props.onA}
          />

          <button
            className="absolute top-[44%] left-[54%] h-[25%] w-[21%] rounded-full select-none"
            onClick={props.onB}
          />
        </div>
      </div>
    </div>
  )
}
