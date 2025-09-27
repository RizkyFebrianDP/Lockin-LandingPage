"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "../ui/icons";
import ScrollReveal from "../animations/scroll-reveal";

interface DemoSlide {
  id: string;
  title: string;
  features: Array<{
    title: string;
    description: string;
  }>;
  mainImage: string;
}

const demoSlides: DemoSlide[] = [
  {
    id: "ai-weekly-snapshot",
    title: "AI-Powered Weekly Snapshot",
    features: [
      {
        title: "Mood & Focus Analytics",
        description:
          "Track your emotional well-being with emoji-based mood tracking and see your focus hours in beautiful visual charts.",
      },
      {
        title: "Weekly Insights",
        description:
          "Get personalized AI-generated insights about your productivity patterns and receive actionable recommendations.",
      },
      {
        title: "Progress Visualization",
        description:
          "Monitor your daily achievements with clear visual feedback and celebrate your productivity milestones.",
      },
    ],
    mainImage: "/images/Dashboard.png",
  },
  {
    id: "smart-todo-tracking",
    title: "Smart To-Do & Habit Tracking",
    features: [
      {
        title: "Intelligent Task Management",
        description:
          "Organize your daily tasks with smart scheduling, priority management, and calendar integration.",
      },
      {
        title: "Completion Tracking",
        description:
          "Visualize your progress with completion percentages and track your daily productivity achievements.",
      },
      {
        title: "Habit Building",
        description:
          "Build consistent habits with streak tracking, gentle reminders, and motivational progress indicators.",
      },
    ],
    mainImage: "/images/To Do List Feature.png",
  },
  {
    id: "focus-lock-mode",
    title: "Focus Lock Mode",
    features: [
      {
        title: "App & Website Blocking",
        description:
          "Block distracting apps and websites during focus sessions to maintain deep concentration and productivity.",
      },
      {
        title: "Pomodoro Timer",
        description:
          "Use customizable focus timers with beautiful, minimalist interface that keeps you in the zone.",
      },
      {
        title: "Focus Session Analytics",
        description:
          "Track your focus sessions, monitor concentration streaks, and build better work habits over time.",
      },
    ],
    mainImage: "/images/Blocking Feature.png",
  },
];

export default function Demo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % demoSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + demoSlides.length) % demoSlides.length
    );
  }, []);

  // Auto-play functionality (5 seconds per slide)
  useEffect(() => {
    if (isPaused || demoSlides.length <= 1) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          prevSlide();
          break;
        case "ArrowRight":
          event.preventDefault();
          nextSlide();
          break;
        case " ":
          event.preventDefault();
          setIsPaused(!isPaused);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, nextSlide, prevSlide]);

  // Touch/swipe support - simplified implementation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      (e.currentTarget as any).touchStartX = touch.clientX;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      const startX = (e.currentTarget as any).touchStartX;

      if (touch && startX !== undefined) {
        const deltaX = touch.clientX - startX;
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            prevSlide(); // Swipe right = previous slide
          } else {
            nextSlide(); // Swipe left = next slide
          }
        }
      }
    },
    [nextSlide, prevSlide]
  );

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const currentDemo = demoSlides[currentSlide];

  return (
    <section id="demo" className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12 relative">
            <h2
              className="text-[36px] font-semibold text-primary-dark leading-[1.21] mb-4"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              See LockIn in Action
            </h2>
            <p
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-12"
              style={{ fontFamily: "General Sans, sans-serif" }}
            >
              Discover how LockIn transforms your productivity with AI-powered
              insights, smart task management, and focus-enhancing features.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Demo Container */}
        <div
          className="relative flex items-center justify-center overflow-visible"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              }}
              className="relative w-full"
            >
              {/* Desktop Layout */}
              <div className="hidden lg:flex items-center justify-center gap-[80px] relative">
                {/* Left Arrow */}
                <motion.button
                  className="w-[40px] h-[40px] rounded-full p-0 shadow-lg border-2 border-gray-200 flex items-center justify-center absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 bg-blue-500"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  whileHover={{
                    scale: 1.15,
                    backgroundColor: "#3b82f6",
                    boxShadow: "0 12px 30px rgba(71, 130, 244, 0.4)",
                  }}
                  whileTap={{
                    scale: 0.9,
                    backgroundColor: "#2563eb",
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <motion.div
                    whileHover={{ x: -2 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <ArrowLeftIcon className="text-white" size={24} />
                  </motion.div>
                </motion.button>

                {/* Main Content Container */}
                <div className="flex items-center gap-[80px]">
                  {/* Left Side: Main Image */}
                  <div className="relative overflow-visible">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="relative"
                    >
                      <img
                        src={currentDemo.mainImage}
                        alt={`${currentDemo.title} demo`}
                        className="w-[240px] h-[480px] object-contain drop-shadow-2xl"
                        onLoad={() =>
                          setImageLoaded((prev) => ({
                            ...prev,
                            [currentDemo.id]: true,
                          }))
                        }
                        onError={(e) => {
                          console.warn(
                            `Failed to load image: ${currentDemo.mainImage}`
                          );
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Right Side: Content */}
                  <div className="w-[380px]">
                    {/* Main Title */}
                    <h3
                      className="text-[26px] font-semibold text-primary-blue leading-[1.35] mb-[25px]"
                      style={{ fontFamily: "General Sans, sans-serif" }}
                    >
                      {currentDemo.title}
                    </h3>

                    {/* Features List */}
                    <div className="w-[360px] space-y-4">
                      {currentDemo.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-2"
                        >
                          {/* Feature Header with Icon */}
                          <div className="flex items-center gap-4">
                            <div className="w-[24px] h-[24px] flex items-center justify-center flex-shrink-0">
                              <CheckIcon
                                className="text-primary-blue"
                                size={24}
                              />
                            </div>
                            <h4
                              className="text-lg font-semibold text-black leading-[1.35]"
                              style={{ fontFamily: "General Sans, sans-serif" }}
                            >
                              {feature.title}
                            </h4>
                          </div>
                          {/* Feature Description */}
                          <p
                            className="text-sm font-medium text-black leading-[1.35] ml-[40px]"
                            style={{ fontFamily: "General Sans, sans-serif" }}
                          >
                            {feature.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Arrow */}
                <motion.button
                  className="w-[40px] h-[40px] rounded-full p-0 shadow-lg border-2 border-gray-200 flex items-center justify-center absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 bg-blue-500"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  whileHover={{
                    scale: 1.15,
                    backgroundColor: "#3b82f6",
                    boxShadow: "0 12px 30px rgba(71, 130, 244, 0.4)",
                  }}
                  whileTap={{
                    scale: 0.9,
                    backgroundColor: "#2563eb",
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <motion.div
                    whileHover={{ x: 2 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <ArrowRightIcon className="text-white" size={24} />
                  </motion.div>
                </motion.button>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden flex flex-col items-center space-y-8 px-4">
                {/* Mobile Navigation Arrows */}
                <div className="flex justify-between w-full max-w-sm">
                  <motion.button
                    className="w-[40px] h-[40px] rounded-full p-0 shadow-lg border-2 border-gray-200 flex items-center justify-center bg-blue-500"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowLeftIcon className="text-white" size={20} />
                  </motion.button>

                  <motion.button
                    className="w-[40px] h-[40px] rounded-full p-0 shadow-lg border-2 border-gray-200 flex items-center justify-center bg-blue-500"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowRightIcon className="text-white" size={20} />
                  </motion.button>
                </div>

                {/* Mobile Content */}
                <div className="text-center space-y-6">
                  {/* Main Title */}
                  <h3
                    className="text-[20px] sm:text-[24px] font-semibold text-primary-blue leading-[1.35]"
                    style={{ fontFamily: "General Sans, sans-serif" }}
                  >
                    {currentDemo.title}
                  </h3>

                  {/* Main Image */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex justify-center"
                  >
                    <img
                      src={currentDemo.mainImage}
                      alt={`${currentDemo.title} demo`}
                      className="w-[200px] h-[400px] sm:w-[220px] sm:h-[440px] object-contain drop-shadow-2xl"
                      onLoad={() =>
                        setImageLoaded((prev) => ({
                          ...prev,
                          [currentDemo.id]: true,
                        }))
                      }
                      onError={(e) => {
                        console.warn(
                          `Failed to load image: ${currentDemo.mainImage}`
                        );
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </motion.div>

                  {/* Features List */}
                  <div className="space-y-4 text-left max-w-md mx-auto">
                    {currentDemo.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        {/* Feature Header with Icon */}
                        <div className="flex items-center gap-3">
                          <div className="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
                            <CheckIcon
                              className="text-primary-blue"
                              size={20}
                            />
                          </div>
                          <h4
                            className="text-base font-semibold text-black leading-[1.35]"
                            style={{ fontFamily: "General Sans, sans-serif" }}
                          >
                            {feature.title}
                          </h4>
                        </div>
                        {/* Feature Description */}
                        <p
                          className="text-sm font-medium text-black leading-[1.35] ml-[32px]"
                          style={{ fontFamily: "General Sans, sans-serif" }}
                        >
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators */}
        {demoSlides.length > 1 && (
          <div className="flex justify-center space-x-3 mt-8">
            {demoSlides.map((_, index) => (
              <motion.button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide
                    ? "bg-primary-blue"
                    : "bg-gray-300 hover:bg-primary-blue/50"
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                animate={{
                  scale: index === currentSlide ? 1.4 : 1,
                  backgroundColor:
                    index === currentSlide ? "#4782F4" : "#D1D5DB",
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
