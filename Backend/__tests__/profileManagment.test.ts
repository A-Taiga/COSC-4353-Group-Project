import request from 'supertest'
import app from '../app'

test("POST / valid data", async () => {
  
    const res = await request(app).post("/api/profile-management").send({
      fullname: 'Chungus',
      address1: 'shit',
      city: 'shit',
      state: 'TX',
      zipcode: '12345-1234',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("profile saved");
  });