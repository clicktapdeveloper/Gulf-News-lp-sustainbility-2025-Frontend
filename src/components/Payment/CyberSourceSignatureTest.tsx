import React, { useState } from 'react';
import { cyberSourcePaymentService } from '../../lib/cybersource-payment-service';
import CustomButton from '../../screens/CustomButton';

const CyberSourceSignatureTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testSignature = async () => {
    setLoading(true);
    setResult(null);

    try {
      const data = await cyberSourcePaymentService.testSignature();
      setResult(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signature test failed';
      setResult({ 
        success: false, 
        error: errorMessage 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">CyberSource Signature Test</h3>
      <p className="text-sm text-gray-600">
        Test the CyberSource API connection and signature generation.
      </p>
      
      <CustomButton 
        onClick={testSignature}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Testing...' : 'Test Signature'}
      </CustomButton>
      
      {result && (
        <div className={`p-4 rounded-md ${
          result.success 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <h4 className="font-semibold">
            {result.success ? 'Signature Test Successful' : 'Signature Test Failed'}
          </h4>
          <pre className="text-xs mt-2 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CyberSourceSignatureTest;
