import React, { useState, useEffect } from 'react';
import { transactionService, TransactionService, type TransactionDetails } from '../../lib/transaction-service';

interface PaymentVerificationProps {
  nominationId: string;
  transactionId?: string;
  onSuccess?: (nomination: any) => void;
  onError?: (error: Error) => void;
}

const PaymentVerification: React.FC<PaymentVerificationProps> = ({ 
  nominationId, 
  transactionId,
  onSuccess, 
  onError 
}) => {
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactionDetails();
  }, [nominationId, transactionId]);

  const loadTransactionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading transaction details for nomination:', nominationId);
      
      let response;
      
      if (transactionId) {
        // Use getTransactionDetails if we have both nominationId and transactionId
        response = await transactionService.getTransactionDetails(nominationId, transactionId);
      } else if (nominationId) {
        // Fallback: try to find by nomination ID only
        // This will likely need a transactionId from localStorage
        const storedTransactionId = localStorage.getItem('transactionId');
        if (storedTransactionId) {
          response = await transactionService.getTransactionDetails(nominationId, storedTransactionId);
        } else {
          throw new Error('Transaction ID is required to load transaction details');
        }
      } else {
        throw new Error('Nomination ID is required');
      }
      
      if (response.success && response.transaction) {
        setTransactionDetails(response.transaction);
        
        // Auto-verify if transaction is already paid
        if (response.transaction.status === 'paid') {
          console.log('Transaction already paid, auto-verifying...');
          handleVerificationSuccess(response.nomination || response.transaction);
        }
      } else {
        throw new Error(response.error || 'Failed to load transaction details');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load transaction details';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    try {
      setVerifying(true);
      setError(null);

      // Get email and transaction ID from localStorage
      const storedEmail = localStorage.getItem('nominationEmail');
      const storedTransactionId = localStorage.getItem('transactionId');

      console.log('Verification data:', { storedEmail, storedTransactionId });

      if (!storedEmail || !storedTransactionId) {
        throw new Error('Missing verification data in localStorage. Please try submitting the form again.');
      }

      const response = await transactionService.updatePaymentStatus(
        nominationId,
        storedTransactionId,
        storedEmail
      );

      if (response.success) {
        handleVerificationSuccess(response.nomination || response.transaction);
      } else {
        throw new Error(response.error || 'Failed to verify payment');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify payment';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setVerifying(false);
    }
  };

  const handleVerificationSuccess = (nomination: any) => {
    console.log('Payment verification successful:', nomination);
    
    // Clear sensitive data from localStorage
    TransactionService.clearSensitiveData();
    
    // Call success callback
    onSuccess?.(nomination);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading transaction details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Verification Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={loadTransactionDetails}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Verification
        </h2>
        <p className="text-gray-600">
          Verify your payment to complete the nomination process
        </p>
      </div>

      {transactionDetails && (
        <div className="space-y-4">
          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Transaction Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-900">{transactionDetails.customerEmail}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Amount:</span>
                <p className="text-gray-900">
                  {transactionDetails.paymentCurrency} {transactionDetails.paymentAmount}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  transactionDetails.status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {transactionDetails.status}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Transaction ID:</span>
                <p className="text-gray-900 font-mono text-xs break-all">
                  {transactionDetails.cybersourceTransactionId || transactionDetails.paymentReference}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Payment Method:</span>
                <p className="text-gray-900">{transactionDetails.paymentMethod}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Card Type:</span>
                <p className="text-gray-900">{transactionDetails.cardType || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Auth Code:</span>
                <p className="text-gray-900">{transactionDetails.authCode || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Submitted:</span>
                <p className="text-gray-900">
                  {new Date(transactionDetails.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            {transactionDetails.status === 'paid' ? (
              <div className="flex items-center text-green-600">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Payment Verified Successfully!</span>
              </div>
            ) : (
              <button
                onClick={handleVerifyPayment}
                disabled={verifying}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                {verifying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify Payment'
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;
