import React from 'react';
import PDFUpload from '../components/Upload/PDFUpload';

const AutoUploadDemo: React.FC = () => {
  const handleUploadSuccess = (uploadedFile: any) => {
    console.log('Auto upload successful:', uploadedFile);
  };

  const handleUploadError = (error: string) => {
    console.error('Auto upload error:', error);
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--secondary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">⚡</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--tertiary-color)] mb-2">
            Auto Upload Demo
          </h1>
          <p className="text-gray-600">
            Files upload automatically when selected - no button needed!
          </p>
        </div>

        <PDFUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          maxSize={10}
          maxFiles={3}
          autoUpload={true}
          className="mb-6"
        />

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Try selecting a PDF file - it will upload automatically with a loading spinner, then show a success tickmark!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutoUploadDemo;

