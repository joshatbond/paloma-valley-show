import { setup } from 'xstate'

export const machine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },
  actions: {},
  guards: {
    showReady: ({ context }) => context.assetsLoaded,
    isPhase0: ({ context }) => context.currentPhase >= 0,
    isPhase1: ({ context }) => context.currentPhase >= 1,
    isPhase2: ({ context }) => context.currentPhase === 2,
    isPollActive: ({ context: { pollStarted, pollDuration } }) =>
      pollStarted && Date.now() < pollStarted + pollDuration ? true : false,
    isPollConcluded: ({ context: { pollStarted, pollDuration } }) =>
      pollStarted && Date.now() >= pollStarted + pollDuration ? true : false,
  },
}).createMachine({
  id: 'pokeBand',
  states: {
    beforeShow: {
      on: {
        next: { target: 'phase0' },
      },
    },
    phase0: {
      states: {
        loadingAssets: {
          on: {
            next: [
              { target: 'idle', guard: 'showReady' },
              { target: 'loadingAssets' },
            ],
          },
        },
        idle: {
          on: {
            next: { target: 'introduction' },
          },
        },
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
            screen3: {
              on: {
                next: { target: 'screen4' },
              },
            },
            screen4: {},
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
      initial: 'loadingAssets',
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
              { target: 'introduction' },
            ],
          },
        },
        starter1: {
          states: {
            introduction: {
              on: {
                next: { target: 'description' },
                navRight: { target: '#pokeBand.phase1.starter2' },
              },
            },
            description: {
              on: { next: { target: 'confirmChoice' } },
            },
            confirmChoice: {
              on: { back: { target: 'introduction' } },
            },
          },
          initial: 'introduction',
          on: { next: { target: 'poll' } },
        },
        starter2: {
          states: {
            introduction: {
              on: {
                next: { target: 'description' },
                navLeft: { target: '#pokeBand.phase1.starter1' },
                navRight: { target: '#pokeBand.phase1.starter3' },
              },
            },
            description: {
              on: { next: { target: 'confirmChoice' } },
            },
            confirmChoice: {
              on: { back: { target: 'introduction' } },
            },
          },
          initial: 'introduction',
          on: { next: { target: 'poll' } },
        },
        starter3: {
          states: {
            introduction: {
              on: {
                next: { target: 'description' },
                navLeft: { target: '#pokeBand.phase1.starter2' },
              },
            },
            description: {
              on: { next: { target: 'confirmChoice' } },
            },
            confirmChoice: {
              on: { back: { target: 'introduction' } },
            },
          },
          initial: 'introduction',
          on: { next: { target: 'poll' } },
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
          on: { next: { target: 'rivalSelect' } },
        },
        rivalSelect: {},
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
  initial: 'beforeShow',
  context: {
    assetsLoaded: false,
    currentPhase: -1,
    pollDuration: 60e3,
    pollStarted: null,
  },
})

type Context = {
  /**
   * Indicates whether all assets required for the show have been loaded
   */
  assetsLoaded: boolean
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
type Events = {
  type: 'back' | 'navLeft' | 'navRight' | 'next'
}
