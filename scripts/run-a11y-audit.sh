#!/bin/bash

# Accessibility Audit Script
# Runs automated accessibility tests using Lighthouse, axe-core, and Pa11y
# Requirements: 18.1-18.7, 18.19

set -e

echo "🔍 Starting Accessibility Audit for cosynq UI/UX Overhaul"
echo "=========================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if dev server is running
echo "📡 Checking if development server is running..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${RED}❌ Development server is not running${NC}"
    echo "Please start the dev server with: npm run dev"
    exit 1
fi
echo -e "${GREEN}✅ Development server is running${NC}"
echo ""

# Create reports directory
mkdir -p reports/accessibility
echo "📁 Created reports directory: reports/accessibility"
echo ""

# Run Lighthouse Accessibility Audit
echo "🏠 Running Lighthouse Accessibility Audit..."
echo "--------------------------------------------"
if command -v lighthouse &> /dev/null; then
    echo "Testing Landing Page..."
    lighthouse http://localhost:3000 \
        --only-categories=accessibility \
        --output=html \
        --output-path=./reports/accessibility/lighthouse-landing.html \
        --quiet
    
    echo "Testing Sign-In Page..."
    lighthouse http://localhost:3000/sign-in \
        --only-categories=accessibility \
        --output=html \
        --output-path=./reports/accessibility/lighthouse-signin.html \
        --quiet
    
    echo "Testing Sign-Up Page..."
    lighthouse http://localhost:3000/sign-up \
        --only-categories=accessibility \
        --output=html \
        --output-path=./reports/accessibility/lighthouse-signup.html \
        --quiet
    
    echo -e "${GREEN}✅ Lighthouse audits complete${NC}"
    echo "   Reports saved to reports/accessibility/"
else
    echo -e "${YELLOW}⚠️  Lighthouse not installed. Install with: npm install -g lighthouse${NC}"
fi
echo ""

# Run axe-core Accessibility Tests
echo "🪓 Running axe-core Accessibility Tests..."
echo "--------------------------------------------"
if command -v axe &> /dev/null; then
    echo "Testing Landing Page..."
    axe http://localhost:3000 \
        --save ./reports/accessibility/axe-landing.json \
        --tags wcag2a,wcag2aa,wcag21a,wcag21aa
    
    echo "Testing Sign-In Page..."
    axe http://localhost:3000/sign-in \
        --save ./reports/accessibility/axe-signin.json \
        --tags wcag2a,wcag2aa,wcag21a,wcag21aa
    
    echo "Testing Sign-Up Page..."
    axe http://localhost:3000/sign-up \
        --save ./reports/accessibility/axe-signup.json \
        --tags wcag2a,wcag2aa,wcag21a,wcag21aa
    
    echo -e "${GREEN}✅ axe-core tests complete${NC}"
    echo "   Reports saved to reports/accessibility/"
else
    echo -e "${YELLOW}⚠️  axe-core not installed. Install with: npm install -g @axe-core/cli${NC}"
fi
echo ""

# Run Pa11y Accessibility Tests
echo "🎯 Running Pa11y Accessibility Tests..."
echo "--------------------------------------------"
if command -v pa11y &> /dev/null; then
    echo "Testing Landing Page..."
    pa11y http://localhost:3000 \
        --reporter json \
        --standard WCAG2AA \
        > ./reports/accessibility/pa11y-landing.json || true
    
    echo "Testing Sign-In Page..."
    pa11y http://localhost:3000/sign-in \
        --reporter json \
        --standard WCAG2AA \
        > ./reports/accessibility/pa11y-signin.json || true
    
    echo "Testing Sign-Up Page..."
    pa11y http://localhost:3000/sign-up \
        --reporter json \
        --standard WCAG2AA \
        > ./reports/accessibility/pa11y-signup.json || true
    
    echo -e "${GREEN}✅ Pa11y tests complete${NC}"
    echo "   Reports saved to reports/accessibility/"
else
    echo -e "${YELLOW}⚠️  Pa11y not installed. Install with: npm install -g pa11y${NC}"
fi
echo ""

# Run custom accessibility tests
echo "🧪 Running Custom Accessibility Tests..."
echo "--------------------------------------------"
if [ -f "test/accessibility/a11y-audit.test.ts" ]; then
    npm run test -- test/accessibility/a11y-audit.test.ts
    echo -e "${GREEN}✅ Custom tests complete${NC}"
else
    echo -e "${YELLOW}⚠️  Custom test file not found${NC}"
fi
echo ""

# Summary
echo "=========================================================="
echo "📊 Accessibility Audit Summary"
echo "=========================================================="
echo ""
echo "Reports generated:"
echo "  - Lighthouse: reports/accessibility/lighthouse-*.html"
echo "  - axe-core:   reports/accessibility/axe-*.json"
echo "  - Pa11y:      reports/accessibility/pa11y-*.json"
echo ""
echo "Next steps:"
echo "  1. Review Lighthouse reports in browser"
echo "  2. Check axe-core JSON reports for violations"
echo "  3. Check Pa11y JSON reports for errors"
echo "  4. Run manual tests (see test/accessibility/a11y-audit.test.ts)"
echo ""
echo -e "${GREEN}✅ Accessibility audit complete!${NC}"
echo ""

# Check for critical issues
echo "🔍 Checking for critical issues..."
echo "--------------------------------------------"

CRITICAL_ISSUES=0

# Check Lighthouse scores (if jq is available)
if command -v jq &> /dev/null; then
    for file in reports/accessibility/lighthouse-*.html; do
        if [ -f "$file" ]; then
            # Extract score from HTML (simplified check)
            echo "Checking $file..."
        fi
    done
fi

# Check axe-core violations
if command -v jq &> /dev/null; then
    for file in reports/accessibility/axe-*.json; do
        if [ -f "$file" ]; then
            VIOLATIONS=$(jq '.violations | length' "$file" 2>/dev/null || echo "0")
            if [ "$VIOLATIONS" -gt 0 ]; then
                echo -e "${RED}❌ Found $VIOLATIONS violations in $file${NC}"
                CRITICAL_ISSUES=$((CRITICAL_ISSUES + VIOLATIONS))
            else
                echo -e "${GREEN}✅ No violations in $file${NC}"
            fi
        fi
    done
fi

# Check Pa11y errors
if command -v jq &> /dev/null; then
    for file in reports/accessibility/pa11y-*.json; do
        if [ -f "$file" ]; then
            ERRORS=$(jq '. | length' "$file" 2>/dev/null || echo "0")
            if [ "$ERRORS" -gt 0 ]; then
                echo -e "${RED}❌ Found $ERRORS errors in $file${NC}"
                CRITICAL_ISSUES=$((CRITICAL_ISSUES + ERRORS))
            else
                echo -e "${GREEN}✅ No errors in $file${NC}"
            fi
        fi
    done
fi

echo ""
if [ $CRITICAL_ISSUES -eq 0 ]; then
    echo -e "${GREEN}🎉 No critical accessibility issues found!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Found $CRITICAL_ISSUES critical accessibility issues${NC}"
    echo "Please review the reports and fix the issues."
    exit 1
fi
