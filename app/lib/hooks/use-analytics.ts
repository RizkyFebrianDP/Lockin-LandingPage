/**
 * Analytics hook for tracking user interactions
 * Provides easy-to-use methods for tracking various events
 */

'use client';

import { useCallback, useEffect, useRef } from 'react';
import { mcpClient, type AnalyticsEvent } from '../mcp-client';
import { analytics, throttle, debounce } from '../utils';

interface UseAnalyticsOptions {
  enableScrollTracking?: boolean;
  enablePageViewTracking?: boolean;
  scrollThreshold?: number;
  debounceDelay?: number;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const {
    enableScrollTracking = true,
    enablePageViewTracking = true,
    scrollThreshold = 25,
    debounceDelay = 300,
  } = options;

  const scrollDepthRef = useRef<Set<number>>(new Set());
  const pageViewTrackedRef = useRef(false);

  /**
   * Track an analytics event
   */
  const track = useCallback(async (event: Omit<AnalyticsEvent, 'timestamp'>) => {
    try {
      const fullEvent: AnalyticsEvent = {
        ...event,
        timestamp: new Date(),
      };
      
      await mcpClient.trackUserInteraction(fullEvent);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }, []);

  /**
   * Track page view
   */
  const trackPageView = useCallback((page?: string, properties?: Record<string, any>) => {
    if (pageViewTrackedRef.current) return;
    
    const pageViewEvent = analytics.trackPageView(
      page || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      properties
    );
    
    if (pageViewEvent) {
      track(pageViewEvent);
    }
    pageViewTrackedRef.current = true;
  }, [track]);

  /**
   * Track button click
   */
  const trackButtonClick = useCallback((buttonName: string, properties?: Record<string, any>) => {
    const clickEvent = analytics.trackButtonClick(buttonName, properties);
    track(clickEvent);
  }, [track]);

  /**
   * Track form submission
   */
  const trackFormSubmit = useCallback((
    formName: string, 
    success: boolean, 
    properties?: Record<string, any>
  ) => {
    const submitEvent = analytics.trackFormSubmit(formName, success, properties);
    track(submitEvent);
  }, [track]);

  /**
   * Track section view
   */
  const trackSectionView = useCallback((sectionName: string, properties?: Record<string, any>) => {
    const sectionEvent = analytics.trackSectionView(sectionName, properties);
    track(sectionEvent);
  }, [track]);

  /**
   * Track scroll depth
   */
  const trackScrollDepth = useCallback(
    debounce((depth: number) => {
      // Only track at specific thresholds (25%, 50%, 75%, 100%)
      const thresholds = [25, 50, 75, 100];
      const threshold = thresholds.find(t => depth >= t && !scrollDepthRef.current.has(t));
      
      if (threshold) {
        scrollDepthRef.current.add(threshold);
        const scrollEvent = analytics.trackScrollDepth(threshold);
        track(scrollEvent);
      }
    }, debounceDelay),
    [track, debounceDelay]
  );

  /**
   * Calculate scroll depth percentage
   */
  const calculateScrollDepth = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    return Math.round((scrollTop / documentHeight) * 100);
  }, []);

  /**
   * Handle scroll events
   */
  const handleScroll = useCallback(
    throttle(() => {
      if (!enableScrollTracking) return;
      
      const depth = calculateScrollDepth();
      if (depth > scrollThreshold) {
        trackScrollDepth(depth);
      }
    }, 100),
    [enableScrollTracking, scrollThreshold, trackScrollDepth, calculateScrollDepth]
  );

  /**
   * Set up scroll tracking
   */
  useEffect(() => {
    if (!enableScrollTracking) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableScrollTracking, handleScroll]);

  /**
   * Set up page view tracking
   */
  useEffect(() => {
    if (enablePageViewTracking && !pageViewTrackedRef.current) {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        trackPageView();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [enablePageViewTracking, trackPageView]);

  return {
    track,
    trackPageView,
    trackButtonClick,
    trackFormSubmit,
    trackSectionView,
    trackScrollDepth,
  };
};

/**
 * Hook for tracking section visibility
 */
export const useSectionTracking = (sectionName: string, threshold: number = 0.5) => {
  const { trackSectionView } = useAnalytics({ enableScrollTracking: false, enablePageViewTracking: false });
  const hasTrackedRef = useRef(false);

  const trackSection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= threshold && !hasTrackedRef.current) {
        trackSectionView(sectionName, {
          intersection_ratio: entry.intersectionRatio,
          visible_area: entry.intersectionRect,
        });
        hasTrackedRef.current = true;
      }
    });
  }, [sectionName, threshold, trackSectionView]);

  useEffect(() => {
    const observer = new IntersectionObserver(trackSection, {
      threshold,
      rootMargin: '0px 0px -10% 0px',
    });

    return () => observer.disconnect();
  }, [trackSection, threshold]);

  return (element: HTMLElement | null) => {
    useEffect(() => {
      if (!element) return;

      const observer = new IntersectionObserver(trackSection, {
        threshold,
        rootMargin: '0px 0px -10% 0px',
      });

      observer.observe(element);
      return () => observer.unobserve(element);
    }, [element]);
  };
};