import React, { useState } from 'react';
import CyberSourceDirectPayment from '../components/Payment/CyberSourceDirectPayment';
import CyberSourceSignatureTest from '../components/Payment/CyberSourceSignatureTest';
import CyberSourcePayment from '../components/Payment/CyberSourcePayment';
import CyberSourceDirectTest from '../components/Payment/CyberSourceDirectTest';
import NetworkDebugger from '../components/Payment/NetworkDebugger';
import APITestComponent from '../components/Payment/APITestComponent';

const CyberSourceTestPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'direct' | 'flex'>('direct');
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const handlePaymentSuccess = (paymentId?: string) => {
    setPaymentResult({ success: true, paymentId });
    console.log('Payment successful:', paymentId);
  };

  const handlePaymentError = (error: string) => {
    setPaymentResult({ success: false, error });
    console.error('Payment failed:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            CyberSource Payment Gateway Test
          </h1>
          
          {/* Payment Method Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setPaymentMethod('direct')}
                className={`px-4 py-2 rounded-md font-medium ${
                  paymentMethod === 'direct'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Direct API (Recommended)
              </button>
              <button
                onClick={() => setPaymentMethod('flex')}
                className={`px-4 py-2 rounded-md font-medium ${
                  paymentMethod === 'flex'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Flex SDK (Legacy)
              </button>
            </div>
          </div>

          {/* API Tests */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">API Connection Tests</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CyberSourceSignatureTest />
              <CyberSourceDirectTest />
            </div>
          </div>

          {/* Network Debugger */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Network Debugger</h2>
            <NetworkDebugger />
          </div>

          {/* API Test Component */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
            <APITestComponent />
          </div>

          {/* Payment Form */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Payment Test</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              {paymentMethod === 'direct' ? (
                <CyberSourceDirectPayment
                  amount={10.00}
                  currency="AED"
                  referenceId="TEST-ORDER-001"
                  customerEmail="test@example.com"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              ) : (
                <CyberSourcePayment
                  amount={10.00}
                  currency="AED"
                  referenceId="TEST-ORDER-001"
                  customerEmail="test@example.com"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  useDirectAPI={false}
                />
              )}
            </div>
          </div>

          {/* Payment Result */}
          {paymentResult && (
            <div className={`p-6 rounded-lg ${
              paymentResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`text-lg font-semibold ${
                paymentResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {paymentResult.success ? 'Payment Successful!' : 'Payment Failed'}
              </h3>
              <div className="mt-2">
                {paymentResult.success ? (
                  <p className="text-green-700">
                    Payment ID: <code className="bg-green-100 px-2 py-1 rounded">{paymentResult.paymentId}</code>
                  </p>
                ) : (
                  <p className="text-red-700">
                    Error: <code className="bg-red-100 px-2 py-1 rounded">{paymentResult.error}</code>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Test Instructions */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Test Instructions</h3>
            <div className="text-blue-800 space-y-2">
              <p><strong>1. Environment Setup:</strong> Make sure your .env.local file has the correct CyberSource credentials.</p>
              <p><strong>2. Test Cards:</strong> Use the provided test card numbers (Visa: 4111111111111111, Mastercard: 5555555555554444)</p>
              <p><strong>3. API Endpoints:</strong> Ensure your backend server is running on the configured API_BASE_URL</p>
              <p><strong>4. Signature Test:</strong> Run the signature test first to verify API connectivity</p>
            </div>
          </div>

          {/* API Endpoints Info */}
          <div className="mt-6 p-6 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Available API Endpoints</h3>
            <div className="space-y-2 text-sm font-mono">
              <div><span className="text-green-600">POST</span> /api/payments/cybersource/process - Direct payment processing</div>
              <div><span className="text-green-600">POST</span> /api/payments/cybersource/token - Create payment token</div>
              <div><span className="text-green-600">POST</span> /api/payments/cybersource/charge - Legacy charge with transient token</div>
              <div><span className="text-green-600">POST</span> /api/payments/cybersource/signature-test - Test signature generation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberSourceTestPage;
