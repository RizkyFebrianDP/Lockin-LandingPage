import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const ArrowLeftIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M15 18L9 12L15 6" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M9 18L15 12L9 6" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = "", size = 25 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 25 25" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M12.5 0C19.4034 0 24.9999 5.59642 24.9999 12.5C24.9999 19.4034 19.4034 24.9999 12.5 24.9999C5.59642 24.9999 0 19.4034 0 12.5C0 5.59642 5.59642 0 12.5 0ZM16.5246 8.71206L10.9375 14.2991L8.47538 11.8371C8.10927 11.471 7.51567 11.471 7.14956 11.8371C6.78345 12.2032 6.78345 12.7967 7.14956 13.1628L10.2746 16.2878C10.6407 16.6539 11.2342 16.6539 11.6003 16.2878L17.8503 10.0378C18.2164 9.67177 18.2164 9.07817 17.8503 8.71206C17.4842 8.34595 16.8907 8.34595 16.5246 8.71206Z" 
      fill="currentColor"
    />
  </svg>
);