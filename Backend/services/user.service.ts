import bcrypt from 'bcrypt'
import { and, eq } from 'drizzle-orm'
import { db } from '../configs/dbConnection'
import { insertUserSchema, users } from '../schemas/schema'
import { User } from '../types/type'

// Insert the user into the database
export const createUser = async (
  username: string,
  password: string,
) => {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)
  const result = insertUserSchema.safeParse({
    username,
    password: hashedPassword,
  })

  // Check if the request is valid
  if (!result.success) throw new Error('Bad request.')

  // Insert the user into the database
  const newUser = await db
    .insert(result.data)
    .values({
      ...result.data,
    })
    .returning()
  console.log('Newly Created User:\n', newUser)

  return newUser
}

// Get the user from the database
export const getUser = async (user: User) => {
  const result = User.safeParse(user)

  // Check if the request is valid
  if (!result.success) throw new Error('Bad request.')

  const { username, password } = result.data

  const foundUser = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.username, username),
        eq(users.password, await bcrypt.hash(password, 10)),
      ),
    )

  return foundUser
}
