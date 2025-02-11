const request = require('supertest');
const { app, connectToDatabase } = require('../index.js');
const mongoose = require('mongoose');

describe('POST /api/v1/users/authenticate', () => {
  beforeAll(async () => {
    jest.setTimeout(10000);
    await connectToDatabase(); // Connette il database per i test
  });

  afterAll(async () => {
    await mongoose.connection.close(true);
  });

  test('should authenticate the user correctly (200)', async () => {
    expect.assertions(4);
    const response = await request(app)
      .post('/api/v1/users/authenticate')
      .send({
        username: 'federico@gmail.com',
        password: 'unitn',
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('AuthNToken');
    expect(response.body).toHaveProperty('role');
  });

  test('should return 400 if the user does not exist', async () => {
    expect.assertions(2);
    const response = await request(app)
      .post('/api/v1/users/authenticate')
      .send({
        username: 'nonexistent@example.com',
        password: 'randompassword',
      })
      .set('Accept', 'application/json');
  
  
    expect(response.status).toBe(400); // Cambiato da 400 a 401
    expect(response.body).toHaveProperty('error');
  });

  test('should return 401 if authentication fails (wrong password)', async () => {
    expect.assertions(2);
    const response = await request(app)
      .post('/api/v1/users/authenticate')
      .send({
        username: 'federico@gmail.com',
        password: 'wrongpassword',
      })
      .set('Accept', 'application/json');
      
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  test('should return 400 if request body is missing', async () => {
    expect.assertions(2);
    const response = await request(app)
      .post('/api/v1/users/authenticate')
      .send({})
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('should return 400 if username or password is missing', async () => {
    expect.assertions(2);
    const response = await request(app)
      .post('/api/v1/users/authenticate')
      .send({ username: 'federico@gmail.com' }) // Password mancante
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});