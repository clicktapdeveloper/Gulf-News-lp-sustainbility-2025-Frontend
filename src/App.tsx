import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Event from './components/Event'
import Why from './components/Why'
import Award from './components/Award'
import Winner from './components/Winner'
import SponsorBy from './components/SponsorBy'
import BecomeEventSponsor from './components/BecomeEventSponsor'
import Footer from './components/Footer'
import ApplyForNominationPage from './apply-for-nomination/page'
import InquireAboutSponsorshipPage from './inquire-about-sponsorship/page'
import RegisterForAttendPage from './register-for-attend/page'
import PaymentSuccess from './success/page'
import PaymentCancel from './cancel/page'
import ThankYouPage from './thankyou/page'
import CyberSourceReturnPage from './cybersource-return/page'
import CyberSourceHostedCheckoutDemo from './cybersource-hosted-demo/page'
import CyberSourceHostedDataDemo from './cybersource-hosted-data-demo/page'
import NominationSuccess from './nomination-success/page'
import NominationError from './nomination-error/page'
import NominationCancelled from './nomination-cancelled/page'
import FormStorageDemo from './form-storage-demo/page'
import { useEffect } from 'react';
import NominationsFromBackendPage from './nominations-from-backend/page'
import AttendeeRegistrationsFromBackendPage from './attendee_registrations-from-backend/page'
import SponsorshipRequestsFromBackendPage from './sponsorship_requests-from-backend/page'

export default function App() {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      const target = '/the-sustainability-excellence-awards-2025' + (location.hash || '');
      navigate(target, { replace: true });
    }
  }, [location.pathname, location.hash, navigate]);

  // Scroll to top when pathname changes (without hash navigation)
  useEffect(() => {
    // Only scroll to top if there's no hash (hash navigation is handled separately)
    if (!location.hash) {
      window.scrollTo({
        top: 0,
        behavior: 'instant' // Instant scroll for route changes
      });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const scrollOffset = 100; // Offset in pixels to stop before the section
      // wait for the section to mount and page to render before scrolling
      const timeout = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = window.pageYOffset + elementPosition - scrollOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100); // Small delay to ensure page has rendered
      return () => clearTimeout(timeout);
    }
  }, [location.pathname, location.hash]);

  return (
    <div 
    className="w-full min-h-screen bg-[var(--background-color)]"
    >
      <div className='sticky top-0 z-50 px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding'>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <Event />
            <Why />
            <Award />
            <Winner />
            <SponsorBy />
            <BecomeEventSponsor />
          </>
        } />
        <Route path="/the-sustainability-excellence-awards-2025" element={
          <>
            <Hero />
            <Event />
            <Why />
            <Award />
            <Winner />
            <SponsorBy />
            <BecomeEventSponsor />
          </>
        } />
        <Route path="/apply-for-nomination" element={<ApplyForNominationPage />} />
        <Route path="/inquire-about-sponsorship" element={<InquireAboutSponsorshipPage />} />
        <Route path="/register-for-attend" element={<RegisterForAttendPage />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<PaymentCancel />} />
        <Route path="/thankyou" element={<ThankYouPage />} />
        <Route path="/cybersource-return" element={<CyberSourceReturnPage />} />
        <Route path="/cybersource-hosted-demo" element={<CyberSourceHostedCheckoutDemo />} />
        <Route path="/cybersource-hosted-data-demo" element={<CyberSourceHostedDataDemo />} />
        <Route path="/nomination/success" element={<NominationSuccess />} />
        <Route path="/nomination/error" element={<NominationError />} />
        <Route path="/nomination/cancelled" element={<NominationCancelled />} />
        <Route path="/form-storage-demo" element={<FormStorageDemo />} />
        <Route path="/nominations-from-backend" element={<NominationsFromBackendPage />} />
        <Route path="/attendee_registrations-from-backend" element={<AttendeeRegistrationsFromBackendPage />} />
        <Route path="/sponsorship_requests-from-backend" element={<SponsorshipRequestsFromBackendPage />} />
      </Routes>
      <Footer />
    </div>
  )
}


