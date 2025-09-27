'use client';

import React, { useEffect, useState } from 'react';
// Temporarily disable complex performance monitoring to fix build issues

interface PerformanceMonitorProps {
  enableServiceWorker?: boolean;
  performanceBudget?: {
    maxBundleSize: number;
    maxImageSize: number;
    maxFontSize: number;
    maxTotalSize: number;
  };
  showDebugInfo?: boolean;
}

export function PerformanceMonitor({
  enableServiceWorker = true,
  performanceBudget,
  showDebugInfo = false,
}: PerformanceMonitorProps) {
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [budgetStatus, setBudgetStatus] = useState<any>(null);
  // const memoryInfo = usePerformanceMonitor();
  const memoryInfo = null; // Temporarily disabled

  useEffect(() => {
    // Temporarily disable complex performance monitoring
    console.log('Performance monitoring initialized (simplified mode)');

    // Initialize performance monitoring
    const initPerformanceMonitoring = () => {
      // Log initial performance metrics
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          console.log('Performance Metrics:', {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
          });
        }
      }
    };

    // Wait for page load
    if (document.readyState === 'complete') {
      initPerformanceMonitoring();
    } else {
      window.addEventListener('load', initPerformanceMonitoring);
      return () => window.removeEventListener('load', initPerformanceMonitoring);
    }
  }, [enableServiceWorker, performanceBudget]);

  // Performance warning component
  const PerformanceWarning = ({ message, type }: { message: string; type: 'warning' | 'error' }) => (
    <div className={`fixed top-4 right-4 p-3 rounded-lg text-white text-sm z-50 ${
      type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
    }`}>
      {message}
    </div>
  );

  // Debug info component
  const DebugInfo = () => {
    if (!showDebugInfo) return null;

    return (
      <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
        <h3 className="font-bold mb-2">Performance Debug</h3>
        
        {memoryInfo && typeof memoryInfo === 'object' && 'usagePercentage' in memoryInfo && (
          <div className="mb-2">
            <div>Memory Usage: {(memoryInfo as any).usagePercentage.toFixed(1)}%</div>
            <div>Used: {((memoryInfo as any).usedJSHeapSize / 1024 / 1024).toFixed(1)}MB</div>
            <div>Limit: {((memoryInfo as any).jsHeapSizeLimit / 1024 / 1024).toFixed(1)}MB</div>
          </div>
        )}
        
        {budgetStatus && (
          <div className="mb-2">
            <div>Bundle: {budgetStatus.bundleSize.toFixed(1)}KB</div>
            <div>Images: {budgetStatus.imageSize.toFixed(1)}KB</div>
            <div>Total: {budgetStatus.totalSize.toFixed(1)}KB</div>
          </div>
        )}
        
        <div>
          <div>SW: {swRegistration ? '✓' : '✗'}</div>
          <div>Cache: Monitoring disabled</div>
        </div>
      </div>
    );
  };

  // Performance warnings
  const warnings = [];
  
  if (memoryInfo && typeof memoryInfo === 'object' && 'usagePercentage' in memoryInfo && (memoryInfo as any).usagePercentage > 80) {
    warnings.push({
      message: `High memory usage: ${(memoryInfo as any).usagePercentage.toFixed(1)}%`,
      type: 'warning' as const,
    });
  }
  
  if (budgetStatus && !budgetStatus.budgetStatus.total) {
    warnings.push({
      message: `Performance budget exceeded: ${budgetStatus.totalSize.toFixed(1)}KB`,
      type: 'error' as const,
    });
  }

  return (
    <>
      {warnings.map((warning, index) => (
        <PerformanceWarning
          key={index}
          message={warning.message}
          type={warning.type}
        />
      ))}
      <DebugInfo />
    </>
  );
}

/**
 * Performance provider component
 */
interface PerformanceProviderProps {
  children: React.ReactNode;
  config?: {
    enableServiceWorker?: boolean;
    performanceBudget?: {
      maxBundleSize: number;
      maxImageSize: number;
      maxFontSize: number;
      maxTotalSize: number;
    };
    enableDebugMode?: boolean;
  };
}

export function PerformanceProvider({ 
  children, 
  config = {} 
}: PerformanceProviderProps) {
  const {
    enableServiceWorker = true,
    performanceBudget = {
      maxBundleSize: 500, // 500KB
      maxImageSize: 1000, // 1MB
      maxFontSize: 200, // 200KB
      maxTotalSize: 2000, // 2MB
    },
    enableDebugMode = process.env.NODE_ENV === 'development',
  } = config;

  return (
    <>
      {children}
      <PerformanceMonitor
        enableServiceWorker={enableServiceWorker}
        performanceBudget={performanceBudget}
        showDebugInfo={enableDebugMode}
      />
    </>
  );
}

/**
 * Performance metrics display component
 */
export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const collectMetrics = () => {
      if (typeof window === 'undefined' || !window.performance) return;

      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const metricsData = {
        // Navigation timing
        domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
        loadComplete: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        
        // Paint timing
        firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        
        // Resource timing
        resourceCount: performance.getEntriesByType('resource').length,
        
        // Memory (if available)
        memory: (performance as any).memory ? {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
          limit: (performance as any).memory.jsHeapSizeLimit,
        } : null,
      };

      setMetrics(metricsData);
    };

    if (document.readyState === 'complete') {
      collectMetrics();
    } else {
      window.addEventListener('load', collectMetrics);
      return () => window.removeEventListener('load', collectMetrics);
    }
  }, []);

  if (!metrics) return null;

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-sm">
      <h3 className="font-bold mb-2">Performance Metrics</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>DOM Content Loaded: {metrics.domContentLoaded.toFixed(0)}ms</div>
        <div>Load Complete: {metrics.loadComplete.toFixed(0)}ms</div>
        <div>First Paint: {metrics.firstPaint.toFixed(0)}ms</div>
        <div>First Contentful Paint: {metrics.firstContentfulPaint.toFixed(0)}ms</div>
        <div>Resources: {metrics.resourceCount}</div>
        {metrics.memory && (
          <div>Memory: {(metrics.memory.used / 1024 / 1024).toFixed(1)}MB</div>
        )}
      </div>
    </div>
  );
}