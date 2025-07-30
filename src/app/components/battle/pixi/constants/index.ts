export const screen = { width: 160, height: 144 }

export const PLAYER_SPRITE_X = 12
export const PLAYER_SPRITE_Y = 40

export const OPPONENT_SPRITE_X = 96
export const OPPONENT_SPRITE_Y = 0
export const OPPONENT_SPRITE_WIDTH = 56
export const OPPONENT_SPRITE_HEIGHT = 56
export const OPPONENT_STATS_X = 8

export const SFX = [
  'pressab',
  'psn',
  'ballpoof',
  'hit',
  'hitresisted',
  'hitsupereffective',
  'faint',
] as const
export const SHADERS = ['oppAppear', 'plyAppear', 'faint'] as const
