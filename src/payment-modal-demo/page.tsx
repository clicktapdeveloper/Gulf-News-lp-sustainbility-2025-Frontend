import React from 'react';
import CyberSourcePaymentModal from '../components/Payment/CyberSourcePaymentModal';
import { usePaymentModal } from '../hooks/usePaymentModal';
import CustomButton from '../screens/CustomButton';

const PaymentModalDemo: React.FC = () => {
  const { openModal, modalProps } = usePaymentModal({
    amount: 525,
    currency: 'AED',
    referenceId: `demo-${Date.now()}`,
    customerEmail: 'demo@example.com',
    onSuccess: (paymentId) => {
      console.log('Payment successful:', paymentId);
    },
    onError: (error) => {
      console.error('Payment error:', error);
    },
    title: 'Complete Payment',
    description: 'Secure payment processing powered by CyberSource'
  });

  return (
    <div className="min-h-screen bg-[var(--background-color)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-[var(--secondary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">$</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--tertiary-color)] mb-2">
            Payment Demo
          </h1>
          <p className="text-gray-600">
            Click the button below to open the beautiful payment modal
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--card-color)] p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Payment Amount</p>
            <p className="text-3xl font-bold text-[var(--secondary-color)]">
              AED 199.00
            </p>
          </div>

          <CustomButton 
            onClick={openModal}
            className="w-full py-4 text-lg font-semibold"
          >
            Open Payment Modal
          </CustomButton>

          <p className="text-xs text-gray-500">
            This demo uses test card numbers and won't charge real money
          </p>
        </div>
      </div>

      <CyberSourcePaymentModal {...modalProps} />
    </div>
  );
};

export default PaymentModalDemo;
