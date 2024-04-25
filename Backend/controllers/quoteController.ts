import { Request, Response } from 'express'
import asyncHandler from '../middlewares/asyncHandler'
import { findUserProfile } from '../services/profile.service'
import {
    createFuelQuote,
    getFuelQuotes,
} from '../services/quote.service'
import {
    FuelQuoteData,
    UserProfileDbReturn,
} from '../types/type'

export const submitFuelQuote = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        user_id,
        gallonsRequested,
        deliveryAddress,
        deliveryDate,
        suggestedPrice,
        totalPrice,
      } = req.body

      if (!user_id) {
        throw new Error('Unauthorized')
      }
      if (
        !gallonsRequested ||
        !deliveryAddress ||
        !deliveryDate ||
        !suggestedPrice ||
        !totalPrice
      ) {
        return res
          .status(400)
          .json({ message: 'Missing required fields' })
      }

      const result = await createFuelQuote({
        gallonsRequested,
        deliveryAddress,
        deliveryDate,
        suggestedPrice,
        totalPrice,
        userId: user_id,
      })

      res.status(200).json({
        message: 'Fuel quote submitted successfully',
      })
    } catch (error) {
      throw new Error((error as Error).message)
    }
  },
)

// Get fuel quote history for a specific client
export const getFuelQuoteHistory = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body
      //   Query the database for fuel quote history for the client
      const fuelQuotes: [FuelQuoteData] =
        (await getFuelQuotes(user_id)) as [FuelQuoteData]

      res.status(200).json({
        message: 'Get fuel quotes successfully',
        fuelQuotes,
      })
    } catch (err) {
      throw new Error((err as Error).message)
    }
  },
)

export const getDeliveryAddress = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body

      if (!user_id) {
        throw new Error('Unauthorized')
      }

      const profile: UserProfileDbReturn | null =
        await findUserProfile(user_id)

      if (
        !profile ||
        !profile.firstName ||
        !profile.lastName
      ) {
        return res.status(200).json({
          message: 'Profile not found',
          profile: profile,
        })
      }

      console.log(profile)

      return res.status(200).json({
        message: 'Profile loaded successfully',
        profile: profile,
      })
    } catch (err) {
      throw new Error((err as Error).message)
    }
  },
)
