'use client';

import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '../animations/loading-skeleton';

interface LazyComponentProps {
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * Higher-order component for lazy loading components
 */
export function withLazyLoading<P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);

  return function LazyWrapper(props: P & LazyComponentProps) {
    const { fallback: customFallback, className, ...componentProps } = props;
    
    const defaultFallback = (
      <div className={`flex items-center justify-center p-8 ${className || ''}`}>
        <LoadingSpinner size="md" />
      </div>
    );

    return (
      <Suspense fallback={customFallback || fallback || defaultFallback}>
        <LazyComponent {...(componentProps as P)} />
      </Suspense>
    );
  };
}

/**
 * Lazy load component with intersection observer
 */
interface LazyOnViewProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export function LazyOnView({
  children,
  fallback,
  rootMargin = '50px',
  threshold = 0.1,
  className = '',
}: LazyOnViewProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  const defaultFallback = (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size="sm" />
    </div>
  );

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (fallback || defaultFallback)}
    </div>
  );
}

/**
 * Dynamic import wrapper for components
 */
export function createDynamicComponent<P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  options?: {
    loading?: React.ComponentType;
    ssr?: boolean;
  }
) {
  const DynamicComponent = lazy(importFunc);

  return function DynamicWrapper(props: P) {
    const LoadingComponent = options?.loading || (() => <LoadingSpinner size="md" />);

    return (
      <Suspense fallback={<LoadingComponent />}>
        <DynamicComponent {...props} />
      </Suspense>
    );
  };
}