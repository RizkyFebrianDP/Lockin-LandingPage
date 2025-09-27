'use client';

import { useState, useEffect } from 'react';
import { device } from '../utils';

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  isTouchDevice: boolean;
}

/**
 * Hook for responsive design and device detection
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1024,
    height: 768,
    isTouchDevice: false,
  });

  useEffect(() => {
    const updateState = () => {
      const { width, height } = device.getViewportSize();
      
      setState({
        isMobile: device.isMobile(),
        isTablet: device.isTablet(),
        isDesktop: device.isDesktop(),
        width,
        height,
        isTouchDevice: device.getTouchSupport(),
      });
    };

    // Initial update
    updateState();

    // Listen for resize events
    window.addEventListener('resize', updateState);
    
    // Listen for orientation change on mobile
    window.addEventListener('orientationchange', () => {
      // Delay to ensure viewport has updated
      setTimeout(updateState, 100);
    });

    return () => {
      window.removeEventListener('resize', updateState);
      window.removeEventListener('orientationchange', updateState);
    };
  }, []);

  return state;
}

/**
 * Hook for breakpoint-specific values
 */
export function useBreakpointValue<T>(values: {
  mobile: T;
  tablet?: T;
  desktop: T;
}): T {
  const { isMobile, isTablet } = useResponsive();

  if (isMobile) return values.mobile;
  if (isTablet && values.tablet) return values.tablet;
  return values.desktop;
}

/**
 * Hook for media query matching
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Common breakpoint queries
 */
export const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  touch: '(hover: none) and (pointer: coarse)',
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
} as const;

/**
 * Hook for common breakpoint checks
 */
export function useBreakpoints() {
  return {
    isMobile: useMediaQuery(breakpoints.mobile),
    isTablet: useMediaQuery(breakpoints.tablet),
    isDesktop: useMediaQuery(breakpoints.desktop),
    isTouchDevice: useMediaQuery(breakpoints.touch),
    isRetina: useMediaQuery(breakpoints.retina),
  };
}