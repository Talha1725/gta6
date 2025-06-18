import { useState } from "react";
import PaymentModal from "./PaymentModal";
import { PaymentButtonProps } from "@/types";

const PaymentButton: React.FC<PaymentButtonProps & { purchaseType: 'one_time' | 'monthly' }> = ({
  onClick,
  className = "",
  children,
  disabled = false,
  amount,
  currency,
  productName,
  purchaseType,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setShowModal(true);
          onClick();
        }}
        disabled={disabled}
        className={`px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg 
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 
          disabled:cursor-not-allowed ${className}`}
      >
        {children}
      </button>

      {showModal && (
        <PaymentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          amount={amount}
          currency={currency}
          productName={productName}
          purchaseType={purchaseType}
        />
      )}
    </>
  );
};

export default PaymentButton;
