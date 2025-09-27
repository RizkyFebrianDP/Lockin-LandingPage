"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled';
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text',
    label,
    error,
    helperText,
    icon,
    iconPosition = 'left',
    variant = 'default',
    loading = false,
    disabled,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const isDisabled = disabled || loading;
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-primary-dark mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={cn(
                "text-secondary-gray",
                hasError && "text-red-500"
              )}>
                {icon}
              </span>
            </div>
          )}
          
          <motion.input
            ref={ref}
            type={type}
            id={inputId}
            className={cn(
              'block w-full rounded-lg border transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:opacity-50 disabled:cursor-not-allowed',
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
              // Icon padding
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              className
            )}
            disabled={isDisabled}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : 
              helperText ? `${inputId}-helper` : undefined
            }
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.15 }}
            {...(props as any)}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className={cn(
                "text-secondary-gray",
                hasError && "text-red-500"
              )}>
                {icon}
              </span>
            </div>
          )}
          
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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
            id={`${inputId}-error`}
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
            id={`${inputId}-helper`}
            className="mt-2 text-sm text-secondary-gray"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };