import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler'
import { getFuelQuotes } from '../services/quote.service'

export const calculatePrice = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // Request parameters
      const { deliveryAddress, user_id } = req.body

      let { gallonsRequested } = req.body
      gallonsRequested = Number(gallonsRequested)

      if (!user_id) {
        throw new Error('Unauthorized')
      }

      // Validate input
      if (!gallonsRequested || !deliveryAddress) {
        return res
          .status(400)
          .json({ message: 'Missing required fields' })
      }

      if (gallonsRequested <= 0) {
        return res.status(400).json({
          message:
            'Gallons requested must be a positive number',
        })
      }

      // Pricing logic constants
      const currentPricePerGallon = 1.5 // Current price per gallon as provided
      const companyProfitFactor = 0.1 // Always 10%

      // Determining the Location Factor
      const locationFactor =
        deliveryAddress.toLowerCase().includes('texas') ||
        deliveryAddress.toLowerCase().includes('tx')
          ? 0.02
          : 0.04

      // Check rate history
      const hasHistory =
        (await getFuelQuotes(user_id)).length > 0
      const rateHistoryFactor = hasHistory ? 0.01 : 0.0

      // Gallons Requested Factor
      const gallonsRequestedFactor =
        gallonsRequested > 1000 ? 0.02 : 0.03

      // Calculating Margin
      const margin =
        currentPricePerGallon *
        (locationFactor -
          rateHistoryFactor +
          gallonsRequestedFactor +
          companyProfitFactor)

      // Calculating Suggested Price per Gallon
      const suggestedPrice = currentPricePerGallon + margin

      // Calculating Total Price
      const totalPrice = gallonsRequested * suggestedPrice

      // Response with pricing result
      return res.status(200).json({
        message: 'Price calculated successfully',
        pricingResult: {
          suggestedPrice: suggestedPrice.toFixed(3), // Rounded to three decimal places for clarity
          totalPrice: totalPrice.toFixed(2), // Rounded to two decimal places for currency formatting
        },
      })
    } catch (err) {
      throw new Error((err as Error).message)
    }
  },
)
