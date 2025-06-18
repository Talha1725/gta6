import React from "react";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  title?: string;
  image?: {
    url: string;
    absoluteUrl: string;
    prompt: string;
    disclaimer: string;
  };
  images?: Array<{
    url: string;
    absoluteUrl: string;
    prompt: string;
    disclaimer: string;
  }>;
  prompt?: string;
  disclaimer?: string;
  meta?: Record<string, any>;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentImageIndex: number;
  setCurrentImageIndex: (idx: number) => void;
  isImageLoading: boolean;
  setIsImageLoading: (b: boolean) => void;
  onNextImage: (msg: ChatMessage) => void;
  onPrevImage: (msg: ChatMessage) => void;
  loading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentImageIndex,
  setCurrentImageIndex,
  isImageLoading,
  setIsImageLoading,
  onNextImage,
  onPrevImage,
  loading,
}) => (
  <div className="space-y-4 flex flex-col">
    {messages.map((msg, index) => (
      <div
        key={msg.id}
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
            {/* Title bar */}
            {msg.title && (
              <div className="bg-yellow-500 text-black py-1 px-3 rounded-t-lg font-bold text-sm">
                {msg.title}
              </div>
            )}
            {/* Content block */}
            <div className="bg-black bg-opacity-70 p-3 text-white">
              <div className="text-red-500 font-bold text-xs mb-2">
                TOP SECRET // CLASSIFIED
                <br />
                INFORMATION // FOR INTERNAL
                <br />
                USE ONLY
              </div>
              <div className="text-white whitespace-pre-wrap">
                {msg.text}
              </div>
              {/* Meta info (optional, if you want to keep it separately) */}
              {/*
              <div className="text-gray-400 text-xs mt-2 border-t border-gray-700 pt-1 font-mono">
                {msg.text
                  .split("\n\n")
                  .slice(-2)[0]
                  .split("\n")
                  .map((line, lIdx) => (
                    <div key={`meta-${lIdx}`}>{line}</div>
                  ))}
              </div>
              */}
            </div>
            {/* Images */}
            {(msg.images && msg.images.length > 0) || msg.image ? (
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
                        ? msg.images[currentImageIndex]?.absoluteUrl
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
                      onClick={() => onPrevImage(msg)}
                      className="text-white px-2 py-1 rounded-md text-xs disabled:opacity-50 transition-all duration-200 hover:scale-105 bg-[#72366F]"
                      disabled={isImageLoading}
                    >
                      ← Prev
                    </button>
                    <span className="text-gray-400 text-xs flex items-center">
                      Image {currentImageIndex + 1} of {msg.images.length}
                    </span>
                    <button
                      onClick={() => onNextImage(msg)}
                      className="text-white px-2 py-1 rounded-md text-xs disabled:opacity-50 transition-all duration-200 hover:scale-105 bg-[#72366F]"
                      disabled={isImageLoading}
                    >
                      Next →
                    </button>
                  </div>
                )}
                {/* Prompt and disclaimer */}
                {msg.prompt && (
                  <div className="text-xs text-gray-300 mt-1">Prompt: {msg.prompt}</div>
                )}
                {msg.disclaimer && (
                  <div className="text-xs text-gray-400 mt-1 italic">{msg.disclaimer}</div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default ChatMessages; 