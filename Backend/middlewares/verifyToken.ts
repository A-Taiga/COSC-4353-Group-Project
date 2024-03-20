import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils/auth/jwt'

const verifyTokens = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement access token verification logic
  // Get the token from request header.
  const { accessToken, csrfToken } = req.cookies

  // Return error if user does not have a token.
  if (!accessToken || !csrfToken) {
    return res.status(401).json({
      message: 'Unauthorized.',
      attempt: accessToken,
    })
  }

  const accessPayload = verifyJwt(accessToken)
  const csrfPayload = verifyJwt(csrfToken)

  if (!accessPayload.valid || !csrfPayload.valid) {
    if (accessPayload.expired && csrfPayload.expired) {
      return res.status(401).json({
        message:
          process.env.NODE_ENV === 'development'
            ? 'Payload expired.'
            : 'Unauthorized',
      })
    }
    return res.status(401).json({
      message:
        process.env.NODE_ENV === 'development'
          ? 'Payload is missing or invalid.'
          : 'Unauthorized',
    })
  }

  if (
    accessPayload.decoded &&
    csrfPayload.decoded &&
    typeof accessPayload.decoded === 'object' &&
    typeof csrfPayload.decoded === 'object' &&
    accessPayload.decoded.csrf !== csrfPayload.decoded.sub
  ) {
    return res.status(401).json({
      message:
        process.env.NODE_ENV === 'development'
          ? 'CSRF token does not match access token.'
          : 'Unauthorized',
    })
  }

  // Else, it must mean that the token is present and valid.
  // Pass it on to the next middleware.
  next()
}

export default verifyTokens
