import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CustomButton from '@/screens/CustomButton';
import PaymentVerification from '@/components/PaymentVerification';
import { TransactionService, transactionService } from '@/lib/transaction-service';

const NominationSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get('transaction_id');
  const objectId = searchParams.get('object_id');
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [nominationId, setNominationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const loadTransactionDetails = useCallback(async () => {
    try {
      console.log('=== LOADING TRANSACTION DETAILS ===');
      setLoading(true);
      setError(null);
      
      // Get nomination ID from URL params or localStorage
      const urlNominationId = objectId;
      const storedNominationId = localStorage.getItem('nominationId');
      
      // Try alternative localStorage keys as fallback
      const alternativeKeys = ['objectId', 'nominationObjectId', 'nomination_id'];
      let alternativeNominationId = null;
      
      for (const key of alternativeKeys) {
        const value = localStorage.getItem(key);
        if (value) {
          console.log(`Found alternative nomination ID in localStorage['${key}']:`, value);
          alternativeNominationId = value;
          break;
        }
      }
      
      const finalNominationId = urlNominationId || storedNominationId || alternativeNominationId;
      
      console.log('=== NOMINATION ID RESOLUTION ===');
      console.log('URL objectId:', urlNominationId);
      console.log('Stored nominationId:', storedNominationId);
      console.log('Alternative nominationId:', alternativeNominationId);
      console.log('Final nominationId:', finalNominationId);
      console.log('objectId type:', typeof objectId);
      console.log('objectId length:', objectId?.length);
      console.log('storedNominationId type:', typeof storedNominationId);
      console.log('storedNominationId length:', storedNominationId?.length);
      
      console.log('Nomination ID sources:', { urlNominationId, storedNominationId, alternativeNominationId, finalNominationId });
      
      if (finalNominationId) {
        console.log('Loading transaction details for nomination ID:', finalNominationId);
        setNominationId(finalNominationId);
        
        // Store transaction ID and email in localStorage for verification
        if (transactionId) {
          localStorage.setItem('transactionId', transactionId);
        }
        
        // Get email from localStorage if available
        const storedEmail = localStorage.getItem('nominationEmail');
        if (!storedEmail) {
          // Try to get from nomination data
          const nominationData = localStorage.getItem('gulfnews_nomination_data');
          if (nominationData) {
            try {
              const parsed = JSON.parse(nominationData);
              if (parsed.formData?.email) {
                localStorage.setItem('nominationEmail', parsed.formData.email);
              }
            } catch (error) {
              console.error('Error parsing nomination data:', error);
            }
          }
        }
        
        // Call the transaction API
        const response = await transactionService.getTransactionDetails(finalNominationId);
        
        if (response.success && response.transaction) {
          console.log('Transaction details loaded:', response.transaction);
          
          // If transaction is already paid, show success immediately
          if (response.transaction.status === 'paid') {
            setVerificationComplete(true);
            TransactionService.clearSensitiveData();
          } else if (transactionId) {
            // If unpaid but we have transaction ID, automatically verify payment
            console.log('Transaction is unpaid, attempting automatic verification...');
            
            const verifyResponse = await transactionService.updatePaymentStatus(
              finalNominationId, 
              transactionId, 
              response.transaction.customerEmail
            );
            
            if (verifyResponse.success) {
              setVerificationComplete(true);
              TransactionService.clearSensitiveData();
            } else {
              setError(verifyResponse.error || 'Failed to verify payment automatically');
            }
          }
        } else {
          setError(response.error || 'Failed to load transaction details');
        }
        
      } else if (transactionId) {
        // If we only have transaction ID but no nomination ID, 
        // we need to find the nomination by transaction ID
        console.log('Only transaction ID available, attempting to find nomination...');
        console.log('Transaction ID:', transactionId);
        
        const findResponse = await transactionService.findNominationByTransactionId(transactionId);
        
        if (findResponse.success && findResponse.nomination) {
          setNominationId(findResponse.nomination._id);
          
          // Store transaction ID and email for verification
          localStorage.setItem('transactionId', transactionId);
          if (findResponse.nomination.customerEmail) {
            localStorage.setItem('nominationEmail', findResponse.nomination.customerEmail);
          }
          
          // If the nomination is already paid, show success immediately
          if (findResponse.nomination.status === 'paid') {
            setVerificationComplete(true);
            TransactionService.clearSensitiveData();
          } else {
            // If unpaid, automatically verify payment
            console.log('Nomination found but unpaid, attempting automatic verification...');
            
            const verifyResponse = await transactionService.updatePaymentStatus(
              findResponse.nomination._id, 
              transactionId, 
              findResponse.nomination.customerEmail
            );
            
            if (verifyResponse.success) {
              setVerificationComplete(true);
              TransactionService.clearSensitiveData();
            } else {
              setError(verifyResponse.error || 'Failed to verify payment automatically');
            }
          }
        } else {
          setError(findResponse.error || 'Nomination not found for this transaction ID');
        }
      } else {
        console.log('No nomination ID or transaction ID found');
        setError('No nomination ID or transaction ID found');
      }
      
    } catch (error) {
      console.error('Error loading transaction details:', error);
      setError('Failed to load transaction details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [objectId, transactionId]);

  const autoVerifyPayment = async (nominationId: string, txnId: string, email: string) => {
    try {
      console.log('=== AUTOMATIC PAYMENT VERIFICATION ===');
      console.log('Nomination ID:', nominationId);
      console.log('Transaction ID:', txnId);
      console.log('Email:', email);
      
      const response = await transactionService.updatePaymentStatus(nominationId, txnId, email);
      
      if (response.success) {
        console.log('Payment verified automatically:', response);
        handleVerificationSuccess(response.nomination || response.transaction);
      } else {
        console.error('Automatic verification failed:', response.error);
        setError(response.error || 'Failed to verify payment automatically');
      }
    } catch (error) {
      console.error('Error in automatic payment verification:', error);
      setError('Failed to verify payment automatically. Please try manual verification.');
    }
  };

  const findNominationByTransactionId = async (txnId: string) => {
    try {
      console.log('=== FINDING NOMINATION BY TRANSACTION ID ===');
      console.log('Searching for nomination with transaction ID:', txnId);
      
      const response = await transactionService.findNominationByTransactionId(txnId);
      console.log('Find nomination response:', response);
      
      if (response.success && response.nomination) {
        console.log('Nomination found:', response.nomination);
        setNominationId(response.nomination._id);
        
        // Store transaction ID and email for verification
        localStorage.setItem('transactionId', txnId);
        if (response.nomination.customerEmail) {
          localStorage.setItem('nominationEmail', response.nomination.customerEmail);
        }
        
        // If the nomination is already paid, show success immediately
        if (response.nomination.status === 'paid') {
          handleVerificationSuccess(response.nomination);
        } else {
          // If unpaid, automatically verify payment
          console.log('Nomination found but unpaid, attempting automatic verification...');
          await autoVerifyPayment(response.nomination._id, txnId, response.nomination.customerEmail);
        }
      } else {
        setError(response.error || 'Nomination not found for this transaction ID');
      }
    } catch (error) {
      console.error('Error finding nomination by transaction ID:', error);
      setError('Unable to find nomination. Please contact support.');
    }
  };

  const handleVerificationSuccess = (nomination: any) => {
    console.log('Payment verified successfully:', nomination);
    setVerificationComplete(true);
    
    // Clear all sensitive data
    TransactionService.clearSensitiveData();
  };

  const handleVerificationError = (error: Error) => {
    console.error('Verification failed:', error);
    // You can show an error message or handle the error as needed
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleSubmitAnother = () => {
    navigate('/apply-for-nomination');
  };

  // Set mounted flag immediately
  useEffect(() => {
    console.log('=== NOMINATION SUCCESS PAGE LOADED ===');
    console.log('Current URL:', window.location.href);
    console.log('Search params:', searchParams.toString());
    console.log('URL Parameters:', { objectId, transactionId });
    console.log('localStorage nominationId:', localStorage.getItem('nominationId'));
    console.log('localStorage nominationEmail:', localStorage.getItem('nominationEmail'));
    console.log('localStorage transactionId:', localStorage.getItem('transactionId'));
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('localStorage values:', {
      nominationId: localStorage.getItem('nominationId'),
      nominationEmail: localStorage.getItem('nominationEmail'),
      transactionId: localStorage.getItem('transactionId'),
      gulfnews_nomination_data: localStorage.getItem('gulfnews_nomination_data')
    });
    
    setMounted(true);
  }, []); // Empty dependency array to run only once on mount

  // Load transaction details after component is mounted
  useEffect(() => {
    if (mounted) {
      console.log('=== TIMER TRIGGERED - LOADING TRANSACTION DETAILS ===');
      loadTransactionDetails();
    }
  }, [mounted, loadTransactionDetails]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-xl font-bold text-blue-900 mb-4">
              Processing Payment
            </h1>
            <p className="text-blue-700 mb-6">
              Please wait while we automatically verify your payment...
            </p>
            {transactionId && (
              <div className="bg-white border border-blue-300 rounded-md p-3 mb-4">
                <p className="text-sm text-blue-700">
                  <strong>Transaction ID:</strong> {transactionId}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!nominationId && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <svg className="h-12 w-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h1 className="text-xl font-bold text-red-900 mb-4">
              Verification Error
            </h1>
            <p className="text-red-700 mb-6">
              {error}
            </p>
            {transactionId && (
              <div className="bg-white border border-red-300 rounded-md p-3 mb-4">
                <p className="text-sm text-red-700">
                  <strong>Transaction ID:</strong> {transactionId}
                </p>
              </div>
            )}
            <CustomButton
              onClick={() => navigate('/apply-for-nomination')}
              className="px-6 py-2"
            >
              Return to Nomination Form
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {verificationComplete ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <div className="flex justify-center mb-4">
                <svg className="h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-green-900 mb-4">
                Payment Verified Successfully!
              </h1>
              <p className="text-green-700 mb-6">
                Your nomination has been submitted and payment confirmed. 
                You will receive a confirmation email shortly.
              </p>
              
              {/* Transaction Details */}
              {(transactionId || objectId) && (
                <div className="bg-white border border-green-300 rounded-md p-4 max-w-md mx-auto mb-6">
                  {transactionId && (
                    <p className="text-sm text-green-700">
                      <strong>Transaction ID:</strong> {transactionId}
                    </p>
                  )}
                  {objectId && (
                    <p className="text-sm text-green-700">
                      <strong>Nomination ID:</strong> {objectId}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <CustomButton
                  onClick={handleReturnHome}
                  className="px-6 py-3"
                >
                  Return to Home
                </CustomButton>
                
                <CustomButton
                  onClick={handleSubmitAnother}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Submit Another Nomination
                </CustomButton>
              </div>
            </div>
          </div>
        ) : nominationId ? (
          <PaymentVerification
            nominationId={nominationId}
            onSuccess={handleVerificationSuccess}
            onError={handleVerificationError}
          />
        ) : (
          <div className="text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <svg className="h-12 w-12 text-yellow-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h1 className="text-xl font-bold text-yellow-900 mb-4">
                Nomination ID Not Found
              </h1>
              <p className="text-yellow-700 mb-6">
                Unable to find nomination ID for verification. This might happen if you accessed this page directly.
              </p>
              <CustomButton
                onClick={() => navigate('/apply-for-nomination')}
                className="px-6 py-2"
              >
                Return to Nomination Form
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NominationSuccess;
