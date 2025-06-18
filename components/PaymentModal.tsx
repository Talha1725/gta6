import { useState, useEffect, lazy, Suspense } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { loadStripe, PaymentRequest } from "@stripe/stripe-js";
import { PaymentFormProps, PaymentModalProps } from "@/types";
import StripePaymentForm from "@/components/StripePaymentForm";
import { useSession } from "next-auth/react";
import { PaymentService } from "@/lib/services/payment.service";
import { formattingUtils } from "@/lib/utils/formatting";

// Add at the top with other imports
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

// PaymentForm component with Stripe functionality
const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  productName,
  onClose,
  originalPrice,
  vatAmount = 0, // Default to 0 if not provided
  purchaseType,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (!stripe || !elements) return;

    // Only create payment request if we have stripe and elements ready
    try {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: currency.toLowerCase(),
        total: {
          label: productName,
          amount: Math.round(amount * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      // Check if the Payment Request is available
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);

          // Store the available payment methods for display
          const methods: string[] = [];
          if (result.applePay) methods.push("Apple Pay");
          if (result.googlePay) methods.push("Google Pay");
          if (result.link) methods.push("Link");
          setAvailablePaymentMethods(methods);

          console.log("Available payment methods:", result);
        } else {
          console.log(
            "No wallet payment methods available on this device/browser"
          );
        }
      });

      // Listen for payment completions
      pr.on("paymentmethod", async (e) => {
        setIsLoading(true);

        try {
          // Execute the payment
          const { error: confirmError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: `${window.location.origin}/payment-success`,
              payment_method: e.paymentMethod.id,
            },
            redirect: "if_required",
          });

          if (confirmError) {
            e.complete("fail");
            setErrorMessage(confirmError.message || "Payment failed");
            setIsLoading(false);
          } else {
            e.complete("success");
            window.location.href = `${window.location.origin}/payment-success`;
          }
        } catch (err) {
          const error = err as Error;
          console.error("Payment confirmation error:", error);
          e.complete("fail");
          setErrorMessage(error.message || "Payment failed");
          setIsLoading(false);
        }
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error setting up payment request:", error);
    }
  }, [stripe, elements, currency, amount, productName]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed");
      setIsLoading(false);
    }
    // On success, the page will redirect to return_url
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-gray-800/50">
        <div className="mb-2">
          <p className="text-xl font-semibold text-white">{productName}</p>
          <p className="text-sm text-gray-400">
            {purchaseType === 'monthly' ? 'Monthly subscription' : 'One-time payment'}
          </p>
        </div>

        <div className="flex justify-between mb-1">
          {originalPrice && (
            <span className="line-through text-gray-500">
              {formattingUtils.currency.formatUSD(originalPrice)}
            </span>
          )}
          <span className="font-bold text-cyan-400">
            {formattingUtils.currency.formatUSD(amount)}
          </span>
        </div>

        {vatAmount > 0 && (
          <div className="flex justify-between text-sm text-gray-500">
            <span>VAT amount</span>
            <span>
              {formattingUtils.currency.formatUSD(vatAmount)}
            </span>
          </div>
        )}
      </div>

      {/* Wallet payment options */}
      {paymentRequest && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">
            {availablePaymentMethods.length > 0
              ? `Pay faster with: ${availablePaymentMethods.join(", ")}`
              : "Pay faster with digital wallet"}
          </p>
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  theme: "dark",
                  height: "44px",
                },
              },
            }}
          />
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-3 text-gray-400 text-sm">
              or pay with card
            </span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>
        </div>
      )}

      <div className="py-2">
        <PaymentElement
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                name: "N/A",
              },
            },
          }}
        />
      </div>

      {errorMessage && (
        <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:bg-gray-600 text-black font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
            Processing...
          </div>
        ) : (
          `Pay ${formattingUtils.currency.formatUSD(amount)}${purchaseType === 'monthly' ? ' /month' : ''}`
        )}
      </button>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  currency = "usd",
  productName,
  originalPrice,
  vatAmount,
  purchaseType,
  totalLeaks,
}) => {
  const { data: session } = useSession();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen && amount > 0) {
      const createPaymentIntent = async () => {
        try {
          setLoading(true);
          setError("");

          const response = await PaymentService.createPaymentIntent({
            amount,
            currency,
            productName,
            //@ts-ignore
            customerEmail: session?.user?.email,
            purchaseType,
            totalLeaks
          });

          setClientSecret(response.clientSecret);
          
          // Log order number if available (for debugging)
          console.log('Payment intent response:', {
            hasOrderNumber: !!response.orderNumber,
            orderNumber: response.orderNumber
          });
        } catch (err) {
          console.error("Error creating payment intent:", err);
          setError("Failed to initialize payment. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      createPaymentIntent();
    }
  }, [isOpen, amount, currency, productName, session?.user?.email]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-gray-900/95 backdrop-blur-lg border border-gray-800/50 rounded-xl p-6 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Complete Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <span className="ml-3 text-white">Initializing payment...</span>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-4 rounded-lg mb-4">
            {error}
          </div>
        ) : clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "night",
                variables: {
                  colorPrimary: "#06b6d4",
                  colorBackground: "#1f2937",
                  colorText: "#ffffff",
                  colorDanger: "#ef4444",
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                  spacingUnit: "4px",
                  borderRadius: "8px",
                },
              },
            }}
          >
            <PaymentForm
              amount={amount}
              currency={currency}
              productName={productName}
              onClose={onClose}
              originalPrice={originalPrice}
              vatAmount={vatAmount}
              purchaseType={purchaseType}
            />
          </Elements>
        ) : null}
      </div>
    </div>
  );
};

export default PaymentModal;