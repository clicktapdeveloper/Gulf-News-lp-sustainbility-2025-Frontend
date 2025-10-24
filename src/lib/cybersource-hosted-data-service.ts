// CyberSource Hosted Checkout Data Service
// This service handles retrieval of all data using cybersource_hosted payment method

import { formDataStorageService, type DecryptedFormData } from './form-data-storage';

export interface CyberSourceHostedPaymentData {
  // Payment specific data
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  paymentAmount: number;
  paymentCurrency: string;
  paymentMethod: 'cybersource_hosted';
  paymentReference: string;
  paymentStatus: string;
  cybersourceTransactionId: string;
  authCode?: string;
  authTime?: string;
  cardType?: string;
  submittedAt: string;
  status: string;
  
  // Form data (nomination data)
  nominationData?: {
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    designation: string;
    phone: string;
    tradeLicense: string;
    supportingDocument?: string | null;
    message?: string | null;
  };
}

export interface CyberSourceHostedDataResponse {
  success: boolean;
  data?: CyberSourceHostedPaymentData[];
  error?: string;
}

class CyberSourceHostedDataService {
  /**
   * Get all stored form data that uses cybersource_hosted payment method
   * @returns Promise<CyberSourceHostedDataResponse> All cybersource_hosted payment data
   */
  async getAllCyberSourceHostedData(): Promise<CyberSourceHostedDataResponse> {
    try {
      console.log('=== RETRIEVING ALL CYBERSOURCE_HOSTED DATA ===');
      
      // Get all stored form data from localStorage
      const allStoredData = formDataStorageService.getAllStoredData();
      console.log('All stored data:', allStoredData);
      
      // Filter data that uses cybersource_hosted payment method
      const cybersourceHostedData: CyberSourceHostedPaymentData[] = [];
      
      for (const storedData of allStoredData) {
        // Check if this data has cybersource_hosted payment method
        if (this.isCyberSourceHostedPayment(storedData)) {
          const paymentData = this.transformToCyberSourceHostedFormat(storedData);
          cybersourceHostedData.push(paymentData);
        }
      }
      
      console.log('Filtered cybersource_hosted data:', cybersourceHostedData);
      console.log('=== RETRIEVAL COMPLETE ===');
      
      return {
        success: true,
        data: cybersourceHostedData
      };
      
    } catch (error) {
      console.error('Error retrieving cybersource_hosted data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve cybersource_hosted data'
      };
    }
  }

  /**
   * Get cybersource_hosted data by transaction ID
   * @param transactionId - Transaction ID to search for
   * @returns Promise<CyberSourceHostedDataResponse> Specific cybersource_hosted payment data
   */
  async getCyberSourceHostedDataByTransactionId(transactionId: string): Promise<CyberSourceHostedDataResponse> {
    try {
      console.log('=== RETRIEVING CYBERSOURCE_HOSTED DATA BY TRANSACTION ID ===');
      console.log('Transaction ID:', transactionId);
      
      // Get specific form data by transaction ID
      const result = await formDataStorageService.retrieveFormData(transactionId);
      
      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || 'No data found for this transaction'
        };
      }
      
      // Check if this data uses cybersource_hosted payment method
      if (!this.isCyberSourceHostedPayment(result.data)) {
        return {
          success: false,
          error: 'This transaction does not use cybersource_hosted payment method'
        };
      }
      
      const paymentData = this.transformToCyberSourceHostedFormat(result.data);
      
      console.log('Retrieved cybersource_hosted data:', paymentData);
      console.log('=== RETRIEVAL COMPLETE ===');
      
      return {
        success: true,
        data: [paymentData]
      };
      
    } catch (error) {
      console.error('Error retrieving cybersource_hosted data by transaction ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve cybersource_hosted data'
      };
    }
  }

  /**
   * Get cybersource_hosted data by customer email
   * @param customerEmail - Customer email to search for
   * @returns Promise<CyberSourceHostedDataResponse> All cybersource_hosted payment data for this customer
   */
  async getCyberSourceHostedDataByEmail(customerEmail: string): Promise<CyberSourceHostedDataResponse> {
    try {
      console.log('=== RETRIEVING CYBERSOURCE_HOSTED DATA BY EMAIL ===');
      console.log('Customer Email:', customerEmail);
      
      // Get all stored form data
      const allStoredData = formDataStorageService.getAllStoredData();
      
      // Filter data that uses cybersource_hosted payment method and matches email
      const cybersourceHostedData: CyberSourceHostedPaymentData[] = [];
      
      for (const storedData of allStoredData) {
        if (this.isCyberSourceHostedPayment(storedData) && 
            storedData.formData.email?.toLowerCase() === customerEmail.toLowerCase()) {
          const paymentData = this.transformToCyberSourceHostedFormat(storedData);
          cybersourceHostedData.push(paymentData);
        }
      }
      
      console.log('Filtered cybersource_hosted data by email:', cybersourceHostedData);
      console.log('=== RETRIEVAL COMPLETE ===');
      
      return {
        success: true,
        data: cybersourceHostedData
      };
      
    } catch (error) {
      console.error('Error retrieving cybersource_hosted data by email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve cybersource_hosted data'
      };
    }
  }

  /**
   * Check if stored data uses cybersource_hosted payment method
   * @param storedData - Stored form data
   * @returns boolean Whether this data uses cybersource_hosted payment method
   */
  private isCyberSourceHostedPayment(storedData: DecryptedFormData): boolean {
    // Check if payment method is cybersource_hosted
    if (storedData.formData.paymentMethod === 'cybersource_hosted') {
      return true;
    }
    
    // Check if transaction ID format suggests cybersource_hosted (starts with 761)
    if (storedData.formData.paymentReference && storedData.formData.paymentReference.startsWith('761')) {
      return true;
    }
    
    // Check if cybersourceTransactionId exists
    if (storedData.formData.cybersourceTransactionId) {
      return true;
    }
    
    return false;
  }

  /**
   * Transform stored form data to CyberSource Hosted format
   * @param storedData - Stored form data
   * @returns CyberSourceHostedPaymentData Transformed payment data
   */
  private transformToCyberSourceHostedFormat(storedData: DecryptedFormData): CyberSourceHostedPaymentData {
    return {
      // Payment specific data
      customerEmail: storedData.formData.email || '',
      customerFirstName: storedData.formData.firstName || '',
      customerLastName: storedData.formData.lastName || '',
      paymentAmount: parseFloat(storedData.formData.paymentAmount || '0'),
      paymentCurrency: storedData.formData.paymentCurrency || 'AED',
      paymentMethod: 'cybersource_hosted',
      paymentReference: storedData.formData.paymentReference || storedData.transactionId,
      paymentStatus: storedData.formData.paymentStatus || 'completed',
      cybersourceTransactionId: storedData.formData.cybersourceTransactionId || storedData.formData.paymentReference || storedData.transactionId,
      authCode: storedData.formData.authCode,
      authTime: storedData.formData.authTime,
      cardType: storedData.formData.cardType,
      submittedAt: new Date(storedData.timestamp).toISOString(),
      status: storedData.formData.status || 'submitted',
      
      // Form data (nomination data)
      nominationData: {
        firstName: storedData.formData.firstName || '',
        lastName: storedData.formData.lastName || '',
        email: storedData.formData.email || '',
        companyName: storedData.formData.companyName2 || storedData.formData.companyName || '',
        designation: storedData.formData.designation || '',
        phone: storedData.formData.phone || '',
        tradeLicense: storedData.formData.tradeLicense || '',
        supportingDocument: storedData.formData.supportingDocument || null,
        message: storedData.formData.message || null
      }
    };
  }

  /**
   * Get summary statistics for cybersource_hosted payments
   * @returns Promise<any> Summary statistics
   */
  async getCyberSourceHostedSummary(): Promise<any> {
    try {
      const result = await this.getAllCyberSourceHostedData();
      
      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error
        };
      }
      
      const data = result.data;
      const totalPayments = data.length;
      const totalAmount = data.reduce((sum, payment) => sum + payment.paymentAmount, 0);
      const successfulPayments = data.filter(payment => payment.paymentStatus === 'completed').length;
      const uniqueCustomers = new Set(data.map(payment => payment.customerEmail)).size;
      
      return {
        success: true,
        summary: {
          totalPayments,
          totalAmount,
          successfulPayments,
          failedPayments: totalPayments - successfulPayments,
          uniqueCustomers,
          averageAmount: totalPayments > 0 ? totalAmount / totalPayments : 0,
          currency: data.length > 0 ? data[0].paymentCurrency : 'AED'
        }
      };
      
    } catch (error) {
      console.error('Error getting cybersource_hosted summary:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get summary'
      };
    }
  }
}

// Export the service instance
export const cyberSourceHostedDataService = new CyberSourceHostedDataService();
export default CyberSourceHostedDataService;
