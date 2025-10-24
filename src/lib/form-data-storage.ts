// Secure Form Data Storage Service
// This service handles secure storage and retrieval of form data linked to transaction IDs

import { ENV_CONFIG } from '../config/env';

export interface StoredFormData {
  formData: string; // Encrypted form data as string
  uploadedFiles?: Record<string, string[]>; // File URLs
  timestamp: number;
  transactionId: string;
  formType: string;
  expiresAt: number;
}

export interface DecryptedFormData {
  formData: Record<string, string>; // Decrypted form data
  uploadedFiles?: Record<string, string[]>; // File URLs
  timestamp: number;
  transactionId: string;
  formType: string;
  expiresAt: number;
}

export interface StorageResponse {
  success: boolean;
  data?: DecryptedFormData;
  error?: string;
}

class FormDataStorageService {
  private readonly STORAGE_KEY_PREFIX = 'gulfnews_form_';
  private readonly EXPIRY_HOURS = ENV_CONFIG.FORM_STORAGE_EXPIRY_HOURS; // Data expires after configured hours

  constructor() {
    // No backend API calls needed - using localStorage only
  }

  /**
   * Generate a secure storage key for the transaction
   */
  private generateStorageKey(transactionId: string): string {
    return `${this.STORAGE_KEY_PREFIX}${transactionId}`;
  }

  /**
   * Encrypt sensitive form data before storage
   */
  private encryptFormData(formData: Record<string, string>): string {
    try {
      // Simple base64 encoding for basic obfuscation
      // In production, use proper encryption with a secret key
      const jsonString = JSON.stringify(formData);
      return btoa(encodeURIComponent(jsonString));
    } catch (error) {
      console.error('Error encrypting form data:', error);
      throw new Error('Failed to encrypt form data');
    }
  }

  /**
   * Decrypt form data after retrieval
   */
  private decryptFormData(encryptedData: string): Record<string, string> {
    try {
      const jsonString = decodeURIComponent(atob(encryptedData));
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error decrypting form data:', error);
      throw new Error('Failed to decrypt form data');
    }
  }

  /**
   * Store form data securely linked to transaction ID
   */
  async storeFormData(
    transactionId: string,
    formData: Record<string, string>,
    uploadedFiles?: Record<string, string[]>,
    formType: string = 'applyForNomination'
  ): Promise<StorageResponse> {
    try {
      console.log('=== STORING FORM DATA ===');
      console.log('Transaction ID:', transactionId);
      console.log('Form Data:', formData);
      console.log('Uploaded Files:', uploadedFiles);
      console.log('Form Type:', formType);

      const now = Date.now();
      const expiresAt = now + (this.EXPIRY_HOURS * 60 * 60 * 1000);

      const dataToStore: StoredFormData = {
        formData: this.encryptFormData(formData),
        uploadedFiles,
        timestamp: now,
        transactionId,
        formType,
        expiresAt
      };

      // Store directly in localStorage (backend endpoints don't exist)
      const storageKey = this.generateStorageKey(transactionId);
      console.log('Storage Key:', storageKey);
      console.log('Data to Store:', dataToStore);
      
      localStorage.setItem(storageKey, JSON.stringify(dataToStore));
      
      // Verify storage
      const stored = localStorage.getItem(storageKey);
      console.log('Verification - Stored Data:', stored);
      
      // Clean up expired entries
      this.cleanupExpiredEntries();

      console.log('Form data stored in localStorage successfully');
      // Decrypt the data before returning
      const decryptedData: DecryptedFormData = {
        ...dataToStore,
        formData: this.decryptFormData(dataToStore.formData)
      };
      console.log('=== STORAGE COMPLETE ===');
      return { success: true, data: decryptedData };

    } catch (error) {
      console.error('Error storing form data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to store form data' 
      };
    }
  }

  /**
   * Retrieve form data by transaction ID
   */
  async retrieveFormData(transactionId: string): Promise<StorageResponse> {
    try {
      console.log('=== RETRIEVING FORM DATA ===');
      console.log('Transaction ID:', transactionId);

      // Retrieve directly from localStorage (backend endpoints don't exist)
      const storageKey = this.generateStorageKey(transactionId);
      console.log('Storage Key:', storageKey);
      
      const storedData = localStorage.getItem(storageKey);
      console.log('Raw Stored Data:', storedData);

      if (!storedData) {
        console.log('No data found for key:', storageKey);
        console.log('All localStorage keys:', Object.keys(localStorage));
        console.log('Keys starting with gulfnews_form_:', Object.keys(localStorage).filter(key => key.startsWith('gulfnews_form_')));
        return { 
          success: false, 
          error: 'No form data found for this transaction' 
        };
      }

      const parsedData: StoredFormData = JSON.parse(storedData);
      console.log('Parsed Data:', parsedData);

      // Check if data has expired
      if (Date.now() > parsedData.expiresAt) {
        console.log('Data has expired, removing from localStorage');
        localStorage.removeItem(storageKey);
        return { 
          success: false, 
          error: 'Form data has expired' 
        };
      }

      // Decrypt the form data
      const decryptedData: DecryptedFormData = {
        ...parsedData,
        formData: this.decryptFormData(parsedData.formData)
      };

      console.log('Form data retrieved from localStorage successfully');
      console.log('Decrypted Data:', decryptedData);
      console.log('=== RETRIEVAL COMPLETE ===');
      return { success: true, data: decryptedData };

    } catch (error) {
      console.error('Error retrieving form data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve form data' 
      };
    }
  }

  /**
   * Delete form data for a specific transaction
   */
  async deleteFormData(transactionId: string): Promise<StorageResponse> {
    try {
      console.log('Deleting form data for transaction:', transactionId);

      // Delete directly from localStorage (backend endpoints don't exist)
      const storageKey = this.generateStorageKey(transactionId);
      localStorage.removeItem(storageKey);

      console.log('Form data deleted from localStorage successfully');
      return { success: true };

    } catch (error) {
      console.error('Error deleting form data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete form data' 
      };
    }
  }

  /**
   * Clean up expired entries from localStorage
   */
  private cleanupExpiredEntries(): void {
    try {
      const now = Date.now();
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
          try {
            const storedData = localStorage.getItem(key);
            if (storedData) {
              const parsedData: StoredFormData = JSON.parse(storedData);
              if (now > parsedData.expiresAt) {
                keysToRemove.push(key);
              }
            }
          } catch (parseError) {
            // Remove corrupted entries
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log('Removed expired form data:', key);
      });

      if (keysToRemove.length > 0) {
        console.log(`Cleaned up ${keysToRemove.length} expired form data entries`);
      }
    } catch (error) {
      console.error('Error cleaning up expired entries:', error);
    }
  }

  /**
   * Get all stored form data (for debugging purposes)
   */
  getAllStoredData(): DecryptedFormData[] {
    const allData: DecryptedFormData[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
          try {
            const storedData = localStorage.getItem(key);
            if (storedData) {
              const parsedData: StoredFormData = JSON.parse(storedData);
              allData.push({
                ...parsedData,
                formData: this.decryptFormData(parsedData.formData)
              } as DecryptedFormData);
            }
          } catch (parseError) {
            console.warn('Skipping corrupted entry:', key);
          }
        }
      }
    } catch (error) {
      console.error('Error getting all stored data:', error);
    }

    return allData;
  }
}

// Export the service instance
export const formDataStorageService = new FormDataStorageService();
export default FormDataStorageService;
