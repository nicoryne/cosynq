#!/usr/bin/env node

/**
 * Animation Performance Checker
 * 
 * This script analyzes CSS animations to ensure they follow performance best practices:
 * - Only animate transform and opacity (GPU-accelerated)
 * - Avoid animating layout properties (width, height, top, left, margin, padding)
 * - Check for proper will-change usage
 * - Verify prefers-reduced-motion support
 */

const fs = require('fs');
const path = require('path');

// Properties that trigger layout recalculation (BAD for performance)
const LAYOUT_PROPERTIES = [
  'width', 'height', 'top', 'left', 'right', 'bottom',
  'margin', 'padding', 'border-width', 'font-size',
  'line-height', 'position:'  // Note: colon added to avoid matching background-position
];

// Properties that are GPU-accelerated (GOOD for performance)
const GPU_PROPERTIES = ['transform', 'opacity'];

// Read globals.css
const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

// Extract @keyframes blocks
const keyframesRegex = /@keyframes\s+([a-zA-Z-]+)\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g;
const keyframes = [];
let match;

while ((match = keyframesRegex.exec(cssContent)) !== null) {
  keyframes.push({
    name: match[1],
    content: match[2]
  });
}

console.log('🎬 Animation Performance Analysis\n');
console.log(`Found ${keyframes.length} @keyframes animations\n`);

let hasIssues = false;

// Analyze each keyframe
keyframes.forEach(({ name, content }) => {
  console.log(`\n📊 Analyzing: @keyframes ${name}`);
  
  const issues = [];
  const goodProps = [];
  
  // Check for layout-triggering properties
  LAYOUT_PROPERTIES.forEach(prop => {
    // Use word boundary for exact matching, but handle properties with colons
    const propName = prop.replace(':', '');
    const regex = new RegExp(`\\b${propName}\\s*:`, 'i');
    if (regex.test(content) && !content.includes('background-' + propName)) {
      issues.push(`❌ Animates "${propName}" (triggers layout recalculation)`);
      hasIssues = true;
    }
  });
  
  // Check for GPU-accelerated properties
  GPU_PROPERTIES.forEach(prop => {
    const regex = new RegExp(`\\b${prop}\\s*:`, 'i');
    if (regex.test(content)) {
      goodProps.push(`✅ Uses "${prop}" (GPU-accelerated)`);
    }
  });
  
  if (issues.length > 0) {
    console.log('  Issues:');
    issues.forEach(issue => console.log(`    ${issue}`));
  }
  
  if (goodProps.length > 0) {
    console.log('  Good practices:');
    goodProps.forEach(prop => console.log(`    ${prop}`));
  }
  
  if (issues.length === 0 && goodProps.length === 0) {
    console.log('  ⚠️  No animated properties detected');
  }
});

// Check for will-change usage
console.log('\n\n🎯 Checking will-change usage...');
const willChangeRegex = /will-change:\s*([^;]+);/g;
const willChangeMatches = [];

while ((match = willChangeRegex.exec(cssContent)) !== null) {
  willChangeMatches.push(match[1].trim());
}

if (willChangeMatches.length > 0) {
  console.log(`Found ${willChangeMatches.length} will-change declarations:`);
  willChangeMatches.forEach(value => {
    console.log(`  - will-change: ${value}`);
  });
  console.log('\n  ✅ Good: will-change is used for optimization');
  console.log('  ⚠️  Reminder: Only use will-change during active animations');
} else {
  console.log('  ℹ️  No will-change declarations found');
  console.log('  Consider adding will-change for active animations');
}

// Check for prefers-reduced-motion
console.log('\n\n♿ Checking accessibility...');
if (cssContent.includes('@media (prefers-reduced-motion: reduce)')) {
  console.log('  ✅ prefers-reduced-motion media query found');
  console.log('  Animations will be disabled for users who prefer reduced motion');
} else {
  console.log('  ❌ Missing prefers-reduced-motion media query');
  console.log('  Add this for accessibility compliance');
  hasIssues = true;
}

// Check for high contrast mode support
if (cssContent.includes('@media (prefers-contrast: high)')) {
  console.log('  ✅ prefers-contrast media query found');
} else {
  console.log('  ⚠️  Consider adding prefers-contrast support');
}

// Summary
console.log('\n\n📋 Summary\n');
if (hasIssues) {
  console.log('❌ Performance issues detected. Please review the issues above.');
  console.log('\nRecommendations:');
  console.log('  1. Replace layout-triggering properties with transform equivalents');
  console.log('  2. Use transform: translateX/Y instead of left/top');
  console.log('  3. Use transform: scale instead of width/height');
  console.log('  4. Add prefers-reduced-motion support if missing');
  process.exit(1);
} else {
  console.log('✅ All animations follow performance best practices!');
  console.log('\nYour animations use GPU-accelerated properties and should run at 60fps.');
  process.exit(0);
}
