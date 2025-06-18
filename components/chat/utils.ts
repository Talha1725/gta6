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

export function updateRemainingRequests(setRemainingRequests: (n: number) => void, setShowUpgradeOverlay: (b: boolean) => void) {
  try {
    const messageCount = getMessageCount();
    const remaining = Math.max(0, 3 - messageCount);
    setRemainingRequests(remaining);
    if (messageCount > 3) {
      setShowUpgradeOverlay(true);
    }
  } catch (error) {
    console.error("Error updating remaining requests:", error);
  }
} 