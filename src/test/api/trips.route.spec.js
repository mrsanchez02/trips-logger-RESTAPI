const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Trip = require('../../models/trip.model');
require('dotenv').config({path:'../../.env.test.local'});

describe('Testing Trips API', () => {

  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1/testdb-trip-logger');
  })

  afterAll(async () => {
    await mongoose.disconnect();
  })

  describe('GET /api/trips', () => {
    let response;
    
    beforeEach(async ()=>{
      response = await request(app).get('/api/trips').send();
    });

    it('should return a 200 status code', () => {
      expect(response.statusCode).toBe(200);
      expect(response.header['content-type']).toContain('json');

    });

    it('should return an Array of trips', () => {
      expect(response.body).toBeInstanceOf(Array);

    });


  });

  describe('POST /api/trips', () => {

    const newTrip = {
      name: "Test Trip",
      destination: "Berlin",
      category:'Business',
      start_date: '2022-05-02'
    };

    const wrongTrip = {
      name: "Test Trip"
    };

    afterEach(async () => {
      await Trip.deleteMany({ name: 'Test Trip'});

    });

    it('should return a 201 status code', async ()=> {
      const response = await request(app).post('/api/trips').send(newTrip);

      expect(response.statusCode).toBe(201);
      expect(response.headers['content-type']).toMatch(/json/);

    });

    it('should insert the new trip', async () => {
      const response = await request(app).post('/api/trips').send(newTrip);

      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe(newTrip.name);

    });

    it('should return an error with a 500 status code', async () => {
      const response = await request(app).post('/api/trips').send(wrongTrip);
      
      expect(response.body.error).toBeDefined();
      expect(response.status).toBe(500);

    });

  });

  describe('PUT /api/trips', () => {
    let trip;

    beforeEach(async () => {
      trip = await Trip.create({ 
        name: 'test trip', 
        destination: 'Berlin', 
        category: 'Friends', 
        start_date: '2022-12-19' 
      });

    });

    afterEach(async () => {
      await Trip.findByIdAndDelete(trip._id);

    });

    it('should return a 200 status code', async () => {
      const response = await request(app).put(`/api/trips/${trip._id}`).send({
        name: 'test trip updated'
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);

    });

    it('should update correctly', async () => {
      const response = await request(app).put(`/api/trips/${trip._id}`).send({
        name: 'test trip updated'
      });

      expect(response.body._id).toBeDefined()
      expect(response.body.name).toBe('test trip updated')

    });

  });

  describe('DELETE /api/trips', () => {
    let trip;
    let response;
    beforeEach(async () => {
      trip = await Trip.create({ 
        name: 'test trip', 
        destination: 'Berlin', 
        category: 'Friends', 
        start_date: '2022-12-19' 
      });
      response = await request(app).delete(`/api/trips/${trip._id}`).send();

    });

    afterEach(async () => {
      await Trip.findByIdAndDelete(trip._id);

    });

    it('should return a 200 status code', async () => {
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);

    });

    it('should delete the trip correctly', async () => {
      expect(response.body._id).toBeDefined();
      
      const foundTrip = await Trip.findById(trip._id);
      expect(foundTrip).toBeNull();

    });
    
  });

});