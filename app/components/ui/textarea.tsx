"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
  loading?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label,
    error,
    helperText,
    variant = 'default',
    loading = false,
    resize = 'vertical',
    disabled,
    id,
    rows = 4,
    ...props 
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const isDisabled = disabled || loading;
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-primary-dark mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <motion.textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            className={cn(
              'block w-full rounded-lg border transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              // Resize options
              resize === 'none' && 'resize-none',
              resize === 'vertical' && 'resize-y',
              resize === 'horizontal' && 'resize-x',
              resize === 'both' && 'resize',
              // Default variant
              variant === 'default' && [
                'border-gray-300 bg-white px-4 py-3',
                'focus:border-primary-blue focus:ring-primary-blue',
                hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              ],
              // Filled variant
              variant === 'filled' && [
                'border-transparent bg-secondary-light-gray px-4 py-3',
                'focus:bg-white focus:border-primary-blue focus:ring-primary-blue',
                hasError && 'bg-red-50 focus:border-red-500 focus:ring-red-500',
              ],
              className
            )}
            disabled={isDisabled}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${textareaId}-error` : 
              helperText ? `${textareaId}-helper` : undefined
            }
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.15 }}
            {...(props as any)}
          />
          
          {loading && (
            <div className="absolute top-3 right-3 flex items-center pointer-events-none">
              <motion.div
                className="h-4 w-4 animate-spin rounded-full border-2 border-primary-blue border-t-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          )}
        </div>
        
        {error && (
          <motion.p
            id={`${textareaId}-error`}
            className="mt-2 text-sm text-red-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
          >
            {error}
          </motion.p>
        )}
        
        {helperText && !error && (
          <p
            id={`${textareaId}-helper`}
            className="mt-2 text-sm text-secondary-gray"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };