Smoke tests for backend

This folder includes simple smoke-test helpers to validate the backend is running and that the analytics collection and contact endpoints respond.

Files:
- `scripts/smokeTest.js` — Node script (uses global `fetch`) that waits for `/health` then POSTs to `/api/social-metrics/collect` and `/api/contact`. Run with `node scripts/smokeTest.js` or via `npm run smoke`.
- `smoke-test.ps1` — PowerShell wrapper for Windows.
- `smoke-test.sh` — Bash wrapper for Unix-like shells (requires `curl` and optionally `jq`).

Usage (Node):

```bash
cd backend
# optionally set BASE_URL: BASE_URL=http://localhost:5000 npm run smoke
npm run smoke
```

Usage (PowerShell):

```powershell
.\smoke-test.ps1 -BaseUrl 'http://localhost:5000'
```

Usage (bash):

```bash
./smoke-test.sh http://localhost:5000
```
