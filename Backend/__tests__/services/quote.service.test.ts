import { createFuelQuote } from '../../services/quote.service';
import { db } from '../../configs/dbConnection';
import { fuelQuotes } from '../../schemas/schema';

jest.mock('../configs/dbConnection', () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn()
  }
}));

describe('createFuelQuote', () => {
    const validQuoteData = {
      gallonsRequested: '1000',
      deliveryDate: new Date(),  
      deliveryAddress: '123 Example Rd',
      suggestedPrice: '3.5',
      totalPrice: '3500'
    };
  
    test('successfully creates a fuel quote', async () => {
      db.returning.mockResolvedValueOnce([validQuoteData]);
  
      const result = await createFuelQuote(validQuoteData);
  
      expect(db.insert).toHaveBeenCalledWith(fuelQuotes);
      expect(db.values).toHaveBeenCalledWith(validQuoteData);
      expect(result).toEqual(validQuoteData);
      expect(result.gallonsRequested).toBe('1000');
    });
  
    test('throws an error if validation fails', async () => {
      const invalidQuoteData = {
        gallonsRequested: '-100', 
        deliveryDate: new Date('invalid-date'),
        deliveryAddress: '',  
        suggestedPrice: '-1', 
        totalPrice: '-100'
      };
  
      await expect(createFuelQuote(invalidQuoteData))
        .rejects
        .toThrow('Validation failed.');
  
      expect(db.insert).not.toHaveBeenCalled();
    });
  });
  