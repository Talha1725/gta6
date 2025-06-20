"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CheckCircle, X, AlertCircle, Sparkles, Mail } from 'lucide-react';
import { formattingUtils } from '@/lib/utils/formatting';
import { validationUtils } from '@/lib/utils/validation';
import { API_ENDPOINTS, preorderPriceTier } from '@/lib/constants';
import { useSession } from "next-auth/react";
import PaymentModal from '../PaymentModal';
import { getPreOrderByEmail } from '@/actions/order';

interface CountdownSectionProps {
  preorder: any;
}

const CountdownSection: React.FC<CountdownSectionProps> = ({ preorder }) => {
  const { data: session } = useSession();
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
  const [showModal, setShowModal] = useState(false);
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);



  useEffect(() => {
    if (session?.user?.email) {
      checkPreOrder();
      setEmail(session.user.email);
    }
  }, [session]);

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

  const checkPreOrder = async () => {

    if (!session?.user?.email) return;
    try {
      console.log(session?.user?.email, '!session?.user?.email')
      const result = await getPreOrderByEmail(session?.user?.email);
      if (Array.isArray(result) && result.length > 0) {
        setIsAlreadySubscribed(true);
      }
    } catch (err) {
      console.error('Error checking pre-order:', err);
    }
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
        // Open subscription modal for the subscription tier
        setShowModal(true);
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
    <section id='countdown-section' className="relative py-20 w-full flex items-center justify-center min-h-screen">
      {/* Background Image - Fixed positioning */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/gta6-beach.svg"
          alt="GTA 6 Beach Background"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-80"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="text-center">
          {/* Title */}
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-pink-500 font-orbitron">
            Time Until GTA 6 Pre-Orders Open</h2>
          <p className='text-white text-md font-spaceMono font-bold mt-4'><span className='text-yellow'>VIP Pre-Order Access ($9.99/MO) </span>– Early Access to Discounts & Bonuses</p>

          {/* Countdown Timer */}
          <div className='p-4 rounded-2xl bg-black/40 mt-10 sm:w-[70%] lg:w-[40%] mx-auto'>
            <div className="mb-12">
              {loading ? (
                <div className="text-white text-2xl">Loading countdown...</div>
              ) : error ? (
                <div className="text-yellow-400 text-lg mb-4">{error}</div>
              ) : null}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg">
                  <div className="text-xl md:text-2xl font-bold text-white font-orbitron">
                    {timeLeft.days}
                  </div>
                  <div className="text-danger md:text-md mt-2 font-bold">Days</div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg">
                  <div className="text-xl md:text-2xl font-bold text-white font-orbitron">
                    {timeLeft.hours}
                  </div>
                  <div className="text-danger md:text-md mt-2 font-bold">Hours</div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg">
                  <div className="text-xl md:text-2xl font-bold text-white font-orbitron">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-danger md:text-md mt-2 font-bold">Minutes</div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg">
                  <div className="text-xl md:text-2xl font-bold text-white font-orbitron">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-danger md:text-md mt-2 font-bold">Seconds</div>
                </div>
              </div>
            </div>

            {/* Email Subscription Form */}
            <div>
              <div>
                <div className="flex flex-col items-center mb-4 lg:w-[80%] mx-auto">
                  <h3 className="text-white text-2xl font-semibold text-center tracking-wide font-orbitron">Sign Up for Weekly GTA 6 Insider Leaks & Pre-Order Deals!</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 text-center rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                      disabled={emailSubmitting || isAlreadySubscribed}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={emailSubmitting || isAlreadySubscribed}
                    className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:bg-cyan-500 py-2 px-4 text-black font-orbitron rounded-full font-bold transition-colors flex items-center justify-center"
                  >
                    {emailSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Get Updates
                      </>
                    )}
                  </button>
                </form>

                {/* Success/Error Messages */}
                {showMessage && (
                  <div className={`mt-4 p-3 rounded-lg flex items-center ${emailSuccess
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
            </div></div>

          {/* Payment Modal for subscription */}
          <PaymentModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            amount={preorderPriceTier.price}
            currency={preorderPriceTier.currency}
            productName={preorderPriceTier.type}
            purchaseType={preorderPriceTier.purchaseType}
            totalLeaks={preorderPriceTier.totalLeaks}
          />

        </div>
      </div>
    </section>
  );
};

export default CountdownSection;