'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui';

interface NavigationItem {
  label: string;
  href: string;
}

interface HeaderProps {
  className?: string;
}

const navigationItems: NavigationItem[] = [
  { label: 'How it Works', href: '#hero' },
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
];

export default function Header({ className = '' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle scroll effect for header styling
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Debounce scroll events for better performance
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolled(window.scrollY > 20);
        // Auto-close mobile menu on scroll with better threshold
        if (isMenuOpen && window.scrollY > 100) {
          setIsMenuOpen(false);
        }
      }, 10);
    };

    // Handle resize to close menu on orientation change
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    // Use passive listeners for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Smooth scroll to section with header offset
  const scrollToSection = (href: string) => {
    // Close menu first
    setIsMenuOpen(false);
    
    // Wait for menu to close, then find element
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        // Use state-based screen size detection
        const headerHeight = isMobile ? 56 : isTablet ? 64 : 80;
        
        // Additional offset for mobile to account for safe area and better spacing
        const additionalOffset = isMobile ? 20 : isTablet ? 16 : 12;
        const totalOffset = headerHeight + additionalOffset;
        
        // Get element position relative to viewport
        const elementRect = element.getBoundingClientRect();
        const elementTop = elementRect.top + window.pageYOffset;
        const offsetPosition = elementTop - totalOffset;

        // Haptic feedback for mobile devices
        if (navigator.vibrate && isMobile) {
          navigator.vibrate(50);
        }

        // Ensure we don't scroll to negative position
        const finalPosition = Math.max(0, offsetPosition);

        // Smooth scroll with better timing for mobile
        const scrollOptions = {
          top: finalPosition,
          behavior: 'smooth' as ScrollBehavior
        };

        // Use requestAnimationFrame for better performance on mobile
        requestAnimationFrame(() => {
          try {
            // Try smooth scroll first
            window.scrollTo(scrollOptions);
          } catch (error) {
            // Fallback for browsers that don't support smooth scroll
            window.scrollTo(0, finalPosition);
          }
          
        // Additional fallback for mobile browsers
        if (isMobile) {
          setTimeout(() => {
            const currentScroll = window.pageYOffset;
            const targetScroll = finalPosition;
            const scrollDiff = Math.abs(currentScroll - targetScroll);
            
            // If scroll didn't work, try again with instant scroll
            if (scrollDiff > 50) {
              console.log('Mobile scroll fallback triggered:', {
                currentScroll,
                targetScroll,
                scrollDiff
              });
              window.scrollTo(0, finalPosition);
            }
          }, 100);
        }
        });

        // Debug log for mobile
        if (isMobile) {
          console.log('Mobile scroll:', {
            href,
            elementTop,
            totalOffset,
            finalPosition,
            headerHeight,
            additionalOffset,
            elementRect: elementRect,
            currentScroll: window.pageYOffset
          });
        }
      } else {
        console.warn('Element not found:', href);
      }
    }, isMobile ? 150 : 100); // Longer delay for mobile to ensure menu is closed
  };

  // Handle touch gestures for mobile menu
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startY = touch.clientY;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const diffY = startY - currentY;
      
      // Close menu on swipe up gesture
      if (diffY > 50 && isMenuOpen) {
        setIsMenuOpen(false);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/10 backdrop-blur-lg md:backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5' 
          : 'bg-white/5 backdrop-blur-sm'
      } ${className}`}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        background: isScrolled 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 xs:h-16 sm:h-16 md:h-18 lg:h-20">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a 
              href="#" 
              className="flex items-center transition-all duration-300 drop-shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              role="button"
              tabIndex={0}
              aria-label="Go to top of page"
              title="LockIn - Go to top of page"
            >
              <Image
                src="/images/logo-web.png"
                alt="LockIn Logo"
                width={180}
                height={60}
                className="h-6 xs:h-8 sm:h-10 md:h-12 w-auto hover:opacity-80 transition-opacity duration-300"
                priority
              />
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item, index) => (
              <motion.button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-300 relative group drop-shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                role="menuitem"
                tabIndex={0}
                aria-label={`Navigate to ${item.label} section`}
                title={`Go to ${item.label} section`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </motion.button>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={() => scrollToSection('#contact')}
              className="bg-blue-600/90 hover:bg-blue-700/90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 backdrop-blur-sm border border-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              role="menuitem"
              tabIndex={0}
              aria-label="Get started with LockIn"
              title="Get started with LockIn"
            >
              Get Started
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 xs:p-3 rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            role="button"
            tabIndex={0}
            title={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 xs:h-6 xs:w-6 text-gray-800 drop-shadow-sm" />
            ) : (
              <Menu className="h-5 w-5 xs:h-6 xs:w-6 text-gray-800 drop-shadow-sm" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden focus:outline-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setIsMenuOpen(false);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Close menu"
            />
            
            <motion.div
            id="mobile-menu"
            className="md:hidden absolute top-full left-0 right-0 bg-white/15 backdrop-blur-sm md:backdrop-blur-md border-b border-white/20 shadow-lg shadow-black/10 z-50 focus:outline-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 100%)'
            }}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            onTouchStart={handleTouchStart}
            onClick={(e) => e.stopPropagation()}
            role="navigation"
            aria-label="Mobile navigation menu"
            tabIndex={0}
            title="Mobile navigation menu"
          >
            <div className="px-3 xs:px-4 py-4 xs:py-6 space-y-1 xs:space-y-2">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left text-gray-800 hover:text-blue-600 font-medium py-2 xs:py-3 px-2 rounded-lg hover:bg-white/10 transition-all duration-300 drop-shadow-sm min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm xs:text-base"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                  role="menuitem"
                  tabIndex={0}
                  aria-label={`Navigate to ${item.label} section`}
                  title={`Go to ${item.label} section`}
                >
                  {item.label}
                </motion.button>
              ))}
              
              <motion.div
                className="pt-2 xs:pt-3 border-t border-white/20 mt-1 xs:mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <Button
                  onClick={() => scrollToSection('#contact')}
                  className="w-full bg-blue-600/90 hover:bg-blue-700/90 text-white py-2 xs:py-3 px-3 xs:px-4 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-blue-500/20 min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm xs:text-base"
                  role="menuitem"
                  tabIndex={0}
                  aria-label="Get started with LockIn"
                  title="Get started with LockIn"
                >
                  Get Started
                </Button>
              </motion.div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}