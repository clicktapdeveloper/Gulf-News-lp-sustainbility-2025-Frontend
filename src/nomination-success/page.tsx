import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CustomButton from '@/screens/CustomButton';

const NominationSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get('transaction_id');
  const objectId = searchParams.get('object_id');

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleSubmitAnother = () => {
    navigate('/apply-for-nomination');
  };

  return (
    <div className="flex flex-col items-center justify-center pt-12 sm:pt-0 py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding relative space-y-[var(--space-y)]">
      <div>
        <img src="/AFNThankYou.webp" alt="ThankYou" className="w-auto h-auto max-w-md lg:max-w-lg xl:max-w-xl" />
      </div>
      <div className="z-10 w-full max-w-6xl mx-auto text-center space-y-[var(--space-y)]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold">
          <p className="text-[var(--tertiary-color)]">Thank You for Your</p>
          <p className="text-[var(--secondary-color)]">Nomination Submission</p>
        </h1>
        <p className="text-gray-600 text-center text-lg">
          Your nomination for the Sustainability Excellence Awards 2025 has been submitted successfully. We will review your application and get back to you soon.
        </p>

        {/* Transaction ID and Object ID Display */}
        {(transactionId || objectId) && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 max-w-md mx-auto">
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <CustomButton 
            onClick={handleReturnHome}
            className="px-6 py-2"
          >
            Okay
          </CustomButton>
          
          <CustomButton 
            onClick={handleSubmitAnother}
            variant="outline"
            className="px-6 py-2"
          >
            Submit Another Nomination
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default NominationSuccess;
