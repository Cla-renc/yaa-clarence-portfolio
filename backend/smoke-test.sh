#!/usr/bin/env bash
BASE=${1:-http://localhost:5000}
echo "Using base URL: $BASE"

healthy=false
for i in $(seq 1 15); do
  if curl -s "$BASE/health" | grep -q '"status":"ok"'; then
    healthy=true
    break
  fi
  sleep 1
done

if [ "$healthy" != true ]; then
  echo "Health check failed"
  exit 2
fi

echo "Health OK — posting smoke events"

analytics='{"eventType":"smoke","page":"smoke-test","path":"/smoke","metadata":{"test":"yes"}}'
curl -s -X POST -H "Content-Type: application/json" -d "$analytics" "$BASE/api/social-metrics/collect" | jq -c || true

contact='{"name":"Shell Tester","email":"shell@test.local","subject":"Smoke Test","message":"Shell automated smoke test"}'
curl -s -X POST -H "Content-Type: application/json" -d "$contact" "$BASE/api/contact" | jq -c || true

exit 0
