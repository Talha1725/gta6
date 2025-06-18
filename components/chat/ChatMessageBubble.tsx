import React from "react";

interface ChatMessageBubbleProps {
  message: string;
  sender: "user" | "ai";
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, sender }) => (
  <div
    className={`my-1 flex ${sender === "user" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow-md whitespace-pre-line ${
        sender === "user"
          ? "bg-purple-600 text-white rounded-br-none"
          : "bg-gray-200 text-gray-900 rounded-bl-none"
      }`}
    >
      {message}
    </div>
  </div>
);

export default ChatMessageBubble; 