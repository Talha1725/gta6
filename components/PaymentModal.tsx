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
          <p className="text-sm text-gray-400">One-time payment</p>
        </div>

        <div className="flex justify-between mb-1">
          {originalPrice && (
            <span className="line-through text-gray-500">
              {originalPrice} {currency}
            </span>
          )}
          <span className="font-bold text-cyan-400">
            {amount} {currency}
          </span>
        </div>

        {vatAmount > 0 && (
          <div className="flex justify-between text-sm text-gray-500">
            <span>VAT amount</span>
            <span>
              {vatAmount} {currency}
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
          {isLoading ? "Processing..." : `Pay ${amount} ${currency}`}
        </button>
      </div>
    </form>
  );
};

// Main PaymentModal component
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
  const [clientSecret, setClientSecret] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [paymentType, setPaymentType] = useState<'payment_intent' | 'setup_intent'>('payment_intent');
  const { data: session, status } = useSession();

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const createPaymentIntent = async () => {
      if (!isOpen) return;

      // Check if user is logged in
      if (status === "unauthenticated") {
        setError("Please log in to make a purchase");
        return;
      }

      const requestBody = {
        amount: Number(amount),
        currency: currency.toLowerCase(),
        productName: productName,
        purchaseType: purchaseType,
        totalLeaks: totalLeaks,
      };
      console.log("💳 Sending payment intent request:", requestBody);

      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        // Log the raw response first
        console.log("📥 Raw API Response:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });

        const data = await response.json();
        // Log the complete response data
        console.log("📦 Complete API Response Data:", data);

        if (!response.ok) {
          console.error("❌ API Error:", data);
          throw new Error(
            data.error || `HTTP error! status: ${response.status}`
          );
        }

        if (isMounted && data.clientSecret) {
          console.log("✅ Setting client secret:", {
            paymentIntentId: data.paymentIntentId,
            setupIntentId: data.setupIntentId,
            productId: data.productId,
            priceId: data.priceId,
            paymentType: data.paymentType,
            hasClientSecret: !!data.clientSecret,
          });
          setClientSecret(data.clientSecret);
          setPaymentType(data.paymentType || 'payment_intent'); // Set the payment type from API response
        } else {
          console.warn("⚠️ No client secret in response:", data);
        }
      } catch (err) {
        const error = err as Error;
        console.error("❌ Payment intent error:", error);
        if (isMounted) {
          setError(`Payment setup failed: ${error.message}`);
        }
      }
    };

    // Add debounce to prevent multiple calls
    if (isOpen) {
      timeoutId = setTimeout(createPaymentIntent, 300);
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      // Clear client secret when modal closes
      if (!isOpen) {
        setClientSecret("");
        setError("");
        setPaymentType('payment_intent'); // Reset payment type
      }
    };
  }, [isOpen, amount, currency, productName, purchaseType, totalLeaks, status]);

  useEffect(() => {
    if (isOpen) {
      console.log("🔓 Payment modal opened");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-gradient-to-br from-gray-900/95 to-purple-900/30 backdrop-blur-lg rounded-2xl border border-purple-800/50 shadow-2xl max-w-md w-full m-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 transition-colors"
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
            {status === "unauthenticated" ? "Login Required" : "Select Payment Method"}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {error ? (
            <div className="bg-gradient-to-br from-red-900/50 to-pink-900/30 backdrop-blur-lg p-6 rounded-2xl border border-red-800/50 shadow-xl">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2 text-pink-400">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-lg">{error}</span>
                </div>

                {status === "unauthenticated" ? (
                  <>
                    <p className="text-gray-300 text-center">
                      You need to be logged in to make a purchase
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        window.location.href = "/auth/signin";
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20"
                    >
                      Login to Continue
                    </button>
                  </>
                ) : (
                  <button
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20"
                    onClick={onClose}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          ) : clientSecret ? (
            <StripePaymentForm
              stripePromise={stripePromise}
              clientSecret={clientSecret}
              amount={amount}
              currency={currency}
              productName={productName}
              purchaseType={purchaseType}
              totalLeaks={totalLeaks}
              paymentType={paymentType} // Pass the payment type to StripePaymentForm
              onClose={onClose}
            />
          ) : (
            <div className="py-10 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;