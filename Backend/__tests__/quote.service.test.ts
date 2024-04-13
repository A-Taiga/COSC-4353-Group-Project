import { createFuelQuote } from '../services/quote.service';
import { db } from '../configs/dbConnection';
import { fuelQuotes } from '../schemas/schema';
import z from 'zod';

jest.mock('../configs/dbConnection', () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis()
  }
}));

describe('Quote Services', () => {
  const validQuoteData = {
    gallonsRequested: '1000',
    deliveryDate: new Date(),
    deliveryAddress: '123 Example Rd',
    suggestedPrice: '3.5',
    totalPrice: '3500'
  };

  describe('createFuelQuote', () => {
    test('successfully creates a fuel quote', async () => {
      db.returning.mockResolvedValueOnce([validQuoteData]);
      const result = await createFuelQuote(validQuoteData);
      expect(db.insert).toHaveBeenCalledWith(fuelQuotes);
      expect(db.values).toHaveBeenCalledWith(validQuoteData);
      expect(result).toEqual(validQuoteData);
    });

    test('throws an error if validation fails', async () => {
      const invalidQuoteData = {
        gallonsRequested: '1000',
        deliveryDate: new Date(),
        deliveryAddress: '',
        suggestedPrice: '3.5',
        totalPrice: '3500'
      };
      await expect(createFuelQuote(invalidQuoteData))
        .rejects
        .toThrow('Validation failed.');
      expect(db.insert).not.toHaveBeenCalled();
    });
  });

  // describe('getFuelQuote', () => {
  //   test('retrieves a fuel quote successfully', async () => {
  //     const quoteId = 'some-quote-id';
  //     db.where.mockResolvedValueOnce([validQuoteData]);
  //     const result = await getFuelQuote(quoteId);
  //     expect(db.select).toHaveBeenCalled();
  //     expect(db.from).toHaveBeenCalledWith(fuelQuotes);
  //     expect(db.where).toHaveBeenCalledWith(expect.any(Function));
  //     expect(result).toEqual(validQuoteData);
  //   });

  //   test('returns null if no quote is found', async () => {
  //     const quoteId = 'non-existent-id';
  //     db.where.mockResolvedValueOnce([]);
  //     const result = await getFuelQuote(quoteId);
  //     expect(result).toBeNull();
  //   });
  // });
});
