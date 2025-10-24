import React from 'react';
import CyberSourceReturnHandler from '../components/Payment/CyberSourceReturnHandler';

const CyberSourceReturnPage: React.FC = () => {
  const handleSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData);
    // Additional success handling can be added here
  };

  const handleError = (error: string) => {
    console.error('Payment error:', error);
    // Additional error handling can be added here
  };

  return (
    <CyberSourceReturnHandler
      onSuccess={handleSuccess}
      onError={handleError}
      redirectTo="/thankyou"
    />
  );
};

export default CyberSourceReturnPage;
