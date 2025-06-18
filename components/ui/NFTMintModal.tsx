"use client";
import React, { useState, useEffect } from "react";
import { X, Mail, Star, CheckCircle, Sparkles } from "lucide-react";
import { NFTMintModalProps } from "@/types";

const NFTMintModal: React.FC<NFTMintModalProps> = ({
  isOpen,
  onClose,
  nftType,
  nftData,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);
  const [currentView, setCurrentView] = useState<"form" | "success" | "error">(
    "form"
  );
  const [isClosing, setIsClosing] = useState(false);

  // Enhanced modal animation control with better scroll prevention
  useEffect(() => {
    if (isOpen) {
      // Prevent background scroll more aggressively
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.documentElement.style.overflow = "hidden";

      setTimeout(() => setShowModal(true), 10);
    } else {
      setShowModal(false);

      // Restore scrolling
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      document.documentElement.style.overflow = "auto";

      // Reset states when closing
      setTimeout(() => {
        setEmail("");
        setEmailError("");
        setHasAttemptedValidation(false);
        setCurrentView("form");
        setIsClosing(false);
      }, 300);
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [isOpen]);

  // Auto-clear error messages after 2 seconds and return to form
  useEffect(() => {
    if (currentView === "error") {
      const timer = setTimeout(() => {
        setEmailError("");
        setCurrentView("form");
        setHasAttemptedValidation(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentView]);

  // Handle email input changes - no validation at all
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Clear any existing errors when user starts typing
    if (emailError) {
      setEmailError("");
      setCurrentView("form");
    }
  };

  // Simple email validation function
  const validateEmail = (email: string) => {
    if (!email || email.trim() === "") {
      return { isValid: false, error: "Email address is required" };
    }

    const cleanEmail = email.trim();

    if (cleanEmail.length < 3) {
      return { isValid: false, error: "Email address is too short" };
    }

    if (cleanEmail.length > 254) {
      return { isValid: false, error: "Email address is too long" };
    }

    if (!cleanEmail.includes("@")) {
      return { isValid: false, error: "Email must contain @ symbol" };
    }

    if (cleanEmail.includes("..")) {
      return {
        isValid: false,
        error: "Email cannot contain consecutive dots (..)",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { isValid: false, error: "Please enter a valid email format" };
    }

    return { isValid: true, error: "" };
  };

  // Handle email submission with conditional auto-close
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setHasAttemptedValidation(true);

    // Validate email
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setEmailError(validation.error || "Invalid email format");
      setCurrentView("error");
      // Error will auto-clear after 2 seconds due to useEffect
      return;
    }

    setIsLoading(true);
    setEmailError("");

    try {
      const response = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          source: `NFT_MINT_${nftType.toUpperCase()}`,
          metadata: {
            nftType,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (response.ok) {
        // Show success view
        setCurrentView("success");

        // Auto-close after 3 seconds for success
        setTimeout(() => {
          setIsClosing(true);
          setTimeout(() => {
            handleClose();
          }, 800);
        }, 3000);
      } else {
        const data = await response.json();
        const errorMessage = data.error || "Failed to verify email";
        setEmailError(errorMessage);
        setCurrentView("error");
        // Error will auto-clear after 2 seconds due to useEffect
      }
    } catch (err) {
      setEmailError("Network error. Please try again.");
      setCurrentView("error");
      // Error will auto-clear after 2 seconds due to useEffect
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced close with smooth exit
  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const getModalColor = () => {
    switch (nftType) {
      case "gold":
        return "from-yellow-500/20 to-orange-500/20";
      case "diamond":
        return "from-blue-500/20 to-cyan-500/20";
      default:
        return "from-purple-500/20 to-pink-500/20";
    }
  };

  const getBorderColor = () => {
    switch (nftType) {
      case "gold":
        return "border-yellow-500/50";
      case "diamond":
        return "border-cyan-500/50";
      default:
        return "border-purple-500/50";
    }
  };

  const getIconColor = () => {
    switch (nftType) {
      case "gold":
        return "text-yellow-400";
      case "diamond":
        return "text-cyan-400";
      default:
        return "text-purple-400";
    }
  };

  const getGlowColor = () => {
    switch (nftType) {
      case "gold":
        return "shadow-yellow-500/25";
      case "diamond":
        return "shadow-cyan-500/25";
      default:
        return "shadow-purple-500/25";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ touchAction: "none" }}
    >
      {/* Enhanced Backdrop with scroll prevention */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-500 ease-out ${
          showModal ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        onTouchMove={(e) => e.preventDefault()}
        onWheel={(e) => e.preventDefault()}
      />

      {/* Enhanced Modal with smooth "suck back" closing animation */}
      <div
        className={`relative bg-gradient-to-br ${getModalColor()} bg-gray-900/95 backdrop-blur-lg rounded-2xl border ${getBorderColor()} shadow-2xl ${getGlowColor()} w-full max-w-lg transform transition-all duration-800 ease-in-out ${
          isClosing
            ? "scale-0 opacity-0 translate-y-0 rotate-0 blur-0"
            : showModal
            ? "scale-100 opacity-100 translate-y-0 rotate-0 blur-0"
            : "scale-95 opacity-0 translate-y-8 rotate-1"
        }`}
      >
        {/* Animated border glow with smooth closing */}
        <div
          className={`absolute inset-0 bg-gradient-to-r rounded-2xl blur-xl transition-all duration-800 ${
            isClosing ? "opacity-0 scale-0" : "animate-pulse opacity-100"
          } ${
            nftType === "gold"
              ? "from-yellow-400/20 via-orange-400/20 to-yellow-400/20"
              : nftType === "diamond"
              ? "from-cyan-400/20 via-blue-400/20 to-cyan-400/20"
              : "from-purple-400/20 via-pink-400/20 to-purple-400/20"
          }`}
        />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90 z-20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Main Content */}
        <div className="relative z-10 p-8">
          {/* Form View */}
          {currentView === "form" && (
            <div
              className={`text-center transition-all duration-700 ease-out ${
                showModal
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {/* NFT Preview */}
              <div
                className={`mb-6 transition-all duration-500 delay-100 ${
                  showModal
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <div
                  className={`w-32 h-32 mx-auto rounded-xl bg-gradient-to-br ${getModalColor()} border ${getBorderColor()} p-1 mb-4 transform hover:scale-105 transition-all duration-300 hover:rotate-3`}
                >
                  <div className="w-full h-full rounded-lg bg-gray-800 flex items-center justify-center">
                    <Star
                      className={`w-16 h-16 ${getIconColor()} animate-pulse`}
                    />
                  </div>
                </div>
                <h3
                  className={`text-2xl font-bold text-white mb-2 font-orbitron`}
                >
                  {nftData.title}
                </h3>
                <p
                  className={`text-3xl font-bold text-cyan-400 font-orbitron animate-pulse`}
                >
                  {nftData.price}
                </p>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div
                  className={`transition-all duration-500 delay-200 ${
                    showModal
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <h4
                    className={`text-lg font-semibold text-white mb-4 font-spaceMono`}
                  >
                    Join the Exclusive NFT List
                  </h4>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors duration-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email address"
                      className="w-full bg-gray-800/80 border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all duration-300 font-spaceMono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-cyan-400 hover:bg-cyan-500 disabled:bg-gray-600 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-orbitron hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25 transform ${
                    showModal
                      ? "opacity-100 translate-y-0 delay-300"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Join NFT Community
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Success View */}
          {currentView === "success" && (
            <div
              className={`text-center transition-all duration-800 ${
                isClosing ? "scale-0 opacity-0" : "animate-zoom-in"
              }`}
            >
              {/* Main success icon */}
              <div className="relative mb-8">
                <div
                  className={`w-24 h-24 bg-green-500/30 border-4 border-green-500/60 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-800 ${
                    isClosing ? "scale-0 opacity-0" : "animate-pulse"
                  }`}
                >
                  <CheckCircle
                    className={`w-12 h-12 text-green-400 transition-all duration-800 ${
                      isClosing ? "scale-0" : "animate-bounce"
                    }`}
                  />
                </div>
                {/* Expanding rings */}
                <div
                  className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 border-2 border-green-400/30 rounded-full transition-all duration-800 ${
                    isClosing ? "scale-0 opacity-0" : "animate-ping"
                  }`}
                ></div>
                <div
                  className={`absolute top-1 left-1/2 transform -translate-x-1/2 w-22 h-22 border-2 border-green-400/20 rounded-full transition-all duration-800 delay-100 ${
                    isClosing ? "scale-0 opacity-0" : "animate-ping delay-300"
                  }`}
                ></div>
              </div>

              {/* Animated success message */}
              <div
                className={`transition-all duration-800 ${
                  isClosing ? "scale-0 opacity-0" : ""
                }`}
              >
                <h3 className="text-4xl font-bold mb-4 font-orbitron">
                  <span className="inline-block animate-bounce bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    ✨ SUCCESS! ✨
                  </span>
                </h3>

                <p className="text-xl text-white font-spaceMono mb-4 animate-pulse">
                  Email Verified Successfully!
                </p>

                <div className="bg-gradient-to-r from-green-900/30 via-cyan-900/20 to-green-900/30 border border-green-400/40 rounded-xl p-6 backdrop-blur-sm">
                  <p className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent font-orbitron animate-pulse">
                    Welcome to {nftData.title}!
                  </p>
                  <p className="text-sm text-gray-300 font-spaceMono mt-2">
                    📧 {email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Error View - Shows for 2 seconds then auto-returns to form */}
          {currentView === "error" && (
            <div
              className={`text-center transition-all duration-500 animate-shake`}
            >
              <div className="relative mb-6">
                {/* Error icon with pulsing effect */}
                <div className="w-16 h-16 bg-red-500/30 border-4 border-red-500/60 rounded-full flex items-center justify-center mx-auto animate-pulse mb-4">
                  <X className="w-8 h-8 text-red-400 animate-bounce" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-4 font-orbitron">
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  ⚠️ Error
                </span>
              </h3>

              {/* Error message display */}
              <div className="bg-gradient-to-r from-red-900/30 via-red-800/20 to-red-900/30 border border-red-500/40 rounded-xl p-4 mb-4 backdrop-blur-sm">
                <p className="text-red-300 font-spaceMono text-sm font-medium">
                  {emailError}
                </p>

                <div className="mt-3 pt-3 border-t border-red-500/20">
                  <p className="text-gray-400 font-spaceMono text-xs">
                    Returning to form in 2 seconds...
                  </p>
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-ping delay-100"></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-ping delay-200"></div>
              </div>
            </div>
          )}
        </div>

        {/* Custom CSS for additional animations */}
        <style jsx>{`
          @keyframes zoom-in {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }

          .animate-zoom-in {
            animation: zoom-in 0.5s ease-out;
          }

          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default NFTMintModal;
