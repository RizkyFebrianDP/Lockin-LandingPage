/**
 * Form validation schemas using Zod
 * Provides runtime validation for all forms in the LockIn landing page
 */

import { z } from 'zod';

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
  message: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 1000,
      'Message must be less than 1000 characters'
    ),
});

/**
 * Newsletter signup validation schema
 */
export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
});

/**
 * Demo request form validation schema
 */
export const demoRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
  company: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 100,
      'Company name must be less than 100 characters'
    ),
  role: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 50,
      'Role must be less than 50 characters'
    ),
  teamSize: z
    .enum(['1-10', '11-50', '51-200', '201-1000', '1000+'])
    .optional(),
});

/**
 * Analytics event validation schema
 */
export const analyticsEventSchema = z.object({
  type: z.enum(['page_view', 'button_click', 'form_submit', 'scroll_depth', 'section_view']),
  properties: z.record(z.string(), z.any()),
  timestamp: z.date(),
  sessionId: z.string().optional(),
});

/**
 * Type inference from schemas
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
export type DemoRequestFormData = z.infer<typeof demoRequestSchema>;
export type AnalyticsEventData = z.infer<typeof analyticsEventSchema>;

/**
 * Validation helper functions
 */
export const validateContactForm = (data: unknown) => {
  return contactFormSchema.safeParse(data);
};

export const validateNewsletterForm = (data: unknown) => {
  return newsletterSchema.safeParse(data);
};

export const validateDemoRequestForm = (data: unknown) => {
  return demoRequestSchema.safeParse(data);
};

export const validateAnalyticsEvent = (data: unknown) => {
  return analyticsEventSchema.safeParse(data);
};

/**
 * Email validation utility (for real-time validation)
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Form field validation states
 */
export interface ValidationState {
  isValid: boolean;
  error?: string;
  touched: boolean;
}

/**
 * Create validation state for form fields
 */
export const createValidationState = (
  isValid: boolean = true,
  error?: string,
  touched: boolean = false
): ValidationState => ({
  isValid,
  error,
  touched,
});

/**
 * Common validation patterns
 */
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/.+/,
} as const;

/**
 * Sanitization utilities
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/**
 * Form error formatting
 */
export const formatValidationErrors = (zodError: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  
  zodError.issues.forEach((issue) => {
    const path = issue.path.join('.');
    formattedErrors[path] = issue.message;
  });
  
  return formattedErrors;
};