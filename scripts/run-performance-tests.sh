#!/bin/bash

# Performance Testing Script for cosynq UI/UX Overhaul
# This script runs comprehensive performance tests and generates reports

set -e

echo "🚀 cosynq Performance Testing Suite"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if production build exists
if [ ! -d ".next" ]; then
    echo -e "${YELLOW}⚠️  No production build found. Building now...${NC}"
    npm run build
fi

# Start production server in background
echo -e "${GREEN}✓${NC} Starting production server..."
npm run start &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server to start..."
sleep 5

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Cleaning up..."
    kill $SERVER_PID 2>/dev/null || true
    exit
}

trap cleanup EXIT INT TERM

# Check if Lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo -e "${YELLOW}⚠️  Lighthouse not found. Installing...${NC}"
    npm install -g lighthouse
fi

# Create reports directory
mkdir -p reports/performance

echo ""
echo "📊 Running Performance Audits..."
echo "================================"

# Run Lighthouse on landing page
echo ""
echo "1️⃣  Testing Landing Page (/)..."
lighthouse http://localhost:3000 \
    --only-categories=performance \
    --output=html \
    --output=json \
    --output-path=./reports/performance/landing-page \
    --chrome-flags="--headless" \
    --quiet

# Run Lighthouse on sign-in page
echo ""
echo "2️⃣  Testing Sign-In Page (/sign-in)..."
lighthouse http://localhost:3000/sign-in \
    --only-categories=performance \
    --output=html \
    --output=json \
    --output-path=./reports/performance/sign-in-page \
    --chrome-flags="--headless" \
    --quiet

# Run Lighthouse on sign-up page
echo ""
echo "3️⃣  Testing Sign-Up Page (/sign-up)..."
lighthouse http://localhost:3000/sign-up \
    --only-categories=performance \
    --output=html \
    --output=json \
    --output-path=./reports/performance/sign-up-page \
    --chrome-flags="--headless" \
    --quiet

echo ""
echo "✅ Performance audits complete!"
echo ""

# Parse and display results
echo "📈 Performance Scores:"
echo "====================="

# Function to extract score from JSON
extract_score() {
    local file=$1
    local score=$(node -e "console.log(Math.round(require('$file').categories.performance.score * 100))")
    echo $score
}

# Function to extract metric from JSON
extract_metric() {
    local file=$1
    local metric=$2
    local value=$(node -e "const data = require('$file'); const audit = data.audits['$metric']; console.log(audit.displayValue || audit.numericValue || 'N/A')")
    echo $value
}

# Landing Page Results
LANDING_SCORE=$(extract_score "./reports/performance/landing-page.report.json")
LANDING_FCP=$(extract_metric "./reports/performance/landing-page.report.json" "first-contentful-paint")
LANDING_LCP=$(extract_metric "./reports/performance/landing-page.report.json" "largest-contentful-paint")
LANDING_CLS=$(extract_metric "./reports/performance/landing-page.report.json" "cumulative-layout-shift")
LANDING_TTI=$(extract_metric "./reports/performance/landing-page.report.json" "interactive")

echo ""
echo "Landing Page (/):"
echo "  Performance Score: $LANDING_SCORE/100"
echo "  FCP: $LANDING_FCP"
echo "  LCP: $LANDING_LCP"
echo "  CLS: $LANDING_CLS"
echo "  TTI: $LANDING_TTI"

# Sign-In Page Results
SIGNIN_SCORE=$(extract_score "./reports/performance/sign-in-page.report.json")
SIGNIN_FCP=$(extract_metric "./reports/performance/sign-in-page.report.json" "first-contentful-paint")
SIGNIN_LCP=$(extract_metric "./reports/performance/sign-in-page.report.json" "largest-contentful-paint")
SIGNIN_CLS=$(extract_metric "./reports/performance/sign-in-page.report.json" "cumulative-layout-shift")
SIGNIN_TTI=$(extract_metric "./reports/performance/sign-in-page.report.json" "interactive")

echo ""
echo "Sign-In Page (/sign-in):"
echo "  Performance Score: $SIGNIN_SCORE/100"
echo "  FCP: $SIGNIN_FCP"
echo "  LCP: $SIGNIN_LCP"
echo "  CLS: $SIGNIN_CLS"
echo "  TTI: $SIGNIN_TTI"

# Sign-Up Page Results
SIGNUP_SCORE=$(extract_score "./reports/performance/sign-up-page.report.json")
SIGNUP_FCP=$(extract_metric "./reports/performance/sign-up-page.report.json" "first-contentful-paint")
SIGNUP_LCP=$(extract_metric "./reports/performance/sign-up-page.report.json" "largest-contentful-paint")
SIGNUP_CLS=$(extract_metric "./reports/performance/sign-up-page.report.json" "cumulative-layout-shift")
SIGNUP_TTI=$(extract_metric "./reports/performance/sign-up-page.report.json" "interactive")

echo ""
echo "Sign-Up Page (/sign-up):"
echo "  Performance Score: $SIGNUP_SCORE/100"
echo "  FCP: $SIGNUP_FCP"
echo "  LCP: $SIGNUP_LCP"
echo "  CLS: $SIGNUP_CLS"
echo "  TTI: $SIGNUP_TTI"

echo ""
echo "📁 Detailed reports saved to:"
echo "  - reports/performance/landing-page.report.html"
echo "  - reports/performance/sign-in-page.report.html"
echo "  - reports/performance/sign-up-page.report.html"

# Check if scores meet requirements
echo ""
echo "🎯 Checking Requirements (Task 11.2):"
echo "====================================="

PASS=true

# Check if all scores are 90+
if [ $LANDING_SCORE -lt 90 ]; then
    echo -e "${RED}❌ Landing page score ($LANDING_SCORE) is below 90${NC}"
    PASS=false
else
    echo -e "${GREEN}✓${NC} Landing page score: $LANDING_SCORE/100"
fi

if [ $SIGNIN_SCORE -lt 90 ]; then
    echo -e "${RED}❌ Sign-in page score ($SIGNIN_SCORE) is below 90${NC}"
    PASS=false
else
    echo -e "${GREEN}✓${NC} Sign-in page score: $SIGNIN_SCORE/100"
fi

if [ $SIGNUP_SCORE -lt 90 ]; then
    echo -e "${RED}❌ Sign-up page score ($SIGNUP_SCORE) is below 90${NC}"
    PASS=false
else
    echo -e "${GREEN}✓${NC} Sign-up page score: $SIGNUP_SCORE/100"
fi

echo ""
if [ "$PASS" = true ]; then
    echo -e "${GREEN}✅ All performance requirements met!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some performance requirements not met. Review the reports for details.${NC}"
    exit 1
fi
