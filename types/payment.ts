export interface PaymentFormProps {
  amount: number;
  currency: string;
  productName: string;
  onClose: () => void;
  originalPrice?: number;
  vatAmount?: number;
  purchaseType?: 'one_time' | 'monthly';
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  productName: string;
  originalPrice?: number;
  vatAmount?: number;
  purchaseType: 'one_time' | 'monthly';
  totalLeaks?: number;
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

export interface Order {
  id: number;
  orderNumber: string;
  customerEmail?: string;
  customerId?: string;
  stripeCustomerId?: string;
  productName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
}

export interface Transaction {
  id: number;
  orderId: number;
  paymentId: string;
  stripeCustomerId?: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  failureReason?: string;
  createdAt: Date;
}

export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  productName: string;
  customerEmail?: string;
  purchaseType?: 'one_time' | 'monthly';
  totalLeaks?: number;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId?: string;
  subscriptionId?: string;
  customerId?: string;
  purchaseType?: 'one_time' | 'monthly';
  orderNumber?: string | null;
  subscription?: {
    id: string;
    status: string;
    customer: string;
    metadata: Record<string, string>;
  };
  payment?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    metadata: Record<string, string>;
  };
} 