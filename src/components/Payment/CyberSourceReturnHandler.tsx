import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { cyberSourceHostedCheckoutService, type CyberSourceResponse } from '../../lib/cybersource-hosted-checkout';
import { showPaymentToast } from '../../lib/toast';
import CustomButton from '../../screens/CustomButton';

interface CyberSourceReturnHandlerProps {
  onSuccess?: (paymentData: any) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

const CyberSourceReturnHandler: React.FC<CyberSourceReturnHandlerProps> = ({
  onSuccess,
  onError,
  redirectTo = '/thankyou'
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    transactionId?: string;
    amount?: string;
    currency?: string;
  } | null>(null);

  useEffect(() => {
    processPaymentResult();
  }, []);

  const processPaymentResult = async () => {
    try {
      setIsProcessing(true);
      
      // Parse response data from URL parameters
      const responseData: CyberSourceResponse = {};
      searchParams.forEach((value, key) => {
        responseData[key] = value;
      });

      console.log('CyberSource return data:', responseData);

      if (!responseData.transaction_id) {
        throw new Error('No transaction data received from CyberSource');
      }

      // Verify the response signature
      const isSignatureValid = await cyberSourceHostedCheckoutService.verifyResponse(responseData);
      
      if (!isSignatureValid) {
        throw new Error('Invalid payment response signature');
      }

      // Check if payment was successful
      const isSuccessful = cyberSourceHostedCheckoutService.isPaymentSuccessful(responseData);
      const statusMessage = cyberSourceHostedCheckoutService.getPaymentStatusMessage(responseData);

      const paymentResult = {
        success: isSuccessful,
        message: statusMessage,
        transactionId: responseData.transaction_id,
        amount: responseData.auth_amount || responseData.req_amount,
        currency: responseData.req_currency || 'AED'
      };

      setResult(paymentResult);

      if (isSuccessful) {
        // Process successful payment on backend
        try {
          const backendResult = await cyberSourceHostedCheckoutService.processSuccessfulPayment(responseData);
          console.log('Backend processing result:', backendResult);
          
          // Show success toast
          showPaymentToast({ 
            success: true, 
            paymentId: responseData.transaction_id,
            message: 'Payment completed successfully'
          });
          
          onSuccess?.(backendResult);
          
        } catch (backendError) {
          console.error('Backend processing error:', backendError);
          // Still show success to user, but log the backend error
          showPaymentToast({ 
            success: true, 
            paymentId: responseData.transaction_id,
            message: 'Payment completed successfully'
          });
        }
      } else {
        // Show error toast
        showPaymentToast({ 
          success: false, 
          error: statusMessage 
        });
        
        onError?.(statusMessage);
      }

    } catch (error) {
      console.error('Error processing payment result:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process payment result';
      
      const errorResult = {
        success: false,
        message: errorMessage,
        transactionId: undefined,
        amount: undefined,
        currency: undefined
      };
      
      setResult(errorResult);
      
      // Show error toast
      showPaymentToast({ 
        success: false, 
        error: errorMessage 
      });
      
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    navigate(redirectTo);
  };

  const handleRetry = () => {
    navigate(-1); // Go back to previous page
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your payment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Payment Error
            </h2>
            <p className="text-gray-600 mb-6">
              Unable to process payment result. Please contact support.
            </p>
            <CustomButton onClick={handleRetry} className="w-full">
              Try Again
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          {result.success ? (
            <>
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-4">
                {result.message}
              </p>
              
              {result.transactionId && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-green-700">
                    <strong>Transaction ID:</strong> {result.transactionId}
                  </p>
                  {result.amount && (
                    <p className="text-sm text-green-700">
                      <strong>Amount:</strong> {result.amount} {result.currency}
                    </p>
                  )}
                </div>
              )}
              
              <CustomButton onClick={handleContinue} className="w-full">
                Continue
              </CustomButton>
            </>
          ) : (
            <>
              <div className="text-red-500 text-6xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Failed
              </h2>
              <p className="text-gray-600 mb-4">
                {result.message}
              </p>
              
              {result.transactionId && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-red-700">
                    <strong>Transaction ID:</strong> {result.transactionId}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <CustomButton onClick={handleRetry} className="w-full">
                  Try Again
                </CustomButton>
                <CustomButton onClick={handleContinue} variant="outline" className="w-full">
                  Continue Anyway
                </CustomButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CyberSourceReturnHandler;
