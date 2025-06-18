"use client";

import React from "react";
import ChatWidget from "./chat-widget";

const ChatWrapper = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="pointer-events-auto absolute bottom-0 right-0 sm:right-0">
        <ChatWidget />
      </div>
    </div>
  );
};

export default ChatWrapper;