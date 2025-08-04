/**
 * Describes assets needed for the moves available
 */
export const moveInfo = {
  BUBBLE: {},
  EMBER: {
    sfx: 'Ember',
  },
  GROWL: {
    pan: -1,
  },
  SCRATCH: {
    sfx: 'Scratch',
    pan: 1,
  },
  TACKLE: {
    sfx: 'Tackle',
    pan: 1,
  },
  'TAIL WHIP': {
    sfx: 'TailWhip',
    pan: -1,
  },
  'VINE WHIP': {
    sfx: 'VineWhip',
    pan: 1,
  },
} as {
  [move: string]: {
    /**
     * specify that NO sfx should be played
     */
    noSfx?: boolean
    /**
     * The pokemon using the attack. -1 is the current pokemon, +1 is the opponent pokemon
     */
    pan?: number
    /**
     * The name of the sound effect. If undefined, use cry
     */
    sfx?: string
    /**
     * Specify a shader file name to load for the move
     */
    shaders?: string[]
    /**
     * Special text to display
     */
    text?: string
  }
}
