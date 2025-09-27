"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  animate?: boolean;
}

const badgeVariants = {
  default: 'bg-secondary-light-gray text-primary-dark border-gray-200',
  primary: 'bg-primary-blue text-white border-primary-blue',
  secondary: 'bg-accent-green text-white border-accent-green',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  outline: 'bg-transparent text-primary-blue border-primary-blue'
};

const sizeVariants = {
  sm: 'px-2 py-1 text-xs font-medium',
  md: 'px-3 py-1.5 text-sm font-medium',
  lg: 'px-4 py-2 text-base font-semibold'
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md',
    children,
    icon,
    removable = false,
    onRemove,
    animate = false,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center rounded-full border transition-all duration-200 ease-in-out',
      badgeVariants[variant],
      sizeVariants[size],
      removable && 'pr-1',
      className
    );

    const content = (
      <>
        {icon && (
          <span className="mr-1 flex-shrink-0">
            {icon}
          </span>
        )}
        
        <span className="truncate">{children}</span>
        
        {removable && onRemove && (
          <button
            type="button"
            className="ml-1 flex-shrink-0 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-1 transition-transform hover:scale-110"
            onClick={onRemove}
            aria-label="Remove badge"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </>
    );

    if (animate) {
      const { onDrag, onDragEnd, onDragStart, onAnimationStart, onAnimationEnd, ...motionProps } = props;
      return (
        <motion.span
          ref={ref}
          className={baseClasses}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          {...motionProps}
        >
          {content}
        </motion.span>
      );
    }

    return (
      <span
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {content}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };