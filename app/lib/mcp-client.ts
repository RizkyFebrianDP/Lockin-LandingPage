/**
 * MCP Client for LockIn Landing Page
 * Handles communication with MCP server for form submissions and analytics
 */

export interface MCPResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ContactFormData {
  email: string;
  message?: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface AnalyticsEvent {
  type: 'page_view' | 'button_click' | 'form_submit' | 'scroll_depth' | 'section_view';
  properties: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
}

export class MCPError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

export class MCPClient {
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;
  private sessionId: string;

  constructor(
    baseUrl: string = '',
    timeout: number = 10000,
    retryAttempts: number = 3
  ) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.retryAttempts = retryAttempts;
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<MCPResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new MCPError(
          `HTTP ${response.status}: ${response.statusText}`,
          'HTTP_ERROR',
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof MCPError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new MCPError('Request timeout', 'TIMEOUT_ERROR', 408);
        }
        throw new MCPError(error.message, 'NETWORK_ERROR', 0);
      }

      throw new MCPError('Unknown error occurred', 'UNKNOWN_ERROR', 500);
    }
  }

  private async retryRequest<T>(
    requestFn: () => Promise<MCPResponse<T>>,
    attempts: number = this.retryAttempts
  ): Promise<MCPResponse<T>> {
    try {
      return await requestFn();
    } catch (error) {
      if (attempts <= 1 || !(error instanceof MCPError)) {
        throw error;
      }

      // Don't retry client errors (4xx)
      if (error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }

      // Wait before retry with exponential backoff
      const delay = Math.pow(2, this.retryAttempts - attempts) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      return this.retryRequest(requestFn, attempts - 1);
    }
  }

  /**
   * Submit contact form data to MCP server
   */
  async submitContactForm(data: ContactFormData): Promise<MCPResponse> {
    return this.retryRequest(() =>
      this.makeRequest('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'landing_page',
        }),
      })
    );
  }

  /**
   * Submit newsletter signup to MCP server
   */
  async submitNewsletterForm(data: NewsletterFormData): Promise<MCPResponse> {
    return this.retryRequest(() =>
      this.makeRequest('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'landing_page',
        }),
      })
    );
  }

  /**
   * Track user interaction events
   */
  async trackUserInteraction(event: AnalyticsEvent): Promise<void> {
    try {
      await this.makeRequest('/api/analytics', {
        method: 'POST',
        body: JSON.stringify({
          ...event,
          sessionId: this.sessionId,
          timestamp: event.timestamp || new Date(),
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
          url: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });
    } catch (error) {
      // Analytics failures should not break the user experience
      console.warn('Analytics tracking failed:', error);
    }
  }

  /**
   * Get dynamic content data from MCP server
   */
  async getContentData(): Promise<MCPResponse> {
    return this.retryRequest(() =>
      this.makeRequest('/api/content', {
        method: 'GET',
      })
    );
  }

  /**
   * Health check for MCP server connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/api/health', {
        method: 'GET',
      });
      return response.success;
    } catch (error) {
      return false;
    }
  }
}

// Singleton instance for the application
export const mcpClient = new MCPClient();

/**
 * Error handler utility for MCP errors
 */
export const handleMCPError = (error: MCPError): string => {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Connection failed. Please check your internet connection and try again.';
    case 'TIMEOUT_ERROR':
      return 'Request timed out. Please try again.';
    case 'HTTP_ERROR':
      if (error.statusCode === 400) {
        return 'Please check your input and try again.';
      }
      if (error.statusCode === 429) {
        return 'Too many requests. Please wait a moment and try again.';
      }
      if (error.statusCode >= 500) {
        return 'Server error. Please try again later.';
      }
      return 'Something went wrong. Please try again.';
    case 'VALIDATION_ERROR':
      return 'Please check your input and try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};