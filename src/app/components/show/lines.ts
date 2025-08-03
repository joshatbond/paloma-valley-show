import { type State } from '~/app/hooks/useGameMachine'

const lines = {
  phase0: {
    screen1: ['Hello there!', 'Welcome to the world of Pokémon!'],
    screen2: ['My name is Oak-', 'people call me the Pokémon Professor'],
    screen3: ["Today, you're not just here", 'to watch a show...'],
    screen4: ["You're here to begin your", 'very own journey!'],
    waiting: ['Sit tight, the show will start soon!', '...'],
    ready: ['The show is ready to begin!', 'Press A to continue...'],
  },
  phase1: {
    intro1: ['Every great Trainer needs a partner.', ''],
    intro2: ['So before we begin, I have an', 'important question for you:'],
    intro3: ['Which Pokémon will you choose?', ''],
    s1Intro: ['Press LEFT or RIGHT to choose your companion', ''],
    s1Descr: ['I see! Bulbasaur is your choice.', "It's very easy to raise."],
    s1Confirm: [
      'So, you want to go with the GRASS POKéMON BULBASAUR?',
      '(A): Yes | (B): No',
    ],
    s2Intro: ['Press LEFT or RIGHT to choose your companion', ''],
    s2Descr: ['Hm! SQUIRTLE is your choice.', "It's one worth raising."],
    s2Confirm: [
      "So, you've decided on the WATER POKéMON SQUIRTLE?",
      '(A): Yes | (B): No',
    ],
    s3Intro: ['Press LEFT or RIGHT to choose your companion', ''],
    s3Descr: [
      'Ah! CHARMANDER is your choice.',
      'You should raise it patiently.',
    ],
    s3Confirm: [
      "So, you're claiming the FIRE POKéMON CHARMANDER?",
      '(A): Yes | (B): No',
    ],
    poll: (s: string) =>
      [`You chose ${s}! Let's see if the group agrees`, '...'] as const,
    pollClosed: (s: string) =>
      [
        "GARY: Alright, I'll take this one, then!",
        `Gary received the ${s}`,
      ] as const,
    rivalSelect: [
      "GARY: Let's check out our Pokémon!",
      "Come on, I'll take you on!",
    ],
  },
  phase2: {
    epilogue1: ['Well done, Trainer!', "You've chosen your first Pokémon, ..."],
    epilogue2: [
      'faced your very first battle,',
      'and taken your first steps into...',
    ],
    epilogue3: [
      'a much larger world. The road',
      'ahead is filled with challenges...',
    ],
    epilogue4: [
      'friendships, and discoveries',
      'beyond your imagination. But...',
    ],
    epilogue5: ['I can already tell--', "you've got what it takes."],
    epilogue6: ['Now go on...', 'your adventure is just beginning!'],
    epilogue7: ['Press A to view', "our show's program"],
  },
} satisfies Record<
  string,
  Record<string, [string, string] | ((s: string) => [string, string])>
>

export function getLines(state: State, starter: string | null) {
  switch (state) {
    case 'phase0.introduction.screen1':
      return lines.phase0.screen1
    case 'phase0.introduction.screen2':
      return lines.phase0.screen2
    case 'phase0.introduction.screen3':
      return lines.phase0.screen3
    case 'phase0.introduction.screen4':
      return lines.phase0.screen4
    case 'phase0.waitingPhase1':
      return lines.phase0.waiting
    case 'phase0.readyPhase1':
      return lines.phase0.ready
    case 'phase1.introduction.screen1':
      return lines.phase1.intro1
    case 'phase1.introduction.screen2':
      return lines.phase1.intro2
    case 'phase1.introduction.screen3':
      return lines.phase1.intro3

    case 'phase1.starter1.introduction':
      return lines.phase1.s1Intro
    case 'phase1.starter1.description':
      return lines.phase1.s1Descr
    case 'phase1.starter1.confirmChoice':
      return lines.phase1.s1Confirm

    case 'phase1.starter2.introduction':
      return lines.phase1.s2Intro
    case 'phase1.starter2.description':
      return lines.phase1.s2Descr
    case 'phase1.starter2.confirmChoice':
      return lines.phase1.s2Confirm

    case 'phase1.starter3.introduction':
      return lines.phase1.s3Intro
    case 'phase1.starter3.description':
      return lines.phase1.s3Descr
    case 'phase1.starter3.confirmChoice':
      return lines.phase1.s3Confirm

    case 'phase1.poll':
      return lines.phase1.poll(starter ?? '')
    case 'phase1.pollClosed':
      const rivalChoices = {
        bulbasaur: 'charmander',
        squirtle: 'bulbasaur',
        charmander: 'squirtle',
      }
      if (starter === null) starter = 'bulbasaur'
      return lines.phase1.pollClosed(
        rivalChoices[starter as keyof typeof rivalChoices]
      )
    case 'phase1.rivalSelect':
      return lines.phase1.rivalSelect
    case 'phase2.epilogue.screen1':
      return lines.phase2.epilogue1
    case 'phase2.epilogue.screen2':
      return lines.phase2.epilogue2
    case 'phase2.epilogue.screen3':
      return lines.phase2.epilogue3
    case 'phase2.epilogue.screen4':
      return lines.phase2.epilogue4
    case 'phase2.epilogue.screen5':
      return lines.phase2.epilogue5
    case 'phase2.epilogue.screen6':
      return lines.phase2.epilogue6
    case 'phase2.epilogue.screen7':
      return lines.phase2.epilogue7
    default:
      return ['Uh oh! Please reload your browser', ''] as [string, string]
  }
}
