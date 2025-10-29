import React, { useState } from 'react';
import { formDataStorageService } from '@/lib/form-data-storage';
import CustomButton from '@/screens/CustomButton';

const FormStorageDemo: React.FC = () => {
  const [testTransactionId, setTestTransactionId] = useState('7613048275666784804501');
  const [testFormData, setTestFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+971501234567',
    designation: 'CEO',
    companyName2: 'Example Corp',
    tradeLicense: 'TL123456789',
    message: 'This is a test nomination for the Sustainability Excellence Awards 2025.'
  });
  const [result, setResult] = useState<string>('');

  const handleStoreData = async () => {
    try {
      const result = await formDataStorageService.storeFormData(
        testTransactionId,
        testFormData,
        { supportingDocument: ['https://example.com/doc1.pdf', 'https://example.com/doc2.pdf'] },
        'applyForNomination'
      );
      
      setResult(`Store Result: ${result.success ? 'Success' : 'Failed'} - ${result.error || 'Data stored successfully'}`);
    } catch (error) {
      setResult(`Store Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleRetrieveData = async () => {
    try {
      const result = await formDataStorageService.retrieveFormData(testTransactionId);
      
      if (result.success && result.data) {
        setResult(`Retrieve Result: Success - Found data for ${result.data.formData.firstName} ${result.data.formData.lastName}`);
      } else {
        setResult(`Retrieve Result: Failed - ${result.error}`);
      }
    } catch (error) {
      setResult(`Retrieve Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteData = async () => {
    try {
      const result = await formDataStorageService.deleteFormData(testTransactionId);
      setResult(`Delete Result: ${result.success ? 'Success' : 'Failed'} - ${result.error || 'Data deleted successfully'}`);
    } catch (error) {
      setResult(`Delete Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleViewAllData = () => {
    try {
      const allData = formDataStorageService.getAllStoredData();
      setResult(`All Stored Data: Found ${allData.length} entries`);
      console.log('All stored data:', allData);
    } catch (error) {
      setResult(`View All Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Form Data Storage Demo</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Configuration</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID
            </label>
            <input
              type="text"
              value={testTransactionId}
              onChange={(e) => setTestTransactionId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Enter transaction ID"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={testFormData.firstName}
                onChange={(e) => setTestFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={testFormData.lastName}
                onChange={(e) => setTestFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={testFormData.email}
                onChange={(e) => setTestFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={testFormData.phone}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 9);
                  setTestFormData(prev => ({ ...prev, phone: digitsOnly }));
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                maxLength={9}
                pattern="[0-9]{9}"
                inputMode="numeric"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <CustomButton onClick={handleStoreData} className="w-full">
              Store Data
            </CustomButton>
            
            <CustomButton onClick={handleRetrieveData} variant="outline" className="w-full">
              Retrieve Data
            </CustomButton>
            
            <CustomButton onClick={handleDeleteData} variant="outline" className="w-full">
              Delete Data
            </CustomButton>
            
            <CustomButton onClick={handleViewAllData} variant="outline" className="w-full">
              View All Data
            </CustomButton>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Result</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">{result}</pre>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Test</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Click "Store Data" to save the test form data with the transaction ID</li>
            <li>Click "Retrieve Data" to fetch the stored data</li>
            <li>Navigate to <code>/nomination/success?transaction_id={testTransactionId}</code> to see the success page</li>
            <li>Click "View All Data" to see all stored entries</li>
            <li>Click "Delete Data" to remove the test data</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FormStorageDemo;
