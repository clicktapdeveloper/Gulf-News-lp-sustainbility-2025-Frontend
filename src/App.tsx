import { Routes, Route } from 'react-router-dom'
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

export default function App() {

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
        <Route path="/apply-for-nomination" element={<ApplyForNominationPage />} />
        <Route path="/inquire-about-sponsorship" element={<InquireAboutSponsorshipPage />} />
        <Route path="/register-for-attend" element={<RegisterForAttendPage />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<PaymentCancel />} />
        <Route path="/thankyou" element={<ThankYouPage />} />
        <Route path="/cybersource-return" element={<CyberSourceReturnPage />} />
        <Route path="/cybersource-hosted-demo" element={<CyberSourceHostedCheckoutDemo />} />
      </Routes>
      <Footer />
    </div>
  )
}


