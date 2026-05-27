const request = require('supertest');
const app = require('../src/index');

describe('Analytics endpoints', () => {
  test('POST /api/social-metrics/collect should accept event', async () => {
    const res = await request(app)
      .post('/api/social-metrics/collect')
      .send({ eventType: 'test', page: 'jest', path: '/jest', metadata: { run: 'yes' } })
      .set('Accept', 'application/json');

    expect([200,201]).toContain(res.status);
    // body should indicate success:true
    expect(res.body).toBeDefined();
    expect(res.body.success).toBeTruthy();
  });
});
