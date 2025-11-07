import React, { useState, useEffect } from 'react';
import CyberSourceHostedCheckoutModal from './CyberSourceHostedCheckoutModal';
import CustomButton from '@/screens/CustomButton';
import { showErrorToast } from '@/lib/toast';

interface NominationPaymentProps {
  formData: Record<string, string>;
  onSuccess?: (paymentId?: string) => void;
  onError?: (error: string) => void;
}

const NominationPayment: React.FC<NominationPaymentProps> = ({ 
  formData, 
  onSuccess, 
  onError 
}) => {
  const [showModal, setShowModal] = useState(false);

  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'designation', 'companyName2', 'tradeLicense'];
  
  const validateForm = (): boolean => {
    for (const field of requiredFields) {
      if (!formData[field] || !formData[field].trim()) {
        showErrorToast(`Please fill in all required fields. Missing: ${field}`);
        return false;
      }
    }
    return true;
  };

  // Automatically open the payment modal when the component mounts
  useEffect(() => {
    // Check if form is valid, then open modal automatically
    const isValid = requiredFields.every(field => formData[field] && formData[field].trim());
    if (isValid) {
      setShowModal(true);
    } else {
      // If form is not valid, show which fields are missing
      const missingFields = requiredFields.filter(field => !formData[field] || !formData[field].trim());
      console.warn('Cannot auto-open payment: missing fields:', missingFields);
    }
  }, [formData]);

  const handlePaymentSuccess = (paymentId?: string) => {
    console.log('=== NOMINATION PAYMENT SUCCESS ===');
    console.log('Payment ID received:', paymentId);
    console.log('onSuccess function:', onSuccess);
    console.log('Calling onSuccess callback...');
    onSuccess?.(paymentId);
    console.log('=== NOMINATION PAYMENT SUCCESS COMPLETE ===');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    onError?.(error);
  };

  const handleOpenModal = () => {
    if (validateForm()) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="flex justify-center">
        <CustomButton 
          type="button"
          onClick={handleOpenModal}
          className="min-w-40 px-6 py-2"
        >
          Pay AED 500 for Register
        </CustomButton>
      </div>

      <CyberSourceHostedCheckoutModal
        isOpen={showModal}
        onClose={handleCloseModal}
        amount={525}
        currency="AED"
        customerEmail={formData.email || ''}
        customerFirstName={formData.firstName || 'Test'}
        customerLastName={formData.lastName || 'User'}
        customerAddress={formData.address || '123 Main Street'}
        customerCity={formData.city || 'Dubai'}
        customerCountry={formData.country || 'AE'}
        referenceNumber={`nomination-${Date.now()}`}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </>
  );
};

export default NominationPayment;
