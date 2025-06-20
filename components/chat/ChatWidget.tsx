import React, { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import ChatMessages, { ChatMessage } from "./ChatMessages";
import ChatInput from "./ChatInput";
import { parseKeywords, getMessageCount, setMessageCount, getNextImageIndex, getPrevImageIndex, scrollToSection, handleNextImage, handlePrevImage } from "../../lib/utils/chat";
import { LeakGenerationResponse } from "@/types";
import { generateLeak, fetchLeaksCount } from "@/lib/services/leak.service";

const API_BASE_URL = "http://185.210.144.97:3000";
const MAX_FREE_REQUESTS = 1;

const ChatWidget: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState<number>(MAX_FREE_REQUESTS);
  const [showUpgradeOverlay, setShowUpgradeOverlay] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const isSending = useRef(false);

  // Fetch leaks for logged-in user or use localStorage for guests
  React.useEffect(() => {
    const fetchLeaks = async () => {
      if (session?.user?.id) {
        try {
          const data = await fetchLeaksCount(session.user.id);
          if (data.success) {
            setRemainingRequests(data.data.leaks);
            if (data.data.leaks === 0) setShowUpgradeOverlay(true);
          } else {
            setRemainingRequests(0);
            setShowUpgradeOverlay(true);
          }
        } catch (e) {
          setRemainingRequests(0);
          setShowUpgradeOverlay(true);
        }
      } else {
        const usedRequests = getMessageCount();
        const remaining = Math.max(0, MAX_FREE_REQUESTS - usedRequests);
        setRemainingRequests(remaining);
        if (remaining === 0) setShowUpgradeOverlay(true);
      }
    };
    fetchLeaks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const handleSend = async () => {
    if (!input.trim() || loading || isSending.current) return;
    setLoading(true);
    isSending.current = true;

    // For logged-in users, check remainingRequests from state
    if (session?.user?.id) {
      if (remainingRequests <= 0) {
        setShowUpgradeOverlay(true);
        setLoading(false);
        isSending.current = false;
        return;
      }
    } else {
      // For guests, check localStorage
      const currentUsedRequests = getMessageCount();
      const currentRemaining = Math.max(0, MAX_FREE_REQUESTS - currentUsedRequests);
      if (currentRemaining <= 0) {
        setShowUpgradeOverlay(true);
        setLoading(false);
        isSending.current = false;
        return;
      }
    }

    const keywords = parseKeywords(input);
    if (keywords.length === 0) {
      setLoading(false);
      isSending.current = false;
      return;
    }

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Make API call to the external backend
      const data: LeakGenerationResponse = await generateLeak({
        keywords,
        gameTitle: keywords.join(" ") + " Game",
        includeImage: true,
        ...(session?.user?.email && { customerEmail: session.user.email })
      });

      // Only refresh leaks after successful response
      if (session?.user?.id) {
        try {
          const leaksData = await fetchLeaksCount(session.user.id);
          if (leaksData.success) {
            setRemainingRequests(leaksData.data.leaks);
          } else {
            setRemainingRequests(0);
          }
        } catch (e) {
          setRemainingRequests(0);
          setShowUpgradeOverlay(true);
        }
        setLoading(false);
        isSending.current = false;
      } else {
        // For guests, increment used count and update remaining requests
        const currentUsedRequests = getMessageCount() + 1;
        setMessageCount(currentUsedRequests);
        const newRemaining = Math.max(0, MAX_FREE_REQUESTS - currentUsedRequests);
        setRemainingRequests(newRemaining);
        setLoading(false);
        isSending.current = false;
      }

      setCurrentImageIndex(0);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        title: data.title,
        text: data.content,
        image: data.image,
        images: data.images,
        prompt: data.image?.prompt || data.images?.[0]?.prompt,
        //@ts-ignore
        disclaimer: data.disclaimer,
        meta: {
          source: data.source,
          credibilityScore: data.credibilityScore,
          //@ts-ignore
          ...data.meta,
        },
      };

      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
      isSending.current = false;
      
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          title: "Error",
          text: "Sorry, something went wrong connecting to the server. Please try again.",
        },
      ]);
      setLoading(false);
      isSending.current = false;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Upper gradient header */}
      <div
        className="relative h-40 p-6 rounded-t-2xl"
        style={{
          background: `conic-gradient(from 202.48deg at 81.78% 23.22%, #F3B960 0deg, #B94DFB 32.76deg, #14F195 122.76deg, #13C6FF 230.76deg, #FF53EE 294.38deg, #F3B960 360deg)`
        }}
      >
        {/* Optional: Overlay for darkening effect */}
        <div className="absolute inset-0 rounded-t-2xl backdrop-blur-xl pointer-events-none w-full h-40 top-0 left-0" />
        {/* Header content */}
        <div className="flex flex-col items-start pt-2 z-50 relative">
          <h1 className="text-xl font-bold text-white font-mono">
            Game Leaks Generator
          </h1>
          <p className="text-white text-xs font-mono mt-1">
            Remaining free leaks: {remainingRequests}
          </p>
        </div>
      </div>

      {/* Lower body */}
      <div className="flex flex-col p-5 justify-between overflow-hidden flex-1 relative bg-[#261025]">
        {/* Full Upgrade Overlay - Shows when no requests left */}
        {showUpgradeOverlay && remainingRequests <= 0 && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#261025]/95 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl p-6 text-center max-w-sm border border-purple-500">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">
                  🚀 Upgrade to Pro
                </h3>
                <p className="text-sm text-gray-300">
                  You've used all {MAX_FREE_REQUESTS} free leak{MAX_FREE_REQUESTS > 1 ? 's' : ''}! Upgrade to get unlimited
                  access to our AI leak generator.
                </p>
              </div>
              <button
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold py-3 px-4 rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  scrollToSection("ai-leak-generator");
                  handleClose();
                }}
              >
                🔓 UNLOCK AI LEAKS
              </button>
            </div>
          </div>
        )}

        {messages.length === 0 ? (
          // Initial view when no messages
          <div className="flex flex-col gap-6 mt-10">
            {/* Title and description */}
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-mono text-white text-center font-semibold">
                Generate your own game leak
              </h2>

              <p className="text-xs text-center text-gray-300 px-4 font-mono">
                Enter comma-separated keywords to generate a confidential
                game "leak"
              </p>
            </div>

            {/* Example box */}
            <div className="w-full rounded-lg p-2 text-gray-300 text-xs font-mono text-center whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 hover:bg-opacity-40 bg-purple-800/30">
              Example: open world, sci-fi, space exploration
            </div>
          </div>
        ) : (
          // Chat messages view
          <div className="flex-1 overflow-y-auto max-h-full pr-2 mb-4 custom-scrollbar" data-scrollable="true">
            <ChatMessages
              messages={messages}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              isImageLoading={isImageLoading}
              setIsImageLoading={setIsImageLoading}
              onNextImage={(msg) => handleNextImage(msg, setCurrentImageIndex, setIsImageLoading)}
              onPrevImage={(msg) => handlePrevImage(msg, setCurrentImageIndex, setIsImageLoading)}
              loading={loading}
            />
            {loading && (
              <div className="bg-[#72366F] p-3 rounded-xl flex items-center animate-in fade-in duration-300 mt-3">
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
          </div>
        )}

        {/* Input and button section at bottom */}
        <div className="mt-auto">
          <div className="w-full border-t my-2 transition-all duration-300 border-[#72366F]"></div>

          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            disabled={loading}
          />

          <p className="text-[10px] text-center text-gray-400 font-mono mt-2 transition-all duration-300">
            {remainingRequests <= 0
              ? "Upgrade to Pro for unlimited leak generation"
              : "Enter keywords to generate fictional game leaks"}
          </p>
        </div>
      </div>
      </div>
  );
};

export default ChatWidget;