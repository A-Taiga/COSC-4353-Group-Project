import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { JwtDecoded } from '../../types/type'

dotenv.config()

const privateKey = process.env.JWT_PRIVATE_KEY
const publicKey = process.env.JWT_PUBLIC_KEY
interface Payload {
  sub: string
  jti?: string
  csrf?: string
}

const signJwt = (payload: Payload, options: object) =>
  jwt.sign({ ...payload }, privateKey as string, {
    ...(options && options),
    algorithm: 'RS256',
  })

const verifyJwt = (token: string): JwtDecoded => {
  try {
    const decoded = jwt.verify(token, publicKey as string)
    return {
      valid: true,
      expired: false,
      decoded: decoded as JwtDecoded['decoded'],
    }
  } catch (e) {
    return {
      valid: false,
      expired:
        e instanceof Error &&
        e.message.toLowerCase() === 'jwt expired',
      decoded: null,
    }
  }
}

export { signJwt, verifyJwt }

