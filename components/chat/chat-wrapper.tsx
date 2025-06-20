"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ChatWidget from "./ChatWidget";

const ChatWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const chatWindowRef = useRef<HTMLDivElement>(null);
  const chatIconRef = useRef<HTMLImageElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startYRef = useRef<number>(0);

  const toggleChat = useCallback((): void => {
    if (isOpen) {
      // Start closing animation
      setIsClosing(true);
      setIsAnimating(true);
      setShowContent(false);

      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      closeTimeoutRef.current = setTimeout(() => {
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

      setTimeout(() => {
        setShowContent(true);
      }, 50);

      setTimeout(() => {
        setIsAnimating(false);
      }, 400);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Close chat when clicking outside
  useEffect(() => {
    if (!shouldRender) return;
    function handleClickOutside(event: MouseEvent) {
      try {
        const chatWindow = chatWindowRef.current;
        const chatIcon = chatIconRef.current;
        const windowContains = chatWindow && chatWindow.contains(event.target as Node);
        const iconContains = chatIcon && chatIcon.contains(event.target as Node);
        // Only close if not already closing
        if (
          chatWindow &&
          !windowContains &&
          chatIcon &&
          !iconContains &&
          !isClosing
        ) {
          toggleChat();
        }
      } catch (err) {
        // silent
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shouldRender, isClosing, toggleChat]);

  // Prevent background scrolling when chat is open
  useEffect(() => {
    if (!shouldRender) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const chatWindow = chatWindowRef.current;
      
      // If the scroll event is happening inside the chat window OR any of its child elements, allow it only if it's scrollable content
      if (chatWindow && chatWindow.contains(target)) {
        // Check if we're in a scrollable area (messages container)
        const scrollableElement = target.closest('.custom-scrollbar, [data-scrollable="true"]');
        if (scrollableElement) {
          return; // Allow scrolling in scrollable areas
        }
        // For non-scrollable areas within chat (header, input), prevent background scroll
        e.preventDefault();
        return;
      }
      
      // Otherwise, prevent background scrolling
      e.preventDefault();
    };

    const handleTouchStart = (e: TouchEvent) => {
      startYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const chatWindow = chatWindowRef.current;
      
      // If the touch event is happening inside the chat window, check if it's in scrollable content
      if (chatWindow && chatWindow.contains(target)) {
        // Check if we're in a scrollable area (messages container)
        const scrollableElement = target.closest('.custom-scrollbar, [data-scrollable="true"]');
        if (scrollableElement) {
          return; // Allow scrolling in scrollable areas
        }
        // For non-scrollable areas within chat (header, input), prevent background scroll
        e.preventDefault();
        return;
      }
      
      // Otherwise, prevent background scrolling
      e.preventDefault();
    };

    // Add event listeners to document to catch all scroll events
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Also prevent scrolling on the body
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      
      // Restore body scrolling
      document.body.style.overflow = 'unset';
    };
  }, [shouldRender]);

  return (
    <div className="fixed bottom-1 right-1 sm:right-3 z-50">
      <img
        ref={chatIconRef}
        src="/images/Chat-Icon.png"
        alt="Chat"
        onClick={toggleChat}
        className={`w-24 h-24 sm:w-36 sm:h-36 cursor-pointer transition-all duration-300 transform hover:scale-110 ${
          isAnimating ? "pointer-events-none opacity-75" : ""
        } ${isOpen ? "rotate-45 scale-95" : "hover:rotate-6"}`}
        aria-label={isOpen ? "Close chat widget" : "Open chat widget"}
      />

      {/* Chat window with smooth animations */}
      {shouldRender && (
        <div
          ref={chatWindowRef}
          className={`rounded-2xl shadow-2xl overflow-hidden absolute bottom-24 sm:bottom-28 right-0 z-50 w-[90vw] sm:w-[440px] h-[500px] sm:h-[640px] max-w-[95vw] max-h-[80vh] border border-opacity-20 border-white origin-bottom-right transition-all duration-400 ease-out ${
            isClosing
              ? "scale-75 opacity-0 translate-y-8 rotate-6"
              : showContent
              ? "scale-100 opacity-100 translate-y-0 rotate-0"
              : "scale-75 opacity-0 translate-y-12 -rotate-12"
          }`}
          style={{ 
            overflowY: 'auto', 
            overscrollBehavior: 'contain',
            // Ensure the chat window itself can be scrolled
            maxHeight: '80vh'
          }}
        >
          <ChatWidget handleClose={toggleChat} />
        </div>
      )}
    </div>
  );
};

export default ChatWrapper;