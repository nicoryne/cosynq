# Accessibility Audit Script (PowerShell)
# Runs automated accessibility tests using Lighthouse, axe-core, and Pa11y
# Requirements: 18.1-18.7, 18.19

Write-Host "🔍 Starting Accessibility Audit for cosynq UI/UX Overhaul" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Check if dev server is running
Write-Host "📡 Checking if development server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Development server is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Development server is not running" -ForegroundColor Red
    Write-Host "Please start the dev server with: npm run dev" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Create reports directory
$reportsDir = "reports/accessibility"
if (-not (Test-Path $reportsDir)) {
    New-Item -ItemType Directory -Path $reportsDir -Force | Out-Null
}
Write-Host "📁 Created reports directory: $reportsDir" -ForegroundColor Green
Write-Host ""

# Run Lighthouse Accessibility Audit
Write-Host "🏠 Running Lighthouse Accessibility Audit..." -ForegroundColor Yellow
Write-Host "--------------------------------------------" -ForegroundColor Yellow
if (Get-Command lighthouse -ErrorAction SilentlyContinue) {
    Write-Host "Testing Landing Page..."
    lighthouse http://localhost:3000 `
        --only-categories=accessibility `
        --output=html `
        --output-path=./reports/accessibility/lighthouse-landing.html `
        --quiet
    
    Write-Host "Testing Sign-In Page..."
    lighthouse http://localhost:3000/sign-in `
        --only-categories=accessibility `
        --output=html `
        --output-path=./reports/accessibility/lighthouse-signin.html `
        --quiet
    
    Write-Host "Testing Sign-Up Page..."
    lighthouse http://localhost:3000/sign-up `
        --only-categories=accessibility `
        --output=html `
        --output-path=./reports/accessibility/lighthouse-signup.html `
        --quiet
    
    Write-Host "✅ Lighthouse audits complete" -ForegroundColor Green
    Write-Host "   Reports saved to reports/accessibility/" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Lighthouse not installed. Install with: npm install -g lighthouse" -ForegroundColor Yellow
}
Write-Host ""

# Run axe-core Accessibility Tests
Write-Host "🪓 Running axe-core Accessibility Tests..." -ForegroundColor Yellow
Write-Host "--------------------------------------------" -ForegroundColor Yellow
if (Get-Command axe -ErrorAction SilentlyContinue) {
    Write-Host "Testing Landing Page..."
    axe http://localhost:3000 `
        --save ./reports/accessibility/axe-landing.json `
        --tags wcag2a,wcag2aa,wcag21a,wcag21aa
    
    Write-Host "Testing Sign-In Page..."
    axe http://localhost:3000/sign-in `
        --save ./reports/accessibility/axe-signin.json `
        --tags wcag2a,wcag2aa,wcag21a,wcag21aa
    
    Write-Host "Testing Sign-Up Page..."
    axe http://localhost:3000/sign-up `
        --save ./reports/accessibility/axe-signup.json `
        --tags wcag2a,wcag2aa,wcag21a,wcag21aa
    
    Write-Host "✅ axe-core tests complete" -ForegroundColor Green
    Write-Host "   Reports saved to reports/accessibility/" -ForegroundColor Gray
} else {
    Write-Host "⚠️  axe-core not installed. Install with: npm install -g @axe-core/cli" -ForegroundColor Yellow
}
Write-Host ""

# Run Pa11y Accessibility Tests
Write-Host "🎯 Running Pa11y Accessibility Tests..." -ForegroundColor Yellow
Write-Host "--------------------------------------------" -ForegroundColor Yellow
if (Get-Command pa11y -ErrorAction SilentlyContinue) {
    Write-Host "Testing Landing Page..."
    pa11y http://localhost:3000 `
        --reporter json `
        --standard WCAG2AA `
        > ./reports/accessibility/pa11y-landing.json
    
    Write-Host "Testing Sign-In Page..."
    pa11y http://localhost:3000/sign-in `
        --reporter json `
        --standard WCAG2AA `
        > ./reports/accessibility/pa11y-signin.json
    
    Write-Host "Testing Sign-Up Page..."
    pa11y http://localhost:3000/sign-up `
        --reporter json `
        --standard WCAG2AA `
        > ./reports/accessibility/pa11y-signup.json
    
    Write-Host "✅ Pa11y tests complete" -ForegroundColor Green
    Write-Host "   Reports saved to reports/accessibility/" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Pa11y not installed. Install with: npm install -g pa11y" -ForegroundColor Yellow
}
Write-Host ""

# Run custom accessibility tests
Write-Host "🧪 Running Custom Accessibility Tests..." -ForegroundColor Yellow
Write-Host "--------------------------------------------" -ForegroundColor Yellow
if (Test-Path "test/accessibility/a11y-audit.test.ts") {
    npm run test -- test/accessibility/a11y-audit.test.ts
    Write-Host "✅ Custom tests complete" -ForegroundColor Green
} else {
    Write-Host "⚠️  Custom test file not found" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "📊 Accessibility Audit Summary" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Reports generated:"
Write-Host "  - Lighthouse: reports/accessibility/lighthouse-*.html"
Write-Host "  - axe-core:   reports/accessibility/axe-*.json"
Write-Host "  - Pa11y:      reports/accessibility/pa11y-*.json"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Review Lighthouse reports in browser"
Write-Host "  2. Check axe-core JSON reports for violations"
Write-Host "  3. Check Pa11y JSON reports for errors"
Write-Host "  4. Run manual tests (see test/accessibility/a11y-audit.test.ts)"
Write-Host ""
Write-Host "✅ Accessibility audit complete!" -ForegroundColor Green
Write-Host ""

# Check for critical issues
Write-Host "🔍 Checking for critical issues..." -ForegroundColor Yellow
Write-Host "--------------------------------------------" -ForegroundColor Yellow

$criticalIssues = 0

# Check axe-core violations
Get-ChildItem -Path "reports/accessibility/axe-*.json" -ErrorAction SilentlyContinue | ForEach-Object {
    $content = Get-Content $_.FullName -Raw | ConvertFrom-Json
    $violations = $content.violations.Count
    if ($violations -gt 0) {
        Write-Host "❌ Found $violations violations in $($_.Name)" -ForegroundColor Red
        $criticalIssues += $violations
    } else {
        Write-Host "✅ No violations in $($_.Name)" -ForegroundColor Green
    }
}

# Check Pa11y errors
Get-ChildItem -Path "reports/accessibility/pa11y-*.json" -ErrorAction SilentlyContinue | ForEach-Object {
    $content = Get-Content $_.FullName -Raw | ConvertFrom-Json
    $errors = $content.Count
    if ($errors -gt 0) {
        Write-Host "❌ Found $errors errors in $($_.Name)" -ForegroundColor Red
        $criticalIssues += $errors
    } else {
        Write-Host "✅ No errors in $($_.Name)" -ForegroundColor Green
    }
}

Write-Host ""
if ($criticalIssues -eq 0) {
    Write-Host "🎉 No critical accessibility issues found!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Found $criticalIssues critical accessibility issues" -ForegroundColor Red
    Write-Host "Please review the reports and fix the issues." -ForegroundColor Yellow
    exit 1
}
