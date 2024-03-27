import request from 'supertest';
import createServer from '../utils/server/server';

const app = createServer();

describe('Fuel Quote Form Submission', () => {
  describe('/api/fuelQuote', () => {
    test('POST / with valid data', async () => {
      const res = await request(app)
        .post('/api/fuelQuote')
        .send({
          gallonsRequested: 500,
          delivDate: new Date().toISOString().split('T')[0], 
          delivAddress: '123 Nunya ln',
          suggestedPrice: 2.5,
          totalAmountDue: 1250
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Fuel quote submitted successfully');
      expect(res.body).toHaveProperty('fuelQuote');
      expect(res.body.fuelQuote.totalAmountDue).toBeDefined();
    });

    test('POST / with missing gallonsRequested field', async () => {
      const res = await request(app)
        .post('/api/fuelQuote')
        .send({
          delivDate: new Date().toISOString().split('T')[0], 
          delivAddress: '123 Nunya ln',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Missing required fields');
    });

    test('POST / with missing delivDate field', async () => {
      const res = await request(app)
        .post('/api/fuelQuote')
        .send({
          gallonsRequested: '500',
          delivAddress: '123 Nunya ln',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Missing required fields');
    });

    test('POST / with missing delivAddress field', async () => {
      const res = await request(app)
        .post('/api/fuelQuote')
        .send({
          gallonsRequested: '500',
          delivDate: new Date().toISOString().split('T')[0], // Future date for delivery
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Missing required fields');
    });

    // test('POST / with invalid data type for gallonsRequested', async () => {
    //     const res = await request(app).post('/api/fuelQuote').send({
    //       gallonsRequested: 'notANumber',
    //       delivDate: new Date().toISOString().split('T')[0], // Use a valid future date
    //       delivAddress: '123 Nunya ln',
    //     });
    //     expect(res.statusCode).toBe(400);
    //     expect(res.body).toHaveProperty('message');
    //     expect(res.body.message).toBe('Invalid data type for gallons requested');
    //   });

    //   test('POST / with negative gallonsRequested', async () => {
    //     const res = await request(app).post('/api/fuelQuote').send({
    //       gallonsRequested: '-500',
    //       delivDate: new Date().toISOString().split('T')[0], // Use a valid future date
    //       delivAddress: '123 Nunya ln',
    //     });
    //     expect(res.statusCode).toBe(400);
    //     expect(res.body).toHaveProperty('message');
    //     expect(res.body.message).toBe('gallons requested cannot be negative');
    //   });

    //   test('POST / with a past delivDate', async () => {
    //     const pastDate = new Date();
    //     pastDate.setDate(pastDate.getDate() - 1); // Set to yesterday
    
    //     const res = await request(app).post('/api/fuelQuote').send({
    //       gallonsRequested: '500',
    //       delivDate: pastDate.toISOString().split('T')[0],
    //       delivAddress: '123 Nunya ln',
    //     });
    //     expect(res.statusCode).toBe(400);
    //     expect(res.body).toHaveProperty('message');
    //     expect(res.body.message).toBe('delivery date cannot be in the past');
    //   });
  });
});
