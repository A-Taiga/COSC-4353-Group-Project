import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { calculatePrice } from '../controllers/pricingController'; // Adjust the import path as necessary

// Mocking the services
jest.mock('../services/quote.service', () => ({
  getFuelQuotes: jest.fn()
}));

const app = express();
app.use(bodyParser.json());
app.post('/calculate-price', calculatePrice);

describe('calculatePrice Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if user_id is missing', async () => {
    const response = await request(app)
      .post('/calculate-price')
      .send({ gallonsRequested: '500', deliveryAddress: '123 Main St' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/calculate-price')
      .send({ user_id: '1' }); // Missing gallonsRequested and deliveryAddress
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Missing required fields');
  });

  it('should return 400 if gallons requested is not a positive number', async () => {
    const response = await request(app)
      .post('/calculate-price')
      .send({
        user_id: '1',
        gallonsRequested: '0',
        deliveryAddress: '123 Main St'
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Gallons requested must be a positive number');
  });

  it('should calculate the price correctly', async () => {
    require('../services/quote.service').getFuelQuotes.mockResolvedValue([]); // No history
    const response = await request(app)
      .post('/calculate-price')
      .send({
        user_id: '1',
        gallonsRequested: '1000',
        deliveryAddress: '789 Main St'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Price calculated successfully');
    expect(response.body.pricingResult).toHaveProperty('suggestedPrice');
    expect(response.body.pricingResult).toHaveProperty('totalPrice');
  });

  it('should calculate different prices based on address in Texas', async () => {
    require('../services/quote.service').getFuelQuotes.mockResolvedValue([{ quoteId: 'quote1' }]); // Has history
    const response = await request(app)
      .post('/calculate-price')
      .send({
        user_id: '1',
        gallonsRequested: '1500',
        deliveryAddress: 'Houston, TX'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Price calculated successfully');
    expect(parseFloat(response.body.pricingResult.suggestedPrice)).toBeLessThan(1.674); // Expected value with Texas factor
    expect(parseFloat(response.body.pricingResult.totalPrice)).toBeGreaterThan(2500); // Total price based on calculated rates
  });
});
