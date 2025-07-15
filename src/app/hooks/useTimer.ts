import { useEffect, useState } from 'react'

export function useTimer(props: {
  duration: number
  startTime: number | null
  endTime?: number
}) {
  const [timeLeft, timeLeftAssign] = useState(props.duration)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const currentTime = Date.now()
    const pollEndTime = props.endTime
      ? props.endTime
      : props.startTime
        ? props.startTime + props.duration
        : Infinity

    if (timeLeft <= 0 || (props.startTime && currentTime >= pollEndTime)) {
      timeLeftAssign(0)
      return
    }

    const secondsRemaining = Math.floor((pollEndTime - currentTime) / 1000)
    if (timeLeft !== secondsRemaining) {
      timeLeftAssign(secondsRemaining)
    }

    timeoutId = setTimeout(() => {
      timeLeftAssign(p => p - 1)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [props.startTime, props.duration, props.endTime, timeLeft])

  return timeLeft
}
