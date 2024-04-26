import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { submitFuelQuote, getFuelQuoteHistory, getDeliveryAddress } from '../controllers/quoteController'; // Adjust the import path as necessary

// Mocking the services
jest.mock('../services/quote.service', () => ({
  createFuelQuote: jest.fn(),
  getFuelQuotes: jest.fn()
}));
jest.mock('../services/profile.service', () => ({
  findUserProfile: jest.fn()
}));

const app = express();
app.use(bodyParser.json());
app.post('/submit-fuel-quote', submitFuelQuote);
app.post('/get-fuel-quote-history', getFuelQuoteHistory);
app.post('/get-delivery-address', getDeliveryAddress);

describe('Fuel Quote Controller', () => {
  describe('submitFuelQuote', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/submit-fuel-quote')
        .send({ user_id: '1' }); // Partial data
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Missing required fields');
    });

    it('should submit a fuel quote successfully', async () => {
      require('../services/quote.service').createFuelQuote.mockResolvedValue({});
      const response = await request(app)
        .post('/submit-fuel-quote')
        .send({
          user_id: '1',
          gallonsRequested: 100,
          deliveryAddress: '123 Test St',
          deliveryDate: '2022-01-01',
          suggestedPrice: 1.50,
          totalPrice: 150
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Fuel quote submitted successfully');
    });
  });

  describe('getFuelQuoteHistory', () => {
    it('should return the fuel quote history', async () => {
      require('../services/quote.service').getFuelQuotes.mockResolvedValue([{ id: '1', gallonsRequested: 100 }]);
      const response = await request(app)
        .post('/get-fuel-quote-history')
        .send({ user_id: '1' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Get fuel quotes successfully');
      expect(response.body.fuelQuotes.length).toBeGreaterThan(0);
    });
  });

  describe('getDeliveryAddress', () => {
    it('should return 200 with profile not found if profile is incomplete', async () => {
      require('../services/profile.service').findUserProfile.mockResolvedValue({ firstName: 'John' }); // Missing lastName
      const response = await request(app)
        .post('/get-delivery-address')
        .send({ user_id: '1' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });

    it('should return 200 with the user profile successfully', async () => {
      require('../services/profile.service').findUserProfile.mockResolvedValue({ firstName: 'John', lastName: 'Doe' });
      const response = await request(app)
        .post('/get-delivery-address')
        .send({ user_id: '1' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile loaded successfully');
      expect(response.body.profile).toEqual({ firstName: 'John', lastName: 'Doe' });
    });
  });
});
