import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { profile, loadProfile } from '../controllers/profileController'; // Adjust the import path as necessary

// Mocking the services
jest.mock('../services/profile.service', () => ({
  findUserProfile: jest.fn(),
  upsertUserProfile: jest.fn()
}));

const app = express();
app.use(bodyParser.json());
app.post('/profile', profile);
app.post('/load-profile', loadProfile);

describe('Profile Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('profile - Create / Update Profile', () => {
    it('should return 400 if required fields are missing or incorrect types', async () => {
      const response = await request(app).post('/profile').send({
        user_id: '1',
        firstName: '', // Intentionally left blank to trigger validation
        lastName: '',
        address1: '',
        city: '',
        state: 'XX', // Invalid state
        zipcode: '123', // Invalid zip
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing required fields.');
    });

    it('should return error if user is not authorized', async () => {
      const response = await request(app).post('/profile').send({ firstName: 'John' });
      expect(response.status).toBe(500);
      expect(response.text).toContain('Unauthorized');
    });

    it('should return 400 if the state code is not valid', async () => {
      const response = await request(app).post('/profile').send({
        user_id: '1',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Elm St',
        city: 'Springfield',
        state: 'XX', // Invalid state code
        zipcode: '12345'
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Not a valid state code');
    });

    it('should return 400 if the zipcode is invalid', async () => {
      const response = await request(app).post('/profile').send({
        user_id: '1',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Elm St',
        city: 'Springfield',
        state: 'TX',
        zipcode: '1234' // Invalid zipcode format
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Zipcode invalid');
    });

    it('should return 200 and save profile if all validations pass', async () => {
      require('../services/profile.service').upsertUserProfile.mockResolvedValue({
        firstName: 'john', lastName: 'doe', addressOne: '123 Elm St', city: 'Springfield', state: 'TX', zip: '12345-6789'
      });
      const response = await request(app).post('/profile').send({
        user_id: '1',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Elm St',
        address2: 'Apt 5',
        city: 'Springfield',
        state: 'TX',
        zipcode: '12345-6789'
      });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('profile saved');
    });
  });

  describe('loadProfile - Load User Profile', () => {
    it('should return error if user is not authorized', async () => {
      const response = await request(app).post('/load-profile').send({});
      expect(response.status).toBe(500);
      expect(response.text).toContain('Unauthorized');
    });

    it('should return 200 and message if profile is not found', async () => {
      require('../services/profile.service').findUserProfile.mockResolvedValue(null);
      const response = await request(app).post('/load-profile').send({ user_id: '1' });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile not found');
    });

    it('should return 200 and profile if user profile exists', async () => {
      require('../services/profile.service').findUserProfile.mockResolvedValue({
        firstName: 'John', lastName: 'Doe',
        addressOne: '123 Elm St',
        city: 'Springfield',
        state: 'TX',
        zip: '12345'
      });
      const response = await request(app).post('/load-profile').send({ user_id: '1' });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile loaded successfully');
      expect(response.body.profile).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        addressOne: '123 Elm St',
        city: 'Springfield',
        state: 'TX',
        zip: '12345'
      });
    });
  });
});
