import React, { useState } from "react";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, disabled }) => {
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing && !disabled) {
      onSend();
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          disabled
            ? "Upgrade to continue..."
            : "Enter keywords separated by commas"
        }
        className={`flex-1 p-2 rounded-lg text-white placeholder-gray-400 outline-none font-mono text-xs h-10 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 bg-purple-800/30 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        disabled={disabled}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className={`px-3 py-2 rounded-lg text-black font-medium font-mono h-10 flex items-center text-xs transition-all duration-300 transform hover:scale-105 bg-[#13C6FF] ${
          disabled || !value.trim()
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-cyan-500 hover:shadow-lg"
        }`}
      >
        {disabled ? (
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
  );
};

export default ChatInput; 