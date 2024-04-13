import request from 'supertest';
import createServer from '../utils/server/server';

const app = createServer();

describe('Fuel Quote Form Submission', () => {
  const validQuote = {
    gallonsRequested: 500,
    delivDate: new Date().toISOString().split('T')[0],
    delivAddress: '123 Nunya ln',
    suggestedPrice: 2.5,
    totalAmountDue: 1250,
    user_id: '12345'
  };

  describe('/api/fuelQuote', () => {
    test('POST / with valid data including user_id', async () => {
      const res = await request(app)
        .post('/api/fuelQuote')
        .send(validQuote);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Fuel quote submitted successfully');
      expect(res.body.fuelQuote).toBeDefined();
    });

    test('POST / with valid data but no user_id (default user)', async () => {
      const { user_id, ...quoteWithoutUserId } = validQuote;
      const res = await request(app)
        .post('/api/fuelQuote')
        .send(quoteWithoutUserId);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Fuel quote submitted successfully');
      expect(res.body.fuelQuote.userId).toBe('default-user-id');
    });

    test('POST / with missing required field (gallonsRequested)', async () => {
      const { gallonsRequested, ...missingRequiredField } = validQuote;
      const res = await request(app)
        .post('/api/fuelQuote')
        .send(missingRequiredField);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.details).toContain('gallonsRequested');
    });

    test('POST / with invalid data type for gallonsRequested (string instead of number)', async () => {
      const invalidDataType = { ...validQuote, gallonsRequested: 'five hundred' };
      const res = await request(app)
        .post('/api/fuelQuote')
        .send(invalidDataType);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.details).toContain('gallonsRequested');
    });
  });
});
