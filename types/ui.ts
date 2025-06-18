export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export interface CountdownTimerProps {
  createdAt: string | Date;
  className?: string;
  size?: "small" | "medium" | "large";
}

export interface SignOutButtonProps {
  className?: string;
  showText?: boolean;
}

export interface ChatMessage {
  sender: "user" | "bot";
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
}

export interface RateLimitResponse {
  rateLimit: {
    remaining: number;
    limit: number;
    used: number;
  };
}

export interface LeakGenerationResponse {
  title: string;
  content: string;
  source: string;
  credibilityScore: string;
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
  rateLimit: {
    remaining: number;
    limit: number;
  };
} 