import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const get = query({
  args: {},
  handler: async (ctx) => (await ctx.db.query('appState').collect())[0],
})

export const setActiveState = mutation({
  args: { id: v.id('appState'), state: v.boolean() },
  handler: async (ctx, args) =>
    await ctx.db.patch(args.id, { showIsActive: args.state }),
})
