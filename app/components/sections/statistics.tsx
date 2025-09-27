'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ScrollReveal } from '../animations/scroll-reveal';
import { ResponsiveContainer, ResponsiveStack, ResponsiveText } from '../ui/responsive-container';

interface StatisticsProps {
  className?: string;
}

export function Statistics({ className = '' }: StatisticsProps) {
  return (
    <section className={`py-16 md:py-24 bg-white ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image Section */}
          <ScrollReveal className="flex-1 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Image
                src="/images/statistics-illustration-70c65f.png"
                alt="Focus illustration"
                width={526}
                height={485}
                className="w-full h-auto"
                priority
              />
            </div>
          </ScrollReveal>

          {/* Content Section */}
          <div className="flex-1 text-center lg:text-left">
            <ScrollReveal delay={0.2}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
                You're not alone —{' '}
                <span className="text-blue-600">95% of Gen Z</span>{' '}
                struggle with staying focused
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0 lg:max-w-none text-left">
                That's why LockIn brings everything you need into one simple
                space that helps you block distractions and stay on track.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}