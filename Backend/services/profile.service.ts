import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { db } from '../configs/dbConnection'
import { users, userProfiles} from '../schemas/schema'
import {
  UserDbReturn,
  UserLookUpData,
  userLookUpSchema,
  userProfileLookupData,
  userProfileSchema,
} from '../types/type'


export const findUserProfile = async (user_id: string): Promise<userProfileLookupData | null> => {
	const queryResult = await db
	.select({id: userProfiles.userId})
	.from (userProfiles)
	.where (eq(userProfiles.userId, user_id))
	let foundUser: userProfileLookupData | null = queryResult.length > 0 ? queryResult[0] : null
	console.log('Found User:\n', foundUser)
  return foundUser;
}
