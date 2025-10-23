import React, { useState } from 'react';
import { cyberSourcePaymentService } from '../../lib/cybersource-payment-service';
import { showPaymentToast, showLoadingToast, dismissToast } from '../../lib/toast';

const CyberSourceDirectTest: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSignature = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await cyberSourcePaymentService.testSignature();
      setResult(response);
    } catch (error) {
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Test failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testPayment = async () => {
    setLoading(true);
    setResult(null);
    
    const loadingToastId = showLoadingToast('Testing payment...');
    
    try {
      const response = await cyberSourcePaymentService.processPayment({
        amount: '10.00',
        currency: 'AED',
        cardNumber: '4111111111111111',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123'
      });
      setResult(response);
      
      dismissToast(loadingToastId);
      showPaymentToast(response);
    } catch (error) {
      const errorResult = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Payment failed' 
      };
      setResult(errorResult);
      
      dismissToast(loadingToastId);
      showPaymentToast(errorResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">CyberSource Direct API Test</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={testSignature}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Signature'}
          </button>
          
          <button
            onClick={testPayment}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Test Payment'}
          </button>
        </div>
        
        {result && (
          <div className={`p-4 rounded-md ${
            result.success 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <h3 className="font-semibold mb-2">
              {result.success ? 'Success!' : 'Error'}
            </h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CyberSourceDirectTest;
