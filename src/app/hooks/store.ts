import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'

export function createStore<T>() {
  return function _internalStateFactory(stateCreator: StateCreator<T>) {
    let state = stateCreator(setState, getState)
    const listeners = new Set<(state: T, prevState: T) => void>()

    return function useStore<U>(
      selector: (state: T) => U = state => state as unknown as U,
      equalityFn: (a: U, b: U) => boolean = Object.is
    ) {
      const currentSelector = useMemoizedSelector(selector, equalityFn)

      return useSyncExternalStore(subscribe, () => currentSelector(getState()))
    }

    function getState(): T {
      return state
    }
    function setState(partial: Parameters<SetState<T>>['0'], replace = false) {
      const nextState = typeof partial === 'function' ? partial(state) : partial
      const prevState = state
      state = replace ? (nextState as T) : { ...state, ...nextState }
      listeners.forEach(listener => listener(state, prevState))
    }
    function subscribe(listener: Parameters<Subscribe<T>>['0']) {
      listeners.add(listener)
      return function () {
        listeners.delete(listener)
      }
    }
  }
}

function useMemoizedSelector<T, U>(
  selector: (state: T) => U,
  equalityFn: (a: U, b: U) => boolean
) {
  const ref = useRef({
    selector,
    equalityFn,
    memoizedSelector: (state: T) => {
      const selected = selector(state)
      ref.current.value = selected
      return selected
    },
    value: undefined as U | undefined,
  })

  useEffect(() => {
    ref.current.selector = selector
    ref.current.equalityFn = equalityFn
  }, [selector, equalityFn])

  return useCallback((state: T) => {
    const { value, memoizedSelector } = ref.current
    const nextValue = memoizedSelector(state)

    return value === undefined || !equalityFn(value, nextValue)
      ? nextValue
      : value
  }, [])
}

type StateCreator<T> = (set: SetState<T>, get: GetState<T>) => T
type SetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>),
  replace?: boolean
) => void
type GetState<T> = () => T
type Subscribe<T> = (listener: (state: T, prevState: T) => void) => () => void
type StoreApi<T> = {
  getState: GetState<T>
  setState: SetState<T>
  subscribe: Subscribe<T>
}
