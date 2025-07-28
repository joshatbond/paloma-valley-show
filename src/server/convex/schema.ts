import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const selection = v.union(
  v.literal('one'),
  v.literal('two'),
  v.literal('three')
)

export default defineSchema({
  appState: defineTable({
    showId: v.union(v.number(), v.null()),
    currentPhase: v.number(),
    pollStarted: v.union(v.number(), v.null()),
    pollEnded: v.optional(v.number()),
    pollChoice: v.optional(selection),
  }),
  poll: defineTable({
    showId: v.number(),
    selection,
  }).index('by_show', ['showId']),
})
