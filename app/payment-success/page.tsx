"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type PaymentStatus = "processing" | "success" | "failed" | "canceled";

// Create a client component that uses useSearchParams
const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>("processing");

  const payment_intent = searchParams?.get("payment_intent");
  const redirect_status = searchParams?.get("redirect_status");
  const error_message = searchParams?.get("error_message");
  const payment_intent_client_secret = searchParams?.get("payment_intent_client_secret");

  useEffect(() => {
    // Handle different payment statuses
    if (redirect_status === "succeeded") {
      setPaymentStatus("success");
    } else if (redirect_status === "failed") {
      console.error('❌ Payment failed:', { payment_intent, status: redirect_status, error: error_message });
      setPaymentStatus("failed");
    } else if (redirect_status === "canceled") {
      setPaymentStatus("canceled");
    } else if (error_message) {
      console.error('❌ Payment error:', { payment_intent, error: error_message });
      setPaymentStatus("failed");
    } else if (payment_intent) {
      // For testing, we'll simulate success after a short delay
      const timer = setTimeout(() => {
        setPaymentStatus("success");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [payment_intent, redirect_status, error_message, payment_intent_client_secret, searchParams]);

  const renderStatusContent = () => {
    switch (paymentStatus) {
      case "success":
        return (
          <>
            <div className="relative mb-8">
              {/* Success icon with purple/pink glow */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full border-4 border-purple-500/60 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-purple-400 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              {/* Animated rings with purple/pink */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 border-2 border-purple-400/30 rounded-full animate-ping"></div>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-22 h-22 border-2 border-pink-400/20 rounded-full animate-ping delay-300"></div>
            </div>

            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Payment Successful!
            </h2>
            
            <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/30 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-purple-800/50 shadow-xl">
              <p className="text-gray-300 mb-4">
                Your payment has been processed successfully.
              </p>
              <div className="text-left text-sm text-gray-400 space-y-2">
                <p><strong>Payment Intent ID:</strong> {payment_intent || 'N/A'}</p>
                <p><strong>Status:</strong> {redirect_status || 'succeeded'}</p>
              </div>
            </div>
          </>
        );

      case "failed":
        return (
          <>
            <div className="relative mb-8">
              {/* Error icon with purple/pink glow */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full border-4 border-purple-500/60 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-pink-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 border-2 border-pink-400/30 rounded-full animate-ping"></div>
            </div>

            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Payment Failed
            </h2>
            
            <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/30 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-purple-800/50 shadow-xl">
              <p className="text-gray-300 mb-4">
                {error_message || 'We were unable to process your payment. Please try again.'}
              </p>
              <div className="text-left text-sm text-gray-400 space-y-2">
                <p><strong>Payment Intent ID:</strong> {payment_intent || 'N/A'}</p>
                <p><strong>Status:</strong> {redirect_status || 'failed'}</p>
              </div>
            </div>
          </>
        );

      case "canceled":
        return (
          <>
            <div className="relative mb-8">
              {/* Canceled icon with purple/pink glow */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full border-4 border-purple-500/60 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 border-2 border-purple-400/30 rounded-full animate-ping"></div>
            </div>

            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Payment Canceled
            </h2>
            
            <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/30 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-purple-800/50 shadow-xl">
              <p className="text-gray-300 mb-4">
                Your payment was canceled. No charges were made.
              </p>
            </div>
          </>
        );

      default: // processing
        return (
          <>
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Processing Payment...
            </h2>
            <p className="text-gray-400 mb-6">
              Please wait while we confirm your payment.
            </p>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-pink-900/20">
<title>{`Payment Success ${paymentStatus}`}</title>
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/30 backdrop-blur-lg p-8 rounded-2xl border border-purple-800/50 shadow-2xl max-w-md w-full text-center">
          {renderStatusContent()}
          
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="px-6 py-3 bg-gradient-to-br from-gray-800/50 to-purple-900/30 text-white font-medium rounded-xl hover:from-gray-700/50 hover:to-purple-800/30 transition-all duration-300 border border-purple-800/50"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

// Wrap the component in Suspense in the page component
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
