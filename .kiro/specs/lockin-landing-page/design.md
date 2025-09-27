# Design Document

## Overview

The LockIn landing page will be built as a modern, single-page application using Next.js 14 with App Router, TypeScript, and Tailwind CSS. The design follows a mobile-first approach with a clean, contemporary aesthetic that appeals to Gen Z users. The page will feature smooth animations, interactive elements, and seamless integration with MCP server functionality for enhanced user experience and data management.

## Architecture

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for utility-first styling
- **Animations**: Framer Motion for smooth transitions and scroll animations
- **Icons**: Lucide React for consistent iconography
- **Images**: Next.js Image component with optimization
- **MCP Integration**: Custom MCP client for server communication
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context for global state (if needed)

### Project Structure
```
app/
├── layout.tsx                 # Root layout with metadata
├── page.tsx                   # Main landing page
├── globals.css               # Global styles and Tailwind imports
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── sections/             # Page sections
│   │   ├── header.tsx
│   │   ├── hero.tsx
│   │   ├── statistics.tsx
│   │   ├── features.tsx
│   │   ├── demo.tsx
│   │   ├── pricing.tsx
│   │   ├── testimonials.tsx
│   │   ├── contact.tsx
│   │   └── footer.tsx
│   └── animations/           # Animation components
│       ├── scroll-reveal.tsx
│       └── fade-in.tsx
├── lib/
│   ├── mcp-client.ts        # MCP server integration
│   ├── utils.ts             # Utility functions
│   └── validations.ts       # Form validation schemas
└── public/
    ├── images/              # Optimized images
    ├── icons/               # App store badges and icons
    └── mockups/             # Device mockups
```

## Components and Interfaces

### Core Components

#### Header Component
```typescript
interface HeaderProps {
  className?: string;
}

interface NavigationItem {
  label: string;
  href: string;
  onClick?: () => void;
}
```
- Fixed header with logo and navigation
- Smooth scroll navigation to sections
- Mobile hamburger menu
- CTA button with hover effects

#### Hero Section
```typescript
interface HeroProps {
  statistics: StatisticItem[];
  appStoreLinks: AppStoreLink[];
}

interface StatisticItem {
  value: string;
  label: string;
  icon?: string;
}

interface AppStoreLink {
  platform: 'ios' | 'android';
  url: string;
  badgeImage: string;
}
```
- Large hero text with gradient effects
- Animated statistics counter
- App store badges with hover effects
- Device mockups with parallax scrolling

#### Statistics Section
```typescript
interface StatisticsProps {
  statistic: string;
  explanation: string;
  image?: string;
}
```
- Large, prominent statistic display
- Supporting explanation text
- Optional accompanying visual/illustration
- Smooth scroll animations
- Responsive typography scaling

#### Features Section
```typescript
interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface FeaturesProps {
  features: Feature[];
}
```
- Grid layout responsive to screen size
- Icon animations on scroll
- Staggered reveal animations
- Interactive hover effects

#### Demo Section
```typescript
interface DemoItem {
  id: string;
  title: string;
  description: string;
  image: string;
  highlights: string[];
}

interface DemoProps {
  demoItems: DemoItem[];
}
```
- Interactive carousel/slider
- Navigation dots and arrows
- Auto-play with pause on hover
- Touch/swipe support for mobile

#### Pricing Section
```typescript
interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
  ctaAction: () => void;
}

interface PricingProps {
  plans: PricingPlan[];
  billingCycle: 'monthly' | 'yearly';
  onBillingChange: (cycle: 'monthly' | 'yearly') => void;
}
```
- Three-column responsive layout
- Billing toggle with smooth transition
- Popular plan highlighting
- Feature comparison with checkmarks

#### Contact Section
```typescript
interface ContactFormData {
  email: string;
  message?: string;
}

interface ContactProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
}
```
- Email validation with real-time feedback
- Loading states for form submission
- Success/error message handling
- Alternative CTA options

### MCP Integration

#### MCP Client Interface
```typescript
interface MCPClient {
  submitContactForm(data: ContactFormData): Promise<MCPResponse>;
  trackUserInteraction(event: AnalyticsEvent): Promise<void>;
  getContentData(): Promise<ContentData>;
}

interface MCPResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface AnalyticsEvent {
  type: 'page_view' | 'button_click' | 'form_submit' | 'scroll_depth';
  properties: Record<string, any>;
  timestamp: Date;
}
```

## Data Models

### Content Data Structure
```typescript
interface LandingPageContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    statistics: StatisticItem[];
  };
  statistics: {
    statistic: string;
    explanation: string;
    image?: string;
  };
  features: Feature[];
  demo: {
    title: string;
    items: DemoItem[];
  };
  pricing: {
    title: string;
    subtitle: string;
    plans: PricingPlan[];
  };
  testimonials: {
    title: string;
    items: TestimonialItem[];
  };
  footer: {
    sections: FooterSection[];
    legal: LegalLink[];
  };
}

interface TestimonialItem {
  id: string;
  name: string;
  avatar: string;
  content: string;
  rating?: number;
}
```

### Form Validation Schemas
```typescript
// Using Zod for runtime validation
const contactFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  message: z.string().optional(),
});

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
```

## Error Handling

### Client-Side Error Handling
- Form validation with user-friendly error messages
- Network error handling with retry mechanisms
- Graceful degradation for JavaScript-disabled browsers
- Loading states and skeleton screens

### MCP Integration Error Handling
```typescript
class MCPError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

const handleMCPError = (error: MCPError) => {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Connection failed. Please try again.';
    case 'VALIDATION_ERROR':
      return 'Please check your input and try again.';
    case 'SERVER_ERROR':
      return 'Something went wrong. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
};
```

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Utility function testing with Jest
- Form validation testing
- MCP client testing with mocked responses

### Integration Testing
- End-to-end user flows with Playwright
- Form submission workflows
- Navigation and scroll behavior
- Responsive design testing

### Performance Testing
- Lighthouse audits for Core Web Vitals
- Image optimization verification
- Bundle size analysis
- Loading performance testing

### Accessibility Testing
- Automated accessibility testing with axe-core
- Keyboard navigation testing
- Screen reader compatibility
- Color contrast validation

## Visual Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --primary-blue: #4782F4;
  --primary-dark: #191A15;
  --primary-white: #FFFFFF;
  
  /* Secondary Colors */
  --secondary-gray: #A6A6A6;
  --secondary-light-gray: #F9FAFB;
  --accent-green: #6DD130;
  
  /* Gradient Colors */
  --gradient-blue: linear-gradient(90deg, #D6E2FF 0%, #F7D6FF 100%);
  --gradient-dark: linear-gradient(90deg, #000000 100%);
}
```

### Typography
```css
/* Font Family: General Sans */
.heading-xl { font-size: 50px; font-weight: 700; line-height: 1.35; }
.heading-lg { font-size: 40px; font-weight: 600; line-height: 1.6; }
.heading-md { font-size: 32px; font-weight: 600; line-height: 1.35; }
.heading-sm { font-size: 24px; font-weight: 600; line-height: 1.35; }
.body-lg { font-size: 24px; font-weight: 400; line-height: 1.25; }
.body-md { font-size: 18px; font-weight: 500; line-height: 1.67; }
.body-sm { font-size: 16px; font-weight: 400; line-height: 1.31; }
.caption { font-size: 14px; font-weight: 500; line-height: 1.35; }
```

### Spacing System
```css
/* Spacing Scale (Tailwind-compatible) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Animation System
```typescript
// Framer Motion variants
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Layout Adaptations
- **Mobile (< 768px)**: Single column layout, stacked sections, hamburger menu
- **Tablet (768px - 1024px)**: Two-column layouts where appropriate, condensed spacing
- **Desktop (> 1024px)**: Multi-column layouts, full feature showcase, expanded spacing

## Performance Optimization

### Image Optimization
- Next.js Image component with automatic optimization
- WebP format with fallbacks
- Lazy loading for below-the-fold images
- Responsive image sizing

### Code Splitting
- Automatic code splitting with Next.js App Router
- Dynamic imports for heavy components
- Lazy loading of non-critical features

### Caching Strategy
- Static generation for content pages
- API route caching for MCP responses
- Browser caching for static assets
- CDN integration for global performance

This design provides a comprehensive foundation for building a modern, performant, and accessible landing page that effectively showcases the LockIn app while providing seamless user experience and robust MCP integration.