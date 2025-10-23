import React from 'react';
import PDFUpload from '../components/Upload/PDFUpload';
import CustomButton from '../screens/CustomButton';

const PDFUploadDemo: React.FC = () => {
  const handleUploadSuccess = (uploadedFile: any) => {
    console.log('Upload successful:', uploadedFile);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--secondary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">📄</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--tertiary-color)] mb-2">
            PDF Upload Demo
          </h1>
          <p className="text-gray-600">
            Upload PDF files to S3 storage with drag & drop support
          </p>
        </div>

        <PDFUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          maxSize={10}
          className="mb-6"
        />

        <div className="text-center">
          <CustomButton
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="px-6 py-2"
          >
            Back to Home
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default PDFUploadDemo;
