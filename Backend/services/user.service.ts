import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { db } from '../configs/dbConnection'
import { users } from '../schemas/schema'
import {
  UserDbReturn,
  UserLookUpData,
  insertUserSchema,
  userLookUpSchema,
} from '../types/type'

// Insert the user into the database
export const createUser = async (
  username: string,
  password: string,
): Promise<UserDbReturn> => {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)
  const result = insertUserSchema.safeParse({
    username,
    password: hashedPassword,
  })

  // Check if the request is valid
  if (!result.success) throw new Error('Bad request.')

  // Insert the user into the database
  const newUser: UserDbReturn = await db
    .insert(result.data)
    .values({
      ...result.data,
    })
    .returning()
  console.log('Newly Created User:\n', newUser)

  return newUser
}

// Get the user from the database
export const getUser = async (
  data: UserLookUpData,
): Promise<UserDbReturn | null> => {
  const result = userLookUpSchema.safeParse(data)

  // Check if the request is valid
  if (!result.success) throw new Error('Bad request.')

  const { username, password } = result.data

  const queryResult = await db
    .select()
    .from(users)
    .where(eq(users.username, username))

  let foundUser: UserDbReturn | null =
    queryResult.length > 0 ? queryResult[0] : null
  console.log('Found User:\n', foundUser)

  if (
    !foundUser ||
    !bcrypt.compare(password, foundUser.password)
  ) {
    return null
  }

  return foundUser
}
