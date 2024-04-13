import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import { db } from '../configs/dbConnection';
import { FuelQuoteInsertSchema } from '../types/type';
import { createFuelQuote } from '../services/quote.service';

export const submitFuelQuote = asyncHandler(async (req: Request, res: Response) => {
    try {
        const validatedData = FuelQuoteInsertSchema.parse(req.body);

        const userId = req.body.user_id || 'default-user-id'; 

        const quoteDataWithUser = { ...validatedData, userId };

        const result = await createFuelQuote(req.body);

        res.status(200).json({
            message: 'Fuel quote submitted successfully',
            fuelQuote: result,
        });
    } catch (error) {
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        res.status(400).json({ message: 'Validation failed', details: errorMessage});
    }
});
