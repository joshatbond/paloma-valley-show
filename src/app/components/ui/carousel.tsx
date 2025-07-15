import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

const urls = ['conductor', 'drums', 'trumpet', 'tuba'].map(
  s => `/images/${s}.png`
)

export function Carousel() {
  const [emblaRef] = useEmblaCarousel({}, [Autoplay({ delay: 6000 })])

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex h-[20vh]">
        {urls.map(url => (
          <div
            key={url}
            className="flex shrink-0 grow-0 basis-full justify-end"
          >
            <img className="max-w-[25vw] object-contain" src={url} />
          </div>
        ))}
      </div>
    </div>
  )
}
