import { eq } from 'drizzle-orm'
import { db } from '../configs/dbConnection'
import { userProfiles } from '../schemas/schema'
import {
  UserProfileDbReturn,
  userProfileLookupData,
  userProfileSchema,
} from '../types/type'

export const findUserProfile = async (
  user_id: string,
): Promise<UserProfileDbReturn | null> => {
  const queryResult = await db
    .select({
      firstName: userProfiles.firstName,
      lastName: userProfiles.lastName,
      address1: userProfiles.addressOne,
      address2: userProfiles.addressTwo,
      city: userProfiles.city,
      state: userProfiles.state,
      zipcode: userProfiles.zip,
    })
    .from(userProfiles)
    .where(eq(userProfiles.userId, user_id))
  let foundProfile: UserProfileDbReturn | null =
    queryResult.length > 0 ? queryResult[0] : null
  console.log('Found Profile:\n', foundProfile)
  return foundProfile
}

export const upsertUserProfile = async (
  user_id: string,
  data: userProfileLookupData,
): Promise<UserProfileDbReturn | null> => {
  const result = userProfileSchema.safeParse(data)

  // Check if the request is valid
  if (!result.success) throw new Error('Bad request.')

  const existingProfile = await findUserProfile(user_id)
  let queryResult

  if (!existingProfile || !existingProfile.firstName) {
    queryResult = await db
      .insert(userProfiles)
      .values({
        userId: user_id,
        firstName: data.firstName,
        lastName: data.lastName,
        addressOne: data.address1,
        addressTwo: data.address2,
        city: data.city,
        state: data.state,
        zip: data.zipcode,
      })
      .returning()
    console.log('Created Profile:\n', queryResult)
  } else {
    queryResult = await db
      .update(userProfiles)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        addressOne: data.address1,
        addressTwo: data.address2,
        city: data.city,
        state: data.state,
        zip: data.zipcode,
      })
      .where(eq(userProfiles.userId, user_id))
      .returning()
    console.log('Updated Profile:\n', queryResult)
  }

  let profile: UserProfileDbReturn | null =
    queryResult.length > 0 ? queryResult[0] : null

  return profile
}
