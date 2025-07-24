import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

const initialState: State = {
  text: '',
  phraseIndex: 0,
  isDeleting: false,
  isDone: false,
  isPaused: false,
}

export function useTypewriter(
  phrases: string[],
  {
    autoplay = true,
    deletingSpeed = 0.05e3,
    totalIterations = 1,
    pauseDuration = 1.5e3,
    typingSpeed = 0.08e3,
  }: {
    /**
     * Controls whether or not the effect runs immediately. If false, use the
     * `start()` function returned from this hook to begin the animation.
     * Default: true
     * */
    autoplay?: boolean
    /**
     * Controls the duration (in ms) before a character is removed when deleting
     * text. Default: 50ms
     */
    deletingSpeed?: number
    /**
     * Controls the duration (in ms) the animation pauses when rendering multiple
     * phrases. Default: 1500ms
     */
    pauseDuration?: number
    /**
     * How many times should the animation play. If set to 0, the animation will
     * run indefinitely. Default: 1.
     */
    totalIterations?: number
    /**
     * Controls the duration (in ms) before a character is inserted when "typing"
     * text. Default: 80ms
     */
    typingSpeed?: number
  } = {}
) {
  const [{ isDeleting, isDone, isPaused, phraseIndex, text }, dispatch] =
    useReducer(reducer, initialState)
  const [isStarted, isStartedAssign] = useState(autoplay)
  const animationFrame = useRef<number>()
  const lastUpdatedTime = useRef<number>()
  const timeAccumulator = useRef(0)

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastUpdatedTime.current) lastUpdatedTime.current = timestamp

      const deltaTime = timestamp - lastUpdatedTime.current
      timeAccumulator.current += deltaTime
      lastUpdatedTime.current = timestamp

      const currentPhrase = phrases[phraseIndex % phrases.length]
      const currentIteration = Math.floor(phraseIndex / phrases.length)

      if (isPaused) {
        if (timeAccumulator.current >= pauseDuration) {
          timeAccumulator.current = 0
          dispatch({ type: 'START_DELETING' })
        }
      } else if (isDeleting) {
        if (timeAccumulator.current >= deletingSpeed) {
          timeAccumulator.current = 0
          if (text.length > 0) {
            dispatch({ type: 'DELETE_CHAR' })
          } else {
            if (totalIterations > 0 && currentIteration >= totalIterations) {
              dispatch({ type: 'RESET' })
              dispatch({ type: 'START_PAUSING', payload: { isLast: true } })
              return
            }
            dispatch({ type: 'NEXT_PHRASE' })
          }
        }
      } else if (timeAccumulator.current >= typingSpeed) {
        timeAccumulator.current = 0

        if (text.length < currentPhrase.length) {
          dispatch({ type: 'TYPE_CHAR', payload: currentPhrase })
        } else {
          const isLastPhraseOfLoop = (phraseIndex + 1) % phrases.length === 0
          const isLastIteration =
            totalIterations > 0 && currentIteration + 1 >= totalIterations
          const isLast = isLastIteration && isLastPhraseOfLoop

          dispatch({ type: 'START_PAUSING', payload: { isLast } })
        }
      }

      animationFrame.current = requestAnimationFrame(animate)
    },
    [
      deletingSpeed,
      isDeleting,
      isPaused,
      pauseDuration,
      phraseIndex,
      phrases,
      totalIterations,
      typingSpeed,
    ]
  )

  const phrasesMemo = JSON.stringify(phrases)
  useEffect(() => {
    dispatch({ type: 'RESET' })
    isStartedAssign(autoplay)
  }, [phrasesMemo, autoplay])

  useEffect(() => {
    if (isStarted && !isDone) {
      animationFrame.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }

      lastUpdatedTime.current = undefined
      timeAccumulator.current = 0
    }
  }, [isStarted, isDone, animate])

  return [
    text,
    {
      isDone: isDone,
      isStarted,
      start: () => {
        if (isStarted) return
        isStartedAssign(true)
      },
    },
  ] as const
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'DELETE_CHAR':
      return { ...state, text: state.text.substring(0, state.text.length - 1) }
    case 'NEXT_PHRASE':
      return { ...state, isDeleting: false, phraseIndex: state.phraseIndex + 1 }
    case 'RESET':
      return { ...initialState }
    case 'START_DELETING':
      return { ...state, isDeleting: true, isPaused: false }
    case 'START_PAUSING':
      return {
        ...state,
        ...(action.payload.isLast ? { isDone: true } : { isPaused: true }),
      }
    case 'TYPE_CHAR':
      return {
        ...state,
        text: action.payload.substring(0, state.text.length + 1),
      }
  }
}
type State = {
  text: string
  phraseIndex: number
  isDeleting: boolean
  isPaused: boolean
  isDone: boolean
}
type Action =
  | { type: 'DELETE_CHAR' }
  | { type: 'NEXT_PHRASE' }
  | { type: 'RESET' }
  | { type: 'START_DELETING' }
  | { type: 'START_PAUSING'; payload: { isLast: boolean } }
  | { type: 'TYPE_CHAR'; payload: string }
