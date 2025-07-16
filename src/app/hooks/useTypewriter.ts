import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

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
): [string, { isDone: boolean; start: () => void }] {
  const [{ count, speed, text }, dispatch] = useReducer(reducer, {
    text: '',
    speed: typingSpeed,
    count: 0,
  })
  const [started, startedAssign] = useState(autoplay)
  const state = useRef<States>('init')
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const iterationCount = useRef(0)

  const handleTyping = useCallback(() => {
    const index = count % phrases.length
    const currentPhrase = phrases[index]

    switch (state.current) {
      case 'completed':
        break
      case 'init':
        if (started) state.current = 'typing'
        dispatch({ type: 'TYPE', payload: currentPhrase, speed: 0 })
        break
      case 'deleting':
        dispatch({
          type: 'DELETE',
          payload: currentPhrase,
          speed: deletingSpeed,
        })

        if (text === '') {
          state.current = 'typing'
          dispatch({ type: 'COUNT' })
        }
        break
      case 'pausing':
        dispatch({ type: 'DELAY', payload: pauseDuration })
        setTimeout(() => {
          state.current = 'deleting'
        }, pauseDuration)
        break
      case 'typing':
        dispatch({ type: 'TYPE', payload: currentPhrase, speed: typingSpeed })

        if (text === currentPhrase) {
          state.current = 'pausing'

          if (totalIterations > 0) {
            iterationCount.current += 1
            if (iterationCount.current / phrases.length === totalIterations) {
              state.current = 'completed'
            }
          }
        }

        break
    }
  }, [
    deletingSpeed,
    pauseDuration,
    phrases,
    started,
    text,
    totalIterations,
    typingSpeed,
  ])

  useEffect(() => {
    if (started) {
      timeoutRef.current = setTimeout(handleTyping, speed)
    }

    return () => clearTimeout(timeoutRef.current)
  }, [started, speed, handleTyping])

  return [
    text,
    {
      isDone: state.current === 'completed',
      start: () => startedAssign(true),
    },
  ]
}

function reducer(
  state: {
    speed: number
    text: string
    count: number
  },
  action: Action
) {
  switch (action.type) {
    case 'TYPE':
      return {
        ...state,
        speed: action.speed,
        text: action.payload?.substring(0, state.text.length + 1),
      }
    case 'DELAY':
      return {
        ...state,
        speed: action.payload,
      }
    case 'DELETE':
      return {
        ...state,
        speed: action.speed,
        text: action.payload?.substring(0, state.text.length - 1),
      }
    case 'COUNT':
      return {
        ...state,
        count: state.count + 1,
      }
    case 'RESET':
      return {
        ...state,
        count: 0,
        text: '',
      }
    default:
      return state
  }
}
type States = 'init' | 'typing' | 'deleting' | 'pausing' | 'completed'
type Action =
  | { type: 'DELAY'; payload: number }
  | { type: 'TYPE'; payload: string; speed: number }
  | { type: 'DELETE'; payload: string; speed: number }
  | { type: 'COUNT' }
  | { type: 'RESET' }
