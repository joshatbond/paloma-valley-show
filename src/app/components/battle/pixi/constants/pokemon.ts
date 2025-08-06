export const pokemon = {
  '001': {
    baseAtk: 49,
    baseDef: 49,
    baseHp: 45,
    baseSpAtk: 65,
    baseSpDef: 65,
    baseSpd: 45,
    cry: '',
    front: '001_front.png',
    back: '001_back.png',
    name: 'bulbasaur',
    types: ['GRASS', 'POISON'],
    anim: { delay: [0], ref: [0] },
    opponentId: '004',
  },
  '004': {
    baseAtk: 52,
    baseDef: 43,
    baseHp: 39,
    baseSpAtk: 60,
    baseSpDef: 50,
    baseSpd: 65,
    cry: '',
    front: '004_front.png',
    back: '004_back.png',
    name: 'CHARMANDER',
    types: ['FIRE'],
    anim: { delay: [0], ref: [0] },
    opponentId: '007',
  },
  '007': {
    baseAtk: 48,
    baseDef: 65,
    baseHp: 44,
    baseSpAtk: 50,
    baseSpDef: 64,
    baseSpd: 43,
    cry: '',
    front: '007_front.png',
    back: '007_back.png',
    name: 'SQUIRTLE',
    types: ['WATER'],
    anim: { delay: [0], ref: [0] },
    opponentId: '001',
  },
} satisfies Record<
  string,
  {
    baseAtk: number
    baseDef: number
    baseHp: number
    baseSpAtk: number
    baseSpDef: number
    baseSpd: number
    cry: string
    front: string
    back: string
    name: string
    types: string[]
    anim: { delay: number[]; ref: number[] }
    opponentId: string
  }
>
