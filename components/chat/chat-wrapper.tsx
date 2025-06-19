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

  // Robust scroll boundary lock for chat window
  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    if (!chatWindow || !shouldRender) return;
  
    let startY = 0;
  
    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = chatWindow;
      if (
        (e.deltaY < 0 && scrollTop === 0) ||
        (e.deltaY > 0 && scrollTop + clientHeight >= scrollHeight)
      ) {
        e.preventDefault();
      }
    };
  
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
  
    const handleTouchMove = (e: TouchEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = chatWindow;
      const diff = e.touches[0].clientY - startY;
      if (
        (diff > 0 && scrollTop === 0) ||
        (diff < 0 && scrollTop + clientHeight >= scrollHeight)
      ) {
        e.preventDefault();
      }
    };
  
    chatWindow.addEventListener('wheel', handleWheel, { passive: false });
    chatWindow.addEventListener('touchstart', handleTouchStart, { passive: false });
    chatWindow.addEventListener('touchmove', handleTouchMove, { passive: false });
  
    return () => {
      chatWindow.removeEventListener('wheel', handleWheel);
      chatWindow.removeEventListener('touchstart', handleTouchStart);
      chatWindow.removeEventListener('touchmove', handleTouchMove);
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
        } ${isOpen ? "rotate-45 scale-95" : "hover:rotate-6 hover:shadow-2xl"}`}
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
          style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
        >
          <ChatWidget handleClose={toggleChat} />
        </div>
      )}
    </div>
  );
};

export default ChatWrapper;