// CyberSource Hosted Checkout Service
// This service handles the Hosted Checkout integration with CyberSource

import { ENV_CONFIG } from '../config/env';

export interface PaymentRequest {
  amount: string;
  currency: string;
  customerEmail: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerAddress?: string;
  customerCity?: string;
  customerCountry?: string;
  referenceNumber?: string;
}

export interface CyberSourceParams {
  access_key: string;
  profile_id: string;
  transaction_uuid: string;
  signed_field_names: string;
  unsigned_field_names: string;
  signed_date_time: string;
  locale: string;
  transaction_type: string;
  reference_number: string;
  amount: string;
  currency: string;
  bill_to_email: string;
  bill_to_forename: string;
  bill_to_surname: string;
  bill_to_address_line1: string;
  bill_to_address_city: string;
  bill_to_address_country: string;
  signature: string;
}

export interface PaymentParamsResponse {
  params: CyberSourceParams;
  cybersourceUrl: string;
}

export interface CyberSourceResponse {
  transaction_id?: string;
  decision?: string;
  reason_code?: string;
  message?: string;
  auth_code?: string;
  auth_amount?: string;
  auth_time?: string;
  signature?: string;
  signed_field_names?: string;
  [key: string]: any;
}

export class CyberSourceHostedCheckoutService {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || `${ENV_CONFIG.API_BASE_URL}/api/payments/cybersource-hosted`;
  }

  /**
   * Get CyberSource Hosted Checkout URL based on environment
   */
  getCyberSourceUrl(): string {
    return ENV_CONFIG.CYBERSOURCE_ENVIRONMENT === 'production'
      ? 'https://secureacceptance.cybersource.com/pay'
      : 'https://testsecureacceptance.cybersource.com/pay';
  }

  /**
   * Create payment parameters for Hosted Checkout
   * @param request - Payment request data
   * @returns Promise<PaymentParamsResponse> Signed payment parameters and CyberSource URL
   */
  async createPaymentParams(request: PaymentRequest): Promise<PaymentParamsResponse> {
    try {
      console.log('Creating payment parameters for Hosted Checkout');
      console.log('Request data:', request);

      const response = await fetch(`${this.baseURL}/create-payment-params`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(request)
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

      const bodyText = await response.text();
      console.log('API Response body text:', bodyText);
      
      // Check if response is HTML (404 error page)
      if (bodyText.includes('<!DOCTYPE html>') || bodyText.includes('<html') || bodyText.includes('<pre>')) {
        const errorMessage = `Backend endpoint not found (${response.status}). Please ensure the backend server is running and the endpoint '/api/payments/cybersource-hosted/create-payment-params' is implemented.`;
        console.error('Backend endpoint error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      let result: any = {};
      try {
        result = bodyText ? JSON.parse(bodyText) : {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid JSON response from server: ${bodyText.substring(0, 100)}...`);
      }
      
      console.log('Parsed result:', result);

      if (!response.ok) {
        const message = result?.error || result?.details?.message || `HTTP ${response.status}`;
        console.error('API Error:', message);
        throw new Error(message);
      }

      if (result.success && (result.params || result.paymentParams)) {
        console.log('Payment parameters created successfully');
        return {
          params: result.params || result.paymentParams,
          cybersourceUrl: result.cybersourceUrl || this.getCyberSourceUrl()
        };
      } else {
        console.error('Failed to create payment parameters. Result:', result);
        const errorMessage = result?.error || 'Failed to create payment parameters';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating payment parameters:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify CyberSource response signature
   * @param responseData - Response data from CyberSource
   * @returns Promise<boolean> Whether signature is valid
   */
  async verifyResponse(responseData: CyberSourceResponse): Promise<boolean> {
    try {
      console.log('Verifying CyberSource response signature');
      console.log('Response data:', responseData);

      const response = await fetch(`${this.baseURL}/verify-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(responseData)
      });

      const bodyText = await response.text();
      
      // Check if response is HTML (404 error page)
      if (bodyText.includes('<!DOCTYPE html>') || bodyText.includes('<html')) {
        const errorMessage = `Backend endpoint not found (${response.status}). Please ensure the backend server is running and the endpoint '/api/payments/cybersource-hosted/verify-response' is implemented.`;
        console.error('Backend endpoint error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      let result: any = {};
      try {
        result = bodyText ? JSON.parse(bodyText) : {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid JSON response from server: ${bodyText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        const message = result?.error || result?.details?.message || `HTTP ${response.status}`;
        console.error('API Error:', message);
        throw new Error(message);
      }

      if (result.success !== undefined) {
        console.log('Signature verification result:', result.success);
        return result.success;
      } else {
        console.error('Failed to verify signature:', result.error);
        throw new Error(result.error || 'Failed to verify signature');
      }
    } catch (error) {
      console.error('Error verifying response:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Process successful payment
   * @param responseData - Response data from CyberSource
   * @returns Promise<any> Processing result
   */
  async processSuccessfulPayment(responseData: CyberSourceResponse): Promise<any> {
    try {
      console.log('Processing successful payment');
      console.log('Response data:', responseData);

      const response = await fetch(`${this.baseURL}/process-success`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(responseData)
      });

      const bodyText = await response.text();
      
      // Check if response is HTML (404 error page)
      if (bodyText.includes('<!DOCTYPE html>') || bodyText.includes('<html')) {
        const errorMessage = `Backend endpoint not found (${response.status}). Please ensure the backend server is running and the endpoint '/api/payments/cybersource-hosted/process-success' is implemented.`;
        console.error('Backend endpoint error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      let result: any = {};
      try {
        result = bodyText ? JSON.parse(bodyText) : {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid JSON response from server: ${bodyText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        const message = result?.error || result?.details?.message || `HTTP ${response.status}`;
        console.error('API Error:', message);
        throw new Error(message);
      }

      console.log('Payment processing result:', result);
      return result;
    } catch (error) {
      console.error('Error processing successful payment:', error);
      throw this.handleError(error);
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
   * Parse URL parameters from CyberSource response
   * @param url - URL with parameters
   * @returns CyberSourceResponse Parsed response data
   */
  static parseResponseFromUrl(url: string): CyberSourceResponse {
    const urlObj = new URL(url);
    const params: CyberSourceResponse = {};
    
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  }

  /**
   * Check if payment was successful based on CyberSource response
   * @param response - CyberSource response
   * @returns boolean Whether payment was successful
   */
  static isPaymentSuccessful(response: CyberSourceResponse): boolean {
    return response.decision === 'ACCEPT' && response.reason_code === '100';
  }

  /**
   * Get payment status message
   * @param response - CyberSource response
   * @returns string Status message
   */
  static getPaymentStatusMessage(response: CyberSourceResponse): string {
    if (this.isPaymentSuccessful(response)) {
      return 'Payment completed successfully';
    }
    
    switch (response.decision) {
      case 'DECLINE':
        return `Payment declined: ${response.message || 'Card declined'}`;
      case 'ERROR':
        return `Payment error: ${response.message || 'Unknown error'}`;
      case 'CANCEL':
        return 'Payment was cancelled';
      default:
        return `Payment status: ${response.decision || 'Unknown'}`;
    }
  }
}

// Export the service instance
export const cyberSourceHostedCheckoutService = new CyberSourceHostedCheckoutService();
export default CyberSourceHostedCheckoutService;
