// Simple smoke test for backend endpoints: /health, /api/social-metrics/collect, /api/contact
// Uses global fetch available in Node 18+. Run: `node scripts/smokeTest.js` or `npm run smoke`

const BASE = process.env.BASE_URL || 'http://localhost:5000';
const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function waitForHealthy(retries = 15, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE}/health`);
      if (res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.status === 'ok') return true;
      }
    } catch (err) {
      // ignore
    }
    await wait(delay);
  }
  return false;
}

async function run() {
  console.log('BASE:', BASE);
  const healthy = await waitForHealthy();
  if (!healthy) {
    console.error('Server did not become healthy in time');
    process.exitCode = 2;
    return;
  }

  console.log('Health OK — running smoke requests');

  try {
    const analyticsPayload = { eventType: 'smoke', page: 'smoke-test', path: '/smoke', metadata: { test: 'yes' } };
    const a = await fetch(`${BASE}/api/social-metrics/collect`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(analyticsPayload)
    });
    const aJson = await a.json().catch(() => ({}));
    console.log('Analytics response:', JSON.stringify(aJson));
  } catch (err) {
    console.error('Analytics request failed:', err.message);
  }

  try {
    const contactPayload = { name: 'Smoke Tester', email: 'smoke@test.local', subject: 'Smoke Test', message: 'Automated smoke test message.' };
    const c = await fetch(`${BASE}/api/contact`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contactPayload)
    });
    const cJson = await c.json().catch(() => ({}));
    console.log('Contact response:', JSON.stringify(cJson));
  } catch (err) {
    console.error('Contact request failed:', err.message);
  }
}

run().then(() => { process.exitCode = 0; }).catch(err => { console.error(err); process.exitCode = 1; });
