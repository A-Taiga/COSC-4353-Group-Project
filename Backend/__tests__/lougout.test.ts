import request from 'supertest';
import createServer from '../utils/server/server';
import { deleteSession } from '../services/session.service';

jest.mock('../services/session.service');

const app = createServer();

describe('user', () => {
  describe('logout', () => {
    const endpoint = '/api/auth/logout';
    
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('POST / successful logout', async () => {
      // Mock deleteSession to simulate successful session deletion
      (deleteSession as jest.Mock).mockResolvedValue(true);

      const res = await request(app)
        .post(endpoint)
        .set('Cookie', ['refreshToken=validToken']);

      expect(deleteSession).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Logged out successfully');
    });

    test('POST / logout with invalid JWT', async () => {
      // Simulate the JWT verification failing
      (deleteSession as jest.Mock).mockResolvedValue(true);

      const res = await request(app)
        .post(endpoint)
        .set('Cookie', ['refreshToken=invalidToken']); // Simulate invalid token

      expect(deleteSession).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Logged out successfully');
    });

    test('POST / logout with valid sessionId when JWT fails', async () => {
      (deleteSession as jest.Mock).mockResolvedValue(true);

      const res = await request(app)
        .post(endpoint)
        .send({ sessionId: 'validSessionId' })
        .set('Cookie', ['refreshToken=invalidToken']);

      expect(deleteSession).toHaveBeenCalledWith('validSessionId');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Logged out successfully');
    });

    test('POST / error during session deletion', async () => {
      // Simulate an error occurring during session deletion
      (deleteSession as jest.Mock).mockRejectedValue(new Error('Session deletion failed'));

      const res = await request(app)
        .post(endpoint)
        .set('Cookie', ['refreshToken=validToken']);

      expect(deleteSession).toHaveBeenCalled();
      expect(res.statusCode).toBe(200); // The controller doesn't handle exceptions to change the status code
      expect(res.text).toBe('Logged out successfully');
    });

    test('POST / logout with no cookies or body data', async () => {
      const res = await request(app)
        .post(endpoint);

      expect(deleteSession).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Logged out successfully');
    });
  });
});
