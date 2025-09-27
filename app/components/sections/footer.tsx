"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useNewsletterForm } from '../../lib/hooks/use-form-submission';
import { useAnalytics } from '../../lib/hooks/use-analytics';

export default function Footer() {
  const { trackButtonClick } = useAnalytics({
    enableScrollTracking: false,
    enablePageViewTracking: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    submissionState,
    submitNewsletterForm,
  } = useNewsletterForm({
    onSuccess: () => {
      trackButtonClick('newsletter_signup_success', { source: 'footer' });
    },
    onError: (error) => {
      trackButtonClick('newsletter_signup_error', { source: 'footer', error });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await submitNewsletterForm(data);
  });

  const handleLinkClick = (linkName: string) => {
    trackButtonClick('footer_link_click', { link: linkName });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <Image
                  src="/images/logo-web.png"
                  alt="LockIn Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Transform your productivity with smart focus tools and habit tracking designed for the modern lifestyle.
              </p>
              
              {/* Newsletter */}
              <div>
                <h3 className="text-white font-semibold mb-3">Stay Updated</h3>
                <form onSubmit={onSubmit} className="space-y-3">
                  <div className="flex">
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Your email"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      disabled={submissionState.isSubmitting}
                      required
                    />
                    <button
                      type="submit"
                      disabled={submissionState.isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none transition-colors duration-200 disabled:opacity-50"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs">{errors.email.message}</p>
                  )}
                  {submissionState.isSuccess && (
                    <p className="text-green-400 text-xs">Successfully subscribed!</p>
                  )}
                  {submissionState.error && (
                    <p className="text-red-400 text-xs">{submissionState.error}</p>
                  )}
                </form>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-white font-semibold mb-6">Product</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleLinkClick('features')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('pricing')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('integrations')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Integrations
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('mobile_app')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Mobile App
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('updates')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    What's New
                  </button>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-white font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleLinkClick('help_center')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('contact')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('community')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Community
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('tutorials')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Tutorials
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('status')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    System Status
                  </button>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleLinkClick('about')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('careers')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('blog')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('press')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Press Kit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('security')}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Security
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 LockIn Inc. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleLinkClick('privacy')}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => handleLinkClick('terms')}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Terms of Service
              </button>
              <button
                onClick={() => handleLinkClick('cookies')}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Cookies
              </button>
            </div>

            {/* Social Proof */}
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-xs">
                Trusted by 50,000+ users worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}