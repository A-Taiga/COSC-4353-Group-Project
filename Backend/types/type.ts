import {
  createInsertSchema,
  createSelectSchema,
} from 'drizzle-zod'
import z from 'zod'
import { sessions, users, fuelQuotes } from '../schemas/schema'

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

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const insertFuelQuoteSchema = createInsertSchema(fuelQuotes, {
  userId: z.string().regex(uuidRegex, 'Invalid UUID format for userId').optional(),
  gallonsRequested: z.string()
    .transform((str) => parseFloat(str))
    .refine((num) => !isNaN(num) && num > 0, {
      message: "Gallons requested must be a positive number",
    }),
  deliveryDate: z.date()
                .min(new Date(), 'Delivery date must be in the future'),
  deliveryAddress: z.string().min(1, 'Delivery address cannot be empty'),
  suggestedPrice: z.string().transform((str) => Number(str)),
  totalPrice: z.string().transform((str) => Number(str)),
});
