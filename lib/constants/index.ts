// Application constants and configuration
export const APP_CONFIG = {
  name: 'GTA 6 Pre-Order Hub',
  description: 'Track every GTA 6 leak, deal & bonus in real-time',
  version: '0.1.0',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    signin: '/api/auth/signin',
    signout: '/api/auth/signout',
    signup: '/api/auth/signup',
  },
  admin: {
    data: '/api/admin/data',
    orders: '/api/admin/orders',
    preorders: '/api/admin/preorders',
    generatePreorder: '/api/admin/generate-preorder',
  },
  payments: {
    createIntent: '/api/create-payment-intent',
  },
  preorders: {
    latest: '/api/preorders/latest',
  },
  subscriptions: {
    subscribe: '/api/email/subscribe',
  },
} as const;

// Product configuration
export const PRODUCTS = {
  common: {
    name: 'Common',
    price: 9.99,
    leaks: 1,
    badge: 'bg-blue-600',
    badgeColor: 'text-blue-500',
    purchaseType: 'one_time' as const,
  },
  rare: {
    name: 'Rare',
    price: 14.99,
    leaks: 3,
    badge: 'bg-yellow',
    badgeColor: 'text-yellow',
    purchaseType: 'one_time' as const,
  },
  legendary: {
    name: 'Legendary',
    price: 39.99,
    leaks: 10,
    badge: 'bg-red-600',
    badgeColor: 'text-red-600',
    purchaseType: 'one_time' as const,
  },
  subscription: {
    name: 'Monthly Subscription',
    price: 149.99,
    leaks: 9999, // Unlimited access
    badge: 'bg-[#EC1890]',
    badgeColor: 'text-pink-400',
    purchaseType: 'monthly' as const,
  },
} as const;

// Helper function to format leaks text
export const formatLeaksText = (leaks: number): string => {
  if (leaks >= 9999) return 'Unlimited Access';
  return `${leaks} Leak${leaks > 1 ? 's' : ''}`;
};

// Pricing tier type definition
export interface PricingTier {
  type: string;
  badge: string;
  badgeColor: string;
  leaks: string;
  price: number;
  displayPrice: string;
  currency: string;
  purchaseType: 'one_time' | 'monthly';
  totalLeaks?: number;
}

// Pricing tiers configuration
export const PRICING_TIERS: PricingTier[] = [
  {
    type: PRODUCTS.common.name,
    badge: PRODUCTS.common.badge,
    badgeColor: PRODUCTS.common.badgeColor,
    leaks: formatLeaksText(PRODUCTS.common.leaks),
    price: PRODUCTS.common.price,
    displayPrice: `$${PRODUCTS.common.price}`,
    currency: "USD",
    purchaseType: PRODUCTS.common.purchaseType,
    totalLeaks: PRODUCTS.common.leaks
  },
  {
    type: PRODUCTS.rare.name,
    badge: PRODUCTS.rare.badge,
    badgeColor: PRODUCTS.rare.badgeColor,
    leaks: formatLeaksText(PRODUCTS.rare.leaks),
    price: PRODUCTS.rare.price,
    displayPrice: `$${PRODUCTS.rare.price}`,
    currency: "USD",
    purchaseType: PRODUCTS.rare.purchaseType,
    totalLeaks: PRODUCTS.rare.leaks
  },
  {
    type: PRODUCTS.legendary.name,
    badge: PRODUCTS.legendary.badge,
    badgeColor: PRODUCTS.legendary.badgeColor,
    leaks: formatLeaksText(PRODUCTS.legendary.leaks),
    price: PRODUCTS.legendary.price,
    displayPrice: `$${PRODUCTS.legendary.price}`,
    currency: "USD",
    purchaseType: PRODUCTS.legendary.purchaseType,
    totalLeaks: PRODUCTS.legendary.leaks
  },
  {
    type: PRODUCTS.subscription.name,
    badge: PRODUCTS.subscription.badge,
    badgeColor: PRODUCTS.subscription.badgeColor,
    leaks: formatLeaksText(PRODUCTS.subscription.leaks),
    price: PRODUCTS.subscription.price,
    displayPrice: `$${PRODUCTS.subscription.price}`,
    currency: "USD",
    purchaseType: PRODUCTS.subscription.purchaseType,
    totalLeaks: PRODUCTS.subscription.leaks
  },
];

// NFT configuration
export const NFT_TYPES = {
  standard: {
    title: 'Standard NFT',
    price: '0.1 ETH',
    image: '/images/Standard.svg',
    perks: ['Exclusive artwork', 'Early access', 'Community access'],
  },
  gold: {
    title: 'Gold NFT',
    price: '0.5 ETH',
    image: '/images/Gold.svg',
    perks: ['All Standard perks', 'Premium artwork', 'VIP community access'],
  },
  diamond: {
    title: 'Diamond NFT',
    price: '1.0 ETH',
    image: '/images/Diamond.svg',
    perks: ['All Gold perks', 'Rare artwork', 'Exclusive events'],
  },
} as const;

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// Transaction statuses
export const TRANSACTION_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  PENDING: 'pending',
  REFUNDED: 'refunded',
} as const;

// UI constants
export const UI = {
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
} as const;

// Validation constants
export const VALIDATION = {
  email: {
    minLength: 3,
    maxLength: 100,
  },
  password: {
    minLength: 6,
    maxLength: 255,
  },
  notes: {
    maxLength: 1000,
  },
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; 