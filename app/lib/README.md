# MCP Integration Library

This library provides comprehensive MCP (Model Context Protocol) integration for the LockIn landing page, including form handling, analytics tracking, and data validation.

## Features

- **MCP Client**: Robust client for communicating with MCP servers
- **Form Handling**: React Hook Form integration with Zod validation
- **Analytics Tracking**: User interaction and behavior tracking
- **Error Handling**: Comprehensive error management with user-friendly messages
- **TypeScript Support**: Full type safety throughout the library

## Quick Start

### Basic MCP Client Usage

```typescript
import { mcpClient } from './lib/mcp-client';

// Submit contact form
const result = await mcpClient.submitContactForm({
  email: 'user@example.com',
  message: 'Hello from the landing page!'
});

// Track user interaction
await mcpClient.trackUserInteraction({
  type: 'button_click',
  properties: { button_name: 'hero_cta' },
  timestamp: new Date()
});
```

### Using Form Hooks

```typescript
import { useContactForm } from './lib/hooks/use-form-submission';

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    submissionState,
    submitContactForm,
  } = useContactForm({
    onSuccess: (data) => console.log('Success!', data),
    onError: (error) => console.error('Error:', error),
  });

  const onSubmit = async (data) => {
    await submitContactForm(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        {...register('email')}
        disabled={submissionState.isSubmitting}
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit" disabled={submissionState.isSubmitting}>
        {submissionState.isSubmitting ? 'Sending...' : 'Send'}
      </button>
      
      {submissionState.error && (
        <div className="error">{submissionState.error}</div>
      )}
    </form>
  );
};
```

### Analytics Tracking

```typescript
import { useAnalytics } from './lib/hooks/use-analytics';

const MyComponent = () => {
  const { trackButtonClick, trackSectionView } = useAnalytics();

  const handleClick = () => {
    trackButtonClick('pricing_cta', {
      plan: 'pro',
      location: 'hero_section'
    });
  };

  return (
    <button onClick={handleClick}>
      Get Started
    </button>
  );
};
```

## API Reference

### MCPClient

The main client for communicating with MCP servers.

#### Methods

- `submitContactForm(data: ContactFormData): Promise<MCPResponse>`
- `submitNewsletterForm(data: NewsletterFormData): Promise<MCPResponse>`
- `trackUserInteraction(event: AnalyticsEvent): Promise<void>`
- `getContentData(): Promise<MCPResponse>`
- `healthCheck(): Promise<boolean>`

#### Configuration

```typescript
const client = new MCPClient(
  '/api/mcp',    // Base URL
  10000,         // Timeout (ms)
  3              // Retry attempts
);
```

### Form Hooks

#### useContactForm(options?)

Hook for handling contact form submissions with validation.

**Options:**
- `onSuccess?: (data) => void` - Success callback
- `onError?: (error) => void` - Error callback

**Returns:**
- All React Hook Form methods
- `submissionState: FormSubmissionState`
- `submitContactForm: (data) => Promise<void>`

#### useNewsletterForm(options?)

Hook for newsletter subscription forms.

#### useDemoRequestForm(options?)

Hook for demo request forms with additional fields.

### Analytics Hooks

#### useAnalytics(options?)

Main analytics hook for tracking user interactions.

**Options:**
- `enableScrollTracking?: boolean` - Enable scroll depth tracking
- `enablePageViewTracking?: boolean` - Enable automatic page view tracking
- `scrollThreshold?: number` - Minimum scroll percentage to track
- `debounceDelay?: number` - Debounce delay for events

**Returns:**
- `track: (event) => Promise<void>`
- `trackPageView: (page?, properties?) => void`
- `trackButtonClick: (buttonName, properties?) => void`
- `trackFormSubmit: (formName, success, properties?) => void`
- `trackSectionView: (sectionName, properties?) => void`

#### useSectionTracking(sectionName, threshold?)

Hook for tracking when sections come into view.

### Validation Schemas

All forms use Zod schemas for validation:

- `contactFormSchema` - Email + optional message
- `newsletterSchema` - Email only
- `demoRequestSchema` - Email + company info

### Utility Functions

#### Data Formatting
- `formatNumber(num)` - Format numbers with K/M/B suffixes
- `formatStatistic(value, suffix?)` - Format statistics for display
- `truncateText(text, maxLength)` - Truncate text with ellipsis

#### Performance
- `debounce(func, wait)` - Debounce function calls
- `throttle(func, limit)` - Throttle function calls

#### DOM Utilities
- `scrollToElement(element, offset?, behavior?)` - Smooth scroll to element
- `isElementInViewport(element, threshold?)` - Check if element is visible
- `getScrollPosition()` - Get current scroll position

#### Device Detection
- `device.isMobile()` - Check if mobile device
- `device.isTablet()` - Check if tablet device
- `device.isDesktop()` - Check if desktop device

## Error Handling

The library provides comprehensive error handling:

```typescript
import { MCPError, handleMCPError } from './lib/mcp-client';

try {
  await mcpClient.submitContactForm(data);
} catch (error) {
  if (error instanceof MCPError) {
    const userMessage = handleMCPError(error);
    // Show user-friendly message
  }
}
```

## Testing

The library includes comprehensive tests. Run them with:

```bash
npm test app/lib/__tests__/
```

## Configuration

### Environment Variables

Set these environment variables for production:

```env
MCP_BASE_URL=https://your-mcp-server.com/api
MCP_TIMEOUT=10000
MCP_RETRY_ATTEMPTS=3
```

### MCP Server Endpoints

The client expects these endpoints on your MCP server:

- `POST /contact` - Contact form submissions
- `POST /newsletter` - Newsletter subscriptions
- `POST /analytics` - Analytics events
- `GET /content` - Dynamic content
- `GET /health` - Health check

## Best Practices

1. **Always handle errors gracefully** - Use the provided error handling utilities
2. **Track user interactions** - Use analytics hooks to understand user behavior
3. **Validate forms client-side** - Use the provided Zod schemas
4. **Debounce expensive operations** - Use the utility functions for performance
5. **Test your integrations** - Use the provided test utilities

## Examples

See the `app/components/examples/` directory for complete working examples of:

- Contact forms with MCP integration
- Newsletter subscription forms
- Analytics tracking implementation
- Error handling patterns

## Support

For issues or questions about the MCP integration, check:

1. The example components in `app/components/examples/`
2. The test files in `app/lib/__tests__/`
3. The TypeScript definitions for API documentation