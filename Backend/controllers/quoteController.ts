import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import { db } from '../configs/dbConnection';
import { insertFuelQuoteSchema } from '../types/type';
import { insertFuelQuote } from '../services/quote.service';
import { IFuelQuoteData } from '../models/quote.model';

// Pricing model import
// import { calculateFinalQuote } from '../utils/pricingCalculator';

export const submitFuelQuote = asyncHandler(async (req: Request, res: Response) => {
    try {
        const validatedData = insertFuelQuoteSchema.parse(req.body);

        // Assuming you have a userId available (e.g., from session or JWT token)
        // You may need to adjust this based on how you're handling user authentication
        const userId = '721cd5f6-af9b-46e8-a38e-d1e3c362a711'; 

        const quoteDataWithUser = { ...validatedData, userId };

        const result = await db.table('fuel_quotes').insert(quoteDataWithUser).returning('*').execute();

        res.status(200).json({
            message: 'Fuel quote submitted successfully',
            fuelQuote: result.rows[0], 
        });
    } catch (error) {
        res.status(400).json({ message: 'Validation failed'});
    }
});
