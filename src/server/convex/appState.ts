import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { selection as dbSelection } from './schema'

export const get = query({
  args: {},
  handler: async ctx => (await ctx.db.query('appState').collect())[0],
})
export const pollState = query({
  args: { showId: v.number() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query('poll')
      .withIndex('by_show', q => q.eq('showId', args.showId))
      .collect()
    return results.reduce<[number, number, number]>(
      (a, v) => {
        if (v.selection === 'one') return [a[0] + 1, a[1], a[2]]
        if (v.selection === 'two') return [a[0], a[1] + 1, a[2]]
        if (v.selection === 'three') return [a[0], a[1], a[2] + 1]

        return a
      },
      [0, 0, 0]
    )
  },
})

export const setActiveState = mutation({
  args: { id: v.id('appState'), state: v.union(v.number(), v.null()) },
  handler: async (ctx, args) =>
    await ctx.db.patch(args.id, {
      showId: args.state,
      currentPhase: args.state ? 0 : -1,
      pollStarted: null,
    }),
})
export const updatePhaseState = mutation({
  args: { id: v.id('appState'), state: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(
      args.id,
      args.state < 0
        ? {
            currentPhase: -1,
            showId: null,
            pollStarted: null,
          }
        : args.state === 0
          ? {
              currentPhase: args.state,
              pollStarted: null,
              pollEnded: undefined,
            }
          : args.state === 1
            ? {
                currentPhase: args.state,
                pollStarted: Date.now(),
                pollEnded: undefined,
              }
            : {
                currentPhase: args.state,
                pollEnded: Date.now(),
              }
    )
  },
})
export const selectStarter = mutation({
  args: { selection: dbSelection, showId: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.insert('poll', args)
  },
})
