import { CookieOptions, Request, Response } from 'express'
import asyncHandler from '../middlewares/asyncHandler'

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 9000000, // 15 mins
  httpOnly: true,
  domain: 'localhost',
  path: '/',
  sameSite: 'strict',
  secure: process.env.NODE_ENV !== 'development',
}

const refreshTokenCookieOptions: CookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, // 1 year
}

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, fingerprint } = req.body

  if (!username || !password || !fingerprint) {
    return res.status(400).json({
      message: 'Bad request.',
    })
  }
})

export default loginUser
