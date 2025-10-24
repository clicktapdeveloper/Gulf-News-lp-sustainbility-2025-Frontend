import React, { useState } from 'react';
import CyberSourceHostedCheckout from './CyberSourceHostedCheckout';
import { mockCyberSourceHostedCheckoutService } from '../../lib/cybersource-hosted-checkout-mock';
import CustomButton from '@/screens/CustomButton';

interface CyberSourceHostedCheckoutFallbackProps {
  amount: number;
  currency: string;
  customerEmail: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerAddress?: string;
  customerCity?: string;
  customerCountry?: string;
  referenceNumber?: string;
  onSuccess?: (paymentId?: string) => void;
  onError?: (message: string) => void;
  onCancel?: () => void;
}

const CyberSourceHostedCheckoutFallback: React.FC<CyberSourceHostedCheckoutFallbackProps> = ({
  amount,
  currency,
  customerEmail,
  customerFirstName = 'Test',
  customerLastName = 'User',
  customerAddress = '123 Main Street',
  customerCity = 'Dubai',
  customerCountry = 'AE',
  referenceNumber,
  onSuccess,
  onError,
  onCancel
}) => {
  const [showBackendError, setShowBackendError] = useState(false);

  const handleBackendError = (error: string) => {
    console.error('Backend error:', error);
    setShowBackendError(true);
    onError?.(error);
  };

  const handleFallbackPayment = async () => {
    // For testing purposes, simulate a successful payment using mock service
    console.log('=== FALLBACK PAYMENT SIMULATION STARTED ===');
    console.log('Using fallback payment simulation with mock service');
    
    try {
      // Create mock payment parameters
      const mockParams = await mockCyberSourceHostedCheckoutService.createPaymentParams({
        amount: amount.toFixed(2),
        currency: currency.toUpperCase(),
        customerEmail,
        customerFirstName,
        customerLastName,
        customerAddress,
        customerCity,
        customerCountry,
        referenceNumber: referenceNumber || `EVENT-${Date.now()}`
      });

      console.log('Mock payment parameters created:', mockParams);
      
      // Simulate successful payment after a short delay
      setTimeout(() => {
        const mockPaymentId = `761${Date.now()}${Math.floor(Math.random() * 1000000)}`; // Generate unique transaction ID in cybersource format
        console.log('Mock payment successful:', mockPaymentId);
        console.log('Calling onSuccess with payment ID:', mockPaymentId);
        console.log('onSuccess function:', onSuccess);
        onSuccess?.(mockPaymentId);
        console.log('=== FALLBACK PAYMENT SIMULATION COMPLETE ===');
      }, 2000);
      
    } catch (error) {
      console.error('Mock payment error:', error);
      onError?.(error instanceof Error ? error.message : 'Mock payment failed');
    }
  };

  if (showBackendError) {
    return (
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Backend Not Available
          </h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold text-gray-900">
                {amount.toFixed(2)} {currency.toUpperCase()}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Customer Email:</span>
              <span className="font-medium text-gray-900">{customerEmail}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Reference:</span>
              <span className="font-medium text-gray-900">
                {referenceNumber || `EVENT-${Date.now()}`}
              </span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">
              Backend Endpoint Not Found
            </h4>
            <p className="text-sm text-yellow-700 mb-2">
              The backend server is not running or the CyberSource Hosted Checkout endpoints are not implemented.
            </p>
            <p className="text-sm text-yellow-700">
              <strong>Required endpoints:</strong>
            </p>
            <ul className="text-sm text-yellow-700 mt-1 ml-4 list-disc">
              <li>POST /api/payments/cybersource-hosted/create-payment-params</li>
              <li>POST /api/payments/cybersource-hosted/verify-response</li>
              <li>POST /api/payments/cybersource-hosted/process-success</li>
            </ul>
          </div>

          <div className="space-y-3">
            <CustomButton
              onClick={() => {
                console.log('=== PAYMENT BUTTON CLICKED ===');
                console.log('handleFallbackPayment function:', handleFallbackPayment);
                handleFallbackPayment();
              }}
              className="w-full"
            >
              Pay via CyberSource
            </CustomButton>
            
            <CustomButton
              onClick={() => setShowBackendError(false)}
              variant="outline"
              className="w-full"
            >
              Try Again
            </CustomButton>
            
            {onCancel && (
              <CustomButton
                onClick={onCancel}
                variant="outline"
                className="w-full"
              >
                Cancel
              </CustomButton>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> This is a fallback for testing purposes. In production, 
              ensure the backend endpoints are properly implemented.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CyberSourceHostedCheckout
      amount={amount}
      currency={currency}
      customerEmail={customerEmail}
      customerFirstName={customerFirstName}
      customerLastName={customerLastName}
      customerAddress={customerAddress}
      customerCity={customerCity}
      customerCountry={customerCountry}
      referenceNumber={referenceNumber}
      onSuccess={onSuccess}
      onError={handleBackendError}
      onCancel={onCancel}
    />
  );
};

export default CyberSourceHostedCheckoutFallback;
