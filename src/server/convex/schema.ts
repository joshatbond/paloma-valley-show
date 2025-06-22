import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  appState: defineTable({
    showIsActive: v.boolean(),
    currentPhase: v.number(),
    pollStarted: v.union(v.number(), v.null()),
  }),
})
