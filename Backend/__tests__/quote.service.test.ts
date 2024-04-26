import { createFuelQuote, getFuelQuotes } from '../services/quote.service';
import { db } from '../configs/dbConnection';
import { fuelQuotes } from '../schemas/schema';

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
    deliveryDate: new Date(),  // Now this is a Date object
    deliveryAddress: '123 Example Rd',
    suggestedPrice: '3.5',
    totalPrice: '3500'
  };

  describe('createFuelQuote', () => {
    test('successfully creates a fuel quote', async () => {
      db.returning.mockResolvedValueOnce([validQuoteData]);
      const result = await createFuelQuote(validQuoteData);
      expect(db.insert).toHaveBeenCalledWith(fuelQuotes);
      expect(db.values).toHaveBeenCalledWith({
        ...validQuoteData,
        deliveryDate: expect.any(Date)  // Ensuring deliveryDate is a Date object
      });
      expect(result).toEqual(validQuoteData);
    });

    test('throws an error if validation fails', async () => {
      const invalidQuoteData = {
        ...validQuoteData,
        deliveryAddress: ''  // Invalid due to empty address
      };
      await expect(createFuelQuote(invalidQuoteData)).rejects.toThrow('Validation failed.');
      expect(db.insert).not.toHaveBeenCalled();
    });

    test('handles database insert errors', async () => {
      db.returning.mockRejectedValueOnce(new Error('DB insert error'));
      await expect(createFuelQuote(validQuoteData)).rejects.toThrow('DB insert error');
    });
  });

  describe('getFuelQuotes', () => {
    const clientId = 'test-client-id';

    test('retrieves a fuel quote successfully', async () => {
      db.where.mockResolvedValueOnce([validQuoteData]);
      const result = await getFuelQuotes(clientId);
      expect(db.select).toHaveBeenCalled();
      expect(db.from).toHaveBeenCalledWith(fuelQuotes);
      expect(db.where).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual([validQuoteData]);
    });

    test('returns an empty array if no quotes are found', async () => {
      db.where.mockResolvedValueOnce([]);
      const result = await getFuelQuotes(clientId);
      expect(result).toEqual([]);
    });

    test('handles database query errors', async () => {
      db.select.mockRejectedValueOnce(new Error('DB select error'));
      await expect(getFuelQuotes(clientId)).rejects.toThrow('DB select error');
    });
  });
});
