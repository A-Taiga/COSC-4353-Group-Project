import { Request, Response } from 'express'
import asyncHandler from '../middlewares/asyncHandler'
import {
  createUser,
  getUser,
} from '../services/user.service'
import { UserDbReturn } from '../types/type'

const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { password } = req.body
    let { username } = req.body
    console.log({ username, password })

    try {
      // Check if the request is valid
      if (
        !username ||
        !password ||
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        password.length < 7
      ) {
        throw new Error('Bad request.')
      }

      // Convert the email or username to lowercase
      username = username.toLowerCase()

      // Look up if the username already exists
      let user: UserDbReturn | null = await getUser(
        {
          username,
        }, // UserLookUpData
        false, // isLogin field
      )

      // Check if user does exist.
      // If it does, throw an error
      if (user != null && user.id) {
        throw new Error(
          'Username taken. Please choose another username.',
        )
      }

      // If it doesn't, create the user
      user = await createUser(username, password)

      return res.status(201).json({
        message: `New user, ${username} registered successfully.`,
      })
    } catch (err) {
      throw new Error((err as Error).message)
    }
  },
)

export default registerUser
