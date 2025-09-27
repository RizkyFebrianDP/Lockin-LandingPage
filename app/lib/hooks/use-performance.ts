'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { cacheManager, memoryCache } from '../performance/cache-manager';
import { monitorMemoryUsage } from '../performance/bundle-optimizer';

/**
 * Hook for measuring component render performance
 */
export function useRenderPerformance(componentName: string) {
  const renderStartRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);
  const totalRenderTimeRef = useRef<number>(0);

  useEffect(() => {
    renderStartRef.current = performance.now();
    renderCountRef.current += 1;

    return () => {
      const renderTime = performance.now() - renderStartRef.current;
      totalRenderTimeRef.current += renderTime;

      // Log slow renders
      if (renderTime > 16) { // More than one frame at 60fps
        console.warn(`Slow render detected in ${componentName}:`, {
          renderTime: renderTime.toFixed(2),
          renderCount: renderCountRef.current,
          averageRenderTime: (totalRenderTimeRef.current / renderCountRef.current).toFixed(2),
        });
      }
    };
  });

  return {
    renderCount: renderCountRef.current,
    averageRenderTime: renderCountRef.current > 0 
      ? totalRenderTimeRef.current / renderCountRef.current 
      : 0,
  };
}

/**
 * Hook for caching expensive computations
 */
export function useComputationCache<T>(
  key: string,
  computeFn: () => T,
  dependencies: any[] = [],
  ttl = 5 * 60 * 1000 // 5 minutes
): T {
  const [result, setResult] = useState<T | null>(null);
  const depsRef = useRef(dependencies);

  useEffect(() => {
    // Check if dependencies changed
    const depsChanged = dependencies.some((dep, index) => dep !== depsRef.current[index]);
    
    if (!depsChanged) {
      // Try to get from cache
      const cached = memoryCache.get<T>(key);
      if (cached !== null) {
        setResult(cached);
        return;
      }
    }

    // Compute new result
    const startTime = performance.now();
    const newResult = computeFn();
    const computeTime = performance.now() - startTime;

    // Log expensive computations
    if (computeTime > 10) {
      console.warn(`Expensive computation detected for ${key}:`, {
        computeTime: computeTime.toFixed(2),
      });
    }

    // Cache the result
    memoryCache.set(key, newResult, ttl);
    setResult(newResult);
    depsRef.current = dependencies;
  }, dependencies);

  return result as T;
}

/**
 * Hook for debouncing expensive operations
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttling function calls
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledCallback = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      return callback(...args);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
      }, delay - (now - lastCallRef.current));
    }
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback as T;
}

/**
 * Hook for monitoring memory usage
 */
export function useMemoryMonitor(interval = 30000) { // 30 seconds
  const [memoryInfo, setMemoryInfo] = useState<ReturnType<typeof monitorMemoryUsage>>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      const info = monitorMemoryUsage();
      setMemoryInfo(info);
      
      // Warn about high memory usage
      if (info && info.usagePercentage > 80) {
        console.warn('High memory usage detected:', info);
      }
    };

    updateMemoryInfo();
    const intervalId = setInterval(updateMemoryInfo, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return memoryInfo;
}

/**
 * Hook for lazy loading data with caching
 */
export function useLazyData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    ttl?: number;
    retries?: number;
    retryDelay?: number;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const {
    ttl = 10 * 60 * 1000, // 10 minutes
    retries = 3,
    retryDelay = 1000,
  } = options;

  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = cacheManager.get<T>(key);
    if (cached) {
      setData(cached);
      return;
    }

    setLoading(true);
    setError(null);

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await fetchFn();
        
        // Cache the result
        cacheManager.set(key, result, { ttl });
        setData(result);
        setLoading(false);
        return;
      } catch (err) {
        lastError = err as Error;
        
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }

    setError(lastError);
    setLoading(false);
  }, [key, fetchFn, ttl, retries, retryDelay]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for intersection observer with performance optimization
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Reuse observer if possible
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
          setEntry(entry);
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
          ...options,
        }
      );
    }

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [options]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    ref: elementRef,
    isIntersecting,
    entry,
  };
}

/**
 * Hook for measuring component size changes
 */
export function useResizeObserver<T extends HTMLElement>() {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const elementRef = useRef<T | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !('ResizeObserver' in window)) return;

    observerRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    ref: elementRef,
    size,
  };
}