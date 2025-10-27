// Transaction Service
// This service handles transaction verification and payment status updates

import { ENV_CONFIG } from '../config/env';

export interface TransactionDetails {
  _id: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  paymentAmount: number;
  paymentCurrency: string;
  paymentMethod: string;
  paymentReference: string;
  paymentStatus: string;
  cybersourceTransactionId: string;
  authCode: string;
  authTime: string;
  cardType: string;
  submittedAt: string;
  status: 'submitted' | 'paid';
  nominationData: any;
}

export interface TransactionResponse {
  success: boolean;
  transaction?: TransactionDetails;
  nomination?: any;
  error?: string;
}

export interface PaymentStatusUpdateRequest {
  transactionId: string;
  email: string;
}

class TransactionService {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || ENV_CONFIG.API_BASE_URL;
  }

  /**
   * Get transaction details by nomination ObjectId
   * @param nominationId - The ObjectId of the nomination
   * @returns Promise<TransactionResponse> Transaction details
   */
  async getTransactionDetails(nominationId: string, transactionId: string): Promise<TransactionResponse> {
    try {
      console.log('=== GETTING TRANSACTION DETAILS ===');
      console.log('Nomination ID:', nominationId);
      console.log('Base URL:', this.baseURL);

      const response = await fetch(`${this.baseURL}/api/nominations/${nominationId}/transaction/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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

      console.log('Transaction details retrieved successfully:', result);
      console.log('=== TRANSACTION DETAILS RETRIEVAL COMPLETE ===');
      
      return {
        success: true,
        transaction: result.transaction || result,
        nomination: result.nomination
      };

    } catch (error) {
      console.error('Error getting transaction details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get transaction details'
      };
    }
  }

  /**
   * Find nomination by transaction ID
   * @param transactionId - The transaction ID from CyberSource
   * @returns Promise<TransactionResponse> Nomination details
   */
  async findNominationByTransactionId(transactionId: string): Promise<TransactionResponse> {
    try {
      console.log('=== FINDING NOMINATION BY TRANSACTION ID ===');
      console.log('Transaction ID:', transactionId);
      console.log('Base URL:', this.baseURL);

      const response = await fetch(`${this.baseURL}/api/nominations/by-transaction/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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

      console.log('Nomination found by transaction ID:', result);
      console.log('=== NOMINATION SEARCH COMPLETE ===');
      
      return {
        success: true,
        transaction: result.transaction || result,
        nomination: result.nomination
      };

    } catch (error) {
      console.error('Error finding nomination by transaction ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to find nomination by transaction ID'
      };
    }
  }

  /**
   * Update payment status with verification
   * @param nominationId - The ObjectId of the nomination
   * @param transactionId - The transaction ID from CyberSource
   * @param email - Customer email for verification
   * @returns Promise<TransactionResponse> Update result
   */
  async updatePaymentStatus(
    nominationId: string, 
    transactionId: string, 
    email: string
  ): Promise<TransactionResponse> {
    try {
      console.log('=== UPDATING PAYMENT STATUS ===');
      console.log('Nomination ID:', nominationId);
      console.log('Transaction ID:', transactionId);
      console.log('Email:', email);

      const updateData: PaymentStatusUpdateRequest = {
        transactionId,
        email
      };

      console.log('Update data:', updateData);

      const response = await fetch(`${this.baseURL}/api/nominations/${nominationId}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
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

      console.log('Payment status updated successfully:', result);
      console.log('=== PAYMENT STATUS UPDATE COMPLETE ===');
      
      return {
        success: true,
        transaction: result.transaction,
        nomination: result.nomination
      };

    } catch (error) {
      console.error('Error updating payment status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update payment status'
      };
    }
  }

  /**
   * Validate ObjectId format
   * @param id - ObjectId to validate
   * @returns boolean Whether the ObjectId is valid
   */
  static isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  /**
   * Clear all sensitive data from localStorage
   */
  static clearSensitiveData(): void {
    const sensitiveKeys = [
      'nominationId',
      'nominationEmail', 
      'transactionId',
      'paymentAmount',
      'paymentCurrency',
      'nominationData',
      'cardDetails',
      'billingInfo',
      'gulfnews_nomination_data' // Our existing nomination data key
    ];
    
    sensitiveKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    console.log('Sensitive data cleared from localStorage and sessionStorage');
  }

  /**
   * Sanitize data before storing
   * @param data - Data to sanitize
   * @returns any Sanitized data
   */
  static sanitizeForStorage(data: any): any {
    const sanitized = { ...data };
    
    // Remove sensitive fields
    delete sanitized.cardNumber;
    delete sanitized.cvv;
    delete sanitized.password;
    delete sanitized.securityCode;
    
    return sanitized;
  }
}

// Export the service instance and class
export const transactionService = new TransactionService();
export { TransactionService };
export default TransactionService;
