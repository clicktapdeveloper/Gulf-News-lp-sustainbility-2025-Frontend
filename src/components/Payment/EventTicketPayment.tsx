import React, { useState } from 'react';
import CyberSourcePayment from './CyberSourcePayment';
import CustomButton from '@/screens/CustomButton';

interface EventTicketPaymentProps {
  attendees: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    position?: string;
    industry?: string;
    interests?: string[];
    dietaryRequirements?: string;
  }>;
  ticketPrice: number;
  eventName?: string;
  eventDate?: string;
  eventLocation?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const EventTicketPayment: React.FC<EventTicketPaymentProps> = ({ 
  attendees,
  ticketPrice,
  eventName = 'Sustainability Excellence Awards 2025',
  eventDate = 'December 15, 2025',
  eventLocation = 'Grand Convention Center, Dubai',
  onSuccess, 
  onError 
}) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePaymentSuccess = (paymentId?: string) => {
    console.log('Payment successful:', paymentId);
    onSuccess?.();
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    onError?.(error);
  };

  const handleInitiatePayment = () => {
    setShowPaymentForm(true);
  };

  const totalAmount = ticketPrice * attendees.length;
  const primaryEmail = attendees[0]?.email || '';

  if (showPaymentForm) {
    return (
      <div className="max-w-md mx-auto">
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Payment Summary</h3>
          <p className="text-sm text-gray-600">{attendees.length} ticket(s) × AED {ticketPrice} = AED {totalAmount}</p>
          <p className="text-sm text-gray-600">{eventName}</p>
          <p className="text-sm text-gray-600">{eventDate} • {eventLocation}</p>
        </div>
        <CyberSourcePayment
          amount={totalAmount}
          currency="aed"
          referenceId={`event-ticket-${Date.now()}`}
          customerEmail={primaryEmail}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
        <div className="mt-4 text-center">
          <CustomButton 
            type="button"
            variant="outline"
            onClick={() => setShowPaymentForm(false)}
            className="text-sm"
          >
            Back to Registration
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <CustomButton 
        type="button"
        onClick={handleInitiatePayment}
        className="min-w-40 px-6 py-2"
      >
        Pay AED {totalAmount} for {attendees.length} Ticket{attendees.length > 1 ? 's' : ''}
      </CustomButton>
    </div>
  );
};

export default EventTicketPayment;
