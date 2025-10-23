import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPayment } from '@/lib/stripe';
import CustomButton from '@/screens/CustomButton';
import NominationSuccessComponent from '@/components/NominationSuccessComponent';
import RegisterSuccessComponent from '@/components/RegisterSuccessComponent';
import InquireSuccessComponent from '@/components/InquireSuccessComponent';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [verificationData, setVerificationData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setVerificationStatus('error');
      setError('No session ID found');
      return;
    }

    const verifyPaymentSession = async () => {
      try {
        const result = await verifyPayment(sessionId);
        setVerificationData(result);
        setVerificationStatus('success');
      } catch (err) {
        console.error('Payment verification failed:', err);
        setVerificationStatus('error');
        setError(err instanceof Error ? err.message : 'Payment verification failed');
      }
    };

    verifyPaymentSession();
  }, [searchParams]);

  const handleGoHome = () => {
    navigate('/');
  };

  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we verify your payment.</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <CustomButton onClick={handleGoHome} className="px-6 py-2">
            Go Home
          </CustomButton>
        </div>
      </div>
    );
  }

  const isNomination = verificationData?.nomination;
  const isEventTicket = verificationData?.booking;
  const isInquire = verificationData?.inquire;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div 
      className="w-full rounded-lg p-8">
        {isNomination && <NominationSuccessComponent />}
        {isEventTicket && <RegisterSuccessComponent />}
        {isInquire && <InquireSuccessComponent />}
      </div>
    </div>
  );
};

export default PaymentSuccess;
