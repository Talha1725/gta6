// Re-export all types from organized modules
export * from './auth';
export * from './payment';
export * from './nft';
export * from './ui';
export * from './preorder';

export interface Preorder {
  id: number;
  notes: string | null;
  selectedDate: string | null;
  releaseDate: string | null;
  createdAt: string;
}

export interface FormData {
  notes: string;
  selectedDate: string;
}

export interface NFTMintModalProps {
  isOpen: boolean;
  onClose: () => void;
  nftType: "standard" | "gold" | "diamond";
  nftData: {
    title: string;
    price: string;
    image: string;
    perks: string[];
  };
}

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

export interface CheckoutButtonProps {
  amount: number;
  currency: string;
  productName: string;
  className?: string;
  children?: React.ReactNode;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
}

export interface PaymentButtonProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  amount: number;
  currency: string;
  productName: string;
}

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export interface CountdownTimerProps {
  createdAt: string | Date; // When the preorder was created (not used for calculation, just for reference)
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

export interface CollectionRowProps {
  rank: number;
  id: string;
  name: string;
  logo: string;
  floorPrice: string;
  volume: string;
  verified?: boolean;
}

export interface NFTCardProps {
  id: string;
  title: string;
  creator: string;
  image: string;
  price: string;
  creatorLogo?: string;
}

// Subscription Types
export interface Subscription {
  plan: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  amount: number;
  customerId: string;
  endDate?: string;
}

export interface SubscriptionApiResponse {
  data: Subscription[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  type: string;
  message: string;
}

export interface SubscriptionsClientProps {
  data: SubscriptionApiResponse | null;
  status: "authenticated" | "unauthenticated";
}

export interface StatsCardsProps {
  data: SubscriptionApiResponse;
  getTypeDisplayName: (type: string) => string;
}

export interface DataTableProps {
  data: Subscription[];
  currentType: 'all' | 'subscriptions' | 'onetime';
  getStatusColor: (status: Subscription["status"]) => string;
  formatDate: (date: string) => string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export interface FilterButtonsProps {
  currentType: 'all' | 'subscriptions' | 'onetime';
  onTypeChange: (type: 'all' | 'subscriptions' | 'onetime') => void;
  getTypeDisplayName: (type: string) => string;
}
