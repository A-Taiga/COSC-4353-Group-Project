import { Request, Response } from 'express';

export const calculatePrice = (req: Request, res: Response) => {
  // try {
  // Request parameters
  const { gallonsRequested, deliveryDate, clientLocation } = req.body

  // Validate input
  if (!gallonsRequested || !deliveryDate || !clientLocation) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  if (gallonsRequested < 0) {
    return res
      .status(400)
      .json({ message: 'Gallons requested cannot be negative' })
  }

  // Pricing calculation
  // To be replaced with actual pricing logic
  const suggestedPrice = 2.5 // Current placeholder
  const totalPrice = parseFloat(gallonsRequested) * suggestedPrice

  // Response
  const pricingResult = {
    totalPrice,
    // Additional properties
  }
  return res.status(200).json({
    message: 'Price calculated successfully',
    pricingResult,
  })
  // } catch (error) {
  //     // For errors when doing pricing calculation
  //     throw new Error(`Error calculating price: ${(error as Error).message}`)
  // }
};
