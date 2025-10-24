import React, { useState } from 'react';
import CyberSourceHostedCheckoutFallback from './CyberSourceHostedCheckoutFallback';
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
  const [showHostedCheckout, setShowHostedCheckout] = useState(false);

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

  const handlePaymentSuccess = (paymentId?: string) => {
    console.log('Payment successful:', paymentId);
    onSuccess?.(paymentId);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    onError?.(error);
  };

  const handlePaymentCancel = () => {
    console.log('Payment cancelled');
    setShowHostedCheckout(false);
  };

  if (showHostedCheckout) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <CustomButton 
            type="button"
            onClick={() => setShowHostedCheckout(false)}
            variant="outline"
            className="min-w-40 px-6 py-2"
          >
            ← Back to Form
          </CustomButton>
        </div>
        
        <CyberSourceHostedCheckoutFallback
          amount={199}
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
          onCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  const handleOpenModal = () => {
    if (validateForm()) {
      setShowHostedCheckout(true);
    }
  };

  return (
    <div className="flex justify-center">
      <CustomButton 
        type="button"
        onClick={handleOpenModal}
        className="min-w-40 px-6 py-2"
      >
        Pay AED 199 for Register
      </CustomButton>
    </div>
  );
};

export default NominationPayment;
