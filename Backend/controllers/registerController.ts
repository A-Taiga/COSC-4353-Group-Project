import { Request, Response } from 'express'
import asyncHandler from '../middlewares/asyncHandler'

const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body
  },
)

export default registerUser
