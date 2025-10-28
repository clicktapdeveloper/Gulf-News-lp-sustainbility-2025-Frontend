import React, { useState } from 'react';
import { FileText, CheckCircle, Trash2 } from 'lucide-react';
import { pdfUploadService, type UploadedFile, type UploadResponse } from '../../lib/pdf-upload-service';
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from '../../lib/toast';

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
        {/* Compact File Input with Integrated Button */}
        <div className="relative flex items-center">
          <div className="flex-1 relative">
            <div
              className={`relative flex items-center rounded-md border border-gray-300 bg-white transition-colors ${
                dragActive
                  ? 'border-[var(--secondary-color)]'
                  : error
                  ? 'border-red-300'
                  : 'border-gray-300 hover:border-gray-400'
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
                disabled={uploading || uploadedFiles.length >= maxFiles}
              />
              
              <div className="flex items-center !justify-between px-4 py-1 w-full">
                <div className="flex items-center flex-1 min-w-0">
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-[var(--secondary-color)] border-t-transparent rounded-full animate-spin mr-3"></div>
                  ) : uploadedFiles.length > 0 ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  ) : file ? (
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                  ) : null}
                  
                  <div className={`text-sm truncate ${
                    file || uploading ? 'text-gray-800 font-medium' : 'text-gray-400'
                  }`}>
                    {uploading ? 'Uploading...' : file ? file.name : uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s) uploaded` : 'Upload a file'}
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!uploading && uploadedFiles.length < maxFiles) {
                      const fileInput = document.createElement('input');
                      fileInput.type = 'file';
                      fileInput.accept = accept;
                      fileInput.onchange = (e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.files?.[0]) {
                          handleFileSelect(target.files[0]);
                        }
                      };
                      fileInput.click();
                    }
                  }}
                  disabled={uploading || uploadedFiles.length >= maxFiles}
                  className=" ml-3 !bg-[#596FEC] hover:bg-[#5458d4] text-white font-medium !text-sm !px-3 !py-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {uploading ? 'Uploading...' : 'Upload file'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
        
        {/* File Info */}
        {file && !uploading && (
          <p className="text-xs text-gray-500 mt-1">
            Size: {formatFileSize(file.size)} • Max size: {maxSize}MB • Max files: {maxFiles}
          </p>
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
