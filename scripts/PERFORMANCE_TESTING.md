# Performance Testing Quick Reference

## Quick Start

### 1. Check Animation Performance
```bash
npm run perf:check-animations
```
This validates that all CSS animations use GPU-accelerated properties (transform, opacity) and follow best practices.

### 2. Run Full Performance Audit

**On Windows (PowerShell):**
```bash
npm run perf:audit:windows
```

**On Linux/Mac (Bash):**
```bash
npm run perf:audit:unix
```

This will:
- Build the production version
- Start the production server
- Run Lighthouse audits on key pages
- Generate HTML and JSON reports
- Display performance scores and Core Web Vitals
- Check if requirements are met (90+ score)

### 3. Analyze Bundle Size
```bash
npm run analyze
```
This opens an interactive bundle analyzer in your browser showing the size of each module.

## Manual Testing

### Lighthouse in Chrome DevTools
1. Build production: `npm run build`
2. Start server: `npm run start`
3. Open Chrome DevTools (F12)
4. Go to "Lighthouse" tab
5. Select "Performance" category
6. Click "Analyze page load"

### Animation Frame Rate Profiling
1. Open Chrome DevTools (F12)
2. Go to "Performance" tab
3. Click record button
4. Scroll and interact with the page
5. Stop recording
6. Review "Frames" section (green = 60fps, yellow = 30-60fps, red = <30fps)

### Core Web Vitals
1. Open Chrome DevTools (F12)
2. Go to "Performance" tab
3. Enable "Web Vitals" checkbox
4. Record page load
5. Review metrics:
   - FCP (First Contentful Paint): < 1.8s
   - LCP (Largest Contentful Paint): < 2.5s
   - CLS (Cumulative Layout Shift): < 0.1
   - TTI (Time to Interactive): < 3.8s

## Performance Requirements (Task 11.2)

✅ **Lighthouse Performance Score**: 90+
✅ **FCP**: < 1.8s
✅ **LCP**: < 2.5s
✅ **CLS**: < 0.1
✅ **TTI**: < 3.8s
✅ **Animation Frame Rate**: 60fps (16.67ms per frame)
✅ **Bundle Size**: < 200KB gzipped

## Optimization Checklist

### Images
- [x] All images use Next.js Image component
- [x] Above-fold images have `priority` flag
- [x] Images have proper width/height attributes

### Lazy Loading
- [x] Below-the-fold sections use dynamic imports
- [x] Heavy components (ProfilePictureUpload) lazy loaded
- [x] Loading skeletons provided

### CSS Animations
- [x] All animations use transform/opacity only
- [x] will-change used sparingly
- [x] prefers-reduced-motion support

### Bundle Optimization
- [x] optimizePackageImports configured for lucide-react
- [x] Dynamic imports for route-specific code
- [x] Tree-shaking enabled

## Troubleshooting

### Low Performance Score
- Check network tab for large resources
- Verify images are optimized
- Check for render-blocking resources
- Review bundle size

### High LCP
- Add `priority` flag to hero images
- Optimize font loading
- Reduce server response time

### High CLS
- Add width/height to all images
- Reserve space for dynamic content
- Avoid inserting content above existing content

### Dropped Frames
- Check for layout-triggering animations
- Reduce simultaneous animations
- Pause animations outside viewport

## Reports Location

After running audits, reports are saved to:
- `reports/performance/landing-page.report.html`
- `reports/performance/sign-in-page.report.html`
- `reports/performance/sign-up-page.report.html`

Open these HTML files in a browser for detailed analysis.

## Continuous Monitoring

Consider setting up:
- Lighthouse CI in GitHub Actions
- Real User Monitoring (RUM) with Vercel Analytics
- Performance budgets in CI/CD pipeline

## Next Steps

1. Run `npm run perf:check-animations` to verify CSS animations
2. Run `npm run perf:audit:windows` (or unix) for full audit
3. Review generated reports
4. Address any issues found
5. Re-run audits to verify improvements
6. Document results in `scripts/performance-audit.md`
