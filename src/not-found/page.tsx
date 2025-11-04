import { useNavigate } from 'react-router-dom';
import CustomButton from '@/screens/CustomButton';
import { Home, ArrowLeft, Award } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/the-sustainability-excellence-awards-2025');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--card-color)] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--primary-color)] rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[var(--secondary-color)] rounded-full opacity-10 blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="z-10 w-full max-w-4xl mx-auto text-center space-y-8">
        {/* Large 404 Display */}
        <div className="relative">
          <h1 className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[15rem] font-bold leading-none">
            <span className="text-[var(--secondary-color)]">4</span>
            <span className="text-[var(--card-color)]">0</span>
            <span className="text-[var(--secondary-color)]">4</span>
          </h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Award className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-[var(--secondary-color)] opacity-30 animate-spin-slow" style={{ animationDuration: '10s' }} />
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-[var(--tertiary-color)]">Oops! Page Not Found</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            The page you're looking for seems to have wandered off into the digital wilderness. 
            Let's get you back on track to the Sustainability Excellence Awards 2025.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <CustomButton 
            onClick={handleGoHome}
            className="px-8 py-4 text-base sm:text-lg flex items-center gap-2 group whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <p>Go to Homepage</p>
            </div>
          </CustomButton>
          <CustomButton 
            onClick={handleGoBack}
            variant="outline"
            className="px-8 py-4 text-base sm:text-lg flex items-center gap-2 group whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <p>Go Back</p>
            </div>
          </CustomButton>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-[var(--border-color)]">
          <p className="text-sm sm:text-base text-gray-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/the-sustainability-excellence-awards-2025#about-event')}
              className="text-[var(--secondary-color)] hover:text-[var(--tertiary-color)] transition-colors text-sm sm:text-base font-medium hover:underline"
            >
              About Event
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/apply-for-nomination')}
              className="text-[var(--secondary-color)] hover:text-[var(--tertiary-color)] transition-colors text-sm sm:text-base font-medium hover:underline"
            >
              Apply for Nomination
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/register-for-attend')}
              className="text-[var(--secondary-color)] hover:text-[var(--tertiary-color)] transition-colors text-sm sm:text-base font-medium hover:underline"
            >
              Register to Attend
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/inquire-about-sponsorship')}
              className="text-[var(--secondary-color)] hover:text-[var(--tertiary-color)] transition-colors text-sm sm:text-base font-medium hover:underline"
            >
              Inquire About Sponsorship
            </button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <div className="w-20 h-20 border-2 border-[var(--card-color)] rounded-full opacity-30 animate-ping"></div>
      </div>
      <div className="absolute top-10 right-10 hidden lg:block">
        <div className="w-16 h-16 border-2 border-[var(--secondary-color)] rounded-full opacity-30 animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default NotFoundPage;

