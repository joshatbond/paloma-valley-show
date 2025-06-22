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
  }),
  poll: defineTable({
    showId: v.number(),
    selection,
  }).index('by_show', ['showId']),
})
