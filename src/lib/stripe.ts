import { loadStripe } from '@stripe/stripe-js';
import { ENV_CONFIG } from '@/config/env';

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(ENV_CONFIG.STRIPE_PUBLISHABLE_KEY);

// API base URL - should match your backend server
const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

export interface PaymentData {
  type: 'nomination' | 'event_ticket';
  amount: number;
  currency?: string;
}

export interface NominationPaymentData extends PaymentData {
  type: 'nomination';
  nominationData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    designation?: string;
    category: string;
    description?: string;
    tradeLicense?: string;
    supportingDocument?: string;
  };
}

export interface EventTicketPaymentData extends PaymentData {
  type: 'event_ticket';
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
  totalAmount: number;
  eventName: string;
  eventDate: string;
  eventLocation: string;
}

export async function createCheckoutSession(paymentData: NominationPaymentData | EventTicketPaymentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/checkout_sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function verifyPayment(sessionId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/verify-payment?session_id=${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to verify payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

export async function redirectToCheckout(checkoutUrl: string) {
  if (checkoutUrl) {
    window.location.href = checkoutUrl;
  } else {
    throw new Error('No checkout URL provided');
  }
}
