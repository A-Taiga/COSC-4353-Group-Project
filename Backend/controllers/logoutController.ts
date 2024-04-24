import { Request, Response } from 'express'
import asyncHandler from '../middlewares/asyncHandler'

const logoutUser = asyncHandler(
  async (req: Request, res: Response) => {
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
