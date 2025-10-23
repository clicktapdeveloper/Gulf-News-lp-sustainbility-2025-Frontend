import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { pdfUploadService, type UploadedFile, type UploadResponse } from '../../lib/pdf-upload-service';
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from '../../lib/toast';
import CustomButton from '../../screens/CustomButton';

interface PDFUploadProps {
  onUploadSuccess?: (uploadedFile: UploadedFile) => void;
  onUploadError?: (error: string) => void;
  maxSize?: number; // in MB
  maxFiles?: number; // maximum number of files
  accept?: string;
  className?: string;
  autoUpload?: boolean; // Auto upload when file is selected
}

const PDFUpload: React.FC<PDFUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  maxSize = 10, // 10MB default
  maxFiles = 5, // 5 files default
  accept = '.pdf',
  className = '',
  autoUpload = true // Auto upload by default
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    return pdfUploadService.validateFile(file, maxSize);
  };

  const handleFileSelect = async (selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    
    if (validationError) {
      setError(validationError);
      showErrorToast(validationError);
      return;
    }

    setError(null);
    setFile(selectedFile);

    // Auto upload if enabled
    if (autoUpload) {
      await uploadFile(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const uploadPDF = async (fileToUpload: File): Promise<UploadResponse> => {
    return await pdfUploadService.uploadPDF(fileToUpload);
  };

  const uploadFile = async (fileToUpload: File) => {
    // Check if max files limit reached
    if (uploadedFiles.length >= maxFiles) {
      const errorMsg = `Maximum ${maxFiles} files allowed`;
      setError(errorMsg);
      showErrorToast(errorMsg);
      return;
    }

    setUploading(true);
    const loadingToastId = showLoadingToast('Uploading PDF...');

    try {
      console.log('Uploading file:', fileToUpload.name);
      const result = await uploadPDF(fileToUpload);
      
      dismissToast(loadingToastId);

      if (result.success && result.uploaded?.[0]) {
        const uploadedFile = result.uploaded[0];
        setUploadedFiles(prev => [...prev, uploadedFile]);
        setFile(null);
        setError(null);
        
        showSuccessToast(`PDF uploaded successfully: ${uploadedFile.originalname}`);
        onUploadSuccess?.(uploadedFile);
      } else {
        const errorMsg = result.error || 'Upload failed';
        setError(errorMsg);
        showErrorToast(errorMsg);
        onUploadError?.(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      dismissToast(loadingToastId);
      setError(errorMsg);
      showErrorToast(errorMsg);
      onUploadError?.(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const deletePDF = async (fileKey: string): Promise<boolean> => {
    const result = await pdfUploadService.deletePDF(fileKey);
    return result.success;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      const errorMsg = 'Please select a PDF file';
      setError(errorMsg);
      showErrorToast(errorMsg);
      return;
    }

    await uploadFile(file);
  };

  const handleDelete = async (fileKey: string, fileName: string) => {
    const loadingToastId = showLoadingToast('Deleting PDF...');
    
    try {
      const success = await deletePDF(fileKey);
      dismissToast(loadingToastId);
      
      if (success) {
        setUploadedFiles(prev => prev.filter(file => file.key !== fileKey));
        showSuccessToast(`PDF deleted: ${fileName}`);
      } else {
        showErrorToast('Failed to delete PDF');
      }
    } catch (error) {
      dismissToast(loadingToastId);
      showErrorToast('Failed to delete PDF');
    }
  };

  const formatFileSize = (bytes: number): string => {
    return pdfUploadService.formatFileSize(bytes);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-[var(--secondary-color)] bg-[var(--primary-color)] bg-opacity-20'
              : error
              ? 'border-red-300 bg-red-50'
              : uploadedFiles.length > 0
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 hover:border-[var(--secondary-color)]'
          } ${uploading || uploadedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              {uploading ? (
                <div className="w-12 h-12 border-4 border-[var(--secondary-color)] border-t-transparent rounded-full animate-spin"></div>
              ) : uploadedFiles.length > 0 ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
              ) : file ? (
                <CheckCircle className="w-12 h-12 text-blue-600" />
              ) : error ? (
                <AlertCircle className="w-12 h-12 text-red-600" />
              ) : (
                <Upload className="w-12 h-12 text-gray-400" />
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-700">
                {uploading ? 'Uploading...' : uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s) uploaded successfully` : file ? file.name : 'Drop your PDF here or click to browse'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Maximum file size: {maxSize}MB • Max files: {maxFiles}
              </p>
              {file && !uploading && (
                <p className="text-sm text-gray-600 mt-1">
                  Size: {formatFileSize(file.size)}
                </p>
              )}
            </div>
            
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>

        {/* Upload Button - Only show when autoUpload is disabled or there's an error */}
        {file && (!autoUpload || error) && (
          <div className="flex justify-center space-x-4">
            <CustomButton
              type="submit"
              disabled={uploading || uploadedFiles.length >= maxFiles}
              className="px-6 py-2"
            >
              {uploading ? 'Uploading...' : uploadedFiles.length >= maxFiles ? `Max ${maxFiles} files reached` : 'Upload PDF'}
            </CustomButton>
            
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => {
                setFile(null);
                setError(null);
              }}
              disabled={uploading}
              className="px-6 py-2"
            >
              Cancel
            </CustomButton>
          </div>
        )}
      </form>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Uploaded Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">{uploadedFile.originalname}</p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(uploadedFile.size)} • Uploaded {new Date(uploadedFile.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <a
                    href={uploadedFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm bg-[var(--secondary-color)] !text-white rounded hover:bg-opacity-90 transition-colors"
                  >
                    View
                  </a>
                  
                  <button
                    onClick={() => handleDelete(uploadedFile.key, uploadedFile.originalname)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUpload;
