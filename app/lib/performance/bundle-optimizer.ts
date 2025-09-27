/**
 * Bundle optimization utilities
 */

/**
 * Dynamic import with retry logic
 */
export async function dynamicImportWithRetry<T>(
  importFunc: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFunc();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      console.warn(`Dynamic import failed, retrying... (${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw new Error('Dynamic import failed after all retries');
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  
  document.head.appendChild(link);
}

/**
 * Prefetch resources for next navigation
 */
export function prefetchResource(href: string) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  
  document.head.appendChild(link);
}

/**
 * Critical CSS inlining utility
 */
export function inlineCriticalCSS(css: string) {
  if (typeof document === 'undefined') return;
  
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  
  document.head.appendChild(style);
}

/**
 * Remove unused CSS (simplified version)
 */
export function removeUnusedCSS() {
  if (typeof document === 'undefined') return;
  
  const stylesheets = Array.from(document.styleSheets);
  const usedSelectors = new Set<string>();
  
  // Collect all used selectors from DOM
  const elements = document.querySelectorAll('*');
  elements.forEach(element => {
    if (element.className) {
      element.className.split(' ').forEach(className => {
        if (className.trim()) {
          usedSelectors.add(`.${className.trim()}`);
        }
      });
    }
    
    if (element.id) {
      usedSelectors.add(`#${element.id}`);
    }
  });
  
  // This is a simplified version - in production, use tools like PurgeCSS
  console.log('Used selectors:', usedSelectors.size);
}

/**
 * Image optimization utilities
 */
export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  sizes?: string;
  priority?: boolean;
}

export function getOptimizedImageProps(
  src: string,
  options: ImageOptimizationOptions = {}
) {
  const {
    quality = 75,
    format = 'webp',
    sizes = '100vw',
    priority = false,
  } = options;
  
  return {
    src,
    quality,
    format,
    sizes,
    priority,
    loading: priority ? 'eager' : 'lazy',
  };
}

/**
 * Font optimization utilities
 */
export function preloadFont(href: string, type = 'font/woff2') {
  preloadResource(href, 'font', type);
}

export function optimizeFontLoading() {
  if (typeof document === 'undefined') return;
  
  // Add font-display: swap to all font faces
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Service Worker registration for caching
 */
export async function registerServiceWorker(swPath = '/sw.js') {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register(swPath);
    console.log('Service Worker registered:', registration);
    
    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available, prompt user to refresh
            console.log('New content available, please refresh');
          }
        });
      }
    });
    
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Memory usage monitoring
 */
export function monitorMemoryUsage() {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }
  
  const memory = (performance as any).memory;
  if (!memory) return null;
  
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  };
}

/**
 * Bundle size analyzer (client-side)
 */
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return null;
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const analysis = {
    scripts: scripts.length,
    styles: styles.length,
    totalResources: scripts.length + styles.length,
    scriptSources: scripts.map(script => (script as HTMLScriptElement).src),
    styleSources: styles.map(style => (style as HTMLLinkElement).href),
  };
  
  console.log('Bundle analysis:', analysis);
  return analysis;
}

/**
 * Performance budget checker
 */
export interface PerformanceBudget {
  maxBundleSize: number; // in KB
  maxImageSize: number; // in KB
  maxFontSize: number; // in KB
  maxTotalSize: number; // in KB
}

export function checkPerformanceBudget(budget: PerformanceBudget) {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }
  
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  let totalSize = 0;
  let bundleSize = 0;
  let imageSize = 0;
  let fontSize = 0;
  
  resources.forEach(resource => {
    const size = resource.transferSize || 0;
    totalSize += size;
    
    if (resource.name.includes('.js')) {
      bundleSize += size;
    } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
      imageSize += size;
    } else if (resource.name.match(/\.(woff|woff2|ttf|otf)$/)) {
      fontSize += size;
    }
  });
  
  const results = {
    totalSize: totalSize / 1024, // Convert to KB
    bundleSize: bundleSize / 1024,
    imageSize: imageSize / 1024,
    fontSize: fontSize / 1024,
    budgetStatus: {
      total: totalSize / 1024 <= budget.maxTotalSize,
      bundle: bundleSize / 1024 <= budget.maxBundleSize,
      images: imageSize / 1024 <= budget.maxImageSize,
      fonts: fontSize / 1024 <= budget.maxFontSize,
    },
  };
  
  console.log('Performance budget check:', results);
  return results;
}