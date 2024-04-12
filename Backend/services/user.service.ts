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
  if (!result.success || password.length == 0)
    throw new Error('Bad request.')

  // Insert the user into the database
  const queryResult = await db
    .insert(users)
    .values({
      ...result.data,
    })
    .returning()

  const newUser: UserDbReturn = queryResult[0]
  console.log('Newly Created User:\n', newUser)

  return newUser
}

// Get the user from the database
export const getUser = async (
  data: UserLookUpData,
  isLogin: boolean = true,
): Promise<UserDbReturn | null> => {
  const result = userLookUpSchema.safeParse(data)

  // Check if the request is valid
  if (!result.success) throw new Error('Bad request')

  const { username, password } = result.data

  const queryResult = await db
    .select({
      id: users.id,
      username: users.username,
      password: users.password,
    })
    .from(users)
    .where(eq(users.username, username))

  let foundUser: UserDbReturn | null =
    queryResult.length > 0 ? queryResult[0] : null
  console.log('Found User:\n', foundUser)

  if (
    isLogin &&
    foundUser &&
    password &&
    foundUser.password &&
    !(await bcrypt.compare(password, foundUser.password))
  )
    return null

  return foundUser
}

export const deleteUser = async (username: string) => {
  const result = userLookUpSchema.safeParse({ username })

  // Check if the request is valid
  if (!result.success) throw new Error('Bad request')

  // Delete the user from the database
  const queryResult = await db
    .delete(users)
    .where(eq(users.username, result.data.username))
    .returning()

  const deletedUser: UserDbReturn = queryResult[0]
  console.log('Deleted User:\n', deletedUser)
  return deletedUser
}