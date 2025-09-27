'use client';

import React from 'react';
// import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

export interface PerformanceData {
  url: string;
  timestamp: number;
  metrics: WebVitalsMetric[];
  userAgent: string;
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

/**
 * Web Vitals thresholds
 */
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

/**
 * Get rating based on metric value and thresholds
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Get connection information
 */
function getConnectionInfo() {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return undefined;
  }

  const connection = (navigator as any).connection;
  return {
    effectiveType: connection.effectiveType || 'unknown',
    downlink: connection.downlink || 0,
    rtt: connection.rtt || 0,
  };
}

/**
 * Send metrics to analytics endpoint
 */
async function sendToAnalytics(data: PerformanceData) {
  try {
    // In a real app, this would send to your analytics service
    console.log('Performance metrics:', data);
    
    // Example: Send to MCP server
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      await fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }
  } catch (error) {
    console.warn('Failed to send performance metrics:', error);
  }
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  const metrics: WebVitalsMetric[] = [];
  
  const handleMetric = (metric: any) => {
    const webVitalsMetric: WebVitalsMetric = {
      name: metric.name,
      value: metric.value,
      rating: getRating(metric.name, metric.value),
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType || 'navigate',
    };
    
    metrics.push(webVitalsMetric);
    
    // Send individual metric immediately for real-time monitoring
    const performanceData: PerformanceData = {
      url: window.location.href,
      timestamp: Date.now(),
      metrics: [webVitalsMetric],
      userAgent: navigator.userAgent,
      connection: getConnectionInfo(),
    };
    
    sendToAnalytics(performanceData);
  };

  // Collect all Web Vitals (temporarily disabled until web-vitals is properly installed)
  // getCLS(handleMetric);
  // getFID(handleMetric);
  // getFCP(handleMetric);
  // getLCP(handleMetric);
  // getTTFB(handleMetric);

  // Send batch of metrics on page unload
  window.addEventListener('beforeunload', () => {
    if (metrics.length > 0) {
      const performanceData: PerformanceData = {
        url: window.location.href,
        timestamp: Date.now(),
        metrics,
        userAgent: navigator.userAgent,
        connection: getConnectionInfo(),
      };
      
      // Use sendBeacon for reliable delivery
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/analytics/web-vitals',
          JSON.stringify(performanceData)
        );
      }
    }
  });
}

/**
 * Performance observer for custom metrics
 */
export class PerformanceMonitor {
  private observers: PerformanceObserver[] = [];
  private customMetrics: Map<string, number> = new Map();

  constructor() {
    this.initObservers();
  }

  private initObservers() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Navigation timing
    try {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordCustomMetric('dom-content-loaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
            this.recordCustomMetric('load-complete', navEntry.loadEventEnd - navEntry.loadEventStart);
          }
        }
      });
      
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    } catch (error) {
      console.warn('Navigation observer not supported:', error);
    }

    // Resource timing
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // Track slow resources
            if (resourceEntry.duration > 1000) {
              console.warn('Slow resource detected:', {
                name: resourceEntry.name,
                duration: resourceEntry.duration,
                size: resourceEntry.transferSize,
              });
            }
          }
        }
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (error) {
      console.warn('Resource observer not supported:', error);
    }

    // Long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'longtask') {
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
            });
          }
        }
      });
      
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (error) {
      console.warn('Long task observer not supported:', error);
    }
  }

  recordCustomMetric(name: string, value: number) {
    this.customMetrics.set(name, value);
    
    // Send custom metric
    const performanceData: PerformanceData = {
      url: window.location.href,
      timestamp: Date.now(),
      metrics: [{
        name,
        value,
        rating: 'good', // Custom metrics don't have standard ratings
        delta: 0,
        id: `custom-${Date.now()}`,
        navigationType: 'navigate',
      }],
      userAgent: navigator.userAgent,
      connection: getConnectionInfo(),
    };
    
    sendToAnalytics(performanceData);
  }

  getCustomMetrics() {
    return Object.fromEntries(this.customMetrics);
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Hook for performance monitoring
 */
export function usePerformanceMonitor() {
  const [monitor] = React.useState(() => new PerformanceMonitor());
  
  React.useEffect(() => {
    return () => monitor.disconnect();
  }, [monitor]);

  return {
    recordMetric: (name: string, value: number) => monitor.recordCustomMetric(name, value),
    getMetrics: () => monitor.getCustomMetrics(),
  };
}

// Auto-initialize Web Vitals monitoring
if (typeof window !== 'undefined') {
  initWebVitals();
}