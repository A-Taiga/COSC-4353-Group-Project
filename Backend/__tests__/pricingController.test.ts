import { Request, Response } from 'express';
import { calculatePrice } from '../controllers/pricingController';

describe('Pricing Controller', () => {
    describe('calculatePrice', () => {
        it('should calculate the price of fuel correctly', async () => {
            const req = {
                body: {
                    gallonsRequested: 100,
                    deliveryDate: new Date(),
                    clientLocation: 'New York',
                    // Additional parameters
                }
            } as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            await calculatePrice(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
        });

        it('should handle zero gallons requested', async () => {
            const req = {
                body: {
                    gallonsRequested: 0,
                    deliveryDate: new Date(),
                    clientLocation: 'New York',
                }
            } as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            await calculatePrice(req, res);

            // Assuming 400 for bad request
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
        });

        it('should handle negative gallons requested', async () => {
            const req = {
                body: {
                    gallonsRequested: -50,
                    deliveryDate: new Date(),
                    clientLocation: 'New York',
                }
            } as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            await calculatePrice(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
        });

        /*
        it('should handle errors and return 500 status code with error message', async () => {
            const req = {
                body: undefined // Set body to undefined to trigger the error handling
            } as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;
        
            const error = new Error('Mock error');
        
            console.error = jest.fn();
        
            await calculatePrice(req, res);
        
            expect(console.error).toHaveBeenCalledWith('Error calculating price:', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
        */
    });
});
