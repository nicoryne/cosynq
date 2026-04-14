# Performance Testing Script for cosynq UI/UX Overhaul
# This script runs comprehensive performance tests and generates reports

$ErrorActionPreference = "Stop"

Write-Host "🚀 cosynq Performance Testing Suite" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if production build exists
if (-not (Test-Path ".next")) {
    Write-Host "⚠️  No production build found. Building now..." -ForegroundColor Yellow
    npm run build
}

# Start production server in background
Write-Host "✓ Starting production server..." -ForegroundColor Green
$serverProcess = Start-Process -FilePath "npm" -ArgumentList "run", "start" -PassThru -NoNewWindow

# Wait for server to be ready
Write-Host "Waiting for server to start..."
Start-Sleep -Seconds 5

# Function to cleanup on exit
function Cleanup {
    Write-Host ""
    Write-Host "Cleaning up..."
    if ($serverProcess -and !$serverProcess.HasExited) {
        Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    }
}

# Register cleanup on exit
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Cleanup } | Out-Null

try {
    # Check if Lighthouse is installed
    $lighthouseInstalled = Get-Command lighthouse -ErrorAction SilentlyContinue
    if (-not $lighthouseInstalled) {
        Write-Host "⚠️  Lighthouse not found. Installing..." -ForegroundColor Yellow
        npm install -g lighthouse
    }

    # Create reports directory
    New-Item -ItemType Directory -Force -Path "reports/performance" | Out-Null

    Write-Host ""
    Write-Host "📊 Running Performance Audits..." -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan

    # Run Lighthouse on landing page
    Write-Host ""
    Write-Host "1️⃣  Testing Landing Page (/)..."
    lighthouse http://localhost:3000 `
        --only-categories=performance `
        --output=html `
        --output=json `
        --output-path=./reports/performance/landing-page `
        --chrome-flags="--headless" `
        --quiet

    # Run Lighthouse on sign-in page
    Write-Host ""
    Write-Host "2️⃣  Testing Sign-In Page (/sign-in)..."
    lighthouse http://localhost:3000/sign-in `
        --only-categories=performance `
        --output=html `
        --output=json `
        --output-path=./reports/performance/sign-in-page `
        --chrome-flags="--headless" `
        --quiet

    # Run Lighthouse on sign-up page
    Write-Host ""
    Write-Host "3️⃣  Testing Sign-Up Page (/sign-up)..."
    lighthouse http://localhost:3000/sign-up `
        --only-categories=performance `
        --output=html `
        --output=json `
        --output-path=./reports/performance/sign-up-page `
        --chrome-flags="--headless" `
        --quiet

    Write-Host ""
    Write-Host "✅ Performance audits complete!" -ForegroundColor Green
    Write-Host ""

    # Parse and display results
    Write-Host "📈 Performance Scores:" -ForegroundColor Cyan
    Write-Host "=====================" -ForegroundColor Cyan

    # Function to extract score from JSON
    function Get-PerformanceScore {
        param($FilePath)
        $json = Get-Content $FilePath | ConvertFrom-Json
        return [Math]::Round($json.categories.performance.score * 100)
    }

    # Function to extract metric from JSON
    function Get-Metric {
        param($FilePath, $MetricName)
        $json = Get-Content $FilePath | ConvertFrom-Json
        $audit = $json.audits.$MetricName
        if ($audit.displayValue) {
            return $audit.displayValue
        } elseif ($audit.numericValue) {
            return $audit.numericValue
        } else {
            return "N/A"
        }
    }

    # Landing Page Results
    $landingScore = Get-PerformanceScore "./reports/performance/landing-page.report.json"
    $landingFCP = Get-Metric "./reports/performance/landing-page.report.json" "first-contentful-paint"
    $landingLCP = Get-Metric "./reports/performance/landing-page.report.json" "largest-contentful-paint"
    $landingCLS = Get-Metric "./reports/performance/landing-page.report.json" "cumulative-layout-shift"
    $landingTTI = Get-Metric "./reports/performance/landing-page.report.json" "interactive"

    Write-Host ""
    Write-Host "Landing Page (/):"
    Write-Host "  Performance Score: $landingScore/100"
    Write-Host "  FCP: $landingFCP"
    Write-Host "  LCP: $landingLCP"
    Write-Host "  CLS: $landingCLS"
    Write-Host "  TTI: $landingTTI"

    # Sign-In Page Results
    $signinScore = Get-PerformanceScore "./reports/performance/sign-in-page.report.json"
    $signinFCP = Get-Metric "./reports/performance/sign-in-page.report.json" "first-contentful-paint"
    $signinLCP = Get-Metric "./reports/performance/sign-in-page.report.json" "largest-contentful-paint"
    $signinCLS = Get-Metric "./reports/performance/sign-in-page.report.json" "cumulative-layout-shift"
    $signinTTI = Get-Metric "./reports/performance/sign-in-page.report.json" "interactive"

    Write-Host ""
    Write-Host "Sign-In Page (/sign-in):"
    Write-Host "  Performance Score: $signinScore/100"
    Write-Host "  FCP: $signinFCP"
    Write-Host "  LCP: $signinLCP"
    Write-Host "  CLS: $signinCLS"
    Write-Host "  TTI: $signinTTI"

    # Sign-Up Page Results
    $signupScore = Get-PerformanceScore "./reports/performance/sign-up-page.report.json"
    $signupFCP = Get-Metric "./reports/performance/sign-up-page.report.json" "first-contentful-paint"
    $signupLCP = Get-Metric "./reports/performance/sign-up-page.report.json" "largest-contentful-paint"
    $signupCLS = Get-Metric "./reports/performance/sign-up-page.report.json" "cumulative-layout-shift"
    $signupTTI = Get-Metric "./reports/performance/sign-up-page.report.json" "interactive"

    Write-Host ""
    Write-Host "Sign-Up Page (/sign-up):"
    Write-Host "  Performance Score: $signupScore/100"
    Write-Host "  FCP: $signupFCP"
    Write-Host "  LCP: $signupLCP"
    Write-Host "  CLS: $signupCLS"
    Write-Host "  TTI: $signupTTI"

    Write-Host ""
    Write-Host "📁 Detailed reports saved to:"
    Write-Host "  - reports/performance/landing-page.report.html"
    Write-Host "  - reports/performance/sign-in-page.report.html"
    Write-Host "  - reports/performance/sign-up-page.report.html"

    # Check if scores meet requirements
    Write-Host ""
    Write-Host "🎯 Checking Requirements (Task 11.2):" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan

    $pass = $true

    # Check if all scores are 90+
    if ($landingScore -lt 90) {
        Write-Host "❌ Landing page score ($landingScore) is below 90" -ForegroundColor Red
        $pass = $false
    } else {
        Write-Host "✓ Landing page score: $landingScore/100" -ForegroundColor Green
    }

    if ($signinScore -lt 90) {
        Write-Host "❌ Sign-in page score ($signinScore) is below 90" -ForegroundColor Red
        $pass = $false
    } else {
        Write-Host "✓ Sign-in page score: $signinScore/100" -ForegroundColor Green
    }

    if ($signupScore -lt 90) {
        Write-Host "❌ Sign-up page score ($signupScore) is below 90" -ForegroundColor Red
        $pass = $false
    } else {
        Write-Host "✓ Sign-up page score: $signupScore/100" -ForegroundColor Green
    }

    Write-Host ""
    if ($pass) {
        Write-Host "✅ All performance requirements met!" -ForegroundColor Green
        exit 0
    } else {
        Write-Host "❌ Some performance requirements not met. Review the reports for details." -ForegroundColor Red
        exit 1
    }
}
finally {
    Cleanup
}
