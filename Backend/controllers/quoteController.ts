import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import { db } from '../configs/dbConnection';

// Pricing model import
// import { calculateFinalQuote } from '../utils/pricingCalculator';

interface FuelQuote {
    gallonsRequested: number;
    deliveryDate: Date;
    deliveryAddress: string;
    suggestedPrice: number;
    totalAmountDue: number;
}

export const submitFuelQuote = async (req: Request, res: Response) => {
    const { gallonsRequested, delivDate, delivAddress } = req.body;

    // Simple validation
    if (!gallonsRequested || !delivDate || !delivAddress) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Pull data from Database here
    console.log('Data received:', req.body);

    //SIMULATION SHOULD BE REMOVED BEFORE FINAL TESTING
    return res.status(200).json({
        message: 'Fuel quote submitted successfully',
        // simulated response
        fuelQuote: {
            gallonsRequested,
            deliveryDate: delivDate,
            deliveryAddress: delivAddress,
            suggestedPrice: 2.5,
            totalAmountDue: parseFloat(gallonsRequested) * 2.5,
        },
    });
};

// export const submitFuelQuote = asyncHandler(async (req: Request, res: Response) => {
//     const { gallonsRequested, delivDate, delivAddress } = req.body;

//     if (!gallonsRequested || !delivDate || !delivAddress) {
//         return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const gallons = parseFloat(gallonsRequested);
//     const deliveryDate = new Date(delivDate);

//     // Pricing logic here
//     const suggestedPrice = 2.5; 
//     // const totalAmountDue = calculateFinalQuote(gallons, suggestedPrice);
//     // Current placeholder SHOULD REPLACE
//     const totalAmountDue = gallons * suggestedPrice;

//     const fuelQuote: FuelQuote = {
//         gallonsRequested: gallons,
//         deliveryDate: deliveryDate,
//         deliveryAddress: delivAddress,
//         suggestedPrice: suggestedPrice,
//         totalAmountDue: totalAmountDue,
//     };

//     // Save to database implementation here later
//     // Example: const savedQuote = await db.fuelQuotes.create(fuelQuote);
    
//     // Remove in the future, just for testing purposes
//     console.log(fuelQuote); 

//     return res.status(200).json({
//         message: 'Fuel quote submitted successfully',
//         fuelQuote: fuelQuote,
//     });
// });
