import { State } from '~/app/hooks/useGameMachine'

const lines = {
  phase0: {
    screen1: {
      line1: 'Hello there!',
      line2: 'Welcome to the world of Pokémon!',
    },
    screen2: {
      line1: 'My name is Oak-',
      line2: 'people call me the Pokémon Professor',
    },
    screen3: {
      line1: "Today, you're not just here",
      line2: 'to watch a show...',
    },
    screen4: {
      line1: "You're here to begin your",
      line2: 'very own journey!',
    },
    waiting: {
      line1: 'Sit tight, the show will start soon!',
    },
    ready: {
      line1: 'The show is ready to begin!',
      line2: 'Press A to continue...',
    },
  },
  phase1: {
    intro1: {
      line1: 'Every great Trainer needs a partner.',
    },
    intro2: {
      line1: 'So before we begin, I have an',
      line2: 'important question for you:',
    },
    intro3: {
      line1: 'Which Pokémon will you choose?',
    },
    s1: {
      intro: 'Press LEFT or RIGHT to choose your companion',
      desc: {
        line1: 'I see! Bulbasaur is your choice.',
        line2: "It's very easy to raise.",
      },
      confirm: 'So, you want to go with the GRASS POKéMON BULBASAUR?',
    },
    s2: {
      intro: 'Press LEFT or RIGHT to choose your companion',
      desc: {
        line1: 'Hm! SQUIRTLE is your choice.',
        line2: "It's one worth raising.",
      },
      confirm: "So, you've decided on the WATER POKéMON SQUIRTLE?",
    },
    s3: {
      intro: 'Press LEFT or RIGHT to choose your companion',
      desc: {
        line1: 'Ah! CHARMANDER is your choice.',
        line2: 'You should raise it patiently.',
      },
      confirm: "So, you're claiming the FIRE POKéMON CHARMANDER?",
    },
    poll: {
      line1: (s: string) => `You chose ${s}! Let's see if the group agrees`,
      line2: 'Group selection in progress',
    },
    pollClosed: {
      line1: "'GARY: Alright, I'll take this one, then!",
      line2: (s: string) => `Gary received the ${s}`,
    },
    rivalSelect: {
      line1: "GARY: Let's check out our Pokémon!",
      line2: "Come on, I'll take you on!",
    },
  },
  phase2: {
    epilogue1: {
      line1: 'Well done, Trainer!',
      line2: "You've chosen your first Pokémon, ...",
    },
    epilogue2: {
      line1: 'faced your very first battle,',
      line2: 'and taken your first steps into...',
    },
    epilogue3: {
      line1: 'a much larger workd. The road',
      line2: 'ahead is filled with challenges...',
    },
    epilogue4: {
      line1: 'friendships, and discoveries',
      line2: 'beyond your imagination. But...',
    },
    epilogue5: {
      line1: 'I can already tell--',
      line2: "you've got what it takes.",
    },
    epilogue6: {
      line1: 'Now go on...',
      line2: 'your adventure is just beginning!',
    },
    epilogue7: {
      line1: 'Press A to view',
      line2: "our show's program",
    },
  },
}

export function getLines(state: State) {
  switch (state) {
    case 'phase0.introduction.screen1':
      return lines.phase0.screen1
    case 'phase0.introduction.screen2':
      return lines.phase0.screen2
    case 'phase0.introduction.screen3':
      return lines.phase0.screen3
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
      return lines.phase1.s1.intro
    case 'phase1.starter1.description':
      return lines.phase1.s1.desc
    case 'phase1.starter1.confirmChoice':
      return lines.phase1.s1.confirm

    case 'phase1.starter2.introduction':
      return lines.phase1.s2.intro
    case 'phase1.starter2.description':
      return lines.phase1.s2.desc
    case 'phase1.starter2.confirmChoice':
      return lines.phase1.s2.confirm

    case 'phase1.starter3.introduction':
      return lines.phase1.s3.intro
    case 'phase1.starter3.description':
      return lines.phase1.s3.desc
    case 'phase1.starter3.confirmChoice':
      return lines.phase1.s3.confirm

    case 'phase1.poll':
      return lines.phase1.poll
    case 'phase1.pollClosed':
      return lines.phase1.pollClosed
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
      return { line1: 'Uh oh! Please reload your browser' }
  }
}
