import { Request, Response } from 'express'
import asyncHandler from '../middlewares/asyncHandler'
import { deleteSession } from '../services/session.service'
import { JwtDecoded } from '../types/type'
import { verifyJwt } from '../utils/auth/jwt'

const logoutUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const sessionId = req.body.sessionId
      const { refreshToken } = req.cookies
      const refreshPayload: JwtDecoded =
        verifyJwt(refreshToken)

      if (
        refreshPayload.valid &&
        refreshPayload.decoded?.jti
      )
        await deleteSession(refreshPayload?.decoded?.jti)
      else await deleteSession(sessionId)
    } catch (err) {
      console.error('Error deleting session', err)
    }

    res.cookie('accessToken', '', {
      expires: new Date(0),
      httpOnly: true,
    })
    res.cookie('refreshToken', '', {
      expires: new Date(0),
      httpOnly: true,
    })
    res.cookie('csrfToken', '', {
      expires: new Date(0),
      httpOnly: true,
    })

    console.log('Logged out successfully')

    res.status(200).send('Logged out successfully')
  },
)

export default logoutUser
