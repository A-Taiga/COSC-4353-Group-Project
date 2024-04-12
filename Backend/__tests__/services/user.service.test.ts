import bcrypt from 'bcrypt'
import {
  client,
  connectDB,
} from '../../configs/dbConnection'
import {
  createUser,
  deleteUser,
  getUser,
} from '../../services/user.service'

describe('User functions', () => {
  let testUser: { username: string; password: string }

  beforeAll(async () => {
    await connectDB()
    testUser = {
      username: 'testuser',
      password: 'testpassword',
    }
  })

  afterAll(async () => {
    // Clean up the test data from the database
    await deleteUser(testUser.username)
    await client.end()
  })

  describe('createUser', () => {
    it('should create a new user and return the user object', async () => {
      const result = await createUser(
        testUser.username,
        testUser.password,
      )

      expect(result).toHaveProperty('id')
      expect(result.username).toBe(testUser.username)
      expect(
        await bcrypt.compare(
          testUser.password,
          result.password!,
        ),
      ).toBe(true)
    })

    it('should throw an error for invalid input', async () => {
      const username = ''
      const password = ''

      try {
        await createUser(username, password)
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Bad request.')
      }
    })
  })

  describe('getUser', () => {
    it('should return the user object for a valid user', async () => {
      const result = await getUser({
        username: testUser.username,
        password: testUser.password,
      })

      expect(result).toHaveProperty('id')
      expect(result?.username).toBe(testUser.username)
      expect(
        await bcrypt.compare(
          testUser.password,
          result?.password ?? '',
        ),
      ).toBe(true)
    })

    it('should return null for an invalid password', async () => {
      const result = await getUser({
        username: testUser.username,
        password: 'wrongpassword',
      })

      expect(result).toBeNull()
    })

    it('should throw an error for invalid input', async () => {
      const username = ''
      const password = ''

      await expect(
        getUser({ username, password }),
      ).rejects.toThrow('Bad request')
    })
  })

  describe('deleteUser', () => {
    it('should delete the user and return the deleted user object', async () => {
      const result = await deleteUser(testUser.username)

      expect(result).toHaveProperty('id')
      expect(result.username).toBe(testUser.username)
    })

    it('should throw an error for invalid input', async () => {
      const username = ''

      let result: any
      try {
        result = await deleteUser(username)
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Bad request.')
        expect(result).toBeUndefined()
      }
    })
  })
})
