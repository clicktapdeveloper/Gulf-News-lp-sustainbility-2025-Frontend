import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '@/screens/CustomButton';

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-orange-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges have been made to your account.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
          <p className="text-sm text-gray-600 mb-2">
            If you encountered any issues during payment, please contact our support team.
          </p>
          <div className="text-sm text-gray-600">
            <p>📧 support@yourevent.com</p>
            <p>📞 +971 50 123 4567</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <CustomButton onClick={handleGoBack} className="px-6 py-2">
            Try Again
          </CustomButton>
          <CustomButton onClick={handleGoHome} className="px-6 py-2 bg-gray-600 hover:bg-gray-700">
            Go Home
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
