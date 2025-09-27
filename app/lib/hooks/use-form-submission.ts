/**
 * Form submission hook with MCP integration
 * Handles form validation, submission, and error states
 */

'use client';

import { useState, useCallback } from 'react';
import { useForm, type UseFormProps, type FieldValues, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ZodSchema } from 'zod';
import { mcpClient, handleMCPError, MCPError, type ContactFormData, type NewsletterFormData } from '../mcp-client';
import { useAnalytics } from './use-analytics';
import { contactFormSchema, newsletterSchema, demoRequestSchema, type DemoRequestFormData } from '../validations';

interface FormSubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  submitCount: number;
}

interface UseFormSubmissionOptions<T extends FieldValues> extends UseFormProps<T> {
  schema: ZodSchema<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  resetOnSuccess?: boolean;
  trackAnalytics?: boolean;
  formName?: string;
}

export const useFormSubmission = <T extends FieldValues>(
  options: UseFormSubmissionOptions<T>
) => {
  const {
    schema,
    onSuccess,
    onError,
    resetOnSuccess = true,
    trackAnalytics = true,
    formName = 'unknown_form',
    ...formOptions
  } = options;

  const { trackFormSubmit } = useAnalytics({
    enableScrollTracking: false,
    enablePageViewTracking: false,
  });

  const [submissionState, setSubmissionState] = useState<FormSubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
    submitCount: 0,
  });

  const form = useForm({
    ...formOptions,
  });

  const submitForm = useCallback(async (
    data: any,
    submitFn: (data: any) => Promise<any>
  ) => {
    // Validate data with schema
    const validationResult = schema.safeParse(data);
    if (!validationResult.success) {
      const errorMessage = 'Please check your input and try again.';
      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false,
        isSuccess: false,
        error: errorMessage,
      }));
      onError?.(errorMessage);
      throw new Error(errorMessage);
    }
    setSubmissionState(prev => ({
      ...prev,
      isSubmitting: true,
      error: null,
      submitCount: prev.submitCount + 1,
    }));

    try {
      const result = await submitFn(validationResult.data);
      
      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true,
        error: null,
      }));

      if (trackAnalytics) {
        trackFormSubmit(formName, true, {
          submit_count: submissionState.submitCount + 1,
        });
      }

      if (resetOnSuccess) {
        form.reset();
      }

      onSuccess?.(validationResult.data);
      return result;
    } catch (error) {
      const errorMessage = error instanceof MCPError 
        ? handleMCPError(error)
        : 'An unexpected error occurred. Please try again.';

      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false,
        isSuccess: false,
        error: errorMessage,
      }));

      if (trackAnalytics) {
        trackFormSubmit(formName, false, {
          error_message: errorMessage,
          submit_count: submissionState.submitCount + 1,
        });
      }

      onError?.(errorMessage);
      throw error;
    }
  }, [form, onSuccess, onError, resetOnSuccess, trackAnalytics, formName, trackFormSubmit, submissionState.submitCount]);

  const clearError = useCallback(() => {
    setSubmissionState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const clearSuccess = useCallback(() => {
    setSubmissionState(prev => ({
      ...prev,
      isSuccess: false,
    }));
  }, []);

  const reset = useCallback(() => {
    form.reset();
    setSubmissionState({
      isSubmitting: false,
      isSuccess: false,
      error: null,
      submitCount: 0,
    });
  }, [form]);

  return {
    ...form,
    submissionState,
    submitForm,
    clearError,
    clearSuccess,
    reset,
  };
};

/**
 * Specific hook for contact form submission
 */
export const useContactForm = (options?: {
  onSuccess?: (data: ContactFormData) => void;
  onError?: (error: string) => void;
}) => {
  const formSubmission = useFormSubmission<ContactFormData>({
    schema: contactFormSchema,
    formName: 'contact_form',
    ...options,
  });

  const submitContactForm = useCallback(async (data: ContactFormData) => {
    return formSubmission.submitForm(data, (formData) => 
      mcpClient.submitContactForm(formData)
    );
  }, [formSubmission]);

  return {
    ...formSubmission,
    submitContactForm,
  };
};

/**
 * Specific hook for newsletter form submission
 */
export const useNewsletterForm = (options?: {
  onSuccess?: (data: NewsletterFormData) => void;
  onError?: (error: string) => void;
}) => {
  const formSubmission = useFormSubmission<NewsletterFormData>({
    schema: newsletterSchema,
    formName: 'newsletter_form',
    ...options,
  });

  const submitNewsletterForm = useCallback(async (data: NewsletterFormData) => {
    return formSubmission.submitForm(data, (formData) => 
      mcpClient.submitNewsletterForm(formData)
    );
  }, [formSubmission]);

  return {
    ...formSubmission,
    submitNewsletterForm,
  };
};

/**
 * Hook for demo request form submission
 */
export const useDemoRequestForm = (options?: {
  onSuccess?: (data: DemoRequestFormData) => void;
  onError?: (error: string) => void;
}) => {
  const formSubmission = useFormSubmission<DemoRequestFormData>({
    schema: demoRequestSchema,
    formName: 'demo_request_form',
    ...options,
  });

  const submitDemoRequest = useCallback(async (data: DemoRequestFormData) => {
    return formSubmission.submitForm(data, (formData) => 
      mcpClient.submitContactForm({
        email: formData.email,
        message: `Demo request from ${formData.company || 'Unknown Company'}\nRole: ${formData.role || 'Not specified'}\nTeam Size: ${formData.teamSize || 'Not specified'}`,
      })
    );
  }, [formSubmission]);

  return {
    ...formSubmission,
    submitDemoRequest,
  };
};