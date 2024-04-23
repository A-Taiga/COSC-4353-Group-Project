import {
  client,
  connectDB,
} from '../../configs/dbConnection'
import {
  createSession,
  deleteSession,
  getSession,
} from '../../services/session.service'

describe('Session functions', () => {
  const userId = 'testUserId' // Assume this is valid and exists in your DB
  const fingerprint = 'testDeviceFingerprint'
  let sessionId: any

  beforeAll(async () => {
    await connectDB() // Ensure the DB connection is ready
  })

  afterAll(async () => {
    // Clean up the test data from the database
    if (sessionId) {
      await deleteSession(sessionId)
    }
    await client.end()
  })

  describe('createSession', () => {
    it('should create a new session and return it', async () => {
      const session = await createSession(
        userId,
        fingerprint,
      )
      sessionId = session.id // Store session ID for cleanup

      expect(session).toHaveProperty('id')
      expect(session.userId).toBe(userId)
      expect(session.fingerprint).toBe(fingerprint)
    })
  })

  describe('getSession', () => {
    it('should return the session object for a valid session', async () => {
      // Ensure there's a session to get
      const session = await createSession(
        userId,
        fingerprint,
      )
      sessionId = session.id // Update sessionId for cleanup

      const fetchedSession = await getSession(
        userId,
        fingerprint,
      )
      expect(fetchedSession).toHaveProperty('id')
      expect(fetchedSession?.id).toBe(session.id)
    })

    it('should return null when no session exists for given criteria', async () => {
      const result = await getSession(
        'nonexistentUserId',
        'nonexistentFingerprint',
      )
      expect(result).toBeNull()
    })
  })

  describe('deleteSession', () => {
    it('should delete a session and confirm deletion', async () => {
      // Create a session to delete
      const session = await createSession(
        userId,
        fingerprint,
      )
      const deleteResult = await deleteSession(session.id)

      // Attempt to fetch the deleted session
      const result = await getSession(userId, fingerprint)
      expect(result).toBeNull()
      expect(deleteResult).toHaveProperty('id') // Ensure the response contains the id of deleted session
    })
  })
})
