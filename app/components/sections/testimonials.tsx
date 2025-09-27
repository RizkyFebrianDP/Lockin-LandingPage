"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { ScrollReveal, StaggerContainer } from '../animations';
import { Star, Quote } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  avatar: string;
  content: string;
  rating: number;
  role?: string;
  company?: string;
}

interface SocialProofStat {
  value: string;
  label: string;
}

const testimonials: TestimonialItem[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'SC',
    content: 'LockIn helped me lock into my study zone like never before. I went from scattered thoughts to laser focus. My productivity increased by 300%!',
    rating: 5,
    role: 'Computer Science Student',
    company: 'UC Berkeley'
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    avatar: 'MJ',
    content: 'I finally learned how to lock in and stay focused. LockIn\'s system helped me unlock my true potential and achieve my biggest career breakthrough.',
    rating: 5,
    role: 'Marketing Director',
    company: 'TechCorp'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    avatar: 'ER',
    content: 'As someone with ADHD, staying locked in was my biggest challenge. LockIn gave me the tools to lock into my creative flow state effortlessly.',
    rating: 5,
    role: 'Creative Director',
    company: 'Design Studio'
  },
  {
    id: '4',
    name: 'Alex Kim',
    avatar: 'AK',
    content: 'LockIn taught me how to lock into deep focus mode. Now I can lock in for hours and unlock incredible academic performance. Game changer!',
    rating: 5,
    role: 'Psychology Major',
    company: 'NYU'
  },
  {
    id: '5',
    name: 'Jordan Taylor',
    avatar: 'JT',
    content: 'From distracted to locked in! LockIn helped me build the habit of locking into my work zone. My coding sessions are now incredibly productive.',
    rating: 5,
    role: 'Software Engineer',
    company: 'Google'
  },
  {
    id: '6',
    name: 'Maya Patel',
    avatar: 'MP',
    content: 'LockIn showed me how to lock into my entrepreneurial mindset. I can now lock in on my goals and unlock business opportunities I never saw before.',
    rating: 5,
    role: 'Entrepreneur',
    company: 'Startup Founder'
  }
];

const socialProofStats: SocialProofStat[] = [
  { value: '50,000+', label: 'Minds Transformed' },
  { value: '4.9/5', label: 'Happiness Rating' },
  { value: '92%', label: 'Feel More Focused' },
  { value: '5 Min', label: 'Daily Practice' }
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}



function SocialProofStats() {
  return (
    <ScrollReveal delay={0.2}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {socialProofStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center group"
          >
            <motion.div 
              className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {stat.value}
            </motion.div>
            <div className="text-gray-800 text-sm md:text-base font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </ScrollReveal>
  );
}

export default function Testimonials() {
  const handleDownloadBetaApp = () => {
    // Track download attempt
    console.log('Download Beta App clicked');
    
    // Download the actual APK file
    const downloadUrl = '/downloads/lockin-beta.apk'; // File di folder public/downloads
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'lockin-beta.apk'; // Nama file asli
    link.click();
    
    // Show download notification
    alert('Download started! File lockin-beta.apk akan terdownload.');
  };

  return (
    <section id="testimonials" className="relative py-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-100/50 to-blue-200/40"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-blue-600/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-500/25 to-blue-700/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-300/20 to-blue-500/15 rounded-full blur-lg"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent text-sm font-semibold tracking-wide uppercase">
                Success Stories
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 bg-clip-text text-transparent">
                LockIn Your Potential—
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                Unlock Your Focus
              </span>
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
              See how thousands of students and professionals locked into their zone and 
              unlocked extraordinary productivity with LockIn's powerful focus system
            </p>
          </div>
        </ScrollReveal>

        {/* Social Proof Statistics */}
        <SocialProofStats />

        {/* Testimonials Grid */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          staggerDelay={0.1}
          direction="up"
          distance={40}
        >
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id}>
              <motion.div
                whileHover={{ 
                  scale: 1.03,
                  y: -8,
                  rotateY: 5
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                <div className="relative h-full bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-200/30 overflow-hidden group">
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${['from-blue-500 to-blue-600', 'from-blue-600 to-blue-700', 'from-blue-400 to-blue-600', 'from-blue-600 to-blue-800', 'from-blue-500 to-blue-700', 'from-blue-700 to-blue-800'][index % 6]} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
                  
                  {/* Quote Icon with Gradient */}
                  <div className="flex justify-start mb-4">
                    <div className={`p-2 rounded-full bg-gradient-to-br ${['from-blue-500 to-blue-600', 'from-blue-600 to-blue-700', 'from-blue-400 to-blue-600', 'from-blue-600 to-blue-800', 'from-blue-500 to-blue-700', 'from-blue-700 to-blue-800'][index % 6]} shadow-lg`}>
                      <Quote className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Testimonial Content */}
                  <p className="text-gray-800 leading-relaxed text-base mb-4 relative z-10">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Rating */}
                  <div className="mb-4">
                    <StarRating rating={testimonial.rating} />
                  </div>
                  
                  {/* User Info */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200/60 relative z-10">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${['from-blue-500 to-blue-600', 'from-blue-600 to-blue-700', 'from-blue-400 to-blue-600', 'from-blue-600 to-blue-800', 'from-blue-500 to-blue-700', 'from-blue-700 to-blue-800'][index % 6]} flex items-center justify-center text-white font-semibold text-lg shadow-lg`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                        {testimonial.company && (
                          <span className="text-gray-400"> • {testimonial.company}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </StaggerContainer>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.4}>
          <div className="text-center mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                  Ready to LockIn Your Success?
                </span>
              </h3>
              <p className="text-lg text-gray-800 mb-6">
                Join thousands who've locked into their zone and unlocked their true potential
              </p>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleDownloadBetaApp}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(59, 130, 246, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-border text-gray-800 px-8 py-4 rounded-xl font-semibold relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #2563eb, #1d4ed8, #1e3a8a) border-box'
                }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent font-semibold">
                  Download LockIn Beta
                </span>
              </motion.button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}