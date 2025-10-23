// CyberSource Payment Service Implementation
// This service provides direct HTTP API integration with CyberSource payment gateway

import { ENV_CONFIG } from '../config/env';

export interface PaymentData {
  amount: string;
  currency: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface CardData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  tokenId?: string;
  status?: string;
  error?: string;
  details?: any;
  response?: any;
}

export interface TokenResponse {
  success: boolean;
  tokenId?: string;
  status?: string;
  error?: string;
  response?: any;
}

export interface SignatureTestResponse {
  success: boolean;
  signature?: string;
  error?: string;
}

export class CyberSourcePaymentService {
  private baseURL: string;

  constructor(baseURL?: string) {
    // Use the backend API URL from environment configuration
    this.baseURL = baseURL || `${ENV_CONFIG.API_BASE_URL}/api/payments/cybersource`;
  }

  /**
   * Process a payment with card details
   * @param paymentData - Payment information
   * @returns Promise<PaymentResponse> Payment result
   */
  async processPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      console.log('CyberSource Payment Service - Starting payment processing');
      console.log('Base URL:', this.baseURL);
      
      // Validate input data
      this.validatePaymentData(paymentData);

      // Normalize payload to expected backend format
      const normalizedPayload = {
        amount: Number.parseFloat(paymentData.amount).toFixed(2),
        currency: (paymentData.currency || 'AED').toUpperCase(),
        cardNumber: paymentData.cardNumber.replace(/\s+/g, ''),
        expiryMonth: paymentData.expiryMonth.padStart(2, '0'),
        expiryYear: paymentData.expiryYear,
        cvv: String(paymentData.cvv).trim(),
      };

      console.log('Normalized payload:', normalizedPayload);
      console.log('Making API call to:', `${this.baseURL}/process`);

      const response = await fetch(`${this.baseURL}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(normalizedPayload)
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

      // Read body text first to avoid JSON parse failures on empty body
      const bodyText = await response.text();
      console.log('API Response body text:', bodyText);
      
      const result = bodyText ? JSON.parse(bodyText) : {};
      console.log('Parsed result:', result);

      if (!response.ok) {
        const message = result?.error || result?.details?.message || `HTTP ${response.status}`;
        console.error('API Error:', message);
        throw new Error(message);
      }
      
      console.log('Payment response:', result);
      
      if (result.success) {
        // Check the actual payment status
        const paymentStatus = result.status || result.response?.status;
        const processorResponse = result.response?.processorInformation?.responseMessage;
        
        if (paymentStatus === 'AUTHORIZED' || paymentStatus === 'CAPTURED') {
          console.log('Payment successful:', result.paymentId);
          return result;
        } else if (paymentStatus === 'DECLINED') {
          console.log('Payment declined:', processorResponse);
          return {
            ...result,
            success: false,
            error: `Payment declined: ${processorResponse || 'Card declined'}`
          };
        } else {
          console.log('Payment failed:', processorResponse);
          return {
            ...result,
            success: false,
            error: `Payment failed: ${processorResponse || 'Unknown error'}`
          };
        }
      } else {
        console.error('Payment failed:', result.error);
        return result;
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a payment token
   * @param cardData - Card information
   * @returns Promise<string> Token ID
   */
  async createToken(cardData: CardData): Promise<string> {
    try {
      this.validateCardData(cardData);

      const normalizedPayload = {
        cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
        expiryMonth: cardData.expiryMonth.padStart(2, '0'),
        expiryYear: cardData.expiryYear,
        cvv: String(cardData.cvv).trim(),
      };

      const response = await fetch(`${this.baseURL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(normalizedPayload)
      });

      const bodyText = await response.text();
      const result = bodyText ? JSON.parse(bodyText) : {};

      if (!response.ok) {
        const message = result?.error || result?.details?.message || `HTTP ${response.status}`;
        throw new Error(message);
      }
      
      if (result.success) {
        console.log('Token created:', result.tokenId);
        return result.tokenId;
      } else {
        console.error('Token creation failed:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Token creation error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Process payment using legacy charge endpoint with transient token
   * @param chargeData - Charge information
   * @returns Promise<PaymentResponse> Payment result
   */
  async chargePayment(chargeData: {
    amount: string;
    currency: string;
    transientToken: string;
    referenceId?: string;
    customerEmail?: string;
  }): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseURL}/charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chargeData)
      });

      const bodyText = await response.text();
      const result = bodyText ? JSON.parse(bodyText) : {};

      if (!response.ok) {
        const message = result?.error || result?.details?.message || `HTTP ${response.status}`;
        throw new Error(message);
      }
      
      if (result.success) {
        console.log('Charge successful:', result.paymentId);
        return result;
      } else {
        console.error('Charge failed:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Charge processing error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Test signature generation (for debugging)
   * @returns Promise<SignatureTestResponse> Signature test result
   */
  async testSignature(): Promise<SignatureTestResponse> {
    try {
      const response = await fetch(`${this.baseURL}/signature-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      const bodyText = await response.text();
      const result = bodyText ? JSON.parse(bodyText) : {};

      if (!response.ok) {
        const message = result?.error || result?.details?.message || `HTTP ${response.status}`;
        throw new Error(message);
      }

      return result;
    } catch (error) {
      console.error('Signature test error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Validate payment data
   * @param data - Payment data
   * @throws Error If validation fails
   */
  private validatePaymentData(data: PaymentData): void {
    const errors: string[] = [];
    
    if (!data.amount || parseFloat(data.amount) <= 0) {
      errors.push('Invalid amount');
    }
    
    if (!data.cardNumber || !/^\d{13,19}$/.test(data.cardNumber.replace(/\s/g, ''))) {
      errors.push('Invalid card number');
    }
    
    if (!data.expiryMonth || !data.expiryYear) {
      errors.push('Invalid expiry date');
    }
    
    if (!data.cvv || !/^\d{3,4}$/.test(data.cvv)) {
      errors.push('Invalid CVV');
    }
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Validate card data for token creation
   * @param data - Card data
   * @throws Error If validation fails
   */
  private validateCardData(data: CardData): void {
    const errors: string[] = [];
    
    if (!data.cardNumber || !/^\d{13,19}$/.test(data.cardNumber.replace(/\s/g, ''))) {
      errors.push('Invalid card number');
    }
    
    if (!data.expiryMonth || !data.expiryYear) {
      errors.push('Invalid expiry date');
    }
    
    if (!data.cvv || !/^\d{3,4}$/.test(data.cvv)) {
      errors.push('Invalid CVV');
    }
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Handle and format errors
   * @param error - Original error
   * @returns Error Formatted error
   */
  private handleError(error: any): Error {
    if (error.message && error.message.includes('fetch failed')) {
      return new Error('Network error: Unable to connect to payment service');
    }
    
    if (error.message && error.message.includes('SSL')) {
      return new Error('Security error: SSL connection failed');
    }
    
    return error;
  }

  /**
   * Get test card numbers for testing
   */
  static getTestCards() {
    return {
      visa: {
        number: '4111111111111111',
        cvv: '123',
        expiryMonth: '12',
        expiryYear: '2025'
      },
      mastercard: {
        number: '5555555555554444',
        cvv: '123',
        expiryMonth: '12',
        expiryYear: '2025'
      },
      amex: {
        number: '378282246310005',
        cvv: '1234',
        expiryMonth: '12',
        expiryYear: '2025'
      },
      declined: {
        number: '4000000000000002',
        cvv: '123',
        expiryMonth: '12',
        expiryYear: '2025'
      }
    };
  }
}

// Export the service instance with proper backend URL
export const cyberSourcePaymentService = new CyberSourcePaymentService();
export default CyberSourcePaymentService;
