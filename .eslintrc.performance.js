module.exports = {
  extends: ['next/core-web-vitals'],
  plugins: ['react-hooks'],
  rules: {
    // Performance-related rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Prevent performance anti-patterns
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    
    // React performance rules
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',
    'react/no-unstable-nested-components': 'error',
    
    // Import optimization
    'import/no-duplicates': 'error',
    'import/no-unused-modules': 'warn',
    
    // Bundle size optimization
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['lodash', 'lodash/*'],
            message: 'Use lodash-es or specific lodash functions to reduce bundle size'
          },
          {
            group: ['moment'],
            message: 'Use date-fns or dayjs instead of moment for smaller bundle size'
          }
        ]
      }
    ],
    
    // Memory leak prevention
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useDebounce|useThrottle|useComputationCache)'
      }
    ]
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        // TypeScript performance rules
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/prefer-readonly': 'warn',
        '@typescript-eslint/prefer-readonly-parameter-types': 'off', // Too strict for most cases
      }
    },
    {
      files: ['**/performance/**/*.ts', '**/performance/**/*.tsx'],
      rules: {
        // Allow console logs in performance monitoring code
        'no-console': 'off'
      }
    }
  ]
};