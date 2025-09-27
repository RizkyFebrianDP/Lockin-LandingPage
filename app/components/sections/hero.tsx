"use client";

import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/button";

interface StatisticItem {
  value: string;
  label: string;
  targetValue: number;
}

const statistics: StatisticItem[] = [
  {
    value: "10k+",
    label: "Active Users",
    targetValue: 10000,
  },
  {
    value: "85%",
    label: "Better Focus",
    targetValue: 85,
  },
  {
    value: "4.8M",
    label: "App Rating",
    targetValue: 4800000,
  },
  {
    value: "2M+",
    label: "Hours Focus",
    targetValue: 2000000,
  },
];

interface AppStoreLink {
  platform: "ios" | "android";
  url: string;
  badgeImage: string;
  alt: string;
}

const appStoreLinks: AppStoreLink[] = [
  {
    platform: "android",
    url: "https://play.google.com/store/apps/details?id=com.lockin",
    badgeImage: "/icons/google-play-badge.svg",
    alt: "Get it on Google Play",
  },
  {
    platform: "ios",
    url: "https://apps.apple.com/app/lockin",
    badgeImage: "/icons/app-store-badge.svg",
    alt: "Download on the App Store",
  },
];

// Animated counter component
function AnimatedCounter({
  targetValue,
  displayValue,
  duration = 2000,
}: {
  targetValue: number;
  displayValue: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(targetValue * easeOutQuart);

        setCount(currentValue);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [inView, targetValue, duration]);

  // Format the count based on the display value format
  const formatCount = (value: number): string => {
    if (displayValue.includes("k+")) {
      return `${Math.floor(value / 1000)}k+`;
    } else if (displayValue.includes("M+")) {
      return `${Math.floor(value / 1000000)}M+`;
    } else if (displayValue.includes("%")) {
      return `${value}%`;
    } else if (displayValue.includes("M")) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return value.toString();
  };

  return (
    <span
      ref={ref}
      className="font-medium text-[25px] leading-[1.2] text-black"
    >
      {inView ? formatCount(count) : displayValue.charAt(0)}
    </span>
  );
}

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white py-2 pt-20"
    >
      {/* Main container with blue background */}
      <div className="w-full max-w-[1158px] min-h-[520px] bg-[#D0DFFF] rounded-[20px] p-[10px] flex flex-col justify-center items-center relative mx-4">
        {/* Content container */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-[31px] px-[20px] lg:px-[40px] py-[20px] w-full h-full">
          {/* Left content */}
          <div className="flex flex-col gap-[18px] w-full lg:w-[420px] flex-shrink-0 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-1"
            >
              <Image
                src="/images/heart-icon.png"
                alt="Heart icon"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="text-base font-normal leading-[1.31] tracking-[-0.32%] text-black">
                Loved by 10k GenZ Users
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-[28px] sm:text-[32px] lg:text-[40px] font-semibold leading-[1.25] text-[#191A15] w-full lg:w-[400px]"
            >
              Block distractions. Build focus streaks. Get things done.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base font-medium leading-[1.67] text-black"
            >
              All in one place — with LockIn.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-black to-black text-white px-6 py-[14px] rounded-[51px] text-base font-medium leading-[1.31] tracking-[-0.32%] backdrop-blur-[4px] min-w-[130px] h-[45px] flex items-center justify-center gap-[5px]"
                onClick={() => handleDownloadBetaApp()}
              >
                Download Beta App
              </Button>
            </motion.div>

            {/* App Store Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-[19px]"
            >
              {appStoreLinks.map((store) => (
                <motion.a
                  key={store.platform}
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="transition-transform duration-200"
                >
                  <Image
                    src={store.badgeImage}
                    alt={store.alt}
                    width={store.platform === "android" ? 135 : 120}
                    height={40}
                    className="h-10 w-auto"
                  />
                </motion.a>
              ))}
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-full max-w-[300px] lg:w-[300px] h-[50px] relative"
            >
              {/* Mobile: Grid layout */}
              <div className="grid grid-cols-2 gap-4 lg:hidden">
                {statistics.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-[18px] sm:text-[20px] font-medium leading-[1.2] text-black">
                      <AnimatedCounter
                        targetValue={stat.targetValue}
                        displayValue={stat.value}
                      />
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-normal text-black whitespace-nowrap">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop: Absolute positioning */}
              <div className="hidden lg:block">
                {statistics.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="absolute"
                    style={{
                      left:
                        index === 0
                          ? "3px"
                          : index === 1
                          ? "92px"
                          : index === 2
                          ? "183px"
                          : "276px",
                      top: "0px",
                    }}
                  >
                    <div className="text-[22px] font-medium leading-[1.2] text-black">
                      <AnimatedCounter
                        targetValue={stat.targetValue}
                        displayValue={stat.value}
                      />
                    </div>
                    <div
                      className="text-[10px] font-normal leading-[3] text-black absolute whitespace-nowrap"
                      style={{
                        top: "26px",
                        left:
                          index === 0
                            ? "-3px"
                            : index === 1
                            ? "-1px"
                            : index === 2
                            ? "4px"
                            : "-2px",
                      }}
                    >
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right side - Phone mockup container */}
          <div className="w-full lg:w-[230px] relative flex justify-center lg:justify-end mt-8 lg:mt-0">
            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
              }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 1, 0, -1, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/images/iphone-mockup.png"
                  alt="LockIn App Mockup"
                  width={220}
                  height={445}
                  className="w-[180px] h-[365px] sm:w-[200px] sm:h-[405px] lg:w-[220px] lg:h-[445px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Floating Cards - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          {/* Top floating icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="absolute top-[45px] right-[450px]"
            style={{
              transform: `translateY(${scrollY * 0.08}px)`,
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/images/floating-icon-1.png"
                alt="Floating icon 1"
                width={67}
                height={66}
                className="w-[60px] h-[60px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
              />
            </motion.div>
          </motion.div>

          {/* This Week card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-[150px] right-[420px]"
            style={{
              transform: `translateY(${scrollY * 0.05}px)`,
            }}
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-white rounded-[15px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-[10px] flex items-center justify-center gap-[10px] h-[50px] min-w-[200px]"
            >
              <Image
                src="/images/heart-icon.png"
                alt="Target icon"
                width={29}
                height={29}
                className="w-[20px] h-[20px]"
              />
              <span className="text-[12px] font-semibold leading-[1.35] text-[#191A15] whitespace-nowrap">
                This Week : 38h Focused
              </span>
            </motion.div>
          </motion.div>

          {/* AI Insight card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute top-[230px] right-[400px]"
            style={{
              transform: `translateY(${scrollY * 0.03}px)`,
            }}
          >
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="bg-white rounded-[15px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-[10px] flex items-center justify-center gap-[10px] w-[200px] h-[45px]"
            >
              <Image
                src="/images/heart-icon.png"
                alt="AI insight icon"
                width={21}
                height={18}
                className="w-[20px] h-[20px]"
              />
              <span className="text-[12px] font-semibold leading-[1.35] text-[#191A15] text-center">
                AI Insight of the Week
              </span>
            </motion.div>
          </motion.div>

          {/* How Was Your Day card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="absolute top-[320px] right-[350px]"
            style={{
              transform: `translateY(${scrollY * 0.02}px)`,
            }}
          >
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="bg-white rounded-[15px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-[10px] flex items-center justify-center gap-[10px] w-[166px] h-[45px]"
            >
              <Image
                src="/images/heart-icon.png"
                alt="Journal icon"
                width={19}
                height={21}
                className="w-[20px] h-[20px]"
              />
              <span className="text-[12px] font-semibold leading-[1.35] text-[#191A15] whitespace-nowrap">
                How Was Your Day
              </span>
            </motion.div>
          </motion.div>

          {/* Bottom floating icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="absolute top-[400px] right-[450px]"
            style={{
              transform: `translateY(${scrollY * 0.06}px)`,
            }}
          >
            <motion.div
              animate={{
                rotate: [0, -15, 0, 15, 0],
                y: [0, -5, 0, 5, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <Image
                src="/images/floating-icon-2.png"
                alt="Floating icon 2"
                width={67}
                height={67}
                className="w-[60px] h-[60px]"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
