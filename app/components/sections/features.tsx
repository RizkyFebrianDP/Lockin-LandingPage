'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ScrollReveal, StaggerContainer } from '../animations';
import { useState } from 'react';

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    id: 'todo-habits',
    icon: '/icons/approval-icon.svg',
    title: 'Smart To-Do & Habit Tracking',
    description: 'Turn big goals into doable steps.\nBuild positive habits with motivating progress visuals that keep you on track — day after day.'
  },
  {
    id: 'journaling',
    icon: '/icons/file-folder-icon.svg',
    title: 'Multi-Format Journaling',
    description: 'Express yourself through text, voice notes, photos, or videos. Use guided reflections and mood tracking to better understand your emotional patterns and growth.'
  },
  {
    id: 'focus-lock',
    icon: '/icons/speed-icon.svg',
    title: 'Focus Lock Mode',
    description: 'Block out distractions, your way. Use custom timers (like Pomodoro) and a clean interface to stay focused — while keeping essential apps whitelisted.'
  },
  {
    id: 'ai-insights',
    icon: '/icons/neural-interface-icon.svg',
    title: 'AI Personal Insights',
    description: 'Let AI decode your journal entries to uncover emotional trends. Get smart, timely motivational nudges when you need them most.'
  }
];

export default function Features() {
  const [focusedFeature, setFocusedFeature] = useState<string | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent, featureId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setFocusedFeature(focusedFeature === featureId ? null : featureId);
    }
  };

  return (
    <section
      id="features"
      className="py-12 sm:py-16 lg:py-20 bg-white"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <ScrollReveal>
            <h2
              id="features-heading"
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight"
            >
              Everything You Need to Stay Focused
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p
              className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Lock-In combines the best productivity tools into one powerful platform designed specifically for the modern Gen Z lifestyle.
            </p>
          </ScrollReveal>
        </div>

        {/* Features Grid */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 justify-items-center"
          staggerDelay={0.15}
          direction="up"
          distance={60}
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col w-full max-w-md group cursor-pointer"
              role="listitem"
              tabIndex={0}
              aria-describedby={`${feature.id}-description`}
              onKeyDown={(e) => handleKeyDown(e, feature.id)}
              onFocus={() => setFocusedFeature(feature.id)}
              onBlur={() => setFocusedFeature(null)}
            >
              <div
                className={`
                  p-4 sm:p-5 lg:p-6 rounded-2xl transition-all duration-300 ease-out
                  ${focusedFeature === feature.id
                    ? 'bg-blue-50 border-2 border-blue-200 shadow-lg'
                    : 'bg-transparent border-2 border-transparent hover:bg-gray-50 hover:shadow-md'
                  }
                  focus-within:bg-blue-50 focus-within:border-blue-200 focus-within:shadow-lg
                  group-hover:bg-gray-50 group-hover:shadow-md
                `}
              >
                {/* Icon and Title */}
                <div className="flex items-start sm:items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300"
                  >
                    <Image
                      src={feature.icon}
                      alt=""
                      width={28}
                      height={28}
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <h3
                    className="text-base sm:text-lg font-semibold text-black leading-tight group-hover:text-blue-900 transition-colors duration-300">
                    {feature.title}
                  </h3>
                </div>

                {/* Description */}
                <p
                  id={`${feature.id}-description`}
                  className="text-sm text-gray-600 leading-relaxed whitespace-pre-line group-hover:text-gray-700 transition-colors duration-300"
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}