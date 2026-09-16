import { describe, it, expect } from 'vitest';
import request from 'supertest';
const app = require('../app');

describe('GET / (Health check)', () => {
  it('returns status 200 with running message', async () => {
    const res = await request(app).get('/');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'running' });
  });
});