# LockIn Landing Page

This is a modern, responsive landing page built with Next.js 14 (App Router) for the LockIn project. It features smooth animations, interactive sections, and optimized performance for showcasing the LockIn service or product. The design emphasizes user engagement with parallax effects, testimonials, pricing tiers, and a contact form.

## Features

- **Responsive Design**: Fully mobile-friendly using Tailwind CSS and custom components.
- **Smooth Animations**: Page transitions and scroll effects powered by Framer Motion.
- **Interactive Sections**: Hero with call-to-action, statistics counters, feature highlights, demo showcase, pricing cards, testimonials carousel, and contact form.
- **SEO Optimized**: Includes sitemap, robots.txt, and meta tags for better search visibility.
- **Performance**: Optimized with Next.js Image, lazy loading, and code splitting.
- **Deployment Ready**: Configured for Vercel, Netlify, and Docker.

## Project Structure

The project follows Next.js App Router conventions with a modular structure for easy maintenance:

```
app/
├── page.tsx          # Main landing page composing all sections
├── layout.tsx        # Root layout with global styles, fonts, and providers
├── globals.css       # Global Tailwind CSS styles
├── favicon.ico       # Site favicon
├── sitemap.ts        # Dynamic sitemap generation
└── api/              # API routes (if needed for contact form backend)
    └── ...
components/
├── animations/       # Reusable animation components
│   ├── PageTransition.tsx  # Wraps the entire page for fade-in/out effects
│   └── SmoothScroll.tsx    # Enables smooth scrolling with offset for fixed headers
└── sections/         # Self-contained page sections
    ├── header.tsx    # Navigation bar with logo, menu, and CTA button
    ├── hero.tsx      # Eye-catching hero section with headline, subtext, and primary CTA
    ├── statistics.tsx # Animated counters for key metrics (e.g., users, growth)
    ├── features.tsx  # Grid of feature cards with icons and descriptions
    ├── demo.tsx      # Interactive demo or video embed section
    ├── pricing.tsx   # Tiered pricing cards with toggle for monthly/annual
    ├── testimonials.tsx # Carousel of user reviews with avatars and quotes
    ├── contact.tsx   # Form for user inquiries with validation
    └── footer.tsx    # Footer with links, social icons, and copyright
lib/
└── utils.ts          # Utility functions (e.g., cn for className merging)
public/
├── images/           # Static assets like logos, icons, and mockups
├── icons/            # Favicon variants and app icons
├── manifest.json     # PWA manifest for web app capabilities
└── ...               # Other public files (robots.txt, etc.)
scripts/              # Build and deployment scripts
docs/                 # Additional documentation (e.g., PERFORMANCE.md)
```

### Key Components Explanation

- **PageTransition (animations/PageTransition.tsx)**: Uses Framer Motion's AnimatePresence and motion.div to handle enter/exit animations for the entire page, ensuring smooth transitions on route changes.
  
- **SmoothScroll (animations/SmoothScroll.tsx)**: A custom hook/component that intercepts anchor clicks and uses window.scrollTo for buttery-smooth scrolling, accounting for header height offset.

- **Header (sections/header.tsx)**: Fixed navigation with responsive hamburger menu. Includes links to sections (using IDs for in-page navigation) and a "Get Started" button linking to pricing or contact.

- **Hero (sections/hero.tsx)**: Prominent section with a background image/video, H1 headline (e.g., "Lock In Your Focus"), supporting text, and primary CTA button. May include a subtle animation on load.

- **Statistics (sections/statistics.tsx)**: Displays key stats (e.g., "10K+ Users", "99% Uptime") with count-up animations using libraries like react-countup or custom hooks.

- **Features (sections/features.tsx)**: A grid or list of 4-6 features, each with an icon (from Heroicons or Lucide), title, and description. Highlights benefits like "Seamless Integration" or "AI-Powered Insights".

- **Demo (sections/demo.tsx)**: Embed a video demo, interactive iframe, or screenshots of the LockIn app in action. Includes play button and captions.

- **Pricing (sections/pricing.tsx)**: Three pricing tiers (Basic, Pro, Enterprise) with cards showing features, price, and "Subscribe" button. Toggle switch for billing cycle.

- **Testimonials (sections/testimonials.tsx)**: Slider or grid of quotes from users, including name, role, avatar, and star rating. Uses a library like Swiper.js for carousel functionality.

- **Contact (sections/contact.tsx)**: Simple form with fields for name, email, message. Submits via API route or external service (e.g., Formspree). Includes success/error states.

- **Footer (sections/footer.tsx)**: Links to About, Privacy, Terms; social media icons; newsletter signup; and copyright notice.

All sections are designed as independent components, making it easy to reorder or customize them in `app/page.tsx`.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RizkyFebrianDP/Lockin-LandingPage.git
   cd lockin-landingpage
   ```

2. Install dependencies:
   ```bash
   npm install
   # or yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

- `npm run dev`: Starts the development server with hot reloading.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality checks.

Editing `app/page.tsx` will auto-update the page in the browser.

## Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with PostCSS
- **Animations**: Framer Motion
- **Icons**: Heroicons or Lucide React
- **Fonts**: Next.js Font Optimization (Geist or custom)
- **TypeScript**: For type safety
- **Deployment**: Vercel (preferred), Netlify, or Docker

## Deployment

### Vercel (Recommended)

1. Push to GitHub.
2. Connect your repo to Vercel dashboard.
3. Deploy automatically on push to main.

Custom domain and environment variables are supported via vercel.json.

### Netlify

Configure via netlify.toml for build settings.

### Docker

Build and run:
```bash
docker build -t lockin-landingpage .
docker run -p 3000:3000 lockin-landingpage
```

## Contributing

1. Fork the project.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please ensure code follows ESLint rules and includes tests if applicable.

## License

This project is open-source under the MIT License.

## Contact

For questions, open an issue on GitHub or email [your-email@example.com](mailto:your-email@example.com).

---

*Built with ❤️ for LockIn by Rizky Febrian DP*
