import React from 'react';
import InquireSuccessComponent from '@/components/InquireSuccessComponent';
import RegisterSuccessComponent from '@/components/RegisterSuccessComponent';
import CustomButton from '@/screens/CustomButton';
import { useNavigate } from 'react-router-dom';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  // Get the current hash from the URL
  const currentHash = window.location.hash;

  // Conditional rendering based on hash
  if (currentHash === '#inquire-about-sponsorship') {
    return <InquireSuccessComponent />;
  }
  
  if (currentHash === '#register-for-attend') {
    return <RegisterSuccessComponent />;
  }

  if (currentHash === '#apply-for-nomination') {
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
          <div className="flex justify-center">
            {/* <button 
              onClick={() => window.location.href = '/'} 
              className="bg-[var(--secondary-color)] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Okay
            </button> */}
            <CustomButton onClick={handleGoHome} className="px-6 py-2">
              Okay
          </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback - you can customize this or redirect
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Thank You</h1>
      <p className="text-gray-600">Your request has been processed successfully.</p>
    </div>
  );
};

export default ThankYouPage;
