import React, { useState } from 'react';
import CustomButton from '@/screens/CustomButton';

const CyberSourceAPITester: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    addResult('Starting backend connection test...');
    
    try {
      // Test the base API URL
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      addResult(`Testing base URL: ${baseURL}`);
      
      // Test if server is running
      try {
        const response = await fetch(baseURL, { method: 'GET' });
        addResult(`Base server response: ${response.status} ${response.statusText}`);
      } catch (error) {
        addResult(`Base server error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Test the specific endpoint
      const endpoint = `${baseURL}/api/payments/cybersource-hosted/create-payment-params`;
      addResult(`Testing endpoint: ${endpoint}`);
      
      const testData = {
        amount: '499.00',
        currency: 'AED',
        customerEmail: 'test@example.com',
        customerFirstName: 'Test',
        customerLastName: 'User',
        customerAddress: '123 Main Street',
        customerCity: 'Dubai',
        customerCountry: 'AE',
        referenceNumber: `TEST-${Date.now()}`
      };
      
      addResult(`Sending test data: ${JSON.stringify(testData, null, 2)}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      addResult(`Response status: ${response.status} ${response.statusText}`);
      addResult(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);
      
      const bodyText = await response.text();
      addResult(`Response body: ${bodyText}`);
      
      if (bodyText.includes('<!DOCTYPE html>') || bodyText.includes('<html') || bodyText.includes('<pre>')) {
        addResult('❌ ERROR: Server returned HTML instead of JSON (endpoint not found)');
      } else {
        try {
          const jsonData = JSON.parse(bodyText);
          addResult(`✅ SUCCESS: Valid JSON response: ${JSON.stringify(jsonData, null, 2)}`);
        } catch (parseError) {
          addResult(`❌ ERROR: Invalid JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
      }
      
    } catch (error) {
      addResult(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      addResult('Test completed.');
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        CyberSource API Connection Tester
      </h2>
      
      <div className="space-y-4 mb-6">
        <CustomButton
          onClick={testBackendConnection}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Testing...' : 'Test Backend Connection'}
        </CustomButton>
        
        <CustomButton
          onClick={clearResults}
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          Clear Results
        </CustomButton>
      </div>
      
      {testResults.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Test Results:
          </h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`text-sm font-mono p-2 rounded ${
                  result.includes('❌') 
                    ? 'bg-red-100 text-red-800' 
                    : result.includes('✅') 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-white text-gray-700'
                }`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          What this test does:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Tests if the backend server is running</li>
          <li>• Checks if the CyberSource endpoint exists</li>
          <li>• Sends test data to the endpoint</li>
          <li>• Analyzes the response format</li>
          <li>• Shows detailed debugging information</li>
        </ul>
      </div>
    </div>
  );
};

export default CyberSourceAPITester;
