import request from 'supertest'
import { client, connectDB } from '../configs/dbConnection'
import {
  createUser,
  deleteUser,
} from '../services/user.service' // Make sure loginUser is implemented
import createServer from '../utils/server/server'

const app = createServer()

const testUser = {
  username: 'testUser',
  password: 'testpassword',
}

describe('Profile management', () => {
  let user: any
  let tokens = { accessToken: '', csrfToken: '' }
  beforeAll(async () => {
    await connectDB()
    user = await createUser(
      testUser.username,
      testUser.password,
    )

    // Simulate login to obtain tokens
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: testUser.username,
        password: testUser.password,
        fingerprint: 'fingerprint',
      })

    tokens.accessToken = loginResponse.body.accessToken
    tokens.csrfToken = loginResponse.body.csrfToken
  })

  afterAll(async () => {
    // Cleanup any potential leftover data and close the database connection
    await deleteUser(testUser.username)
    await client.end()
  })

  describe('POST /api/profile-management', () => {
    const userProfile = {
      firstName: 'Test',
      lastName: 'User',
      address1: '123 Test St',
      address2: '',
      city: 'Testville',
      state: 'CA',
      zipcode: '12345',
    }

    test('Valid profile creation', async () => {
      const cookie = `accessToken=${tokens.accessToken}; csrfToken=${tokens.csrfToken}`

      const response = await request(app)
        .post('/api/profile-management')
        .set('Cookie', cookie)
        .send(userProfile)

      expect(response.statusCode).toBe(200)
      expect(response.body.message).toBe('profile saved')
      expect(response.body.firstName).toBe(
        userProfile.firstName.toLowerCase(),
      )
      expect(response.body.lastName).toBe(
        userProfile.lastName.toLowerCase(),
      )
      expect(response.body.state).toBe(userProfile.state)
    })

    test('Profile creation with missing fields', async () => {
      const cookie = `accessToken=${tokens.accessToken}; csrfToken=${tokens.csrfToken}`
      const response = await request(app)
        .post('/api/profile-management')
        .set('Cookie', cookie)
        .send({})
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe(
        'Some fields are missing.',
      )
    })

    test('Profile update with existing user', async () => {
      const cookie = `accessToken=${tokens.accessToken}; csrfToken=${tokens.csrfToken}`
      const modifiedProfile = {
        ...userProfile,
        city: 'New Testville',
      }
      const response = await request(app)
        .post('/api/profile-management')
        .set('Cookie', cookie)
        .send(modifiedProfile)
      expect(response.statusCode).toBe(200)
      expect(response.body.city).toBe('New Testville')
      expect(response.body.message).toBe('profile saved')
    })
  })

  describe('GET /api/profile-loading', () => {
    const cookie = `accessToken=${tokens.accessToken}; csrfToken=${tokens.csrfToken}`
    test('Load existing profile', async () => {
      const response = await request(app)
        .get('/api/profile-loading')
        .set('Cookie', cookie)
      expect(response.statusCode).toBe(404)
    })

    test('Attempt to load profile with nonexistent user_id', async () => {
      const cookie = `accessToken=${tokens.accessToken}; csrfToken=${tokens.csrfToken}`
      const response = await request(app)
        .get('/api/profile-loading')
        .set('Cookie', cookie)
        .send({ user_id: 'nonexistentUserId' })
      expect(response.statusCode).toBe(404)
      expect(response.body.message).toBe(
        'Profile not found',
      )
    })
  })
})
