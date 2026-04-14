# 🚀 Run Performance Audits - Action Required

## Overview
All performance optimizations have been implemented. You now need to run the audits to measure actual performance and verify requirements are met.

## Prerequisites
- Node.js and npm installed
- Chrome browser installed (for Lighthouse)
- Production build ready

## Step-by-Step Instructions

### Step 1: Build Production Version
```bash
npm run build
```
Wait for the build to complete. This creates an optimized production bundle.

### Step 2: Check Animation Performance
```bash
npm run perf:check-animations
```

**Expected Output**:
```
✅ All animations follow performance best practices!
Your animations use GPU-accelerated properties and should run at 60fps.
```

If you see any errors, review the output and fix the issues before proceeding.

### Step 3: Run Full Performance Audit

**On Windows (PowerShell):**
```bash
npm run perf:audit:windows
```

**On Linux/Mac (Bash):**
```bash
npm run perf:audit:unix
```

This will:
1. Start the production server
2. Run Lighthouse audits on 3 pages (landing, sign-in, sign-up)
3. Generate HTML and JSON reports
4. Display performance scores
5. Check if requirements are met (90+ score)

**Expected Output**:
```
📈 Performance Scores:
=====================

Landing Page (/):
  Performance Score: 90+/100
  FCP: < 1.8s
  LCP: < 2.5s
  CLS: < 0.1
  TTI: < 3.8s

✅ All performance requirements met!
```

### Step 4: Review Detailed Reports

Open the generated HTML reports in your browser:
- `reports/performance/landing-page.report.html`
- `reports/performance/sign-in-page.report.html`
- `reports/performance/sign-up-page.report.html`

Review:
- Performance score breakdown
- Opportunities for improvement
- Diagnostics
- Core Web Vitals

### Step 5: Analyze Bundle Size
```bash
npm run analyze
```

This opens an interactive visualization in your browser showing:
- Size of each module
- Which packages are largest
- Opportunities for optimization

**Target**: Main bundle < 200KB gzipped

### Step 6: Manual Testing (Optional but Recommended)

#### Test Animation Frame Rates:
1. Open the site in Chrome: `http://localhost:3000`
2. Open DevTools (F12)
3. Go to "Performance" tab
4. Click record
5. Scroll through the page and interact with animations
6. Stop recording
7. Review "Frames" section - should be mostly green (60fps)

#### Test Core Web Vitals:
1. Open DevTools (F12)
2. Go to "Performance" tab
3. Enable "Web Vitals" checkbox
4. Record page load
5. Verify metrics meet targets

### Step 7: Document Results

Update `scripts/performance-audit.md` with your actual results:

```markdown
## Audit Results

### Landing Page (/)
- **Date**: [Your date]
- **Lighthouse Score**: [Your score]/100
- **FCP**: [Your FCP]
- **LCP**: [Your LCP]
- **CLS**: [Your CLS]
- **TTI**: [Your TTI]
- **Bundle Size**: [Your size]

[Add notes about any issues or optimizations needed]
```

## Troubleshooting

### Issue: Lighthouse not found
**Solution**: Install Lighthouse globally
```bash
npm install -g lighthouse
```

### Issue: Port 3000 already in use
**Solution**: Stop any running Next.js servers or use a different port
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Kill process on port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9
```

### Issue: Performance score below 90
**Solutions**:
1. Check network tab for large resources
2. Review bundle analyzer for large packages
3. Verify images are optimized
4. Check for render-blocking resources
5. Review the Lighthouse report "Opportunities" section

### Issue: High LCP (> 2.5s)
**Solutions**:
1. Verify hero image has `priority` flag
2. Optimize font loading
3. Reduce server response time
4. Use CDN for static assets

### Issue: High CLS (> 0.1)
**Solutions**:
1. Verify all images have width/height
2. Check for content inserted above existing content
3. Ensure loading skeletons reserve proper space

## Success Criteria

✅ **Animation Performance**: All animations pass check
✅ **Lighthouse Score**: 90+ on all pages
✅ **FCP**: < 1.8s
✅ **LCP**: < 2.5s
✅ **CLS**: < 0.1
✅ **TTI**: < 3.8s
✅ **Bundle Size**: < 200KB gzipped
✅ **Frame Rate**: 60fps during animations

## What's Been Optimized

### ✅ Image Optimization
- All images use Next.js Image component
- Hero image has `priority` flag
- Modern formats (AVIF, WebP) configured

### ✅ Lazy Loading
- Below-the-fold sections lazy loaded
- Heavy components (ProfilePictureUpload) lazy loaded
- Loading skeletons prevent layout shifts

### ✅ CSS Animations
- All animations use GPU-accelerated properties (transform, opacity)
- No layout-triggering properties
- Accessibility support (prefers-reduced-motion)

### ✅ Bundle Optimization
- Package imports optimized (lucide-react, @tanstack/react-query)
- Dynamic imports for route-specific code
- Code splitting enabled

## Next Steps After Audits

1. If all requirements are met:
   - ✅ Mark task 11.2 as complete
   - Document results in performance-audit.md
   - Proceed to next task (11.3 - Test responsive design)

2. If requirements are not met:
   - Review Lighthouse reports for specific issues
   - Implement recommended optimizations
   - Re-run audits
   - Repeat until requirements are met

## Quick Commands Reference

```bash
# Build production
npm run build

# Check animations
npm run perf:check-animations

# Run full audit (Windows)
npm run perf:audit:windows

# Run full audit (Linux/Mac)
npm run perf:audit:unix

# Analyze bundle
npm run analyze

# Start production server manually
npm run start
```

## Need Help?

- Review `scripts/performance-audit.md` for detailed guidance
- Review `scripts/PERFORMANCE_TESTING.md` for quick reference
- Review `scripts/PERFORMANCE_OPTIMIZATIONS_SUMMARY.md` for what's been done
- Check Lighthouse report "Opportunities" section for specific recommendations

---

**Ready to start? Run these commands:**

```bash
npm run build
npm run perf:check-animations
npm run perf:audit:windows  # or perf:audit:unix
```
