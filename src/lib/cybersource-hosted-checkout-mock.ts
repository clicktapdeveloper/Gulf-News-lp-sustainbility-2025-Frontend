// Mock CyberSource Hosted Checkout Service for testing
// This service simulates the backend responses when the real backend is not available

import { ENV_CONFIG } from '../config/env';
import type { PaymentRequest, CyberSourceParams, PaymentParamsResponse } from './cybersource-hosted-checkout';

export class MockCyberSourceHostedCheckoutService {
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
   * Create mock payment parameters for testing
   */
  async createPaymentParams(request: PaymentRequest): Promise<PaymentParamsResponse> {
    console.log('Mock service: Creating payment parameters for Hosted Checkout');
    console.log('Request data:', request);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock parameters
    const timestamp = new Date().toISOString().replace(/\.\d{3}/, '');
    const transactionUuid = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const mockParams: CyberSourceParams = {
      access_key: 'mock_access_key',
      profile_id: 'mock_profile_id',
      transaction_uuid: transactionUuid,
      signed_field_names: 'access_key,profile_id,transaction_uuid,unsigned_field_names,signed_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,bill_to_email,bill_to_forename,bill_to_surname,bill_to_address_line1,bill_to_address_city,bill_to_address_country',
      unsigned_field_names: '',
      signed_date_time: timestamp,
      locale: 'en',
      transaction_type: 'sale',
      reference_number: request.referenceNumber || `EVENT-${Date.now()}`,
      amount: request.amount,
      currency: request.currency,
      bill_to_email: request.customerEmail,
      bill_to_forename: request.customerFirstName || 'Test',
      bill_to_surname: request.customerLastName || 'User',
      bill_to_address_line1: request.customerAddress || '123 Main Street',
      bill_to_address_city: request.customerCity || 'Dubai',
      bill_to_address_country: request.customerCountry || 'AE',
      signature: 'mock_signature_for_testing'
    };

    console.log('Mock service: Payment parameters created successfully');
    return {
      params: mockParams,
      cybersourceUrl: this.getCyberSourceUrl()
    };
  }

  /**
   * Mock response verification (always returns true for testing)
   */
  async verifyResponse(responseData: any): Promise<boolean> {
    console.log('Mock service: Verifying CyberSource response signature');
    console.log('Response data:', responseData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Mock service: Signature verification result: true');
    return true;
  }

  /**
   * Mock successful payment processing
   */
  async processSuccessfulPayment(responseData: any): Promise<any> {
    console.log('Mock service: Processing successful payment');
    console.log('Response data:', responseData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = {
      success: true,
      message: 'Payment processed successfully (mock)',
      paymentId: responseData.transaction_id || `mock-payment-${Date.now()}`
    };

    console.log('Mock service: Payment processing result:', result);
    return result;
  }

  /**
   * Parse URL parameters from CyberSource response
   */
  static parseResponseFromUrl(url: string): any {
    const urlObj = new URL(url);
    const params: any = {};
    
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  }

  /**
   * Check if payment was successful based on CyberSource response
   */
  static isPaymentSuccessful(response: any): boolean {
    return response.decision === 'ACCEPT' && response.reason_code === '100';
  }

  /**
   * Get payment status message
   */
  static getPaymentStatusMessage(response: any): string {
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

// Export the mock service instance
export const mockCyberSourceHostedCheckoutService = new MockCyberSourceHostedCheckoutService();
export default MockCyberSourceHostedCheckoutService;
