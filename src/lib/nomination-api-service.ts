// Nomination API Service
// This service handles API calls for nomination form submission and payment status updates

import { ENV_CONFIG } from '../config/env';

export interface NominationFormData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  designation: string;
  phone: string;
  category?: string | null;
  tradeLicense?: string | null;
  supportingDocument?: string | null;
  message?: string | null;
}

export interface NominationSubmissionResponse {
  success: boolean;
  objectId?: string;
  error?: string;
}

export interface PaymentUpdateResponse {
  success: boolean;
  error?: string;
}

class NominationAPIService {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || ENV_CONFIG.API_BASE_URL;
  }

  /**
   * Submit nomination form data to backend
   * @param formData - Form data to submit
   * @returns Promise<NominationSubmissionResponse> - Response with ObjectId
   */
  async submitNominationForm(formData: NominationFormData): Promise<NominationSubmissionResponse> {
    try {
      console.log('=== SUBMITTING NOMINATION FORM TO BACKEND ===');
      console.log('Base URL:', this.baseURL);
      console.log('Form Data:', formData);

      const response = await fetch(`${this.baseURL}/api/nominations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('API Response status:', response.status);

      const bodyText = await response.text();
      console.log('API Response body text:', bodyText);
      
      let result: any = {};
      try {
        result = bodyText ? JSON.parse(bodyText) : {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid JSON response from server: ${bodyText.substring(0, 100)}...`);
      }
      
      console.log('Parsed result:', result);

      if (!response.ok) {
        const message = result?.error || result?.message || `HTTP ${response.status}`;
        console.error('API Error:', message);
        throw new Error(message);
      }

      console.log('Nomination form submitted successfully:', result);
      console.log('=== FORM SUBMISSION COMPLETE ===');
      
      return {
        success: true,
        objectId: result._id || result.id || result.objectId
      };

    } catch (error) {
      console.error('Error submitting nomination form:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit nomination form'
      };
    }
  }

  /**
   * Update nomination payment status to 'paid'
   * @param objectId - The ObjectId of the nomination
   * @param paymentData - Payment information
   * @returns Promise<PaymentUpdateResponse> - Update result
   */
  async updateNominationPayment(
    objectId: string,
    paymentData: {
      paymentAmount: number;
      paymentCurrency: string;
      paymentDate: string;
      paymentReference: string;
      paymentStatus: string;
      paymentMethod?: string;
      cybersourceTransactionId?: string;
      authCode?: string;
      authTime?: string;
      cardType?: string;
    }
  ): Promise<PaymentUpdateResponse> {
    try {
      console.log('=== UPDATING NOMINATION PAYMENT STATUS ===');
      console.log('ObjectId:', objectId);
      console.log('Payment Data:', paymentData);

      const updateData = {
        status: 'paid',
        paymentAmount: paymentData.paymentAmount,
        paymentCurrency: paymentData.paymentCurrency,
        paymentDate: paymentData.paymentDate,
        paymentReference: paymentData.paymentReference,
        paymentStatus: paymentData.paymentStatus,
        paymentMethod: paymentData.paymentMethod || 'cybersource_hosted',
        cybersourceTransactionId: paymentData.cybersourceTransactionId,
        authCode: paymentData.authCode,
        authTime: paymentData.authTime,
        cardType: paymentData.cardType,
        paidAt: new Date().toISOString()
      };

      console.log('Prepared update data:', updateData);

      const response = await fetch(`${this.baseURL}/api/nominations/${objectId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      console.log('API Response status:', response.status);

      const bodyText = await response.text();
      console.log('API Response body text:', bodyText);
      
      let result: any = {};
      try {
        result = bodyText ? JSON.parse(bodyText) : {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid JSON response from server: ${bodyText.substring(0, 100)}...`);
      }
      
      console.log('Parsed result:', result);

      if (!response.ok) {
        const message = result?.error || result?.message || `HTTP ${response.status}`;
        console.error('API Error:', message);
        throw new Error(message);
      }

      console.log('Nomination payment updated successfully:', result);
      console.log('=== PAYMENT UPDATE COMPLETE ===');
      
      return {
        success: true
      };

    } catch (error) {
      console.error('Error updating nomination payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update nomination payment'
      };
    }
  }
}

// Export the service instance
export const nominationAPIService = new NominationAPIService();
export default NominationAPIService;
