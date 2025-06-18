import { 
  Elements, 
  PaymentElement, 
  useStripe, 
  useElements,
} from '@stripe/react-stripe-js';
import { useState } from 'react';

interface StripePaymentFormProps {
  stripePromise: Promise<any>;
  clientSecret: string;
  amount: number;
  currency: string;
  productName: string;
  purchaseType?: 'one_time' | 'monthly';
  totalLeaks?: number;
  paymentType?: 'payment_intent' | 'setup_intent'; // Add this prop
  onClose: () => void;
}

const PaymentFormContent: React.FC<Omit<StripePaymentFormProps, 'stripePromise'>> = ({
  clientSecret,
  amount,
  currency,
  productName,
  purchaseType = 'one_time',
  totalLeaks,
  paymentType = 'payment_intent', // Default to payment_intent
  onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      if (paymentType === 'setup_intent') {
        console.log('🔧 Confirming setup intent for subscription...');
        
        // For subscriptions, use confirmSetup
        const { error } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment-success?type=subscription`,
          },
        });

        if (error) {
          console.error('Setup error:', error);
          setErrorMessage(error.message || 'Setup failed');
          setIsLoading(false);
        }
        // On success, the page will redirect to return_url
      } else {
        console.log('💳 Confirming payment intent for one-time payment...');
        
        // For one-time payments, use confirmPayment
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment-success?type=one-time`,
          },
        });

        if (error) {
          console.error('Payment error:', error);
          setErrorMessage(error.message || 'Payment failed');
          setIsLoading(false);
        }
        // On success, the page will redirect to return_url
      }
    } catch (err) {
      const error = err as Error;
      console.error('Payment/Setup confirmation error:', error);
      setErrorMessage(error.message || 'Payment failed');
      setIsLoading(false);
    }
  };

  // Determine payment type display
  const getPaymentTypeDisplay = () => {
    if (purchaseType === 'monthly') {
      return {
        label: 'Monthly Subscription',
        description: 'Recurring monthly payment - cancel anytime',
        icon: '🔄'
      };
    } else {
      return {
        label: 'One-time Purchase',
        description: `${totalLeaks} leak${totalLeaks !== 1 ? 's' : ''} - no recurring charges`,
        icon: '💰'
      };
    }
  };

  const paymentDisplay = getPaymentTypeDisplay();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-gray-800/50">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">{paymentDisplay.icon}</span>
            <p className="text-xl font-semibold text-white">{productName}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-400">{paymentDisplay.label}</p>
              <p className="text-xs text-gray-400">{paymentDisplay.description}</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-cyan-400 text-2xl">
                ${amount} {currency.toUpperCase()}
              </span>
              {purchaseType === 'monthly' && (
                <p className="text-xs text-gray-400">/month</p>
              )}
            </div>
          </div>
        </div>

        {/* Subscription-specific info */}
        {purchaseType === 'monthly' && (
          <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-700/50">
            <div className="flex items-center space-x-2 text-purple-300">
              <span>ℹ️</span>
              <span className="text-sm">
                {paymentType === 'setup_intent' 
                  ? 'Setting up payment method for monthly billing'
                  : 'Subscription includes unlimited leaks and can be cancelled anytime'
                }
              </span>
            </div>
          </div>
        )}

        {/* One-time purchase info */}
        {purchaseType === 'one_time' && totalLeaks && (
          <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-700/50">
            <div className="flex items-center space-x-2 text-green-300">
              <span>✅</span>
              <span className="text-sm">
                You'll receive {totalLeaks} leak{totalLeaks !== 1 ? 's' : ''} after payment
              </span>
            </div>
          </div>
        )}

        {/* Debug info - remove in production */}
        <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs text-gray-500">
          Payment Type: {paymentType} | Purchase Type: {purchaseType}
        </div>
      </div>

      <div className="py-2">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-900/50 text-red-400 rounded-lg border border-red-800/50">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 transition-all duration-300"
          disabled={isLoading || !stripe}
        >
          {isLoading ? 'Processing...' : 
           paymentType === 'setup_intent' ? 
           'Set up Payment Method' : 
           purchaseType === 'monthly' ? 
           `Subscribe for $${amount}/month` : 
           `Pay $${amount}`}
        </button>
      </div>
    </form>
  );
};

const StripePaymentForm: React.FC<StripePaymentFormProps> = (props) => {
  return (
    <Elements 
      stripe={props.stripePromise} 
      options={{
        clientSecret: props.clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#8B5CF6',
            colorBackground: '#111827',
            colorText: '#FFFFFF',
            colorDanger: '#EF4444',
            fontFamily: 'Space Mono, monospace',
            borderRadius: '0.5rem',
          },
        },
      }}
    >
      <PaymentFormContent {...props} />
    </Elements>
  );
};

export default StripePaymentForm;