/**
 * Main exports for the lib directory
 * Provides easy access to all utilities, hooks, and clients
 */

// MCP Client
export { mcpClient, MCPClient, MCPError, handleMCPError } from './mcp-client';
export type { MCPResponse, AnalyticsEvent } from './mcp-client';

// Validation schemas and utilities
export {
  contactFormSchema,
  newsletterSchema,
  demoRequestSchema,
  analyticsEventSchema,
  validateContactForm,
  validateNewsletterForm,
  validateDemoRequestForm,
  validateAnalyticsEvent,
  isValidEmail,
  createValidationState,
  validationPatterns,
  sanitizeInput,
  sanitizeEmail,
  formatValidationErrors,
} from './validations';
export type {
  ContactFormData,
  NewsletterFormData,
  DemoRequestFormData,
  AnalyticsEventData,
  ValidationState,
} from './validations';

// Utility functions
export * from './utils';

// Hooks
export * from './hooks/use-analytics';
export * from './hooks/use-form-submission';