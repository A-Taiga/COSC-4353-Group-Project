import {
  createInsertSchema,
  createSelectSchema,
} from 'drizzle-zod'
import z from 'zod'
import { sessions, userProfiles, users } from '../schemas/schema'

export const userLookUpSchema = z.object({
  username: z.string().toLowerCase(),
  password: z.string().min(7).optional(),
})

export type UserLookUpData = z.infer<
  typeof userLookUpSchema
>

// DOCUMENTATION: https://orm.drizzle.team/docs/zod
// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().toLowerCase(),
  password: z
    .string()
    .min(
      60,
      'Password must be hashed to be at least 60 characters long',
    ),
})

export type UserInsertData = z.infer<
  typeof insertUserSchema
>

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(users, {
  id: z.string().optional(),
  password: z.string().optional(),
  createdAt: z.date().optional(),
})
export type UserDbReturn = z.infer<typeof selectUserSchema>

export const selectSessionSchema = createSelectSchema(
  sessions,
  {
    userId: z.string().optional(),
    fingerprint: z.string().optional(),
    createdAt: z.date().optional(),
    expiresAt: z.date().optional(),
  },
)
export type SessionDbReturn = z.infer<
  typeof selectSessionSchema
>

export const userProfileSchema = z.object ({
  firstName: z.string(),
  lastName: z.string().optional(),
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
})
export type userProfileLookupData = z.infer <typeof userProfileSchema>

export const selectUserProfileSchema = createSelectSchema(userProfiles)
