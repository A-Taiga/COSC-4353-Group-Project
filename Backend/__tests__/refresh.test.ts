import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import refreshToken from '../controllers/refreshController'; 

// Mock dependencies
jest.mock('../services/session.service', () => ({
  getSession: jest.fn()
}));
jest.mock('../utils/auth/jwt', () => ({
  verifyJwt: jest.fn(),
  signJwt: jest.fn(() => 'mockToken')
}));
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'newUuid')
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/refresh-token', refreshToken);

describe('refreshToken Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reject if no refresh token is provided', async () => {
    const response = await request(app).post('/refresh-token');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Forbidden. No refreshToken found in cookies.');
  });

  it('should reject if the refresh token is invalid', async () => {
    require('../utils/auth/jwt').verifyJwt.mockReturnValue({ valid: false });
    const response = await request(app).post('/refresh-token').set('Cookie', ['refreshToken=invalid']);
    expect(response.status).toBe(500);
    expect(response.body.message).toContain('Forbidden. Refresh Payload is missing or invalid.');
  });

  it('should reject if the refresh token is expired', async () => {
    require('../utils/auth/jwt').verifyJwt.mockReturnValue({ valid: false, expired: true });
    const response = await request(app).post('/refresh-token').set('Cookie', ['refreshToken=expiredToken']);
    expect(response.status).toBe(500);
    expect(response.body.message).toContain('Forbidden. Refresh Payload expired.');
  });

  it('should reject if no session found or session is not valid', async () => {
    require('../utils/auth/jwt').verifyJwt.mockReturnValue({ valid: true, decoded: { sub: 'user1', jti: 'session1' } });
    require('../services/session.service').getSession.mockResolvedValue(null);
    const response = await request(app).post('/refresh-token')
      .set('Cookie', ['refreshToken=validToken'])
      .send({ fingerprint: 'validFingerprint' });
    expect(response.status).toBe(500);
    expect(response.body.message).toContain('Forbidden. No session found or not valid.');
  });

  it('should successfully refresh tokens', async () => {
    require('../utils/auth/jwt').verifyJwt.mockReturnValue({ valid: true, decoded: { sub: 'user1', jti: 'session1' } });
    require('../services/session.service').getSession.mockResolvedValue({ id: 'session1', userId: 'user1' });
    const response = await request(app).post('/refresh-token')
      .set('Cookie', ['refreshToken=validToken'])
      .send({ fingerprint: 'validFingerprint' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Refresh token successfully');
    expect(response.body).toHaveProperty('accessToken', 'mockToken');
    expect(response.body).toHaveProperty('csrfToken', 'mockToken');
  });
});
