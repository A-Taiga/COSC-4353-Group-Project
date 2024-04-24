import { CookieOptions, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import asyncHandler from '../middlewares/asyncHandler'
import { getSession } from '../services/session.service'
import { JwtDecoded, SessionDbReturn } from '../types/type'
import { signJwt, verifyJwt } from '../utils/auth/jwt'
const accessTokenCookieOptions: CookieOptions = {
  maxAge: 9000000, // 15 mins
  httpOnly: true,
  domain: 'localhost',
  path: '/',
  sameSite: 'strict',
  secure: process.env.NODE_ENV !== 'development',
}

const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies
    const { fingerprint } = req.body

    if (!refreshToken) {
      throw new Error(
        'Unauthorized. No refreshToken found in cookies.',
      )
    }
    const refreshPayload: JwtDecoded =
      verifyJwt(refreshToken)

    if (!refreshPayload.valid) {
      if (refreshPayload.expired)
        throw new Error(
          'Unauthorized. Refresh Payload expired.',
        )
      else
        throw new Error(
          'Unauthorized. Refresh Payload is missing or invalid.',
        )
    }
    console.log(refreshPayload)

    const session: SessionDbReturn | null =
      await getSession(
        refreshPayload?.decoded?.sub ?? '',
        fingerprint,
      )

      if (
        !session ||
        (session &&
          session.id !== refreshPayload.decoded?.jti)
      ) {
        throw new Error(
          'Unauthorized. No session found or not valid.',
        )
      }

      // Create access & refresh tokens
      // Token object will contain the user info and session id
      const csrfTokenObj = {
        sub: uuid(),
      }

      const accessTokenObj = {
        sub: refreshPayload.decoded?.sub ?? '',
        csrf: csrfTokenObj.sub,
      }

      // Create access & refresh tokens
      const accessToken = signJwt(accessTokenObj, {
        expiresIn: process.env.ACCESS_TOKEN_TTL,
      }) // 15min

      const csrfToken = signJwt(csrfTokenObj, {
        expiresIn: process.env.ACCESS_TOKEN_TTL,
      }) // 15min

      // Set both tokens to cookies
      res.cookie(
        'accessToken',
        accessToken,
        accessTokenCookieOptions,
      ) // 15 min
      res.cookie(
        'csrfToken',
        csrfToken,
        accessTokenCookieOptions,
      ) // 15 min

      console.log('Refresh token successfully')

      res.status(200).json({
        message: 'Refresh token successfully',
        accessToken,
        csrfToken,
      })
  },
)

export default refreshToken
