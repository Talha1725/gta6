"use client";

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ChatMessage, LeakGenerationResponse } from "@/types";
import { useSession } from "next-auth/react";

const API_BASE_URL = "http://185.210.144.97:3000";

const ChatWidget = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [remainingRequests, setRemainingRequests] = useState<number>(3);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [showUpgradeOverlay, setShowUpgradeOverlay] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWidgetRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Get message count from localStorage
  const getMessageCount = (): number => {
    try {
      if (typeof window !== "undefined") {
        const count = localStorage.getItem("chatMessageCount");
        return count ? parseInt(count, 10) : 0;
      }
      return 0;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return 0;
    }
  };

  // Set message count in localStorage
  const setMessageCount = (count: number): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("chatMessageCount", count.toString());
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  // Update remaining requests based on message count
  const updateRemainingRequests = (): void => {
    try {
      const messageCount = getMessageCount();
      const remaining = Math.max(0, 3 - messageCount);
      setRemainingRequests(remaining);

      // Show upgrade overlay only if user tries to send 4th message
      if (messageCount > 3) {
        setShowUpgradeOverlay(true);
      }
    } catch (error) {
      console.error("Error updating remaining requests:", error);
    }
  };

  // Effect to handle click outside to close chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !isAnimating &&
        chatWidgetRef.current &&
        !chatWidgetRef.current.contains(event.target as Node)
      ) {
        toggleChat();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isAnimating]);

  // Initialize remaining requests on component mount
  useEffect(() => {
    updateRemainingRequests();
  }, []);

  // Effect to scroll to bottom when chat is opened
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      updateRemainingRequests();
    }
  }, [isOpen]);

  // Separate effect to scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && chatMessages.length > 0) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen]);

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

  const parseKeywords = (input: string): string[] => {
    return input
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!message.trim()) return;

    // Check if user has exceeded free limit (trying to send 4th message)
    const messageCount = getMessageCount();
    if (messageCount >= 3) {
      setShowUpgradeOverlay(true);
      return;
    }

    const keywords = parseKeywords(message);
    if (keywords.length === 0) return;

    // Increment message count BEFORE making API call
    const newCount = messageCount + 1;
    setMessageCount(newCount);

    // Update remaining requests display
    const remaining = Math.max(0, 3 - newCount);
    setRemainingRequests(remaining);

    // Add user message to chat
    const userMessage: ChatMessage = { sender: "user", text: message };
    setChatMessages([...chatMessages, userMessage]);

    // Clear input
    setMessage("");

    // Set loading state
    setIsLoading(true);

    try {
      // Make API call to the Express backend with conditional customerEmail
      const response = await fetch(`${API_BASE_URL}/api/leaks/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: keywords,
          gameTitle: keywords.join(" ") + " Game",
          includeImage: true,
          ...(session?.user?.email && { customerEmail: session.user.email })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 402) {
          setChatMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: "bot",
              title: "Rate Limit Reached",
              text:
                errorData.message ||
                "You have used all your free leaks for today.",
            },
          ]);
          setRemainingRequests(0);
        } else {
          setChatMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: "bot",
              title: "Error",
              text:
                errorData.error || "Something went wrong. Please try again.",
            },
          ]);
        }
        setIsLoading(false);
        return;
      }

      const data: LeakGenerationResponse = await response.json();

      // Update remaining requests from API response
      setRemainingRequests(data.rateLimit.remaining);

      setCurrentImageIndex(0);

      const botMessage: ChatMessage = {
        sender: "bot",
        title: data.title,
        text: data.content,
        image: data.image,
        images: data.images,
      };

      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          title: "Error",
          text: "Sorry, something went wrong connecting to the server. Please try again.",
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleNextImage = (msgIndex: number) => {
    if (
      chatMessages[msgIndex].images &&
      chatMessages[msgIndex].images?.length > 1
    ) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex + 1) % (chatMessages[msgIndex].images?.length || 1)
      );
    }
  };

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      // Close the chat after scrolling
      toggleChat();
    }
  };

  const handlePrevImage = (msgIndex: number) => {
    if (
      chatMessages[msgIndex].images &&
      chatMessages[msgIndex].images?.length > 1
    ) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0
          ? (chatMessages[msgIndex].images?.length || 1) - 1
          : prevIndex - 1
      );
    }
  };

  return (
    <div className="fixed bottom-1 right-1 sm:right-3 z-50" ref={chatWidgetRef}>
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
          {/* Upper gradient header */}
          <div
            className={`relative h-40 p-6 rounded-t-2xl bg-gradient-to-br from-yellow-400 via-purple-500 via-green-400 via-cyan-400 via-pink-500 to-yellow-400 transition-all duration-400 delay-100 ${
              showContent
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* Close button */}
            <button
              onClick={toggleChat}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-200 hover:rotate-90 hover:scale-110"
            >
              <X size={20} className="text-white" />
            </button>

            {/* Header content */}
            <div className="flex flex-col items-start pt-2">
              <h1 className="text-xl font-bold text-white font-mono">
                Game Leaks Generator
              </h1>
              <p className="text-white text-xs font-mono mt-1">
                Remaining free leaks: {remainingRequests}
              </p>
            </div>
          </div>

          {/* Lower body with overlay covering everything */}
          <div
            className={`flex flex-col p-5 justify-between overflow-hidden h-[480px] relative bg-[#261025] transition-all duration-400 delay-200 ${
              showContent
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* Full Upgrade Overlay - Only shows when trying 4th message */}
            {showUpgradeOverlay && (
              <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#261025]/95 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl p-6 text-center max-w-sm border border-purple-500">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-2">
                      🚀 Upgrade to Pro
                    </h3>
                    <p className="text-sm text-gray-300">
                      You've used all 3 free leaks! Upgrade to get unlimited
                      access to our AI leak generator.
                    </p>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold py-3 px-4 rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                    onClick={() => scrollToSection("ai-leak-generator")}
                  >
                    🔓 UNLOCK AI LEAKS
                  </button>
                </div>
              </div>
            )}

            {chatMessages.length === 0 ? (
              // Initial view when no messages
              <div
                className={`flex flex-col gap-6 mt-10 transform transition-all duration-400 delay-300 ${
                  showContent
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                {/* Title and description */}
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-spaceMono text-white text-center font-semibold">
                    Generate your own game leak
                  </h2>

                  <p className="text-xs text-center text-gray-300 px-4 font-spaceMono">
                    Enter comma-separated keywords to generate a confidential
                    game "leak"
                  </p>
                </div>

                {/* Example box */}
                <div className="w-full rounded-lg p-2 text-gray-300 text-xs font-spaceMono text-center whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 hover:bg-opacity-40 bg-purple-800/30">
                  Example: open world, sci-fi, space exploration
                </div>
              </div>
            ) : (
              // Chat messages view
              <div className="flex-1 overflow-y-auto max-h-full pr-2 mb-4">
                <div className="space-y-4 flex flex-col">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-300 ease-out transform ${
                        msg.sender === "user"
                          ? "bg-[#EC1890] px-4 py-3 rounded-xl rounded-br-none text-white text-sm ml-auto max-w-[80%] inline-block animate-in slide-in-from-right-5 duration-300"
                          : "bg-[#72366F] rounded-xl p-2 text-white font-mono text-sm w-full animate-in slide-in-from-left-5 duration-300"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <div className="text-white">{msg.text}</div>
                      ) : (
                        <div className="flex flex-col">
                          <div className="bg-yellow-500 text-black py-1 px-3 rounded-t-lg font-bold text-sm">
                            {msg.title}
                          </div>

                          <div className="bg-black bg-opacity-70 p-3 text-white">
                            <div className="text-red-500 font-bold text-xs mb-2">
                              TOP SECRET // CLASSIFIED
                              <br />
                              INFORMATION // FOR INTERNAL
                              <br />
                              USE ONLY
                            </div>

                            <div className="text-white whitespace-pre-wrap">
                              {msg.text
                                .split("\n\n")
                                .slice(2, -2)
                                .map((section, sIdx) => (
                                  <div key={`content-${sIdx}`} className="mb-2">
                                    {section
                                      .split("\n")
                                      .map((paragraph, pIdx) => {
                                        const parts =
                                          paragraph.split(/(\[REDACTED\])/g);
                                        return (
                                          <p
                                            key={`p-${sIdx}-${pIdx}`}
                                            className="mb-1 last:mb-0 text-sm"
                                          >
                                            {parts.map((part, j) =>
                                              part === "[REDACTED]" ? (
                                                <span
                                                  key={`redacted-${j}`}
                                                  className="bg-gray-800 text-gray-600 px-1 mx-0.5 rounded font-bold"
                                                >
                                                  [REDACTED]
                                                </span>
                                              ) : (
                                                part
                                              )
                                            )}
                                          </p>
                                        );
                                      })}
                                  </div>
                                ))}
                            </div>

                            <div className="text-gray-400 text-xs mt-2 border-t border-gray-700 pt-1 font-mono">
                              {msg.text
                                .split("\n\n")
                                .slice(-2)[0]
                                .split("\n")
                                .map((line, lIdx) => (
                                  <div key={`meta-${lIdx}`}>{line}</div>
                                ))}
                            </div>
                          </div>

                          {((msg.images && msg.images.length > 0) ||
                            msg.image) && (
                            <div className="mt-2">
                              <div className="border rounded overflow-hidden relative h-40 transition-all duration-300 border-[#72366F]">
                                {isImageLoading && (
                                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#72366F]/75">
                                    <div className="flex space-x-2 items-center">
                                      <div className="h-2 w-2 rounded-full animate-pulse bg-[#13C6FF]"></div>
                                      <div className="h-2 w-2 rounded-full animate-pulse delay-150 bg-[#13C6FF]"></div>
                                      <div className="h-2 w-2 rounded-full animate-pulse delay-300 bg-[#13C6FF]"></div>
                                    </div>
                                  </div>
                                )}
                                <img
                                  src={
                                    msg.images
                                      ? msg.images[currentImageIndex]
                                          .absoluteUrl
                                      : msg.image
                                      ? msg.image.absoluteUrl
                                      : ""
                                  }
                                  alt="Generated game leak"
                                  className="w-full h-full object-cover transition-opacity duration-300"
                                  onLoad={() => setIsImageLoading(false)}
                                  onError={() => setIsImageLoading(false)}
                                />
                              </div>
                              {msg.images && msg.images.length > 1 && (
                                <div className="flex justify-between mt-2 text-xs">
                                  <button
                                    onClick={() => {
                                      setIsImageLoading(true);
                                      handlePrevImage(index);
                                    }}
                                    className="text-white px-2 py-1 rounded-md text-xs disabled:opacity-50 transition-all duration-200 hover:scale-105 bg-[#72366F]"
                                    disabled={isImageLoading}
                                  >
                                    ← Prev
                                  </button>
                                  <span className="text-gray-400 text-xs flex items-center">
                                    Image {currentImageIndex + 1} of{" "}
                                    {msg.images.length}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setIsImageLoading(true);
                                      handleNextImage(index);
                                    }}
                                    className="text-white px-2 py-1 rounded-md text-xs disabled:opacity-50 transition-all duration-200 hover:scale-105 bg-[#72366F]"
                                    disabled={isImageLoading}
                                  >
                                    Next →
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="bg-[#72366F] p-3 rounded-xl flex items-center animate-in fade-in duration-300">
                      <div className="flex space-x-2 items-center">
                        <div className="h-2 w-2 rounded-full animate-pulse bg-[#13C6FF]"></div>
                        <div className="h-2 w-2 rounded-full animate-pulse delay-150 bg-[#13C6FF]"></div>
                        <div className="h-2 w-2 rounded-full animate-pulse delay-300 bg-[#13C6FF]"></div>
                        <span className="text-sm text-gray-400 ml-2">
                          Accessing classified data...
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}

            {/* Input and button section at bottom */}
            <form
              onSubmit={handleSubmit}
              className={`mt-auto transition-all duration-400 delay-400 ${
                showContent
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="w-full border-t my-2 transition-all duration-300 border-[#72366F]"></div>

              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    showUpgradeOverlay
                      ? "Upgrade to continue..."
                      : "Enter keywords separated by commas"
                  }
                  className={`flex-1 p-2 rounded-lg text-white placeholder-gray-400 outline-none font-spaceMono text-xs h-10 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 bg-purple-800/30 ${
                    showUpgradeOverlay ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={showUpgradeOverlay}
                />
                <button
                  type="submit"
                  disabled={isLoading || !message.trim() || showUpgradeOverlay}
                  className={`px-3 py-2 rounded-lg text-black font-medium font-spaceMono h-10 flex items-center text-xs transition-all duration-300 transform hover:scale-105 bg-[#13C6FF] ${
                    isLoading || !message.trim() || showUpgradeOverlay
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-cyan-500 hover:shadow-lg"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <div className="h-2 w-2 bg-black rounded-full animate-pulse mr-1"></div>
                      <div className="h-2 w-2 bg-black rounded-full animate-pulse delay-150 mr-1"></div>
                      <div className="h-2 w-2 bg-black rounded-full animate-pulse delay-300 mr-1"></div>
                    </span>
                  ) : (
                    <span>Generate</span>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-center text-gray-400 font-spaceMono mt-2 transition-all duration-300">
                {showUpgradeOverlay
                  ? "Upgrade to Pro for unlimited leak generation"
                  : "Enter keywords to generate fictional game leaks"}
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
