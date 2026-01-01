$ErrorActionPreference = 'Stop'

function Assert-True($cond, [string]$msg) {
  $ok = $false
  if ($null -eq $cond) {
    $ok = $false
  } elseif ($cond -is [bool]) {
    $ok = $cond
  } elseif ($cond -is [string]) {
    $ok = -not [string]::IsNullOrWhiteSpace($cond)
  } elseif ($cond -is [int] -or $cond -is [long] -or $cond -is [double]) {
    $ok = ($cond -ne 0)
  } else {
    # Treat presence of any other object as truthy
    $ok = $true
  }

  if (-not $ok) { throw "ASSERTION FAILED: $msg" }
}

function Quote-Arg([string]$s) {
  # Start-Process joins args into a single string; we must quote paths with spaces.
  $escaped = $s -replace '"', '""'
  return '"' + $escaped + '"'
}

$root = Split-Path -Parent $PSScriptRoot
$distApi = Join-Path $root 'dist\api.js'
$distWorker = Join-Path $root 'dist\worker.js'
$ffprobeStub = Join-Path $PSScriptRoot 'ffprobe-stub.js'
$serveScript = Join-Path $PSScriptRoot 'serve-test-file.js'

Assert-True (Test-Path $distApi) "Missing dist/api.js. Run: npm run build"
Assert-True (Test-Path $distWorker) "Missing dist/worker.js. Run: npm run build"
Assert-True (Test-Path $ffprobeStub) "Missing ffprobe stub"
Assert-True (Test-Path $serveScript) "Missing serve script"

$apiPort = 8085
$filePort = 8099

$dataDir = Join-Path $root 'data_test'
$storageDir = Join-Path $root 'storage_test'

# Clean test dirs
if (Test-Path $dataDir) { Remove-Item -Recurse -Force $dataDir }
if (Test-Path $storageDir) { Remove-Item -Recurse -Force $storageDir }
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
New-Item -ItemType Directory -Force -Path $storageDir | Out-Null

$envMap = @{
  DOWNLOAD_SIGNING_SECRET = 'dev-secret'
  PORT = "$apiPort"
  PUBLIC_BASE_URL = "http://localhost:$apiPort"
  DATA_DIR = $dataDir
  STORAGE_DIR = $storageDir
  FILE_TTL_SECONDS = '120'
  FREE_QUEUE_DELAY_SECONDS = '0'
  FFPROBE_PATH = $ffprobeStub
  FFPROBE_TIMEOUT_MS = '2000'
}

$serverProc = $null
$apiProc = $null
$workerProc = $null

try {
  foreach ($k in $envMap.Keys) { Set-Item -Path "Env:$k" -Value $envMap[$k] }

  $env:TEST_FILE_PORT = "$filePort"
  $serverProc = Start-Process -FilePath node -ArgumentList (Quote-Arg $serveScript) -NoNewWindow -PassThru

  Start-Sleep -Milliseconds 400

  $apiProc = Start-Process -FilePath node -ArgumentList (Quote-Arg $distApi) -NoNewWindow -PassThru

  Start-Sleep -Milliseconds 400

  $workerProc = Start-Process -FilePath node -ArgumentList (Quote-Arg $distWorker) -NoNewWindow -PassThru

  Start-Sleep -Milliseconds 700

  # Health
  $health = Invoke-RestMethod -Method GET -Uri "http://localhost:$apiPort/api/health"
  Assert-True ($health.ok -eq $true) 'Health endpoint failed'

  # Submit job
  $submitBody = @{ url = "http://127.0.0.1:$filePort/media.bin"; kind = 'video' } | ConvertTo-Json
  $submit = Invoke-RestMethod -Method POST -Uri "http://localhost:$apiPort/api/jobs" -ContentType 'application/json' -Body $submitBody
  Assert-True ($submit.jobId) 'Job ID missing'

  $jobId = $submit.jobId

  # Poll until ready/failed
  $status = $null
  for ($i = 0; $i -lt 40; $i++) {
    $status = Invoke-RestMethod -Method GET -Uri "http://localhost:$apiPort/api/jobs/$jobId"
    if ($status.status -eq 'ready' -or $status.status -eq 'failed') { break }
    Start-Sleep -Milliseconds 500
  }

  Assert-True ($status.status -eq 'ready') "Job did not become ready (status=$($status.status))"
  Assert-True ($status.result.expiresAt) 'Missing expiresAt'

  # Get download link
  $dl = Invoke-RestMethod -Method GET -Uri "http://localhost:$apiPort/api/jobs/$jobId/download-link"
  Assert-True ($dl.url) 'Missing download url'

  # Download (one-time)
  $outFile = Join-Path $root 'download_test.bin'
  if (Test-Path $outFile) { Remove-Item -Force $outFile }

  Invoke-WebRequest -Uri $dl.url -OutFile $outFile | Out-Null
  Assert-True (Test-Path $outFile) 'Download file not created'
  Assert-True ((Get-Item $outFile).Length -gt 0) 'Downloaded file is empty'

  # After successful download, job should be expired and storage deleted
  Start-Sleep -Milliseconds 500
  $status2 = Invoke-RestMethod -Method GET -Uri "http://localhost:$apiPort/api/jobs/$jobId"
  Assert-True ($status2.status -eq 'expired') "Expected expired after download, got $($status2.status)"

  $jobDir = Join-Path $storageDir $jobId
  Assert-True (-not (Test-Path $jobDir)) 'Job storage directory should be deleted'

  "INTEGRATION TEST PASSED" | Write-Output
  exit 0
}
finally {
  foreach ($p in @($workerProc, $apiProc, $serverProc)) {
    if ($null -ne $p) {
      try { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } catch {}
    }
  }
}
