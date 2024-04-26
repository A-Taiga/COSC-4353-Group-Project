import { Request, Response, NextFunction } from 'express';
import { calculatePrice } from '../controllers/pricingController';

jest.mock('../services/quote.service', () => ({
  getFuelQuotes: jest.fn()
}));

const mockedGetFuelQuotes = require('../services/quote.service').getFuelQuotes;

describe('Pricing Controller', () => {
  describe('calculatePrice', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should calculate the price of fuel correctly', async () => {
      const req = {
        body: {
          gallonsRequested: 100,
          deliveryAddress: 'New York',
          user_id: 'mockUserId'
        }
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await calculatePrice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle zero gallons requested', async () => {
      const req = {
        body: {
          gallonsRequested: 0,
          deliveryAddress: 'New York',
          user_id: 'mockUserId'
        }
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await calculatePrice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle negative gallons requested', async () => {
      const req = {
        body: {
          gallonsRequested: -50,
          deliveryAddress: 'New York',
          user_id: 'mockUserId'
        }
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await calculatePrice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle unauthorized user', async () => {
      const req = {
        body: {
          gallonsRequested: 100,
          deliveryAddress: 'New York'
        }
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await calculatePrice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should calculate the price correctly with rate history and high gallons requested', async () => {
      mockedGetFuelQuotes.mockResolvedValueOnce([{ id: 1, user_id: 'mockUserId', gallonsRequested: 500, deliveryAddress: 'Texas' }]);

      const req = {
        body: {
          gallonsRequested: 1500,
          deliveryAddress: 'Texas',
          user_id: 'mockUserId'
        }
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await calculatePrice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);

      // Calculations for expected values
      const currentPricePerGallon = 1.5;
      const companyProfitFactor = 0.1;
      const locationFactor = 0.02;
      const rateHistoryFactor = 0.01;
      const gallonsRequestedFactor = 0.02;
      const margin = currentPricePerGallon * (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor);
      const suggestedPrice = currentPricePerGallon + margin;
      const totalPrice = req.body.gallonsRequested * suggestedPrice;

      expect(res.json).toHaveBeenCalledWith({
        message: 'Price calculated successfully',
        pricingResult: {
          suggestedPrice: suggestedPrice.toFixed(3),
          totalPrice: totalPrice.toFixed(2)
        }
      });
    });

    it('should calculate the price correctly without rate history and low gallons requested', async () => {
      mockedGetFuelQuotes.mockResolvedValueOnce([]);

      const req = {
        body: {
          gallonsRequested: 500,
          deliveryAddress: 'New York',
          user_id: 'mockUserId'
        }
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await calculatePrice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);

      // Calculations for expected values
      const currentPricePerGallon = 1.5;
      const companyProfitFactor = 0.1;
      const locationFactor = 0.04;
      const rateHistoryFactor = 0;
      const gallonsRequestedFactor = 0.03;
      const margin = currentPricePerGallon * (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor);
      const suggestedPrice = currentPricePerGallon + margin;
      const totalPrice = req.body.gallonsRequested * suggestedPrice;

      expect(res.json).toHaveBeenCalledWith({
        message: 'Price calculated successfully',
        pricingResult: {
          suggestedPrice: suggestedPrice.toFixed(3),
          totalPrice: totalPrice.toFixed(2)
        }
      });
    });
  });
});
