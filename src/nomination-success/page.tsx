import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CustomButton from '@/screens/CustomButton';
import PaymentVerification from '@/components/PaymentVerification';
import { TransactionService } from '@/lib/transaction-service';

const NominationSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get('transaction_id');
  const objectId = searchParams.get('object_id');
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [nominationId, setNominationId] = useState<string | null>(null);

  useEffect(() => {
    // Get nomination ID from URL params or localStorage
    const urlNominationId = objectId;
    const storedNominationId = localStorage.getItem('nominationId');
    
    const finalNominationId = urlNominationId || storedNominationId;
    
    if (finalNominationId) {
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
    }
  }, [objectId, transactionId]);

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

  if (!nominationId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
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
        ) : (
          <PaymentVerification
            nominationId={nominationId}
            onSuccess={handleVerificationSuccess}
            onError={handleVerificationError}
          />
        )}
      </div>
    </div>
  );
};

export default NominationSuccess;
