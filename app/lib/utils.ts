/**
 * Utility functions for the LockIn landing page
 * Includes data formatting, analytics helpers, and common utilities
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers with appropriate suffixes (K, M, B)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

/**
 * Format statistics for display
 */
export const formatStatistic = (value: string | number, suffix?: string): string => {
  if (typeof value === 'number') {
    return formatNumber(value) + (suffix ? ` ${suffix}` : '');
  }
  return value + (suffix ? ` ${suffix}` : '');
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for scroll events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Generate unique IDs for components
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if code is running in browser
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Get scroll position
 */
export const getScrollPosition = (): { x: number; y: number } => {
  if (!isBrowser()) return { x: 0, y: 0 };
  
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
};

/**
 * Get element position relative to viewport
 */
export const getElementPosition = (element: HTMLElement): { top: number; left: number } => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
  };
};

/**
 * Check if element is in viewport
 */
export const isElementInViewport = (element: HTMLElement, threshold: number = 0): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
};

/**
 * Smooth scroll to element
 */
export const scrollToElement = (
  element: HTMLElement | string,
  offset: number = 0,
  behavior: ScrollBehavior = 'smooth'
): void => {
  if (!isBrowser()) return;

  const targetElement = typeof element === 'string' 
    ? document.querySelector(element) as HTMLElement
    : element;

  if (!targetElement) return;

  const elementPosition = getElementPosition(targetElement);
  const offsetPosition = elementPosition.top - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior,
  });
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format time for display
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate reading time for content
 */
export const calculateReadingTime = (text: string, wordsPerMinute: number = 200): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Convert string to slug
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Analytics utilities
 */
export const analytics = {
  /**
   * Track page view
   */
  trackPageView: (page: string, properties?: Record<string, any>) => {
    if (!isBrowser()) return undefined;
    
    return {
      type: 'page_view' as const,
      properties: {
        page,
        url: window.location.href,
        referrer: document.referrer,
        ...properties,
      },
    };
  },

  /**
   * Track button click
   */
  trackButtonClick: (buttonName: string, properties?: Record<string, any>) => {
    return {
      type: 'button_click' as const,
      properties: {
        button_name: buttonName,
        ...properties,
      },
    };
  },

  /**
   * Track form submission
   */
  trackFormSubmit: (formName: string, success: boolean, properties?: Record<string, any>) => {
    return {
      type: 'form_submit' as const,
      properties: {
        form_name: formName,
        success,
        ...properties,
      },
    };
  },

  /**
   * Track scroll depth
   */
  trackScrollDepth: (depth: number, properties?: Record<string, any>) => {
    return {
      type: 'scroll_depth' as const,
      properties: {
        depth_percentage: depth,
        ...properties,
      },
    };
  },

  /**
   * Track section view
   */
  trackSectionView: (sectionName: string, properties?: Record<string, any>) => {
    return {
      type: 'section_view' as const,
      properties: {
        section_name: sectionName,
        ...properties,
      },
    };
  },
};

/**
 * Local storage utilities with error handling
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (!isBrowser()) return defaultValue || null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.warn(`Error reading from localStorage:`, error);
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    if (!isBrowser()) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage:`, error);
      return false;
    }
  },

  remove: (key: string): boolean => {
    if (!isBrowser()) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage:`, error);
      return false;
    }
  },
};

/**
 * Device detection utilities
 */
export const device = {
  isMobile: (): boolean => {
    if (!isBrowser()) return false;
    return window.innerWidth < 768;
  },

  isTablet: (): boolean => {
    if (!isBrowser()) return false;
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  },

  isDesktop: (): boolean => {
    if (!isBrowser()) return false;
    return window.innerWidth >= 1024;
  },

  getTouchSupport: (): boolean => {
    if (!isBrowser()) return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  getViewportSize: (): { width: number; height: number } => {
    if (!isBrowser()) return { width: 0, height: 0 };
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
};

/**
 * Touch and gesture utilities
 */
export interface TouchPosition {
  x: number;
  y: number;
}

export interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
}

export const touch = {
  /**
   * Get touch position from touch event
   */
  getPosition: (event: TouchEvent): TouchPosition => {
    const touch = event.touches[0] || event.changedTouches[0];
    return {
      x: touch.clientX,
      y: touch.clientY,
    };
  },

  /**
   * Calculate swipe direction and distance
   */
  getSwipeDirection: (
    startPos: TouchPosition,
    endPos: TouchPosition,
    minDistance = 50
  ): SwipeDirection => {
    const deltaX = endPos.x - startPos.x;
    const deltaY = endPos.y - startPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < minDistance) {
      return { direction: null, distance };
    }

    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    if (angle >= -45 && angle <= 45) {
      return { direction: 'right', distance };
    } else if (angle >= 45 && angle <= 135) {
      return { direction: 'down', distance };
    } else if (angle >= -135 && angle <= -45) {
      return { direction: 'up', distance };
    } else {
      return { direction: 'left', distance };
    }
  },

  /**
   * Create touch handlers for swipe gestures
   */
  createSwipeHandlers: (
    onSwipe: (direction: 'left' | 'right' | 'up' | 'down', distance: number) => void,
    minDistance = 50
  ) => {
    let startPos: TouchPosition | null = null;

    return {
      onTouchStart: (e: React.TouchEvent) => {
        startPos = touch.getPosition(e.nativeEvent);
      },
      onTouchEnd: (e: React.TouchEvent) => {
        if (!startPos) return;
        
        const endPos = touch.getPosition(e.nativeEvent);
        const swipe = touch.getSwipeDirection(startPos, endPos, minDistance);
        
        if (swipe.direction) {
          onSwipe(swipe.direction, swipe.distance);
        }
        
        startPos = null;
      },
    };
  },
};

/**
 * Performance utilities
 */
export const performance = {
  /**
   * Measure function execution time
   */
  measure: async <T>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    const start = Date.now();
    const result = await fn();
    const end = Date.now();
    console.log(`${name} took ${end - start}ms`);
    return result;
  },

  /**
   * Create a performance observer for monitoring
   */
  observePerformance: (callback: (entries: PerformanceEntry[]) => void) => {
    if (!isBrowser() || !('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      callback(list.getEntries());
    });

    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    return observer;
  },
};