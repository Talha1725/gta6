"use client";

import React, { useState, useEffect } from "react";
import ChatWidget from "./ChatWidget";

const ChatWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const toggleChat = (): void => {
    if (isAnimating) return;

    if (isOpen) {
      // Start closing animation
      setIsClosing(true);
      setIsAnimating(true);
      setShowContent(false);

      setTimeout(() => {
        setShouldRender(false);
        setIsOpen(false);
        setIsClosing(false);
        setIsAnimating(false);
      }, 400);
    } else {
      // Start opening animation
      setIsClosing(false);
      setIsAnimating(true);
      setIsOpen(true);
      setShouldRender(true);
      setShowContent(false);

      // Trigger animation after DOM is rendered
      setTimeout(() => {
        setShowContent(true);
      }, 50);

      setTimeout(() => {
        setIsAnimating(false);
      }, 400);
    }
  };

  return (
    <div className="fixed bottom-1 right-1 sm:right-3 z-50">
      <img
        src="/images/Chat-Icon.png"
        alt="Chat"
        onClick={toggleChat}
        className={`w-24 h-24 sm:w-36 sm:h-36 cursor-pointer transition-all duration-300 transform hover:scale-110 ${
          isAnimating ? "pointer-events-none opacity-75" : ""
        } ${isOpen ? "rotate-45 scale-95" : "hover:rotate-6 hover:shadow-2xl"}`}
        aria-label={isOpen ? "Close chat widget" : "Open chat widget"}
      />

      {/* Chat window with smooth animations */}
      {shouldRender && (
        <div
          className={`rounded-2xl shadow-2xl overflow-hidden absolute bottom-24 sm:bottom-28 right-0 z-50 w-[90vw] sm:w-[440px] h-[500px] sm:h-[640px] max-w-[95vw] max-h-[80vh] border border-opacity-20 border-white origin-bottom-right transition-all duration-400 ease-out ${
            isClosing
              ? "scale-75 opacity-0 translate-y-8 rotate-6"
              : showContent
              ? "scale-100 opacity-100 translate-y-0 rotate-0"
              : "scale-75 opacity-0 translate-y-12 -rotate-12"
          }`}
        >
          <ChatWidget />
        </div>
      )}
    </div>
  );
};

export default ChatWrapper;