import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CustomButton from '@/screens/CustomButton';

const NominationError: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reason = searchParams.get('reason');
  const message = searchParams.get('message');

  const handleTryAgain = () => {
    navigate('/apply-for-nomination');
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mb-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        
        <p className="text-gray-600 mb-4">
          {message || 'There was an issue processing your payment.'}
        </p>
        
        {reason && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
            <p className="text-sm text-red-700">
              <strong>Error Code:</strong> {reason}
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <CustomButton 
            onClick={handleTryAgain}
            className="w-full"
          >
            Try Again
          </CustomButton>
          
          <CustomButton 
            onClick={handleReturnHome}
            variant="outline"
            className="w-full"
          >
            Return to Home
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default NominationError;
