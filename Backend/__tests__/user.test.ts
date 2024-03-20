import request from 'supertest'
import createServer from '../utils/server/server'

const app = createServer()

describe('user', () => {
  describe('/api/auth/login', () => {
    test('POST / valid data', async () => {
      const res = await request(app).post('/api/auth/login').send({
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
      expect(res.body.message).toBe('Logged in successfully')
    })

    test('POST / all empty fields', async () => {
      const res = await request(app).post('/api/auth/login').send({
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
      const res = await request(app).post('/api/auth/login').send({
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
      const res = await request(app).post('/api/auth/login').send({
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
      const res = await request(app).post('/api/auth/login').send({
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
      const res = await request(app).post('/api/auth/login').send({
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
      const res = await request(app).post('/api/auth/login').send({
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
      const res = await request(app).post('/api/auth/login').send({
        username: 'Steve',
        password: 'stevepass',
        fingerprint: 'fingerprint',
      })
      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe('Unauthorized')
    })
  })
})
