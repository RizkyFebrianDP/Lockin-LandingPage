"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, ArrowRight, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ScrollReveal } from '../animations/scroll-reveal';
import { LoadingSpinner, Skeleton } from '../animations/loading-skeleton';
import { useContactForm } from '../../lib/hooks/use-form-submission';
import { useAnalytics } from '../../lib/hooks/use-analytics';

export default function Contact() {
  const { trackButtonClick } = useAnalytics({
    enableScrollTracking: false,
    enablePageViewTracking: false,
  });

  // Contact form hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    submissionState,
    submitContactForm,
  } = useContactForm({
    onSuccess: () => {
      trackButtonClick('contact_form_success', { form_type: 'contact' });
    },
    onError: (error) => {
      trackButtonClick('contact_form_error', { form_type: 'contact', error });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await submitContactForm(data);
  });

  const handleDownloadBetaApp = () => {
    trackButtonClick('download_beta_app', { source: 'contact_section' });
    // In a real app, this would navigate to the app store or download page
    window.open('https://app.lockin.com/download', '_blank');
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-32 items-center">
          {/* Left Side - Testimonials */}
          <ScrollReveal>
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Section Title */}
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-900 mb-4 lg:mb-6 leading-tight">
                  People are Saying About LockIn
                </h2>
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                  Everything you need to boost your productivity and achieve your goals from anywhere on the planet
                </p>
              </div>

              {/* Testimonial */}
              <div className="space-y-6">
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  LockIn has completely transformed my productivity! My days are so much more organized and focused. This app helps me stay on track with my goals and I can accomplish tasks in record time 🚀
                </p>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Right Side - Feedback Form */}
          <ScrollReveal>
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Success Message */}
              {submissionState.isSuccess && (
                <motion.div
                  className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 font-medium">Feedback sent successfully!</p>
                    <p className="text-green-700 text-sm mt-1">Thank you for your valuable input!</p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {submissionState.error && (
                <motion.div
                  className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium">Failed to send feedback</p>
                    <p className="text-red-700 text-sm mt-1">{submissionState.error}</p>
                  </div>
                </motion.div>
              )}

              {/* Feedback Form */}
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-4">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      disabled={submissionState.isSubmitting}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Feedback Field */}
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-4">
                    Feedback
                  </label>
                  <div className="relative">
                    <textarea
                      {...register('message')}
                      placeholder="Share your thoughts, suggestions, or feedback..."
                      rows={4}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                      disabled={submissionState.isSubmitting}
                    />
                  </div>
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-400" role="alert">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submissionState.isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submissionState.isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Sending Feedback...
                    </>
                  ) : (
                    'Give Feedback'
                  )}
                </button>

              </form>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}