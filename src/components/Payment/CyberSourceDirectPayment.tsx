import React, { useState } from 'react';
import { cyberSourcePaymentService, CyberSourcePaymentService } from '../../lib/cybersource-payment-service';
import type { PaymentData } from '../../lib/cybersource-payment-service';
import { showPaymentToast, showLoadingToast, dismissToast } from '../../lib/toast';
import CustomButton from '../../screens/CustomButton';

interface CyberSourceDirectPaymentProps {
  amount: number;
  currency: string;
  referenceId?: string;
  customerEmail?: string;
  onSuccess?: (paymentId?: string) => void;
  onError?: (message: string) => void;
}

const CyberSourceDirectPayment: React.FC<CyberSourceDirectPaymentProps> = ({ 
  amount, 
  currency, 
  onSuccess, 
  onError 
}) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cardNumber || !/^\d{13,19}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiry = 'Please enter valid expiry date';
    }
    
    if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted, preventing default behavior');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    console.log('Starting payment processing...');
    setLoading(true);
    setResult(null);

    // Show loading toast
    const loadingToastId = showLoadingToast('Processing payment...');

    try {
      const paymentData: PaymentData = {
        amount: amount.toString(),
        currency: currency,
        cardNumber: formData.cardNumber,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        cvv: formData.cvv
      };

      console.log('Sending payment data to backend:', paymentData);
      const data = await cyberSourcePaymentService.processPayment(paymentData);
      console.log('Backend response:', data);
      
      setResult(data);
      
      // Dismiss loading toast
      dismissToast(loadingToastId);
      
      // Show appropriate toast based on result
      const isFullySuccessful = showPaymentToast(data);
      
      if (isFullySuccessful) {
        console.log('Payment successful:', data.paymentId);
        // Reset form on success
        setFormData({
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: ''
        });
        
        onSuccess?.(data.paymentId);
      } else {
        console.error('Payment failed/declined:', data.error);
        onError?.(data.error || 'Payment failed');
      }
      
    } catch (error) {
      console.error('Payment processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      const errorResult = { 
        success: false, 
        error: errorMessage 
      };
      
      setResult(errorResult);
      
      // Dismiss loading toast
      dismissToast(loadingToastId);
      
      // Show error toast
      showPaymentToast(errorResult);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fillTestCard = (cardType: 'visa' | 'mastercard' | 'amex' | 'declined') => {
    const testCards = CyberSourcePaymentService.getTestCards();
    const testCard = testCards[cardType];
    
    setFormData({
      cardNumber: testCard.number,
      expiryMonth: testCard.expiryMonth,
      expiryYear: testCard.expiryYear,
      cvv: testCard.cvv
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Test Card Buttons */}
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md">
          <span className="text-sm text-gray-600 mr-2">Test Cards:</span>
          <button 
            type="button" 
            onClick={() => fillTestCard('visa')}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            Visa
          </button>
          <button 
            type="button" 
            onClick={() => fillTestCard('mastercard')}
            className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Mastercard
          </button>
          <button 
            type="button" 
            onClick={() => fillTestCard('amex')}
            className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
          >
            Amex
          </button>
          <button 
            type="button" 
            onClick={() => fillTestCard('declined')}
            className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
          >
            Declined
          </button>
        </div>

        {/* Card Number */}
        <div className="space-y-1">
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="4111111111111111"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={19}
            required
          />
          {errors.cardNumber && <span className="text-sm text-red-600">{errors.cardNumber}</span>}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700">
              Month
            </label>
            <select
              id="expiryMonth"
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.expiry ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">MM</option>
              {Array.from({length: 12}, (_, i) => (
                <option key={i+1} value={String(i+1).padStart(2, '0')}>
                  {String(i+1).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1">
            <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <select
              id="expiryYear"
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.expiry ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">YYYY</option>
              {Array.from({length: 10}, (_, i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div className="space-y-1">
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              placeholder="123"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cvv ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={4}
              required
            />
            {errors.cvv && <span className="text-sm text-red-600">{errors.cvv}</span>}
          </div>
        </div>
        
        {errors.expiry && <span className="text-sm text-red-600">{errors.expiry}</span>}
        
        {/* Submit Button */}
        <div className="pt-2">
          <CustomButton 
            type="submit" 
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Pay ${currency.toUpperCase()} ${amount}`}
          </CustomButton>
        </div>
        
        {/* Result Message */}
        {result && (
          <div className={`p-4 rounded-md ${
            result.success 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {result.success ? (
              <div>
                <h3 className="font-semibold">Payment Successful!</h3>
                <p className="text-sm">Payment ID: {result.paymentId}</p>
                <p className="text-sm">Status: {result.status}</p>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold">Payment Failed</h3>
                <p className="text-sm">Error: {result.error}</p>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default CyberSourceDirectPayment;
