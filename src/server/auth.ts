import { createServerFn } from '@tanstack/start'
import { z } from 'zod'

const authRecord = z.object({
  username: z.string(),
  password: z.string(),
})

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME as string

export const adminAuth = createServerFn()
  .validator((input: unknown) => {
    const auth = authRecord.safeParse(input)

    if (auth.error) throw new Error(auth.error.message)

    return auth.data
  })
  .handler(async ({ data }) => {
    console.log(ADMIN_PASSWORD, ADMIN_USERNAME, data)
    return data.password === ADMIN_PASSWORD && data.username === ADMIN_USERNAME
  })
