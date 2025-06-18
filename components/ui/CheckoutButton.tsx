'use client';

import { useState } from 'react';
import { Button } from './Button';
import PaymentModal from '../PaymentModal';
import { CheckoutButtonProps } from '@/types';

export default function CheckoutButton({ 
  amount,
  currency,
  productName,
  className = '',
  children,
  variant = 'default',
  purchaseType = 'one_time'
}: CheckoutButtonProps & { purchaseType?: 'one_time' | 'monthly' }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className={className}
        variant={variant}
      >
        {children || 'Checkout'}
      </Button>

      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        amount={amount}
        currency={currency}
        productName={productName}
        purchaseType={purchaseType}
      />
    </>
  );
} 