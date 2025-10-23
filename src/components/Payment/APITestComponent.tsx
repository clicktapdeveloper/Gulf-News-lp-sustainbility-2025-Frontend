import React, { useState } from 'react';
import { cyberSourcePaymentService } from '../../lib/cybersource-payment-service';
import CustomButton from '../../screens/CustomButton';

const APITestComponent: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAPI = async () => {
    setIsLoading(true);
    addLog('Testing API connection...');
    
    try {
      // Test with minimal data
      const testData = {
        amount: '10.00',
        currency: 'AED',
        cardNumber: '4111111111111111',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123'
      };
      
      addLog(`Sending test data: ${JSON.stringify(testData)}`);
      const result = await cyberSourcePaymentService.processPayment(testData);
      addLog(`API Response: ${JSON.stringify(result)}`);
      
      if (result.success) {
        addLog('✅ API connection successful!');
      } else {
        addLog(`❌ API returned error: ${result.error}`);
      }
    } catch (error) {
      addLog(`❌ API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <CustomButton 
            onClick={testAPI}
            disabled={isLoading}
            className="px-4 py-2"
          >
            {isLoading ? 'Testing...' : 'Test API Connection'}
          </CustomButton>
          
          <CustomButton 
            onClick={clearLogs}
            variant="outline"
            className="px-4 py-2"
          >
            Clear Logs
          </CustomButton>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-y-auto">
          <h3 className="font-semibold mb-2">Debug Logs:</h3>
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet. Click "Test API Connection" to start debugging.</p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-sm font-mono bg-white p-2 rounded">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default APITestComponent;
