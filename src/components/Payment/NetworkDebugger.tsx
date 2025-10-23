import React, { useState } from 'react';
import { cyberSourcePaymentService } from '../../lib/cybersource-payment-service';

const NetworkDebugger: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    setIsLoading(true);
    addLog('Testing backend connection...');
    
    try {
      // Test signature endpoint first
      addLog('Calling signature test endpoint...');
      const signatureResult = await cyberSourcePaymentService.testSignature();
      addLog(`Signature test result: ${JSON.stringify(signatureResult)}`);
      
      if (signatureResult.success) {
        addLog('✅ Backend connection successful!');
      } else {
        addLog(`❌ Signature test failed: ${signatureResult.error}`);
      }
    } catch (error) {
      addLog(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testPayment = async () => {
    setIsLoading(true);
    addLog('Testing payment processing...');
    
    try {
      const paymentData = {
        amount: '10.00',
        currency: 'AED',
        cardNumber: '4111111111111111',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123'
      };
      
      addLog(`Sending payment data: ${JSON.stringify(paymentData)}`);
      const result = await cyberSourcePaymentService.processPayment(paymentData);
      addLog(`Payment result: ${JSON.stringify(result)}`);
      
      if (result.success) {
        addLog('✅ Payment processed successfully!');
      } else {
        addLog(`❌ Payment failed: ${result.error}`);
      }
    } catch (error) {
      addLog(`❌ Payment error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Network Debugger</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={testBackendConnection}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Backend Connection'}
          </button>
          
          <button
            onClick={testPayment}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Test Payment'}
          </button>
          
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Clear Logs
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-y-auto">
          <h3 className="font-semibold mb-2">Debug Logs:</h3>
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet. Click a test button to start debugging.</p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-sm font-mono">
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

export default NetworkDebugger;
