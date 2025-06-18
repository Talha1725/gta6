import React from "react";

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => (
  <div className="flex items-center justify-between p-2 border-b bg-gray-900 text-white rounded-t-lg">
    <span className="font-semibold">AI Leak Generator</span>
    <button
      className="text-gray-400 hover:text-white transition"
      onClick={onClose}
      aria-label="Close chat"
    >
      ×
    </button>
  </div>
);

export default ChatHeader; 