import React, { useState } from 'react';
import { cyberSourceHostedCheckoutService, type PaymentRequest, type CyberSourceParams } from '../../lib/cybersource-hosted-checkout';
import { showPaymentToast, showLoadingToast, dismissToast } from '../../lib/toast';
import CustomButton from '../../screens/CustomButton';

interface CyberSourceHostedCheckoutProps {
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

const CyberSourceHostedCheckout: React.FC<CyberSourceHostedCheckoutProps> = ({
  amount,
  currency,
  customerEmail,
  customerFirstName = 'Test',
  customerLastName = 'User',
  customerAddress = '123 Main Street',
  customerCity = 'Dubai',
  customerCountry = 'AE',
  referenceNumber,
  onError,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!customerEmail) {
      const errorMsg = 'Customer email is required';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);

    const loadingToastId = showLoadingToast('Preparing payment...');

    try {
      const paymentRequest: PaymentRequest = {
        amount: amount.toFixed(2),
        currency: currency.toUpperCase(),
        customerEmail,
        customerFirstName,
        customerLastName,
        customerAddress,
        customerCity,
        customerCountry,
        referenceNumber: referenceNumber || `EVENT-${Date.now()}`
      };

      console.log('Creating payment parameters:', paymentRequest);
      const paymentResponse = await cyberSourceHostedCheckoutService.createPaymentParams(paymentRequest);
      
      console.log('Payment parameters created:', paymentResponse);
      
      // Dismiss loading toast
      dismissToast(loadingToastId);
      
      // Create and submit the form to CyberSource
      submitToCyberSource(paymentResponse.params, paymentResponse.cybersourceUrl);
      
    } catch (error) {
      console.error('Error creating payment parameters:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to prepare payment';
      
      // Dismiss loading toast
      dismissToast(loadingToastId);
      
      // Show error toast
      showPaymentToast({ success: false, error: errorMessage });
      
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const submitToCyberSource = (params: CyberSourceParams, cybersourceUrl: string) => {
    try {
      // Create a form element
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = cybersourceUrl;
      form.target = '_self';
      form.style.display = 'none';

      // Add all parameters as hidden inputs
      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      // Add form to DOM and submit
      document.body.appendChild(form);
      form.submit();
      
      // Clean up
      document.body.removeChild(form);
      
      console.log('Form submitted to CyberSource Hosted Checkout');
      
    } catch (error) {
      console.error('Error submitting to CyberSource:', error);
      const errorMessage = 'Failed to redirect to payment page';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          CyberSource Hosted Checkout
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

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <CustomButton
            onClick={handlePayment}
            disabled={isLoading || !customerEmail}
            className="w-full"
          >
            {isLoading ? 'Preparing Payment...' : 'Pay with CyberSource'}
          </CustomButton>
          
          {onCancel && (
            <CustomButton
              onClick={onCancel}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              Cancel
            </CustomButton>
          )}
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Secure Payment:</strong> You will be redirected to CyberSource's secure payment page 
            to enter your card details. Your payment information is never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CyberSourceHostedCheckout;
