import { useEffect, useState } from 'react'

export function useTimer(props: {
  duration: number
  pollStarted: number | null
}) {
  const [timeLeft, timeLeftAssign] = useState(props.duration)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const currentTime = Date.now()
    const pollEndTime = props.pollStarted
      ? props.pollStarted + props.duration
      : Infinity

    if (timeLeft <= 0 || (props.pollStarted && currentTime >= pollEndTime)) {
      timeLeftAssign(0)
      return
    }

    const secondsRemaining = Math.floor((pollEndTime - currentTime) / 1000)
    if (timeLeft !== secondsRemaining) {
      timeLeftAssign(secondsRemaining)
    }

    timeoutId = setTimeout(() => {
      timeLeftAssign((p) => p - 1)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [props.pollStarted, props.duration, timeLeft])

  return timeLeft
}
