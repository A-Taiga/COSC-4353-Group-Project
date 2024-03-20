import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const privateKey = process.env.JWT_PRIVATE_KEY
const publicKey = process.env.JWT_PUBLIC_KEY

const signJwt = (payload: object, options: object) =>
  jwt.sign(payload, privateKey as string, {
    ...(options && options),
    algorithm: 'RS256',
  })

const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey as string)
    return {
      valid: true,
      expired: false,
      decoded,
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message)
      return {
        valid: false,
        expired: e.message === 'jwt expired',
        decoded: null,
      }
    }
    // Handle non-Error objects that might have been thrown
    return {
      valid: false,
      expired: false,
      decoded: null,
    }
  }
}

export { signJwt, verifyJwt }
