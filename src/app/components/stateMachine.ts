import { assign, setup } from 'xstate'
export const pollDuration = 132e3 // 2 minutes, 12 seconds
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
  },
  guards: {
    isPhase1: ({ context }) => context.currentPhase >= 1,
    isPhase2: ({ context }) => context.currentPhase === 2,
    isPollActive: ({ context: { pollStarted, pollDuration } }) => {
      const endTime = pollStarted! + pollDuration
      return Date.now() < endTime ? true : false
    },
    isPollConcluded: ({ context: { pollStarted, pollDuration } }) => {
      const endTime = pollStarted! + pollDuration - 2e3
      return Date.now() > endTime ? true : false
    },
  },
}).createMachine({
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
              },
            },
            screen2: {
              on: {
                next: { target: 'screen3' },
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
            screen3: {
              on: {
                next: { target: 'screen4' },
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
            screen4: {
              on: {
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
          },
          initial: 'screen1',
          on: {
            next: [
              { target: 'readyPhase1', guard: 'isPhase1' },
              { target: 'waitingPhase1' },
            ],
            updatePhase: { actions: 'phaseUpdate' },
          },
        },
        readyPhase1: {
          on: {
            updatePhase: { actions: 'phaseUpdate' },
          },
        },
        waitingPhase1: {
          on: {
            next: [
              { target: 'readyPhase1', guard: 'isPhase1' },
              { target: 'waitingPhase1' },
            ],
            updatePhase: { actions: 'phaseUpdate', target: 'readyPhase1' },
          },
        },
      },
      initial: 'introduction',
      on: {
        next: { target: 'phase1' },
        updatePhase: { actions: 'phaseUpdate' },
      },
    },
    phase1: {
      states: {
        introduction: {
          states: {
            screen1: {
              on: {
                next: { target: 'screen2' },
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
            screen2: {
              on: {
                next: { target: 'screen3' },
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
            screen3: {
              on: {
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
          },
          initial: 'screen1',
          on: {
            next: [
              { target: 'starter1', guard: 'isPollActive' },
              { target: 'pollClosed', guard: 'isPollConcluded' },
              { target: '#pokeBand.phase1.introduction.screen3' },
            ],
            updatePhase: { actions: 'phaseUpdate' },
          },
        },
        starter1: {
          states: {
            introduction: {
              on: {
                next: { target: 'description' },
                navRight: { target: '#pokeBand.phase1.starter2' },
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
            description: {
              on: {
                next: { target: 'confirmChoice' },
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
            confirmChoice: {
              on: {
                back: { target: 'introduction' },
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
          },
          initial: 'introduction',
          on: {
            next: { target: 'poll' },
            updatePhase: { actions: 'phaseUpdate' },
          },
        },
        starter2: {
          states: {
            introduction: {
              on: {
                next: { target: 'description' },
                navLeft: { target: '#pokeBand.phase1.starter1' },
                navRight: { target: '#pokeBand.phase1.starter3' },
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
            description: {
              on: {
                next: { target: 'confirmChoice' },
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
            confirmChoice: {
              on: {
                back: { target: 'introduction' },
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
          },
          initial: 'introduction',
          on: {
            next: { target: 'poll' },
            updatePhase: { actions: 'phaseUpdate' },
          },
        },
        starter3: {
          states: {
            introduction: {
              on: {
                next: { target: 'description' },
                navLeft: { target: '#pokeBand.phase1.starter2' },
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
            description: {
              on: {
                next: { target: 'confirmChoice' },
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
            confirmChoice: {
              on: {
                back: { target: 'introduction' },
                updatePhase: { actions: 'phaseUpdate' },
              },
            },
          },
          initial: 'introduction',
          on: {
            next: { target: 'poll' },
            updatePhase: { actions: 'phaseUpdate' },
          },
        },
        poll: {
          on: {
            next: [
              { target: 'pollClosed', guard: 'isPollConcluded' },
              { target: 'poll' },
            ],
            updatePhase: { actions: 'phaseUpdate' },
          },
        },
        pollClosed: {
          on: {
            next: { target: 'rivalSelect' },
            updatePhase: { actions: 'phaseUpdate' },
          },
        },
        rivalSelect: {
          on: {
            updatePhase: { actions: 'phaseUpdate' },
          },
        },
      },
      initial: 'introduction',
      on: {
        next: [
          { target: 'phase2', guard: 'isPhase2' },
          { target: '#pokeBand.phase1.rivalSelect' },
        ],
        updatePhase: { actions: 'phaseUpdate' },
      },
    },
    phase2: {
      states: {
        playVideo: {
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
      initial: 'playVideo',
    },
  },
  initial: 'phase0',
  context: {
    currentPhase: 0,
    pollDuration,
    pollStarted: null,
  },
})

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
