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
    endPoll: assign(({ context, event }) => {
      if (event.type !== 'pollEnded') return context

      return {
        ...context,
        pollEnded: event.endTime,
      }
    }),
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
            updatePhase: { actions: 'phaseUpdate' },
            pollEnded: { actions: 'endPoll' },
          },
        },
        readyPhase1: {
          on: {
            updatePhase: { actions: 'phaseUpdate' },
            pollEnded: { actions: 'endPoll' },
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
        pollEnded: { actions: 'endPoll' },
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
                updatePhase: { actions: 'phaseUpdate' },
                pollEnded: { actions: 'endPoll' },
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
            pollEnded: { actions: 'endPoll' },
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
                updatePhase: { actions: 'phaseUpdate' },
                pollEnded: { actions: 'endPoll' },
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
            updatePhase: { actions: 'phaseUpdate' },
            pollEnded: { actions: 'endPoll' },
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
                updatePhase: { actions: 'phaseUpdate' },
                pollEnded: { actions: 'endPoll' },
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
            updatePhase: { actions: 'phaseUpdate' },
            pollEnded: { actions: 'endPoll' },
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
                updatePhase: { actions: 'phaseUpdate' },
                pollEnded: { actions: 'endPoll' },
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
            updatePhase: { actions: 'phaseUpdate' },
            pollEnded: { actions: 'endPoll' },
          },
        },
        poll: {
          on: {
            next: [
              { target: 'pollClosed', guard: 'isPollConcluded' },
              { target: 'poll' },
            ],
            updatePhase: { actions: 'phaseUpdate' },
            pollEnded: { actions: 'endPoll' },
          },
        },
        pollClosed: {
          on: {
            next: { target: 'rivalSelect' },
            updatePhase: { actions: 'phaseUpdate' },
            pollEnded: { actions: 'endPoll' },
          },
        },
        rivalSelect: {
          on: {
            updatePhase: { actions: 'phaseUpdate' },
            pollEnded: { actions: 'endPoll' },
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
        pollEnded: { actions: 'endPoll' },
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
    pollEnded: null,
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
  | { type: 'pollEnded'; endTime: number }
