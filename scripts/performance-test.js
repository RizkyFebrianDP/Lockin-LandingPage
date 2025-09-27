#!/usr/bin/env node

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

/**
 * Performance testing script for LockIn Landing Page
 */

const CONFIG = {
  url: process.env.TEST_URL || 'http://localhost:3000',
  outputDir: './performance-reports',
  thresholds: {
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 95,
    pwa: 80,
  },
  metrics: {
    firstContentfulPaint: 1800, // 1.8s
    largestContentfulPaint: 2500, // 2.5s
    firstInputDelay: 100, // 100ms
    cumulativeLayoutShift: 0.1, // 0.1
    speedIndex: 3000, // 3s
  },
};

async function runLighthouseAudit() {
  console.log('🚀 Starting Lighthouse audit...');
  
  // Launch Chrome
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
  });

  try {
    // Run Lighthouse audit
    const options = {
      logLevel: 'info',
      output: 'html',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
      port: chrome.port,
    };

    const runnerResult = await lighthouse(CONFIG.url, options);

    // Extract scores
    const scores = {
      performance: Math.round(runnerResult.lhr.categories.performance.score * 100),
      accessibility: Math.round(runnerResult.lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(runnerResult.lhr.categories['best-practices'].score * 100),
      seo: Math.round(runnerResult.lhr.categories.seo.score * 100),
      pwa: Math.round(runnerResult.lhr.categories.pwa.score * 100),
    };

    // Extract metrics
    const metrics = {
      firstContentfulPaint: runnerResult.lhr.audits['first-contentful-paint'].numericValue,
      largestContentfulPaint: runnerResult.lhr.audits['largest-contentful-paint'].numericValue,
      firstInputDelay: runnerResult.lhr.audits['max-potential-fid'].numericValue,
      cumulativeLayoutShift: runnerResult.lhr.audits['cumulative-layout-shift'].numericValue,
      speedIndex: runnerResult.lhr.audits['speed-index'].numericValue,
      totalBlockingTime: runnerResult.lhr.audits['total-blocking-time'].numericValue,
    };

    // Create output directory
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    // Save HTML report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(CONFIG.outputDir, `lighthouse-report-${timestamp}.html`);
    fs.writeFileSync(reportPath, runnerResult.report);

    // Save JSON results
    const jsonPath = path.join(CONFIG.outputDir, `lighthouse-results-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      url: CONFIG.url,
      scores,
      metrics,
      thresholds: CONFIG.thresholds,
      passed: checkThresholds(scores, metrics),
    }, null, 2));

    // Display results
    console.log('\n📊 Lighthouse Audit Results:');
    console.log('================================');
    
    Object.entries(scores).forEach(([category, score]) => {
      const threshold = CONFIG.thresholds[category];
      const status = score >= threshold ? '✅' : '❌';
      console.log(`${status} ${category.charAt(0).toUpperCase() + category.slice(1)}: ${score}/100 (threshold: ${threshold})`);
    });

    console.log('\n⚡ Core Web Vitals:');
    console.log('==================');
    
    Object.entries(metrics).forEach(([metric, value]) => {
      const threshold = CONFIG.metrics[metric];
      if (threshold) {
        const status = value <= threshold ? '✅' : '❌';
        const unit = metric.includes('Paint') || metric.includes('Index') || metric.includes('Time') ? 'ms' : '';
        console.log(`${status} ${metric}: ${Math.round(value)}${unit} (threshold: ${threshold}${unit})`);
      }
    });

    console.log(`\n📄 Full report saved to: ${reportPath}`);
    console.log(`📊 JSON results saved to: ${jsonPath}`);

    // Check if all thresholds passed
    const allPassed = checkThresholds(scores, metrics);
    if (allPassed) {
      console.log('\n🎉 All performance thresholds passed!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some performance thresholds failed!');
      process.exit(1);
    }

  } finally {
    await chrome.kill();
  }
}

function checkThresholds(scores, metrics) {
  // Check score thresholds
  const scoresPassed = Object.entries(scores).every(([category, score]) => {
    return score >= CONFIG.thresholds[category];
  });

  // Check metric thresholds
  const metricsPassed = Object.entries(metrics).every(([metric, value]) => {
    const threshold = CONFIG.metrics[metric];
    return !threshold || value <= threshold;
  });

  return scoresPassed && metricsPassed;
}

// Bundle size analysis
async function analyzeBundleSize() {
  console.log('📦 Analyzing bundle size...');
  
  const buildDir = './.next';
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Build directory not found. Run "npm run build" first.');
    return;
  }

  try {
    const { execSync } = require('child_process');
    
    // Run bundle analyzer
    const output = execSync('npx next-bundle-analyzer', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    console.log('Bundle analysis complete!');
    console.log(output);
  } catch (error) {
    console.error('Bundle analysis failed:', error.message);
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'lighthouse':
      await runLighthouseAudit();
      break;
    case 'bundle':
      await analyzeBundleSize();
      break;
    case 'all':
      await runLighthouseAudit();
      await analyzeBundleSize();
      break;
    default:
      console.log('Usage: node performance-test.js [lighthouse|bundle|all]');
      console.log('');
      console.log('Commands:');
      console.log('  lighthouse  Run Lighthouse performance audit');
      console.log('  bundle      Analyze bundle size');
      console.log('  all         Run all performance tests');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  runLighthouseAudit,
  analyzeBundleSize,
  CONFIG,
};