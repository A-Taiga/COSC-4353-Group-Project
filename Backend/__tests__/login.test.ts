import request from 'supertest'
import app from '../app'

describe('user', () => {
  describe('/api/auth/login', () => {
    test('POST / valid data', async () => {
      const res = await request(app).post('api/auth/login').send({
        username: 'group70',
        password: 'group70pass',
        fingerprint: 'fingerprint',
      })
      expect(res.statusCode).toBe(200)
      expect(res.body.data.length).toEqual(1)
      expect(res.body.data[0].message).toBe('Logged in successfully')
      expect(res.body.data[0]).toHaveProperty('csrfToken')
      expect(res.body.data[0].csrfToken).toBeDefined()
      expect(res.body.data[0]).toHaveProperty('accessToken')
      expect(res.body.data[0].accessToken).toBeDefined()
      expect(res.body.data[0]).toHaveProperty('refreshToken')
      expect(res.body.data[0].refreshToken).toBeDefined()
    })
  })
})
