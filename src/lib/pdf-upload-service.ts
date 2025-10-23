import { ENV_CONFIG } from '../config/env';

export interface UploadedFile {
  url: string;
  key: string;
  originalname: string;
  mimetype: string;
  size: number;
  uploadedAt: string;
}

export interface UploadResponse {
  success: boolean;
  uploaded?: UploadedFile[];
  error?: string;
  message?: string;
}

export interface DeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ListFilesResponse {
  success: boolean;
  files?: UploadedFile[];
  error?: string;
}

export class PDFUploadService {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || ENV_CONFIG.API_BASE_URL;
  }

  /**
   * Upload a PDF file to S3
   * @param file - PDF file to upload
   * @returns Promise<UploadResponse> Upload result
   */
  async uploadPDF(file: File): Promise<UploadResponse> {
    try {
      console.log('PDFUploadService - Uploading file:', file.name);
      
      const formData = new FormData();
      formData.append('pdfFile', file);

      const response = await fetch(`${this.baseURL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log('PDFUploadService - Upload response:', result);
      
      return result;
    } catch (error) {
      console.error('PDFUploadService - Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Delete a PDF file from S3
   * @param fileKey - S3 file key to delete
   * @returns Promise<DeleteResponse> Delete result
   */
  async deletePDF(fileKey: string): Promise<DeleteResponse> {
    try {
      console.log('PDFUploadService - Deleting file:', fileKey);
      
      const response = await fetch(`${this.baseURL}/api/delete/${fileKey}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      console.log('PDFUploadService - Delete response:', result);
      
      return result;
    } catch (error) {
      console.error('PDFUploadService - Delete error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      };
    }
  }

  /**
   * List PDF files from S3
   * @param prefix - S3 prefix to filter files (default: 'uploads/reports/')
   * @returns Promise<ListFilesResponse> List result
   */
  async listFiles(prefix: string = 'uploads/reports/'): Promise<ListFilesResponse> {
    try {
      console.log('PDFUploadService - Listing files with prefix:', prefix);
      
      const response = await fetch(`${this.baseURL}/api/files?prefix=${encodeURIComponent(prefix)}`);
      const result = await response.json();
      
      console.log('PDFUploadService - List response:', result);
      return result;
    } catch (error) {
      console.error('PDFUploadService - List error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'List failed'
      };
    }
  }

  /**
   * Validate PDF file
   * @param file - File to validate
   * @param maxSizeMB - Maximum file size in MB (default: 10)
   * @returns string | null - Error message or null if valid
   */
  validateFile(file: File, maxSizeMB: number = 10): string | null {
    // Check file type
    if (file.type !== 'application/pdf') {
      return 'Please select a PDF file only';
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  }

  /**
   * Format file size for display
   * @param bytes - File size in bytes
   * @returns string - Formatted file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const pdfUploadService = new PDFUploadService();
export default PDFUploadService;
