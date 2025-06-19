import type { ChatMessage } from "../../components/chat/ChatMessages";
// Utility functions for chat widget

export function parseKeywords(input: string): string[] {
  return input
    .split(",")
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);
}

export function getMessageCount(): number {
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
}

export function setMessageCount(count: number): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatMessageCount", count.toString());
    }
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
}

// chat widget utils

// Image navigation helpers
export function getNextImageIndex(current: number, total: number): number {
  return (current + 1) % total;
}

export function getPrevImageIndex(current: number, total: number): number {
  return current === 0 ? total - 1 : current - 1;
}



export function handleNextImage(
  msg: ChatMessage,
  setCurrentImageIndex: (fn: (prev: number) => number) => void,
  setIsImageLoading: (b: boolean) => void
) {
  if (msg.images && msg.images.length > 1) {
    setCurrentImageIndex((prev) => getNextImageIndex(prev, msg.images!.length));
    setIsImageLoading(true);
  }
}

export function handlePrevImage(
  msg: ChatMessage,
  setCurrentImageIndex: (fn: (prev: number) => number) => void,
  setIsImageLoading: (b: boolean) => void
) {
  if (msg.images && msg.images.length > 1) {
    setCurrentImageIndex((prev) => getPrevImageIndex(prev, msg.images!.length));
    setIsImageLoading(true);
  }
}

// Scroll helper
export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
}

