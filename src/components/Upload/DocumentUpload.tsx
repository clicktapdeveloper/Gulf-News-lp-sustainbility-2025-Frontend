import React, { useState } from 'react';
import PDFUpload from './PDFUpload';
import type { UploadedFile } from '../../lib/pdf-upload-service';

interface DocumentUploadProps {
  onDocumentsChange?: (documents: UploadedFile[]) => void;
  maxFiles?: number;
  className?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentsChange,
  maxFiles = 5,
  className = ''
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedFile[]>([]);

  const handleUploadSuccess = (uploadedFile: UploadedFile) => {
    const newDocuments = [...uploadedDocuments, uploadedFile];
    setUploadedDocuments(newDocuments);
    onDocumentsChange?.(newDocuments);
  };

  const handleUploadError = (error: string) => {
    console.error('Document upload error:', error);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Upload Supporting Documents
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload PDF documents to support your nomination (max {maxFiles} files, 10MB each)
        </p>
      </div>

      <PDFUpload
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        maxSize={10}
        className="mb-4"
      />

      {uploadedDocuments.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-800 mb-3">
            Uploaded Documents ({uploadedDocuments.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {uploadedDocuments.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">📄</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{doc.originalname}</p>
                    <p className="text-xs text-gray-600">
                      {(doc.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm bg-[var(--secondary-color)] !text-white rounded hover:bg-opacity-90 transition-colors"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
