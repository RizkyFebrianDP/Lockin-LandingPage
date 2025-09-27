'use client';

import { useCallback, useRef } from 'react';
import { touch, type TouchPosition, type SwipeDirection } from '../utils';

export interface TouchGestureOptions {
  minSwipeDistance?: number;
  maxSwipeTime?: number;
  preventScroll?: boolean;
}

export interface TouchGestureHandlers {
  onSwipeLeft?: (distance: number) => void;
  onSwipeRight?: (distance: number) => void;
  onSwipeUp?: (distance: number) => void;
  onSwipeDown?: (distance: number) => void;
  onTap?: (position: TouchPosition) => void;
  onLongPress?: (position: TouchPosition) => void;
  onPinch?: (scale: number) => void;
}

/**
 * Hook for handling touch gestures
 */
export function useTouchGestures(
  handlers: TouchGestureHandlers,
  options: TouchGestureOptions = {}
) {
  const {
    minSwipeDistance = 50,
    maxSwipeTime = 500,
    preventScroll = false,
  } = options;

  const touchStartRef = useRef<{
    position: TouchPosition;
    time: number;
    touches: number;
  } | null>(null);

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const position = touch.getPosition(e.nativeEvent);
    const time = Date.now();
    const touches = e.touches.length;

    touchStartRef.current = { position, time, touches };

    // Start long press timer for single touch
    if (touches === 1 && handlers.onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        if (touchStartRef.current && handlers.onLongPress) {
          handlers.onLongPress(position);
        }
      }, 500);
    }

    if (preventScroll) {
      e.preventDefault();
    }
  }, [handlers.onLongPress, preventScroll]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Cancel long press on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Handle pinch gesture
    if (e.touches.length === 2 && handlers.onPinch && touchStartRef.current) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      // You would need to store initial distance to calculate scale
      // This is a simplified version
      handlers.onPinch(currentDistance);
    }

    if (preventScroll) {
      e.preventDefault();
    }
  }, [handlers.onPinch, preventScroll]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (!touchStartRef.current) return;

    const endPosition = touch.getPosition(e.nativeEvent);
    const endTime = Date.now();
    const duration = endTime - touchStartRef.current.time;

    // Check for tap (short duration, minimal movement)
    const swipe = touch.getSwipeDirection(
      touchStartRef.current.position,
      endPosition,
      minSwipeDistance
    );

    if (!swipe.direction && duration < 200 && handlers.onTap) {
      handlers.onTap(endPosition);
      touchStartRef.current = null;
      return;
    }

    // Check for swipe (within time limit)
    if (swipe.direction && duration < maxSwipeTime) {
      switch (swipe.direction) {
        case 'left':
          handlers.onSwipeLeft?.(swipe.distance);
          break;
        case 'right':
          handlers.onSwipeRight?.(swipe.distance);
          break;
        case 'up':
          handlers.onSwipeUp?.(swipe.distance);
          break;
        case 'down':
          handlers.onSwipeDown?.(swipe.distance);
          break;
      }
    }

    touchStartRef.current = null;

    if (preventScroll) {
      e.preventDefault();
    }
  }, [
    handlers.onTap,
    handlers.onSwipeLeft,
    handlers.onSwipeRight,
    handlers.onSwipeUp,
    handlers.onSwipeDown,
    minSwipeDistance,
    maxSwipeTime,
    preventScroll,
  ]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

/**
 * Simplified hook for swipe gestures only
 */
export function useSwipeGestures(
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down', distance: number) => void,
  options: TouchGestureOptions = {}
) {
  return useTouchGestures({
    onSwipeLeft: (distance) => onSwipe('left', distance),
    onSwipeRight: (distance) => onSwipe('right', distance),
    onSwipeUp: (distance) => onSwipe('up', distance),
    onSwipeDown: (distance) => onSwipe('down', distance),
  }, options);
}

/**
 * Hook for horizontal swipe gestures (common for carousels)
 */
export function useHorizontalSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  options: TouchGestureOptions = {}
) {
  return useTouchGestures({
    onSwipeLeft: () => onSwipeLeft(),
    onSwipeRight: () => onSwipeRight(),
  }, options);
}