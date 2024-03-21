import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { signJwt, verifyJwt } from '../../../utils/auth/jwt'

dotenv.config()

describe('jwt', () => {
  const payload = { userId: '1234' }
  const options = { expiresIn: '1d' }

  describe('signJwt', () => {
    it('should sign a JWT with the provided payload and options', () => {
      const publicKey = process.env.JWT_PUBLIC_KEY || 'your-public-key'

      const token = signJwt(payload, options)
      const decoded = jwt.verify(token, publicKey)
      const userId = (decoded as any).userId
      expect(userId).toEqual(payload.userId)
    })
  })

  describe('verifyJwt', () => {
    let token: string

    beforeEach(() => {
      token = signJwt(payload, options)
    })

    it('should verify a valid JWT', () => {
      const result = verifyJwt(token)
      const decoded = result.decoded
      const userId = (decoded as any).userId

      expect(result.valid).toBe(true)
      expect(result.expired).toBe(false)
      expect(userId).toEqual(payload.userId)
    })

    it('should detect an expired JWT', async () => {
      token = signJwt(payload, { expiresIn: '1s' })
      // Wait for the token to expire
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const result = verifyJwt(token)
      expect(result.valid).toBe(false)
      expect(result.expired).toBe(true)
      expect(result.decoded).toBeNull()
    })

    it('should handle invalid JWTs', () => {
      const invalidToken = 'invalid-token'
      const result = verifyJwt(invalidToken)
      console.log(result)

      expect(result.valid).toBe(false)
      expect(result.expired).toBe(false)
      expect(result.decoded).toBeNull()
    })
  })
})
