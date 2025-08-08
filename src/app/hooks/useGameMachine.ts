import { useActor } from '@xstate/react'
import { useEffect } from 'react'

import { machine } from '../components/stateMachine'

const states = {
  phase0: {
    introduction: {
      screen1: null,
      screen2: null,
      screen3: null,
      screen4: null,
    },
    waitingPhase1: null,
    readyPhase1: null,
  },
  phase1: {
    introduction: {
      screen1: null,
      screen2: null,
      screen3: null,
    },
    starter1: {
      introduction: null,
      description: null,
      confirmChoice: null,
    },
    starter2: {
      introduction: null,
      description: null,
      confirmChoice: null,
    },
    starter3: {
      introduction: null,
      description: null,
      confirmChoice: null,
    },
    poll: null,
    pollClosed: null,
    rivalIntro: null,
    rivalSelect: null,
  },
  phase2: {
    battle: null,
    epilogue: {
      screen1: null,
      screen2: null,
      screen3: null,
      screen4: null,
      screen5: null,
      screen6: null,
      screen7: null,
    },
  },
} as const
const statesMap = [...createPathMap(states).entries()] as PathEntries<
  typeof states
>[]

export function useGameMachine({
  currentPhase,
  pollEndDate,
  pollStartDate,
}: {
  currentPhase: number
  pollEndDate: number | null
  pollStartDate: number | null
}) {
  const [state, send, ref] = useActor(machine)
  const currentState = statesMap
    .filter(([_, value]) => state.matches(value))
    .pop()?.[0]

  useEffect(() => {
    const context = ref.getSnapshot().context

    if (context.pollEnded !== pollEndDate) {
      send({ type: 'pollEnded', endTime: pollEndDate })
    }
    if (context.currentPhase !== currentPhase) {
      send({
        type: 'updatePhase',
        phase: currentPhase,
        startTime: pollStartDate,
      })
    }
    if (currentState === 'phase0.waitingPhase1' && currentPhase === 1) {
      send({ type: 'next' })
    }
  }, [currentState, currentPhase, pollEndDate, send])

  return [currentState, send, ref] as const
}

export type State = ReturnType<typeof useGameMachine>[0]
export type SendParams = Parameters<
  ReturnType<typeof useGameMachine>[1]
>[0]['type']

/**
 * Creates a Map where keys are path strings and values are
 * the nested object representation of that path.
 */
function createPathMap<T extends Record<string, any>>(obj: T) {
  const result = new Map<string, any>()
  generate(obj, '')
  return result as PathMap<T>

  function stringToNestedObject(path: string) {
    const keys = path.split('.')
    const value = keys.pop()!
    return keys.reduceRight((acc, key) => ({ [key]: acc }), value as any)
  }

  function generate(currentObj: Record<string, any>, currentPath: string) {
    for (const key of Object.keys(currentObj)) {
      const newPath = currentPath ? `${currentPath}.${key}` : key

      result.set(newPath, stringToNestedObject(newPath))

      const value = currentObj[key]
      if (typeof value === 'object' && value !== null) {
        generate(value, newPath)
      }
    }
  }
}

/**
 * Converts a string path like 'a.b.c' into a nested object type: { a: { b: 'c' } }.
 */
type PathToObject<Path extends string> =
  Path extends `${infer Key}.${infer Rest}`
    ? { [K in Key]: PathToObject<Rest> }
    : Path
/**
 * Recursively generates a union of all possible dot-notation path strings from an object type.
 */
type AllObjectPaths<T> = T extends object
  ? {
      [K in keyof T & string]:
        | K
        | `${K}.${AllObjectPaths<T[K]> extends string ? AllObjectPaths<T[K]> : never}`
    }[keyof T & string]
  : never
/**
 * A mapped type. For each possible path `P` in `T`,
 * it creates a key `P` with a value of `PathToObject<P>`.
 */
interface PathMap<T> extends Map<string, any> {
  get<P extends AllObjectPaths<T>>(key: P): PathToObject<P>
}
/**
 * Creates a union of all possible [path, value] tuples for an object T.
 * e.g., ['a.b', { a: 'b' }] | ['a.c', { a: 'c' }]
 */
type PathEntries<T> = {
  [P in AllObjectPaths<T>]: [P, PathToObject<P>]
}[AllObjectPaths<T>]
