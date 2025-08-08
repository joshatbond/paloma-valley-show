import { v } from 'convex/values'

import { api } from './_generated/api'
import { mutation, query } from './_generated/server'
import { pollDuration } from './data'
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
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      showId: args.state,
      currentPhase: args.state ? 0 : -1,
      pollStarted: null,
    })

    const now = new Date()
    const endOfDay = new Date(now)
    endOfDay.setDate(now.getDate() + 1)
    endOfDay.setHours(0, 0, 0, 0)
    await ctx.scheduler.runAt(endOfDay, api.appState.setActiveState, {
      id: args.id,
      state: null,
    })
  },
})
export const updatePhaseState = mutation({
  args: { id: v.id('appState'), state: v.number(), showId: v.number() },
  handler: async (ctx, args) => {
    const defaultArgs = {
      currentPhase: -1,
      pollStarted: null,
      pollChoice: undefined,
    } as const

    if (args.state < 0) {
      await ctx.db.patch(args.id, { ...defaultArgs, showId: null })
    }
    if (args.state === 0) {
      await ctx.db.patch(args.id, { ...defaultArgs, currentPhase: 0 })
    }
    if (args.state === 1) {
      await ctx.db.patch(args.id, {
        ...defaultArgs,
        currentPhase: 1,
        pollStarted: Date.now(),
      })
      ctx.scheduler.runAfter(pollDuration, api.appState.assignPollStarter, {
        id: args.id,
        showId: args.showId,
      })
    }
    if (args.state === 2) {
      await ctx.db.patch(args.id, {
        currentPhase: 2,
        pollEnded: Date.now(),
      })
    }
  },
})
export const assignPollStarter = mutation({
  args: { id: v.id('appState'), showId: v.number() },
  handler: async (ctx, args) => {
    const pollResults = await ctx.db
      .query('poll')
      .withIndex('by_show', q => q.eq('showId', args.showId))
      .collect()

    const groupSelection = pollResults.reduce<{
      one: number
      two: number
      three: number
      largest: 'one' | 'two' | 'three' | null
    }>(
      (a, v) => {
        a[v.selection] = a[v.selection] + 1
        a.largest =
          a.largest === null || a[v.selection] > a[a.largest]
            ? v.selection
            : a.largest

        return a
      },
      { one: 0, two: 0, three: 0, largest: null }
    ).largest

    await ctx.db.patch(args.id, {
      pollChoice: groupSelection ?? 'one',
    })
  },
})
export const selectStarter = mutation({
  args: { selection: dbSelection, showId: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.insert('poll', args)
  },
})
