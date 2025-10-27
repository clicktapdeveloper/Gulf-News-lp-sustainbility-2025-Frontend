import React, { useEffect } from 'react';
import CustomButton from '@/screens/CustomButton';
import { useNavigate, useSearchParams } from 'react-router-dom';

const NominationSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction_id');
  const objectId = searchParams.get('object_id');
  
  console.log('NominationSuccess component rendered');
  console.log('Full URL:', window.location.href);
  console.log('searchParams:', searchParams.toString());
  console.log('transactionId:', transactionId);
  console.log('objectId:', objectId);
  
  const handleGoHome = () => {
    navigate('/');
  };

  useEffect(() => {
    console.log('=== NOMINATION SUCCESS USE EFFECT TRIGGERED ===');
    console.log('transactionId:', transactionId);
    console.log('objectId:', objectId);
  }, [transactionId, objectId]);

  return (
    <div className="flex flex-col items-center justify-center pt-12 sm:pt-0 py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding relative space-y-[var(--space-y)]">
      <div>
        <img src="/AFNThankYou.webp" alt="ThankYou" className="w-auto h-auto max-w-md lg:max-w-lg xl:max-w-xl" />
      </div>
      <div className="z-10 w-full max-w-6xl mx-auto text-center space-y-[var(--space-y)]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold">
          <p className="text-[var(--tertiary-color)]">Thank You for Your</p>
          <p className="text-[var(--secondary-color)]">Nomination Submission {transactionId ? transactionId : objectId ? objectId : 'Testing...'}</p>
        </h1>
        <p className="text-gray-600 text-center text-lg">
          Your nomination for the Sustainability Excellence Awards 2025 has been submitted successfully. We will review your application and get back to you soon.
        </p>
        <div className="flex justify-center">
          <CustomButton onClick={handleGoHome} className="px-6 py-2">
            Okay
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default NominationSuccess;
