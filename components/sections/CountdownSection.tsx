"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CheckCircle, X, AlertCircle, Sparkles, Mail } from 'lucide-react';

const CountdownSection: React.FC = () => {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  // Email form states
  const [email, setEmail] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  // Fetch the latest preorder date from API
  useEffect(() => {
    const fetchLatestPreorder = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        const response = await fetch('/api/preorders/latest');
        const data = await response.json();

        if (data.success && data.data && data.data.releaseDate) {
          const releaseDate = new Date(data.data.releaseDate);
          setTargetDate(releaseDate);
        } else if (data.success && !data.data) {
          // No preorders found - use fallback date without showing error
          const fallbackDate = new Date();
          fallbackDate.setDate(fallbackDate.getDate() + 30);
          setTargetDate(fallbackDate);
        } else {
          throw new Error('Failed to load preorder data');
        }
      } catch (err) {
        console.error('Error fetching preorder:', err);
        // Use fallback date and only show error for actual network/server issues
        const fallbackDate = new Date();
        fallbackDate.setDate(fallbackDate.getDate() + 30);
        setTargetDate(fallbackDate);
        setError('Unable to load latest countdown. Showing default timer.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPreorder();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00'
        });
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);

  // Message display effect
  useEffect(() => {
    if (emailSuccess || emailError) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        setTimeout(() => {
          setEmailSuccess(false);
          setEmailError(null);
        }, 500);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [emailSuccess, emailError]);

  // Simple email validation with essential checks only
  const validateEmail = (email: string) => {
    // Check for @ symbol
    if (!email.includes('@')) {
      return { isValid: false, error: 'Email must contain @ symbol' };
    }

    // Check for consecutive dots (..)
    if (email.includes('..')) {
      return { isValid: false, error: 'Email cannot contain consecutive dots (..)' };
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email format' };
    }

    return { isValid: true, error: null };
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear previous messages when user starts typing
    if (emailError) setEmailError(null);
    if (emailSuccess) setEmailSuccess(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic required field check
    if (!email || email.trim() === '') {
      setEmailError('Email address is required');
      return;
    }

    // Remove leading/trailing spaces
    const cleanEmail = email.trim();

    // Simple length validation
    if (cleanEmail.length < 3) {
      setEmailError('Email address is too short');
      return;
    }

    if (cleanEmail.length > 254) {
      setEmailError('Email address is too long');
      return;
    }

    // Email format validation
    const validation = validateEmail(cleanEmail);
    if (!validation.isValid) {
      setEmailError(validation.error);
      return;
    }

    setEmailSubmitting(true);
    setEmailError(null);

    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setEmailSuccess(true);
        setEmail(''); // Clear the form
      } else {
        setEmailError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Error subscribing email:', error);
      setEmailError('Network error. Please check your connection and try again.');
    } finally {
      setEmailSubmitting(false);
    }
  };

  return (
    <section id='countdown-section' className="relative w-full flex items-center justify-center min-h-screen">
      {/* Background Image - Fixed positioning */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/gta6-beach.svg"
          alt="GTA 6 Beach Scene"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-90"
          priority
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
        {/* Main Title - Responsive sizing */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-pink-500 font-orbitron">
          Time Until GTA 6 Pre-Orders Open
        </h2>
        
        {/* Target Date Display */}
        {targetDate && (
          <p className="text-cyan-400 mb-4 text-sm md:text-base font-spaceMono">
            Release Date: 15 september 2025
          </p>
        )}
        
        {/* VIP Access Text */}
        <p className="text-yellow-400 mb-8 md:mb-12 text-sm md:text-base font-spaceMono">
          VIP Pre-Order Access ($9.99/MO) - Early Access to Discounts & Bonuses
        </p>
        
        {/* Error Message - Only show for actual errors, not "no data found" */}
        {error && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 p-3 rounded-md mb-6 max-w-md mx-auto">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {/* Countdown Container with Message Area */}
        <div className="relative bg-black/50 backdrop-blur-sm rounded-lg p-6 md:p-8 max-w-lg mx-auto">
          
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center mb-4 md:mb-6">
              <span className="text-white">Loading countdown...</span>
            </div>
          ) : (
            <div className="mb-4 md:mb-6">
              <div className="flex justify-center gap-6 md:gap-12 mb-4">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="text-white text-4xl md:text-5xl lg:text-4xl font-black font-mono leading-none mb-2">
                      {item.value}
                    </div>
                    <div className="text-red-500 text-sm md:text-base font-bold font-spaceMono uppercase tracking-wide">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Sign Up Text with reduced spacing */}
          <div className="mb-4 md:mb-5">
            <h3 className="text-white text-lg md:text-xl font-medium mb-2">
              Sign Up for Weekly GTA 6
            </h3>
            <h3 className="text-white text-lg md:text-xl font-medium">
              Insider Leaks & Pre-Order Deals!
            </h3>
          </div>

          {/* Message Area - Compact space for messages only */}
          <div className="relative mb-3 min-h-[40px] flex items-center justify-center overflow-hidden">
            
            {/* Success Message */}
            {emailSuccess && (
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                showMessage 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-75 translate-y-4'
              }`}>
                <div className="bg-gradient-to-r from-green-900/95 via-emerald-800/95 to-green-900/95 backdrop-blur-lg border border-green-400/50 rounded-xl p-3 shadow-2xl w-full h-full">
                  {/* Floating sparkles */}
                  <div className="absolute -top-1 -left-1 text-yellow-400 animate-bounce">
                    <Sparkles className="w-2 h-2" />
                  </div>
                  <div className="absolute -top-1 -right-1 text-cyan-400 animate-bounce delay-200">
                    <Sparkles className="w-2 h-2" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 text-pink-400 animate-bounce delay-500">
                    <Sparkles className="w-2 h-2" />
                  </div>
                  
                  {/* Success content - Compact */}
                  <div className="flex items-center gap-2 h-full">
                    <div className="relative">
                      <div className="w-6 h-6 bg-green-500/30 border border-green-400 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h4 className="text-sm font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent font-orbitron">
                        🎉 SUCCESS!
                      </h4>
                      <p className="text-green-300 text-xs font-spaceMono">
                        Subscribed to updates!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {emailError && (
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                showMessage 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-75 translate-y-4'
              }`}>
                <div className="bg-gradient-to-r from-red-900/95 via-red-800/95 to-orange-900/95 backdrop-blur-lg border border-red-400/50 rounded-xl p-3 shadow-2xl w-full h-full">
                  {/* Error effects */}
                  <div className="absolute -top-1 -left-1 text-red-400 animate-bounce">
                    <X className="w-2 h-2" />
                  </div>
                  <div className="absolute -top-1 -right-1 text-orange-400 animate-bounce delay-200">
                    <AlertCircle className="w-2 h-2" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 text-red-500 animate-bounce delay-400">
                    <X className="w-2 h-2" />
                  </div>
                  
                  {/* Error content - Compact */}
                  <div className="flex items-center gap-2 h-full">
                    <div className="relative">
                      <div className="w-6 h-6 bg-red-500/30 border border-red-400 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-red-400" />
                      </div>
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h4 className="text-sm font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-orbitron">
                        ⚠️ ERROR
                      </h4>
                      <p className="text-red-300 text-xs font-spaceMono leading-tight">
                        {emailError}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Default State - Empty space when no message */}
            {!emailSuccess && !emailError && (
              <div className="w-full h-full"></div>
            )}
          </div>
          
          {/* Email Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-md bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm md:text-base"
                required
                disabled={emailSubmitting}
                autoComplete="email"
                spellCheck="false"
              />
            </div>
            
            <button
              type="submit"
              disabled={emailSubmitting}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-medium py-3 px-4 rounded-full transition-colors duration-300 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Subscribing...
                </div>
              ) : (
                'Get Updates'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;