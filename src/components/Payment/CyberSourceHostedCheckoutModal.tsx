import React, { useState, useEffect } from 'react';
import { cyberSourceHostedCheckoutService, type PaymentRequest, type CyberSourceParams } from '../../lib/cybersource-hosted-checkout';
import { showLoadingToast, dismissToast, showPaymentToast } from '../../lib/toast';
import CustomButton from '@/screens/CustomButton';

interface CyberSourceHostedCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

const CyberSourceHostedCheckoutModal: React.FC<CyberSourceHostedCheckoutModalProps> = ({
  isOpen,
  onClose,
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
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentParams, setPaymentParams] = useState<CyberSourceParams | null>(null);
  const [cybersourceUrl, setCybersourceUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && !paymentParams) {
      initializePayment();
    }
  }, [isOpen]);

  const initializePayment = async () => {
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
      
      setPaymentParams(paymentResponse.params);
      setCybersourceUrl(paymentResponse.cybersourceUrl);
      
      // Dismiss loading toast
      dismissToast(loadingToastId);
      
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

  const handlePayment = () => {
    if (!paymentParams || !cybersourceUrl) {
      setError('Payment parameters not ready');
      return;
    }

    try {
      // Create a form element
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = cybersourceUrl;
      form.target = '_blank'; // Open in new tab/window
      form.style.display = 'none';

      // Add all parameters as hidden inputs
      Object.entries(paymentParams).forEach(([key, value]) => {
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
      
      console.log('Form submitted to CyberSource Hosted Checkout in new window');
      
      // Listen for payment completion
      listenForPaymentCompletion();
      
    } catch (error) {
      console.error('Error submitting to CyberSource:', error);
      const errorMessage = 'Failed to redirect to payment page';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const listenForPaymentCompletion = () => {
    // Listen for messages from the payment window
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'PAYMENT_SUCCESS') {
        console.log('Payment success message received:', event.data);
        onSuccess?.(event.data.paymentId);
        onClose();
      } else if (event.data.type === 'PAYMENT_ERROR') {
        console.log('Payment error message received:', event.data);
        onError?.(event.data.error);
        onClose();
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Clean up listener after 10 minutes
    setTimeout(() => {
      window.removeEventListener('message', handleMessage);
    }, 600000);
  };

  const handleClose = () => {
    setError(null);
    setPaymentParams(null);
    setCybersourceUrl('');
    onClose();
  };

  const VAT_RATE = 0.05;
  const baseAmount = amount / (1 + VAT_RATE);
  const vatAmount = amount - baseAmount;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Complete Payment
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Payment Summary */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Payment Summary</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Amount:</span>
                  <span className="font-medium text-gray-900">
                    {baseAmount.toFixed(2)} {currency.toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">VAT 5%:</span>
                  <span className="font-medium text-gray-900">
                    {vatAmount.toFixed(2)} {currency.toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold text-gray-900">
                    {amount.toFixed(2)} {currency.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium text-gray-900">
                    {customerFirstName} {customerLastName}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{customerEmail}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-medium text-gray-900">
                    {referenceNumber || `EVENT-${Date.now()}`}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                CyberSource will charge a total of {amount.toFixed(2)} {currency.toUpperCase()}.
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Payment Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Preparing payment...</span>
              </div>
            ) : (
              <>
                <CustomButton
                  onClick={handlePayment}
                  disabled={!paymentParams || !!error}
                  className="w-full"
                >
                  Pay via CyberSource
                </CustomButton>
                
                <CustomButton
                  onClick={handleClose}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </CustomButton>
              </>
            )}
          </div>

          {/* Info */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Secure Payment:</strong> You will be redirected to CyberSource's secure payment page to complete your transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberSourceHostedCheckoutModal;
