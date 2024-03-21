import request from 'supertest'
import createServer from '../utils/server/server'

const app = createServer()

test('POST / valid data 1', async () => {
  const res = await request(app).post('/api/profile-management').send({
    fullName: 'Chungus',
    address1: '1234 street name',
    city: 'SomeBigCity',
    state: 'TX',
    zipcode: '12345-1234',
  })
  expect(res.statusCode).toBe(200)
  expect(res.body.fullName).toBe('chungus'); // remember it is made to lowercase
  expect(res.body.address1).toBe('1234 street name');
  expect(res.body.city).toBe('SomeBigCity');
  expect(res.body.state).toBe('TX');
  expect(res.body.zipcode).toBe('12345-1234');
  expect(res.body).toHaveProperty('message');
  expect(res.body.message).toBe('profile saved')
})

test('POST / invalid data 1', async () => {
  const res = await request(app).post('/api/profile-management').send({
    fullName: '',
    address1: '',
    city: '',
    state: '',
    zipcode: '',
  })
  expect(res.statusCode).toBe(400)
  expect(res.body.message).toBe('Some fields are missing.');
  expect(res.body.fullName).toBe("");
  expect(res.body.address1).toBe("");
  expect(res.body.city).toBe("");
  expect(res.body.state).toBe("");
  expect(res.body.zipcode).toBe("");
})

test('POST / valid data 3', async () => {
  const res = await request(app).post('/api/profile-management').send({
    fullName: 'Bill',
    address1: 'Bill\'s street',
    address2: 'Bill\'s second street',
    city: 'City12345',
    state: 'AL',
    zipcode: '12345-1234',
  })
  expect(res.statusCode).toBe(200)
  expect(res.body.message).toBe('profile saved');
  expect(res.body.fullName).toBe('bill');
  expect(res.body.address1).toBe('Bill\'s street');
  expect(res.body.address2).toBe('Bill\'s second street');
  expect(res.body.city).toBe('City12345');
  expect(res.body.state).toBe('AL');
  expect(res.body.zipcode).toBe('12345-1234');
})

test('POST / valid data 4', async () => {
  const res = await request(app).post('/api/profile-management').send({
    fullName: 'Name',
    address1: 'address1',
    city: 'city',
    state: 'TX',
    zipcode: '12345-1234',
  })
  expect(res.statusCode).toBe(200)
  expect(res.body.message).toBe('profile saved');
  expect(res.body.fullName).toBe('name')
  expect(res.body.address1).toBe('address1');
  expect(res.body.city).toBe('city');
  expect(res.body.state).toBe('TX');
  expect(res.body.zipcode).toBe('12345-1234');
})


test('POST / valid zipcode test 1', async () => {
  const res = await request(app).post('/api/profile-management').send({
    fullName: 'Name',
    address1: 'address1',
    city: 'city',
    state: 'TX',
    zipcode: '12345',
  })
  expect(res.statusCode).toBe(200)
  expect(res.body.message).toBe('profile saved');
  expect(res.body.fullName).toBe('name')
  expect(res.body.address1).toBe('address1');
  expect(res.body.city).toBe('city');
  expect(res.body.state).toBe('TX');
  expect(res.body.zipcode).toBe('12345');
})

test('POST / invalid zipcode test 1', async () => {
  const res = await request(app).post('/api/profile-management').send({
    fullName: 'Name',
    address1: 'address1',
    city: 'city',
    state: 'TX',
    zipcode: '12345-',
  })
  expect(res.statusCode).toBe(400)
  expect(res.body.message).toBe('Zipcode invalid');
  expect(res.body.zipcode).toBe('12345-');
})


test('POST / invalid zipcode test 2', async () => {
  const res = await request(app).post('/api/profile-management').send({
    fullName: 'Name',
    address1: 'address1',
    city: 'city',
    state: 'TX',
    zipcode: '12345-1',
  })
  expect(res.statusCode).toBe(400)
  expect(res.body.message).toBe('Zipcode invalid');
  expect(res.body.zipcode).toBe('12345-1');
})

test('POST / invalid zipcode test 3', async () => {
  const res = await request(app).post('/api/profile-management').send({
    fullName: 'Name',
    address1: 'address1',
    city: 'city',
    state: 'TX',
    zipcode: '12345-12345',
  })
  expect(res.statusCode).toBe(400)
  expect(res.body.message).toBe('Zipcode invalid');
  expect(res.body.zipcode).toBe('12345-12345');
})

test('POST / invalid zipcode test 4', async () => {
  const res = await request(app).post('/api/profile-management').send({
    fullName: 'Name',
    address1: 'address1',
    city: 'city',
    state: 'TX',
    zipcode: '123456-1234',
  })
  expect(res.statusCode).toBe(400)
  expect(res.body.message).toBe('Zipcode invalid');
  expect(res.body.zipcode).toBe('123456-1234');
})

test('POST / invalid state test 1', async () => {
  const res = await request(app).post('/api/profile-management').send({
    fullName: 'Name',
    address1: 'address1',
    city: 'city',
    state: 'ST',
    zipcode: '12345-1234',
  })
  expect(res.statusCode).toBe(400)
  expect(res.body.message).toBe('Not a valid state code');
})


