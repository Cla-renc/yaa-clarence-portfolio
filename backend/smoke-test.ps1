Param(
    [string]$BaseUrl = 'http://localhost:5000'
)

Write-Host "Using base URL: $BaseUrl"

$healthy = $false
for ($i=0; $i -lt 15; $i++) {
    try {
        $r = Invoke-RestMethod -Uri ($BaseUrl + '/health') -Method Get -TimeoutSec 5
        if ($r.status -eq 'ok') { $healthy = $true; break }
    } catch {}
    Start-Sleep -Seconds 1
}

if (-not $healthy) { Write-Host 'Health check failed'; exit 2 }

Write-Host 'Health OK — posting smoke events'

$analytics = @{ eventType='smoke'; page='smoke-test'; path='/smoke'; metadata=@{ test='yes' } }
$a = Invoke-RestMethod -Uri ($BaseUrl + '/api/social-metrics/collect') -Method Post -Body ($analytics | ConvertTo-Json -Depth 5) -ContentType 'application/json'
Write-Host 'Analytics response:' (ConvertTo-Json $a -Compress)

$contact = @{ name='PowerShell Tester'; email='ps@test.local'; subject='Smoke Test'; message='PowerShell automated smoke test' }
$c = Invoke-RestMethod -Uri ($BaseUrl + '/api/contact') -Method Post -Body ($contact | ConvertTo-Json -Depth 5) -ContentType 'application/json'
Write-Host 'Contact response:' (ConvertTo-Json $c -Compress)

exit 0
