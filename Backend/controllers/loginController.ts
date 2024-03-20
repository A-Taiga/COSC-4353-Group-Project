import bcrypt from 'bcrypt'
import { and, eq } from 'drizzle-orm'
import { CookieOptions, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { db } from '../configs/dbConnection'
import asyncHandler from '../middlewares/asyncHandler'
import { sessions, users } from '../schemas/schema'
import { createSession } from '../services/session.service'
import { signJwt } from '../utils/auth/jwt'

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

// Check password against the hashed version function
const matchPassword = (enteredPassword: string, userPassword: string) => {
  return bcrypt.compare(enteredPassword, userPassword)
}

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { password, fingerprint } = req.body
  let { username } = req.body

  if (
    !username ||
    !password ||
    !fingerprint ||
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof fingerprint !== 'string' ||
    username.length < 3 ||
    password.length < 8
  ) {
    return res.status(400).json({
      message: 'Bad request.',
    })
  }

  // Convert the email or username to lowercase
  username = username.toLowerCase()

  try {
    // Check if a user exists in the database.
    const user = await db.select({ username: username }).from(users)

    // Check if user does not exist or wrong password.
    if (!user || !(await matchPassword(password, user.password))) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid email or password.' })
    }

    console.log({ user })

    // Check if the user already has a session
    // If so, delete that session
    const existingSession = await db
      .select({ sessionId: sessions.id })
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, user.id),
          eq(sessions.fingerprint, fingerprint),
        ),
      )

    console.log({ existingSession })

    if (existingSession.length > 0) {
      await db
        .delete(sessions)
        .where(eq(sessions.id, existingSession[0].sessionId))
    }

    // Create a session for the user
    const session = await createSession(user.id, fingerprint) // Create access & refresh tokens

    // Token object will contain the user info and session id
    const csrfTokenObj = {
      sub: uuid(),
    }

    const accessTokenObj = {
      sub: user.id,
      csrf: csrfTokenObj.sub,
    }

    const refreshTokenObj = {
      sub: user.id,
      jti: session.id,
    }

    // Create access & refresh tokens
    const accessToken = signJwt(accessTokenObj, {
      expiresIn: process.env.ACCESS_TOKEN_TTL,
    }) // 15min

    const csrfToken = signJwt(accessTokenObj, {
      expiresIn: process.env.ACCESS_TOKEN_TTL,
    }) // 15min

    const refreshToken = signJwt(refreshTokenObj, {
      expiresIn: process.env.REFRESH_TOKEN_TTL,
    }) // 1 year

    // Set both tokens to cookies
    res.cookie('accessToken', accessToken, accessTokenCookieOptions) // 15 min

    res.cookie('csrfToken', csrfToken, accessTokenCookieOptions) // 15 min

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions) // 1 year

    // Redirect to the frontend callback page
    res
      .status(201)
      .json({
        message: 'Logged in successfully',
        accessToken,
        csrfToken,
        refreshToken,
      })
  } catch (err) {
    return res.status(500).json({ message: err })
  }
})

export default loginUser
