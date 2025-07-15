import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export function Carousel() {
  const [emblaRef] = useEmblaCarousel({}, [Autoplay()])

  return (
    <div className='overflow-hidden' ref={emblaRef}>
      <div className='flex'>
        <img
          src='/images/conductor.png'
          className='h-full object-contain shrink-0 grow-0 basis-full'
        />
        <img
          src='/images/drums.png'
          className='h-full object-contain shrink-0 grow-0 basis-full'
        />
        <img
          src='/images/trumpet.png'
          className='h-full object-contain shrink-0 grow-0 basis-full'
        />
        <img
          src='/images/tuba.png'
          className='h-full object-contain shrink-0 grow-0 basis-full'
        />
      </div>
    </div>
  )
}
