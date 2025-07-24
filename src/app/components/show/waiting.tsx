import { useEffect, useRef } from 'react'

export function WaitingScreen() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isLooping = useRef(false)

  useEffect(() => {
    if (!videoRef.current) return
    const tick = () => {
      if (!videoRef.current || isLooping.current) return
      const { currentTime, duration } = videoRef.current
      const threshold = 0.1

      isLooping.current = duration > 0 && currentTime >= duration - threshold
    }

    videoRef.current.addEventListener('timeupdate', tick)

    return () => videoRef.current?.removeEventListener('timeupdate', tick)
  }, [])

  return (
    <video
      ref={videoRef}
      width="720"
      height="540"
      autoPlay={true}
      controls={false}
      muted={isLooping.current}
      loop={true}
      className="absolute inset-0"
      playsInline={true}
    >
      <source src="/images/waiting.mp4" />
    </video>
  )
}
