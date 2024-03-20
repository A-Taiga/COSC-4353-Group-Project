import request from 'supertest'
import createServer from '../utils/server/server'

const app = createServer()

test('POST / valid data', async () => {
  const res = await request(app).post('/api/profile-management').send({
    fullName: 'Chungus',
    address1: 'shit',
    city: 'shit',
    state: 'TX',
    zipcode: '12345-1234',
  })
  expect(res.statusCode).toBe(200)
  expect(res.body.message).toBe('profile saved')
})
