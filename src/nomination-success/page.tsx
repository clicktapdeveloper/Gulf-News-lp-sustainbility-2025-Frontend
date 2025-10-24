import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CustomButton from '@/screens/CustomButton';
import { formDataStorageService, type StoredFormData } from '@/lib/form-data-storage';
import { showErrorToast } from '@/lib/toast';

const NominationSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get('transaction_id');
  const [storedFormData, setStoredFormData] = useState<StoredFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFormData = async () => {
      if (!transactionId) {
        setError('No transaction ID provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Loading form data for transaction:', transactionId);
        const result = await formDataStorageService.retrieveFormData(transactionId);
        
        if (result.success && result.data) {
          setStoredFormData(result.data);
          console.log('Form data loaded successfully:', result.data);
        } else {
          setError(result.error || 'Failed to load form data');
          console.error('Failed to load form data:', result.error);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error loading form data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFormData();
  }, [transactionId]);

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleSubmitAnother = () => {
    navigate('/apply-for-nomination');
  };

  const handleDownloadReceipt = () => {
    if (!storedFormData) return;
    
    // Create a receipt with form data
    const receiptData = {
      transactionId: transactionId,
      submissionDate: new Date(storedFormData.timestamp).toLocaleString(),
      nominee: {
        name: `${storedFormData.formData.firstName} ${storedFormData.formData.lastName}`,
        email: storedFormData.formData.email,
        phone: storedFormData.formData.phone,
        designation: storedFormData.formData.designation,
        company: storedFormData.formData.companyName2,
        tradeLicense: storedFormData.formData.tradeLicense
      },
      payment: {
        amount: storedFormData.formData.paymentAmount,
        currency: storedFormData.formData.paymentCurrency,
        status: storedFormData.formData.paymentStatus,
        date: storedFormData.formData.paymentDate
      },
      supportingDocuments: storedFormData.uploadedFiles?.supportingDocument || []
    };

    const receiptText = `
GULF NEWS SUSTAINABILITY EXCELLENCE AWARDS 2025
NOMINATION RECEIPT

Transaction ID: ${receiptData.transactionId}
Submission Date: ${receiptData.submissionDate}

NOMINEE INFORMATION:
Name: ${receiptData.nominee.name}
Email: ${receiptData.nominee.email}
Phone: ${receiptData.nominee.phone}
Designation: ${receiptData.nominee.designation}
Company: ${receiptData.nominee.company}
Trade License: ${receiptData.nominee.tradeLicense}

PAYMENT INFORMATION:
Amount: ${receiptData.payment.amount} ${receiptData.payment.currency}
Status: ${receiptData.payment.status}
Payment Date: ${receiptData.payment.date}

SUPPORTING DOCUMENTS:
${receiptData.supportingDocuments.length > 0 ? receiptData.supportingDocuments.join('\n') : 'No documents uploaded'}

Thank you for your nomination!
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nomination-receipt-${transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-12 sm:pt-0 py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding relative space-y-[var(--space-y)]">
        <div className="z-10 w-full max-w-6xl mx-auto text-center space-y-[var(--space-y)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--secondary-color)] mx-auto mb-4"></div>
          <p className="text-gray-600 text-center text-lg">Loading your nomination details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center pt-12 sm:pt-0 py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding relative space-y-[var(--space-y)]">
        <div className="z-10 w-full max-w-6xl mx-auto text-center space-y-[var(--space-y)]">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold">
            <p className="text-[var(--tertiary-color)]">Error Loading</p>
            <p className="text-[var(--secondary-color)]">Nomination Details</p>
          </h1>
          
          <p className="text-gray-600 text-center text-lg mb-4">
            {error}
          </p>
          
          <div className="flex justify-center">
            <CustomButton 
              onClick={handleReturnHome}
              className="px-6 py-2"
            >
              Return to Home
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center pt-12 sm:pt-0 py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding relative space-y-[var(--space-y)]">
      <div>
        <img src="/AFNThankYou.webp" alt="ThankYou" className="w-auto h-auto max-w-md lg:max-w-lg xl:max-w-xl" />
      </div>
      <div className="z-10 w-full max-w-6xl mx-auto text-center space-y-[var(--space-y)]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold">
          <p className="text-[var(--tertiary-color)]">Thank You for Your</p>
          <p className="text-[var(--secondary-color)]">Nomination Submission</p>
        </h1>
        <p className="text-gray-600 text-center text-lg">
          Your nomination for the Sustainability Excellence Awards 2025 has been submitted successfully. We will review your application and get back to you soon.
        </p>

        {/* Transaction ID Display */}
        {transactionId && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 max-w-md mx-auto">
            <p className="text-sm text-green-700">
              <strong>Transaction ID:</strong> {transactionId}
            </p>
          </div>
        )}

        {/* Form Data Display (if available) */}
        {storedFormData && (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nomination Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">
                  {storedFormData.formData.firstName} {storedFormData.formData.lastName}
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{storedFormData.formData.email}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{storedFormData.formData.phone}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-medium text-gray-900">{storedFormData.formData.designation}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-medium text-gray-900">{storedFormData.formData.companyName2}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">Trade License</p>
                <p className="font-medium text-gray-900">{storedFormData.formData.tradeLicense}</p>
              </div>
            </div>

            {storedFormData.formData.message && (
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <p className="text-sm text-gray-600">Message</p>
                <p className="text-gray-900">{storedFormData.formData.message}</p>
              </div>
            )}

            {storedFormData.uploadedFiles?.supportingDocument && storedFormData.uploadedFiles.supportingDocument.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <p className="text-sm text-gray-600 mb-2">Supporting Documents</p>
                <div className="space-y-1">
                  {storedFormData.uploadedFiles.supportingDocument.map((url, index) => (
                    <a 
                      key={index}
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm block"
                    >
                      Document {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-700">
                <strong>Payment:</strong> {storedFormData.formData.paymentAmount} {storedFormData.formData.paymentCurrency} - {storedFormData.formData.paymentStatus}
              </p>
              <p className="text-sm text-green-700">
                <strong>Submitted:</strong> {new Date(storedFormData.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {storedFormData && (
            <CustomButton 
              onClick={handleDownloadReceipt}
              className="px-6 py-2"
            >
              Download Receipt
            </CustomButton>
          )}
          
          <CustomButton 
            onClick={handleReturnHome}
            className="px-6 py-2"
          >
            Okay
          </CustomButton>
          
          <CustomButton 
            onClick={handleSubmitAnother}
            variant="outline"
            className="px-6 py-2"
          >
            Submit Another Nomination
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default NominationSuccess;
