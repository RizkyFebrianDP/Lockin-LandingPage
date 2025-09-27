import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Temporarily disable performance monitoring to fix build issues
// import { PerformanceProvider } from "./components/performance/performance-monitor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LockIn - Block distractions. Build focus streaks. Get things done.",
  description: "LockIn is a productivity app designed specifically for Gen Z users. Block distractions, build focus streaks, and get things done with smart to-do tracking, focus lock mode, AI insights, and multi-format journaling.",
  keywords: ["productivity", "focus", "Gen Z", "app", "distraction blocker", "habit tracking"],
  authors: [{ name: "LockIn Team" }],
  robots: "index, follow",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo-web.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/images/logo-web.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: "LockIn - Block distractions. Build focus streaks. Get things done.",
    description: "LockIn is a productivity app designed specifically for Gen Z users.",
    type: "website",
    locale: "en_US",
    siteName: "LockIn",
    images: [
      {
        url: "/images/logo-web.png",
        width: 1200,
        height: 630,
        alt: "LockIn Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LockIn - Block distractions. Build focus streaks. Get things done.",
    description: "LockIn is a productivity app designed specifically for Gen Z users.",
    images: ["/images/logo-web.png"],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/logo-web.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logo-web.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/images/iphone-mockup.png" as="image" type="image/png" />
        <link rel="preload" href="/images/heart-icon.png" as="image" type="image/png" />
        
        {/* Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
