'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { useResponsive } from '../../lib/hooks/use-responsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  as?: keyof React.JSX.IntrinsicElements;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

const paddingClasses = {
  none: '',
  sm: 'px-2 sm:px-4',
  md: 'px-4 sm:px-6 lg:px-8',
  lg: 'px-6 sm:px-8 lg:px-12',
  xl: 'px-8 sm:px-12 lg:px-16',
};

export function ResponsiveContainer({
  children,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = '',
  maxWidth = '7xl',
  padding = 'md',
  as: Component = 'div',
}: ResponsiveContainerProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const responsiveClassName = cn(
    'mx-auto',
    maxWidthClasses[maxWidth],
    paddingClasses[padding],
    className,
    isMobile && mobileClassName,
    isTablet && tabletClassName,
    isDesktop && desktopClassName
  );

  return (
    <Component className={responsiveClassName}>
      {children}
    </Component>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

const gapClasses = {
  sm: 'gap-2 sm:gap-3',
  md: 'gap-4 sm:gap-6 lg:gap-8',
  lg: 'gap-6 sm:gap-8 lg:gap-10',
  xl: 'gap-8 sm:gap-10 lg:gap-12',
};

export function ResponsiveGrid({
  children,
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
}: ResponsiveGridProps) {
  const gridClassName = cn(
    'grid',
    `grid-cols-${cols.mobile || 1}`,
    cols.tablet && `sm:grid-cols-${cols.tablet}`,
    cols.desktop && `lg:grid-cols-${cols.desktop}`,
    gapClasses[gap],
    className
  );

  return (
    <div className={gridClassName}>
      {children}
    </div>
  );
}

interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  direction?: {
    mobile?: 'row' | 'col';
    tablet?: 'row' | 'col';
    desktop?: 'row' | 'col';
  };
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export function ResponsiveStack({
  children,
  className = '',
  direction = { mobile: 'col', tablet: 'row', desktop: 'row' },
  align = 'start',
  justify = 'start',
  gap = 'md',
}: ResponsiveStackProps) {
  const stackClassName = cn(
    'flex',
    direction.mobile === 'row' ? 'flex-row' : 'flex-col',
    direction.tablet && (direction.tablet === 'row' ? 'sm:flex-row' : 'sm:flex-col'),
    direction.desktop && (direction.desktop === 'row' ? 'lg:flex-row' : 'lg:flex-col'),
    alignClasses[align],
    justifyClasses[justify],
    gapClasses[gap],
    className
  );

  return (
    <div className={stackClassName}>
      {children}
    </div>
  );
}

interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  size?: {
    mobile?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    tablet?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    desktop?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  };
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: {
    mobile?: 'left' | 'center' | 'right';
    tablet?: 'left' | 'center' | 'right';
    desktop?: 'left' | 'center' | 'right';
  };
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignClasses2 = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function ResponsiveText({
  children,
  className = '',
  size = { mobile: 'base', tablet: 'base', desktop: 'base' },
  weight = 'normal',
  align = { mobile: 'left', tablet: 'left', desktop: 'left' },
  as: Component = 'p',
}: ResponsiveTextProps) {
  const textClassName = cn(
    sizeClasses[size.mobile || 'base'],
    size.tablet && `sm:${sizeClasses[size.tablet]}`,
    size.desktop && `lg:${sizeClasses[size.desktop]}`,
    weightClasses[weight],
    alignClasses2[align.mobile || 'left'],
    align.tablet && `sm:${alignClasses2[align.tablet]}`,
    align.desktop && `lg:${alignClasses2[align.desktop]}`,
    className
  );

  return (
    <Component className={textClassName}>
      {children}
    </Component>
  );
}