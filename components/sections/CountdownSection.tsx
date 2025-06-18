"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CheckCircle, X, AlertCircle, Sparkles, Mail } from 'lucide-react';
import { formattingUtils } from '@/lib/utils/formatting';
import { validationUtils } from '@/lib/utils/validation';
import { API_ENDPOINTS } from '@/lib/constants';

interface CountdownSectionProps {
  preorder: any;
}

const CountdownSection: React.FC<CountdownSectionProps> = ({ preorder }) => {
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

  // Set target date from preorder prop
  useEffect(() => {
    if (preorder && preorder.releaseDate) {
      setTargetDate(new Date(preorder.releaseDate));
    } else {
      // No preorders found - use fallback date
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 30);
      setTargetDate(fallbackDate);
    }
    setLoading(false);
  }, [preorder]);

  // Countdown timer effect
  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      const countdown = formattingUtils.time.formatCountdown(targetDate);
      setTimeLeft({
        days: countdown.days.toString().padStart(2, '0'),
        hours: countdown.hours.toString().padStart(2, '0'),
        minutes: countdown.minutes.toString().padStart(2, '0'),
        seconds: countdown.seconds.toString().padStart(2, '0')
      });
      if (countdown.isExpired) {
        clearInterval(timer);
      }
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

    // Email validation using utility
    const emailError = validationUtils.email.getError(cleanEmail);
    if (emailError) {
      setEmailError(emailError);
      return;
    }

    setEmailSubmitting(true);
    setEmailError(null);

    try {
      const response = await fetch(API_ENDPOINTS.subscriptions.subscribe, {
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
          alt="GTA 6 Beach Background"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-30"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="text-center">
          {/* Title */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            <span className="text-pink-500 font-orbitron">GTA 6</span> Release Countdown
          </h2>

          {/* Countdown Timer */}
          <div className="mb-12">
            {loading ? (
              <div className="text-white text-2xl">Loading countdown...</div>
            ) : error ? (
              <div className="text-yellow-400 text-lg mb-4">{error}</div>
            ) : null}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50">
                <div className="text-4xl md:text-6xl font-bold text-pink-500 font-orbitron">
                  {timeLeft.days}
                </div>
                <div className="text-white text-sm md:text-lg mt-2">Days</div>
              </div>
              
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50">
                <div className="text-4xl md:text-6xl font-bold text-pink-500 font-orbitron">
                  {timeLeft.hours}
                </div>
                <div className="text-white text-sm md:text-lg mt-2">Hours</div>
              </div>
              
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50">
                <div className="text-4xl md:text-6xl font-bold text-pink-500 font-orbitron">
                  {timeLeft.minutes}
                </div>
                <div className="text-white text-sm md:text-lg mt-2">Minutes</div>
              </div>
              
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50">
                <div className="text-4xl md:text-6xl font-bold text-pink-500 font-orbitron">
                  {timeLeft.seconds}
                </div>
                <div className="text-white text-sm md:text-lg mt-2">Seconds</div>
              </div>
            </div>
          </div>

          {/* Email Subscription Form */}
          <div className="max-w-md mx-auto">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50">
              <div className="flex flex-col items-center mb-4">
                <Mail className="text-pink-500 mb-2" size={24} />
                <h3 className="text-white text-lg font-semibold text-center tracking-wide">Get Notified</h3>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                Be the first to know when GTA 6 is available for pre-order!
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                    disabled={emailSubmitting}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={emailSubmitting}
                  className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {emailSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2" size={16} />
                      Subscribe Now
                    </>
                  )}
                </button>
              </form>

              {/* Success/Error Messages */}
              {showMessage && (
                <div className={`mt-4 p-3 rounded-lg flex items-center ${
                  emailSuccess 
                    ? 'bg-green-900/50 border border-green-500/50 text-green-400' 
                    : 'bg-red-900/50 border border-red-500/50 text-red-400'
                }`}>
                  {emailSuccess ? (
                    <>
                      <CheckCircle className="mr-2" size={16} />
                      Successfully subscribed! You'll be notified when GTA 6 is available.
                    </>
                  ) : (
                    <>
                      <AlertCircle className="mr-2" size={16} />
                      {emailError}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;