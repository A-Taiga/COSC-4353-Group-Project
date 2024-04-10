import request from 'supertest'
import { client, connectDB } from '../configs/dbConnection'
import { deleteUser } from '../services/user.service'
import createServer from '../utils/server/server'

const app = createServer()

describe('user', () => {
  beforeAll(async () => {
    // Connect to the database
    await connectDB()
  })
  afterAll(async () => {
    // Disconnect from the database
    await client.end()
  })

  // User Login tests
  describe('login', () => {
    describe('/api/auth/login', () => {
      test('POST / valid data', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            username: 'group70',
            password: 'group70pass',
            fingerprint: 'fingerprint',
          })
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('csrfToken')
        expect(res.body).toHaveProperty('accessToken')
        expect(res.body).toHaveProperty('refreshToken')
        expect(res.body.message).toBeDefined()
        expect(res.body.csrfToken).toBeDefined()
        expect(res.body.accessToken).toBeDefined()
        expect(res.body.refreshToken).toBeDefined()
        expect(res.body.message).toBe(
          'Logged in successfully',
        )
      })

      test('POST / all empty fields', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            username: '',
            password: '',
            fingerprint: '',
          })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toBe('Bad Request')
      })

      test('POST / username field missing', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            username: '',
            password: 'group70pass',
            fingerprint: 'fingerprint',
          })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toBe('Bad Request')
      })

      test('POST / password field missing', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            username: 'group70',
            password: '',
            fingerprint: 'fingerprint',
          })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toBe('Bad Request')
      })

      test('POST / fingerprint field missing', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            username: 'group70',
            password: 'group70pass',
            fingerprint: '',
          })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toBe('Bad Request')
      })

      // Additional test case: valid username and fingerprint, but invalid password
      test('POST / valid username and fingerprint but invalid password', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            username: 'group70',
            password: 'wrongpass',
            fingerprint: 'fingerprint',
          })
        expect(res.statusCode).toBe(401) // Assuming 401 for unauthorized
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toBe('Unauthorized')
      })

      // Additional test case: invalid username
      test('POST / invalid username', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            username: 'nonexistentuser',
            password: 'group70pass',
            fingerprint: 'fingerprint',
          })
        expect(res.statusCode).toBe(401) // Assuming 401 for unauthorized
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toBe('Unauthorized')
      })
      test('POST / user does not exist', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            username: 'Steve',
            password: 'stevepass',
            fingerprint: 'fingerprint',
          })
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe('Unauthorized')
      })
    })
  })

  // User Registration tests
  describe('register', () => {
    afterAll(async () => {
      // Cleanup: delete all users created during tests
      await deleteUser('newUser70')
      await deleteUser('existingUser')
    })

    describe('/api/auth/register', () => {
      test('POST / valid registration', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            username: 'newUser70',
            password: 'newUserPass70',
          })
        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe(
          'New user, newuser70 registered successfully.',
        )
      })

      test('POST / password too short', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            username: 'shortPassUser',
            password: 'short',
          })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Bad Request')
      })

      test('POST / missing username or password', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            password: 'noUsername',
          })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Bad Request')

        const res2 = await request(app)
          .post('/api/auth/register')
          .send({
            username: 'noPassword',
          })
        expect(res2.statusCode).toBe(400)
        expect(res2.body).toHaveProperty('message')
        expect(res2.body.message).toBe('Bad Request')
      })

      test('POST / username already exists', async () => {
        // First, create a new user
        await request(app).post('/api/auth/register').send({
          username: 'existingUser',
          password: 'existingPass',
        })
        // Then, try to create the same user again
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            username: 'existingUser',
            password: 'existingPass',
          })
        expect(res.statusCode).toBe(409)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Username Taken')
      })

      test('POST / invalid username type', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            username: 123, // assuming usernames must be strings
            password: 'validPassword',
          })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Bad Request')
      })

      test('POST / invalid password type', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            username: 'validUsername',
            password: 1234, // assuming passwords must be strings
          })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Bad Request')
      })
    })
  })
})
