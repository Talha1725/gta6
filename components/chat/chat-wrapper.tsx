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

  // Prevent background scrolling only when scrolling inside chat
  useEffect(() => {
    if (!shouldRender) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const chatWindow = chatWindowRef.current;
      
      // Only prevent scroll if the event is happening inside the chat window
      if (chatWindow && chatWindow.contains(target)) {
        // Find the closest scrollable element
        const scrollableElement = target.closest('.custom-scrollbar, [data-scrollable="true"]') as HTMLElement;
        
        if (scrollableElement) {
          // Check if we can scroll in the intended direction
          const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
          const isScrollingUp = e.deltaY < 0;
          const isScrollingDown = e.deltaY > 0;
          
          // Allow scroll if we're not at the boundary
          const canScrollUp = scrollTop > 0;
          const canScrollDown = scrollTop < scrollHeight - clientHeight;
          
          if ((isScrollingUp && canScrollUp) || (isScrollingDown && canScrollDown)) {
            return; // Allow the scroll
          }
        }
        
        // Prevent background scroll for all other cases within chat
        e.preventDefault();
        return;
      }
      
      // If scroll is outside chat window, allow normal background scrolling
      // No preventDefault() here - let the scroll happen normally
    };

    const handleTouchStart = (e: TouchEvent) => {
      startYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const chatWindow = chatWindowRef.current;
      
      // Only prevent scroll if the event is happening inside the chat window
      if (chatWindow && chatWindow.contains(target)) {
        // Find the closest scrollable element
        const scrollableElement = target.closest('.custom-scrollbar, [data-scrollable="true"]') as HTMLElement;
        
        if (scrollableElement) {
          const currentY = e.touches[0].clientY;
          const diff = startYRef.current - currentY;
          const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
          
          const isScrollingUp = diff < 0;
          const isScrollingDown = diff > 0;
          
          // Check if we can scroll in the intended direction
          const canScrollUp = scrollTop > 0;
          const canScrollDown = scrollTop < scrollHeight - clientHeight;
          
          if ((isScrollingUp && canScrollUp) || (isScrollingDown && canScrollDown)) {
            return; // Allow the scroll
          }
        }
        
        // Prevent background scroll for all other cases within chat
        e.preventDefault();
        return;
      }
      
      // If touch is outside chat window, allow normal background scrolling
      // No preventDefault() here - let the scroll happen normally
    };

    // Add event listeners to document to catch all scroll events
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Don't prevent body overflow - allow normal scrolling outside chat
    // document.body.style.overflow = 'hidden'; // Removed this line

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      
      // No need to restore since we're not blocking it
      // document.body.style.overflow = 'unset'; // Removed this line
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