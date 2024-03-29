import { Request, Response } from 'express';
import { Pricing } from '../models/pricing'; 

const pricing = new Pricing();

/*
interface PricingResult {
    totalPrice: number;
    // Properties needed for the response
}
*/

export const calculatePrice = (req: Request, res: Response) => {
    try {
        // Request parameters
        const { gallonsRequested, deliveryDate, deliveryAddress } = req.body;

        // Validate input
        if (!gallonsRequested || !deliveryDate || !deliveryAddress) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Pricing calculation using the Pricing class
        const totalPrice = pricing.calculatePrice({
            gallonsRequested,
            deliveryDate,
            clientLocation: deliveryAddress,
        });

        /*
        // Pricing calculation
        // Replace with actual pricing logic
        const suggestedPrice = 2.5; // Current placeholder
        const totalPrice = parseFloat(gallonsRequested) * suggestedPrice;

        // Response
        const pricingResult: PricingResult = {
            totalPrice,
            // Additional properties
        };
        return res.status(200).json({
            message: 'Price calculated successfully',
            pricingResult,
        });
        */

        // Response
        return res.status(200).json({
            message: 'Price calculated successfully',
            totalPrice,
        });
    } catch (error) {
        // Error handling
        console.error('Error calculating price:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
