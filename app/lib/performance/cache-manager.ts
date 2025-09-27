'use client';

/**
 * Browser caching utilities
 */

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  version?: string;
  compress?: boolean;
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
}

/**
 * Enhanced localStorage with TTL and versioning
 */
export class CacheManager {
  private prefix: string;
  private defaultTTL: number;
  private version: string;

  constructor(prefix = 'lockin_cache', defaultTTL = 24 * 60 * 60 * 1000, version = '1.0.0') {
    this.prefix = prefix;
    this.defaultTTL = defaultTTL;
    this.version = version;
  }

  private getKey(key: string): string {
    return `${this.prefix}_${key}`;
  }

  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() > item.timestamp + item.ttl;
  }

  private isValidVersion(item: CacheItem<any>): boolean {
    return item.version === this.version;
  }

  set<T>(key: string, data: T, options: CacheOptions = {}): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: options.ttl || this.defaultTTL,
        version: options.version || this.version,
      };

      let serializedData = JSON.stringify(cacheItem);
      
      // Simple compression (in production, use a proper compression library)
      if (options.compress && serializedData.length > 1000) {
        // This is a placeholder - implement actual compression
        console.log('Compressing cache data for key:', key);
      }

      localStorage.setItem(this.getKey(key), serializedData);
      return true;
    } catch (error) {
      console.warn('Failed to set cache item:', error);
      return false;
    }
  }

  get<T>(key: string): T | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    try {
      const serializedData = localStorage.getItem(this.getKey(key));
      if (!serializedData) return null;

      const cacheItem: CacheItem<T> = JSON.parse(serializedData);

      // Check if expired or invalid version
      if (this.isExpired(cacheItem) || !this.isValidVersion(cacheItem)) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Failed to get cache item:', error);
      this.remove(key);
      return null;
    }
  }

  remove(key: string): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.warn('Failed to remove cache item:', error);
      return false;
    }
  }

  clear(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.warn('Failed to clear cache:', error);
      return false;
    }
  }

  getStats(): { totalItems: number; totalSize: number; oldestItem: number | null } {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { totalItems: 0, totalSize: 0, oldestItem: null };
    }

    let totalItems = 0;
    let totalSize = 0;
    let oldestTimestamp: number | null = null;

    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        totalItems++;
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length;
          
          try {
            const cacheItem = JSON.parse(value);
            if (!oldestTimestamp || cacheItem.timestamp < oldestTimestamp) {
              oldestTimestamp = cacheItem.timestamp;
            }
          } catch (error) {
            // Invalid cache item
          }
        }
      }
    });

    return {
      totalItems,
      totalSize,
      oldestItem: oldestTimestamp,
    };
  }

  cleanup(): number {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 0;
    }

    let removedCount = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const cacheItem = JSON.parse(value);
            if (this.isExpired(cacheItem) || !this.isValidVersion(cacheItem)) {
              localStorage.removeItem(key);
              removedCount++;
            }
          }
        } catch (error) {
          // Remove invalid cache items
          localStorage.removeItem(key);
          removedCount++;
        }
      }
    });

    return removedCount;
  }
}

/**
 * Memory cache for runtime data
 */
export class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  set<T>(key: string, data: T, ttl = 5 * 60 * 1000): void {
    // Remove expired items if cache is full
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
      
      // If still full, remove oldest item
      if (this.cache.size >= this.maxSize) {
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey) {
          this.cache.delete(oldestKey);
        }
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      version: '1.0.0',
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (this.isExpired(item)) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() > item.timestamp + item.ttl;
  }

  remove(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): number {
    let removedCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    return removedCount;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }
}

/**
 * HTTP cache utilities
 */
export class HTTPCache {
  private cache = new Map<string, Response>();

  async fetch(url: string, options?: RequestInit): Promise<Response> {
    const cacheKey = this.getCacheKey(url, options);
    
    // Check cache first
    const cachedResponse = this.cache.get(cacheKey);
    if (cachedResponse) {
      return cachedResponse.clone();
    }

    // Fetch from network
    const response = await fetch(url, options);
    
    // Cache successful responses
    if (response.ok) {
      this.cache.set(cacheKey, response.clone());
    }

    return response;
  }

  private getCacheKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * Global cache instances
 */
export const cacheManager = new CacheManager();
export const memoryCache = new MemoryCache();
export const httpCache = new HTTPCache();

/**
 * Cache cleanup on page load
 */
if (typeof window !== 'undefined') {
  // Cleanup expired cache items on load
  setTimeout(() => {
    const removed = cacheManager.cleanup();
    if (removed > 0) {
      console.log(`Cleaned up ${removed} expired cache items`);
    }
  }, 1000);

  // Periodic cleanup
  setInterval(() => {
    cacheManager.cleanup();
    memoryCache.cleanup();
  }, 10 * 60 * 1000); // Every 10 minutes
}