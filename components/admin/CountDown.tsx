"use client";

import { CountdownState, CountdownTimerProps } from "@/types";
import { useState, useEffect } from "react";

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  createdAt,
  className = "",
  size = "medium",
}) => {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  // Fixed release date: June 30, 2025 at 11:59 PM
  const RELEASE_DATE = new Date("2025-06-30T23:59:59");

  const calculateCountdown = (): CountdownState => {
    try {
      const now = new Date().getTime();
      const target = RELEASE_DATE.getTime();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, isExpired: false };
    } catch (error) {
      console.error("Error calculating countdown:", error);
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
    }
  };

  useEffect(() => {
    // Initial calculation
    setCountdown(calculateCountdown());

    // Update every second
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          container: "text-xs",
          number: "text-lg font-bold",
          label: "text-xs",
        };
      case "large":
        return {
          container: "text-base",
          number: "text-4xl font-bold",
          label: "text-sm",
        };
      default: // medium
        return {
          container: "text-sm",
          number: "text-2xl font-bold",
          label: "text-xs",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  if (countdown.isExpired) {
    return (
      <div className={`${className} ${sizeClasses.container}`}>
        <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-center">
          <div className="text-red-600 font-bold">🚀 RELEASED!</div>
          <div className="text-red-500 text-xs">June 30, 2025</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} ${sizeClasses.container}`}>
      <div className="bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 rounded-lg p-3">
        <div className="text-center mb-2">
          <div className="text-gray-600 font-medium text-xs">
            Release Countdown
          </div>
          <div className="text-gray-500 text-xs">Until June 30, 2025</div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-white rounded p-2 border border-gray-200">
            <div className={`${sizeClasses.number} text-cyan-600`}>
              {countdown.days}
            </div>
            <div className={`${sizeClasses.label} text-gray-500`}>Days</div>
          </div>
          <div className="bg-white rounded p-2 border border-gray-200">
            <div className={`${sizeClasses.number} text-purple-600`}>
              {countdown.hours}
            </div>
            <div className={`${sizeClasses.label} text-gray-500`}>Hours</div>
          </div>
          <div className="bg-white rounded p-2 border border-gray-200">
            <div className={`${sizeClasses.number} text-cyan-600`}>
              {countdown.minutes}
            </div>
            <div className={`${sizeClasses.label} text-gray-500`}>Mins</div>
          </div>
          <div className="bg-white rounded p-2 border border-gray-200">
            <div className={`${sizeClasses.number} text-purple-600`}>
              {countdown.seconds}
            </div>
            <div className={`${sizeClasses.label} text-gray-500`}>Secs</div>
          </div>
        </div>

        <div className="text-center mt-2">
          <div className="inline-flex items-center px-2 py-1 bg-green-100 border border-green-300 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-green-700 text-xs">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
