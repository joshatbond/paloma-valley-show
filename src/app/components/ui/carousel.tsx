import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const urls = ['conductor', 'drums', 'trumpet', 'tuba'].map(
  (s) => `/images/${s}.png`
)

export function Carousel() {
  const [emblaRef] = useEmblaCarousel({}, [Autoplay()])

  return (
    <div className='overflow-hidden' ref={emblaRef}>
      <div className='flex h-[20vh]'>
        {urls.map((url) => (
          <div
            key={url}
            className='shrink-0 grow-0 basis-full flex justify-end'
          >
            <img className='object-contain' src={url} />
          </div>
        ))}
      </div>
    </div>
  )
}
