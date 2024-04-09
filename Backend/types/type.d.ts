import z from 'zod'

const User = z.object({
  username: z.string(),
  password: z.string(),
})

export type User = z.infer<typeof User>
