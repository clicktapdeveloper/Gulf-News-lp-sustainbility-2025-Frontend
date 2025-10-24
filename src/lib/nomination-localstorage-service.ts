// Nomination LocalStorage Service
// This service handles saving and retrieving nomination ObjectId from localStorage

export interface NominationData {
  objectId: string;
  formData: Record<string, string>;
  uploadedFiles?: Record<string, string[]>;
  submittedAt: string;
  status: 'unpaid' | 'paid';
}

class NominationLocalStorageService {
  private readonly STORAGE_KEY = 'gulfnews_nomination_data';

  /**
   * Save nomination data to localStorage after form submission
   * @param objectId - The ObjectId returned from backend
   * @param formData - Form data submitted
   * @param uploadedFiles - Uploaded file URLs
   * @returns boolean - Success status
   */
  saveNominationData(
    objectId: string,
    formData: Record<string, string>,
    uploadedFiles?: Record<string, string[]>
  ): boolean {
    try {
      console.log('=== SAVING NOMINATION DATA TO LOCALSTORAGE ===');
      console.log('ObjectId:', objectId);
      console.log('Form Data:', formData);
      console.log('Uploaded Files:', uploadedFiles);

      const nominationData: NominationData = {
        objectId,
        formData,
        uploadedFiles,
        submittedAt: new Date().toISOString(),
        status: 'unpaid'
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(nominationData));
      
      console.log('Nomination data saved to localStorage successfully');
      console.log('=== LOCALSTORAGE SAVE COMPLETE ===');
      return true;

    } catch (error) {
      console.error('Error saving nomination data to localStorage:', error);
      return false;
    }
  }

  /**
   * Retrieve nomination data from localStorage
   * @returns NominationData | null
   */
  getNominationData(): NominationData | null {
    try {
      console.log('=== RETRIEVING NOMINATION DATA FROM LOCALSTORAGE ===');
      
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      
      if (!storedData) {
        console.log('No nomination data found in localStorage');
        return null;
      }

      const nominationData: NominationData = JSON.parse(storedData);
      console.log('Nomination data retrieved:', nominationData);
      console.log('=== LOCALSTORAGE RETRIEVAL COMPLETE ===');
      
      return nominationData;

    } catch (error) {
      console.error('Error retrieving nomination data from localStorage:', error);
      return null;
    }
  }

  /**
   * Update nomination status to 'paid' in localStorage
   * @param paymentData - Payment information
   * @returns boolean - Success status
   */
  updateNominationStatus(paymentData: {
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
  }): boolean {
    try {
      console.log('=== UPDATING NOMINATION STATUS TO PAID ===');
      console.log('Payment Data:', paymentData);

      const existingData = this.getNominationData();
      
      if (!existingData) {
        console.error('No existing nomination data found to update');
        return false;
      }

      const updatedData: NominationData = {
        ...existingData,
        status: 'paid',
        // Add payment information to form data
        formData: {
          ...existingData.formData,
          paymentAmount: paymentData.paymentAmount.toString(),
          paymentCurrency: paymentData.paymentCurrency,
          paymentDate: paymentData.paymentDate,
          paymentReference: paymentData.paymentReference,
          paymentStatus: paymentData.paymentStatus,
          paymentMethod: paymentData.paymentMethod || 'cybersource_hosted',
          cybersourceTransactionId: paymentData.cybersourceTransactionId || '',
          authCode: paymentData.authCode || '',
          authTime: paymentData.authTime || '',
          cardType: paymentData.cardType || ''
        }
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
      
      console.log('Nomination status updated to paid successfully');
      console.log('=== STATUS UPDATE COMPLETE ===');
      return true;

    } catch (error) {
      console.error('Error updating nomination status:', error);
      return false;
    }
  }

  /**
   * Clear nomination data from localStorage
   * @returns boolean - Success status
   */
  clearNominationData(): boolean {
    try {
      console.log('Clearing nomination data from localStorage');
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Nomination data cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing nomination data:', error);
      return false;
    }
  }

  /**
   * Check if there's pending nomination data (unpaid status)
   * @returns boolean
   */
  hasPendingNomination(): boolean {
    const data = this.getNominationData();
    return data !== null && data.status === 'unpaid';
  }
}

// Export the service instance
export const nominationLocalStorageService = new NominationLocalStorageService();
export default NominationLocalStorageService;
