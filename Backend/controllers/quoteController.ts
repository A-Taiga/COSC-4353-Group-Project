/*
import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler'
import { createFuelQuote } from '../services/quote.service'
import { FuelQuoteInsertSchema } from '../types/type'

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
*/

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

// Get fuel quote history for a specific client
export const getFuelQuoteHistory = asyncHandler(async (req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;

        // Query the database for fuel quote history for the client
        const fuelQuotes = await db.query("SELECT * FROM fuel_quotes WHERE user_id = 'cc798fcb-2a90-4b19-a833-a1a3aa00f656';", [clientId]);
        console.log(fuelQuotes);

        res.json({ success: true, fuelQuotes });
    } catch (err) {
        console.error('Error fetching fuel quote history:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
