import { assign, setup } from 'xstate'

import { pollDuration } from '~/server/convex/data'

export const machine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },
  actions: {
    phaseUpdate: assign(({ context, event }) => {
      if (event.type !== 'updatePhase') return context

      const nextPhase = event.phase ? event.phase : context.currentPhase + 1
      return {
        currentPhase: nextPhase,
        pollStarted: event.startTime
          ? event.startTime
          : nextPhase === 1
            ? Date.now()
            : context.pollStarted,
      }
    }),
    endPoll: assign(({ context, event }) => {
      if (event.type !== 'pollEnded') return context

      return {
        ...context,
        pollEnded: event.endTime,
      }
    }),
    logDevJump: ({ event }) => {
      if (event.type === 'DEV_JUMP_TO_STATE') {
        console.log(`DEV MODE: Jumping to state: "${event.path}"`)
      }
    },
  },
  guards: {
    isPhase1: ({ context }) => context.currentPhase >= 1,
    isPhase2: ({ context }) => context.currentPhase === 2,
    isPollActive: ({ context: { pollEnded, pollStarted, pollDuration } }) => {
      const endTime = pollEnded ? pollEnded : pollStarted! + pollDuration
      return Date.now() < endTime ? true : false
    },
    isPollConcluded: ({
      context: { pollEnded, pollStarted, pollDuration },
    }) => {
      const endTime = pollEnded ? pollEnded : pollStarted! + pollDuration - 2e3
      return Date.now() > endTime ? true : false
    },
    isTargetingState: ({ event }, params: { path: string }) => {
      if (event.type !== 'DEV_JUMP_TO_STATE') return false
      return event.path === params.path
    },
  },
}).createMachine(
  (() => {
    return devMode({
      id: 'pokeBand',
      states: {
        phase0: {
          states: {
            introduction: {
              states: {
                screen1: {
                  on: {
                    next: { target: 'screen2' },
                    updatePhase: { actions: 'phaseUpdate' },
                    pollEnded: { actions: 'endPoll' },
                  },
                },
                screen2: {
                  on: {
                    next: { target: 'screen3' },
                    updatePhase: { actions: 'phaseUpdate' },
                    pollEnded: { actions: 'endPoll' },
                  },
                },
                screen3: {
                  on: {
                    next: { target: 'screen4' },
                    updatePhase: { actions: 'phaseUpdate' },
                    pollEnded: { actions: 'endPoll' },
                  },
                },
                screen4: {
                  on: {
                    updatePhase: { actions: 'phaseUpdate' },
                    pollEnded: { actions: 'endPoll' },
                  },
                },
              },
              initial: 'screen1',
              on: {
                next: [
                  { target: 'readyPhase1', guard: 'isPhase1' },
                  { target: 'waitingPhase1' },
                ],
              },
            },
            readyPhase1: {},
            waitingPhase1: {
              on: {
                next: [
                  { target: 'readyPhase1', guard: 'isPhase1' },
                  { target: 'waitingPhase1' },
                ],
              },
            },
          },
          initial: 'introduction',
          on: {
            next: { target: 'phase1' },
          },
        },
        phase1: {
          states: {
            introduction: {
              states: {
                screen1: {
                  on: {
                    next: { target: 'screen2' },
                  },
                },
                screen2: {
                  on: {
                    next: { target: 'screen3' },
                  },
                },
                screen3: {},
              },
              initial: 'screen1',
              on: {
                next: [
                  { target: 'starter1', guard: 'isPollActive' },
                  { target: 'pollClosed', guard: 'isPollConcluded' },
                  { target: '#pokeBand.phase1.introduction.screen3' },
                ],
              },
            },
            starter1: {
              states: {
                introduction: {
                  on: {
                    next: [
                      { target: 'description', guard: 'isPollActive' },
                      { target: '#pokeBand.phase1.pollClosed' },
                    ],
                    navRight: { target: '#pokeBand.phase1.starter2' },
                    navLeft: { target: '#pokeBand.phase1.starter3' },
                  },
                },
                description: {
                  on: {
                    next: [
                      { target: 'confirmChoice', guard: 'isPollActive' },
                      { target: '#pokeBand.phase1.pollClosed' },
                    ],
                    updatePhase: { actions: 'phaseUpdate' },
                    pollEnded: { actions: 'endPoll' },
                  },
                },
                confirmChoice: {
                  on: {
                    back: { target: 'introduction' },
                    updatePhase: { actions: 'phaseUpdate' },
                    pollEnded: { actions: 'endPoll' },
                  },
                },
              },
              initial: 'introduction',
              on: {
                next: [
                  { target: 'poll', guard: 'isPollActive' },
                  { target: '#pokeBand.phase1.pollClosed' },
                ],
              },
            },
            starter2: {
              states: {
                introduction: {
                  on: {
                    next: [
                      { target: 'description', guard: 'isPollActive' },
                      { target: '#pokeBand.phase1.pollClosed' },
                    ],
                    navLeft: { target: '#pokeBand.phase1.starter1' },
                    navRight: { target: '#pokeBand.phase1.starter3' },
                  },
                },
                description: {
                  on: {
                    next: [
                      { target: 'confirmChoice', guard: 'isPollActive' },
                      { target: '#pokeBand.phase1.pollClosed' },
                    ],
                  },
                },
                confirmChoice: {
                  on: {
                    back: { target: 'introduction' },
                  },
                },
              },
              initial: 'introduction',
              on: {
                next: [
                  { target: 'poll', guard: 'isPollActive' },
                  { target: '#pokeBand.phase1.pollClosed' },
                ],
              },
            },
            starter3: {
              states: {
                introduction: {
                  on: {
                    next: [
                      { target: 'description', guard: 'isPollActive' },
                      { target: '#pokeBand.phase1.pollClosed' },
                    ],
                    navLeft: { target: '#pokeBand.phase1.starter2' },
                    navRight: { target: '#pokeBand.phase1.starter1' },
                  },
                },
                description: {
                  on: {
                    next: [
                      { target: 'confirmChoice', guard: 'isPollActive' },
                      { target: '#pokeBand.phase1.pollClosed' },
                    ],
                  },
                },
                confirmChoice: {
                  on: {
                    back: { target: 'introduction' },
                  },
                },
              },
              initial: 'introduction',
              on: {
                next: [
                  { target: 'poll', guard: 'isPollActive' },
                  { target: '#pokeBand.phase1.pollClosed' },
                ],
              },
            },
            poll: {
              on: {
                next: [
                  { target: 'pollClosed', guard: 'isPollConcluded' },
                  { target: 'poll' },
                ],
              },
            },
            pollClosed: {
              on: {
                next: { target: 'rivalIntro' },
              },
            },
            rivalIntro: {
              on: { next: { target: 'rivalSelect' } },
            },
            rivalSelect: {
              on: {},
            },
          },
          initial: 'introduction',
          on: {
            next: [
              { target: 'phase2', guard: 'isPhase2' },
              { target: '#pokeBand.phase1.rivalSelect' },
            ],
          },
        },
        phase2: {
          states: {
            battle: {
              on: { next: { target: 'epilogue' } },
            },
            epilogue: {
              states: {
                screen1: { on: { next: { target: 'screen2' } } },
                screen2: { on: { next: { target: 'screen3' } } },
                screen3: { on: { next: { target: 'screen4' } } },
                screen4: { on: { next: { target: 'screen5' } } },
                screen5: { on: { next: { target: 'screen6' } } },
                screen6: { on: { next: { target: 'screen7' } } },
                screen7: {},
              },
              initial: 'screen1',
            },
          },
          initial: 'battle',
        },
      },
      initial: 'phase0',
      on: {
        updatePhase: { actions: 'phaseUpdate' },
        pollEnded: { actions: 'endPoll' },
      },
      context: {
        currentPhase: 0,
        pollDuration,
        pollStarted: null,
        pollEnded: null,
      },
    })
  })()
)

function devMode<T extends Record<string, unknown>>(obj: T) {
  if (import.meta.env.DEV) return obj
  if (!('states' in obj)) return obj

  const allPaths = getAllPaths(obj.states as T)

  return {
    ...obj,
    on: {
      DEV_JUMP_TO_STATE: allPaths.map(path => ({
        actions: 'logDevJump',
        target: `#pokeBand.${path}`,
        guard: { type: 'isTargetingState', params: { path } },
      })),
      ...('on' in obj && obj.on ? obj.on : {}),
    },
  }

  function getAllPaths(states: T, parentPath = ''): string[] {
    if (!states) return []

    return (Object.keys(states) as Array<keyof T>).flatMap(key => {
      const stateConfigNode = states[key]
      const currentPath = parentPath
        ? `${parentPath}.${String(key)}`
        : String(key)
      const childStates = (
        typeof stateConfigNode === 'object' &&
        stateConfigNode &&
        'states' in stateConfigNode &&
        stateConfigNode.states &&
        typeof stateConfigNode.states === 'object'
          ? stateConfigNode.states
          : {}
      ) as T

      const childPaths = getAllPaths(childStates, currentPath)

      return [currentPath, ...childPaths]
    })
  }
}

type Context = {
  /**
   * Current phase of the show
   */
  currentPhase: number
  /**
   * A timestamp indicating when the poll started, defaults to null before the poll starts
   */
  pollStarted: number | null
  /**
   * A timestamp indicating when the poll ended, should only be set if admin overrides poll state
   */
  pollEnded: number | null
  /**
   * How long the poll should last in milliseconds
   */
  pollDuration: number
}
type Events =
  | {
      type: 'back'
    }
  | {
      type: 'navLeft'
    }
  | {
      type: 'navRight'
    }
  | { type: 'next' }
  | { type: 'updatePhase'; phase?: number; startTime?: number | null }
  | { type: 'pollEnded'; endTime: number | null }
  | { type: 'DEV_JUMP_TO_STATE'; path: string }
