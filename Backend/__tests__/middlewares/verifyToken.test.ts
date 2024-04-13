import express from 'express'
import request from 'supertest'
import verifyTokens from '../../middlewares/verifyToken'

// Mock the JWT verification utility
jest.mock('../../utils/auth/jwt', () => ({
  verifyJwt: jest.fn((token) => {
    if (token === 'validAccessToken') {
      return {
        valid: true,
        decoded: { sub: 'user123', csrf: 'csrf123' },
      }
    } else if (token === 'validCsrfToken') {
      return { valid: true, decoded: { sub: 'csrf123' } }
    } else if (token === 'validCsrfTokenMismatch') {
      return { valid: true, decoded: { sub: 'csrf321' } }
    } else if (token === 'validAccessTokenWithNoCsrf') {
      return { valid: true, decoded: { sub: 'user123' } }
    } else if (token === 'validCsrfTokenWithNoSub') {
      return { valid: true, decoded: {} }
    } else {
      return {
        valid: false,
        expired: token.includes('expired'),
      }
    }
  }),
}))

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require('cookie-parser')())
app.use(verifyTokens)
app.post('/test', (req, res) =>
  res.status(200).json({ userId: req.body.user_id }),
)

describe('verifyTokens middleware', () => {
  it('should return 401 if no tokens are provided', async () => {
    const response = await request(app).post('/test')
    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      message: 'Unauthorized.',
      attempt: undefined,
    })
  })

  it('should return 401 if tokens are invalid', async () => {
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=invalidAccessToken',
        'csrfToken=invalidCsrfToken',
      ])
    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      message: 'Unauthorized',
    })
  })

  it('should return 401 if tokens are expired', async () => {
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=expiredAccessToken',
        'csrfToken=expiredCsrfToken',
      ])
    expect(response.status).toBe(401)
    expect(response.body.message).toContain('Unauthorized')
  })

  it('should return 401 if CSRF token does not match', async () => {
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=validAccessToken',
        'csrfToken=validCsrfTokenMismatch',
      ])
    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      message: 'Unauthorized',
    })
  })

  it('should pass user ID to the request body if tokens are valid and match', async () => {
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=validAccessToken',
        'csrfToken=validCsrfToken',
      ])
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ userId: 'user123' })
  })

  it('should return 401 if access token is expired but CSRF token is valid', async () => {
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=expiredAccessToken',
        'csrfToken=validCsrfToken',
      ])
    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      message:
        process.env.NODE_ENV === 'development'
          ? 'Payload expired.'
          : 'Unauthorized',
    })
  })

  it('should return 401 if CSRF token is expired but access token is valid', async () => {
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=validAccessToken',
        'csrfToken=expiredCsrfToken',
      ])
    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      message:
        process.env.NODE_ENV === 'development'
          ? 'Payload expired.'
          : 'Unauthorized',
    })
  })

  it('should return 401 if access token is valid but missing CSRF property in decoded payload', async () => {
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=validAccessTokenWithNoCsrf',
        'csrfToken=validCsrfToken',
      ])
    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      message:
        process.env.NODE_ENV === 'development'
          ? 'Payload is missing or invalid.'
          : 'Unauthorized',
    })
  })

  it('should return 401 if CSRF token is valid but missing sub property in decoded payload', async () => {
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=validAccessToken',
        'csrfToken=validCsrfTokenWithNoSub',
      ])
    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      message:
        process.env.NODE_ENV === 'development'
          ? 'Payload is missing or invalid.'
          : 'Unauthorized',
    })
  })
})

describe('verifyTokens middleware - Environment specific messages', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules() // Resets the module registry - the cache of all required modules. This is useful to isolate modules where local state might conflict between tests.
    process.env = { ...originalEnv } // Make a copy of the environment variables
  })

  afterEach(() => {
    process.env = originalEnv // Restore the original environment
  })

  it('should return "Payload is missing or invalid." if NODE_ENV is development', async () => {
    process.env.NODE_ENV = 'development' // Set NODE_ENV to 'development'
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=invalidAccessToken',
        'csrfToken=invalidCsrfToken',
      ])
    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      message: 'Payload is missing or invalid.',
    })
  })

  it('should return "Unauthorized" if NODE_ENV is not development', async () => {
    process.env.NODE_ENV = 'production' // Set NODE_ENV to 'production'
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=invalidAccessToken',
        'csrfToken=invalidCsrfToken',
      ])
    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      message: 'Unauthorized',
    })
  })
  it('should return "Payload expired." in development for expired tokens', async () => {
    process.env.NODE_ENV = 'development'
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=expiredAccessToken',
        'csrfToken=expiredCsrfToken',
      ])
    expect(response.status).toBe(401)
    expect(response.body.message).toEqual(
      'Payload expired.',
    )
  })

  it('should return "Unauthorized" in production for expired tokens', async () => {
    process.env.NODE_ENV = 'production'
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=expiredAccessToken',
        'csrfToken=expiredCsrfToken',
      ])
    expect(response.status).toBe(401)
    expect(response.body.message).toEqual('Unauthorized')
  })

  it('should show detailed mismatch error in development for CSRF token mismatch', async () => {
    process.env.NODE_ENV = 'development' // Set environment to development
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=validAccessToken',
        'csrfToken=validCsrfTokenMismatch',
      ])
    expect(response.status).toBe(401)
    expect(response.body.message).toEqual(
      'CSRF token does not match access token.',
    )
  })

  it('should show generic unauthorized error in production for CSRF token mismatch', async () => {
    process.env.NODE_ENV = 'production' // Simulate production environment
    const response = await request(app)
      .post('/test')
      .set('Cookie', [
        'accessToken=validAccessToken',
        'csrfToken=validCsrfTokenMismatch',
      ])
    expect(response.status).toBe(401)
    expect(response.body.message).toEqual('Unauthorized')
  })
})
