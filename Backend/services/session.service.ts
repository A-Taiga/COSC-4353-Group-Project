import { and, eq } from 'drizzle-orm'
import { db } from '../configs/dbConnection'
import { sessions } from '../schemas/schema'
import { SessionDbReturn } from '../types/type'

export const getSession = async (
  userId: string,
  fingerprint: string,
): Promise<SessionDbReturn | null> => {
  const result = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(
      and(
        eq(sessions.userId, userId),
        eq(sessions.fingerprint, fingerprint),
      ),
    )
  const existingSession: SessionDbReturn | null =
    result.length > 0 ? result[0] : null

  console.log('Existing Session:\n', existingSession)
  return existingSession
}

export const createSession = async (
  userId: string,
  fingerprint: string,
): Promise<SessionDbReturn> => {
  const today = new Date()
  const session: SessionDbReturn = await db
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
  console.log(session)
  return session
}

export const deleteSession = async (sessionId: string) => {
  const session = await db
    .delete(sessions)
    .where(eq(sessions.id, sessionId))
    .returning()

  console.log('Deleted Session:\n', session[0])
}
