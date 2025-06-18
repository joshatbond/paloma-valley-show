import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  appState: defineTable({
    showIsActive: v.boolean(),
  }),
})
