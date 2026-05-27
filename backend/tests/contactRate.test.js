const request = require('supertest');
const app = require('../src/index');

describe('Contact form rate limiting', () => {
  test('allows up to 5 submissions then rate limits', async () => {
    const payload = { name: 'Rate Tester', email: 'ratetest@example.com', subject: 'Rate', message: 'This is a test message for rate limiting.' };

    // send 5 requests - should succeed (201)
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post('/api/contact')
        .send(payload)
        .set('Accept', 'application/json');

      expect([200,201]).toContain(res.status);
      expect(res.body).toBeDefined();
      expect(res.body.success).toBeTruthy();
    }

    // 6th request should be rate-limited (429)
    const res6 = await request(app)
      .post('/api/contact')
      .send(payload)
      .set('Accept', 'application/json');

    expect(res6.status).toBe(429);
  }, 20000);
});
