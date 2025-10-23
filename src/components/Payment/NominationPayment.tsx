import React from 'react';
import CyberSourcePaymentModal from './CyberSourcePaymentModal';
import { usePaymentModal } from '../../hooks/usePaymentModal';
import CustomButton from '@/screens/CustomButton';

interface NominationPaymentProps {
  formData: Record<string, string>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const NominationPayment: React.FC<NominationPaymentProps> = ({ 
  formData, 
  onSuccess, 
  onError 
}) => {
  const { openModal, modalProps } = usePaymentModal({
    amount: 199,
    currency: 'AED',
    referenceId: `nomination-${Date.now()}`,
    customerEmail: formData.email || '',
    onSuccess: () => {
      console.log('Payment successful');
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Payment error:', error);
      onError?.(error);
    },
    title: 'Complete Nomination Payment',
    description: 'Pay AED 199 to complete your nomination registration'
  });

  return (
    <>
      <div className="flex justify-center">
        <CustomButton 
          type="button"
          onClick={openModal}
          className="min-w-40 px-6 py-2"
        >
          Pay AED 199 for Register
        </CustomButton>
      </div>
      
      <CyberSourcePaymentModal {...modalProps} />
    </>
  );
};

export default NominationPayment;
