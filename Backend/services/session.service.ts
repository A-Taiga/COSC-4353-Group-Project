import { db } from '../configs/dbConnection'
import { sessions } from '../schemas/schema'

export const createSession = async (userId: string, fingerprint: string) => {
  const today = new Date()
  const session = await db
    .insert(sessions)
    .values({
      userId: userId,
      fingerprint: fingerprint,
      createdAt: new Date(),
      expiresAt: new Date(
        today.getFullYear() + 1,
        today.getMonth(),
        today.getDate(),
      ),
    })
    .returning()
  console.log(session[0])
  return session[0]
}
