import React, { useState } from 'react';
import { X, CreditCard, Lock, Shield } from 'lucide-react';
import { cyberSourcePaymentService, CyberSourcePaymentService } from '../../lib/cybersource-payment-service';
import type { PaymentData } from '../../lib/cybersource-payment-service';
import { showPaymentToast, showLoadingToast, dismissToast } from '../../lib/toast';
import CustomButton from '../../screens/CustomButton';

interface CyberSourcePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  referenceId?: string;
  customerEmail?: string;
  onSuccess?: (paymentId?: string) => void;
  onError?: (message: string) => void;
  title?: string;
  description?: string;
}

const CyberSourcePaymentModal: React.FC<CyberSourcePaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  currency,
  // referenceId,
  // customerEmail,
  onSuccess,
  onError,
  title = "Complete Payment",
  description = "Secure payment processing powered by CyberSource"
}) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
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
      const result = await cyberSourcePaymentService.processPayment(paymentData);
      console.log('Backend response:', result);
      
      dismissToast(loadingToastId);
      
      const isFullySuccessful = showPaymentToast(result);
      
      if (isFullySuccessful) {
        console.log('Payment successful:', result.paymentId);
        // Reset form and close modal on success
        setFormData({
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: ''
        });
        onClose();
        onSuccess?.(result.paymentId);
      } else {
        console.error('Payment failed/declined:', result.error);
        onError?.(result.error || 'Payment failed');
      }
      
    } catch (error) {
      console.error('Payment processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      dismissToast(loadingToastId);
      showPaymentToast({ success: false, error: errorMessage });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        // className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-md"
        className="absolute inset-0  backdrop-blur-2xl"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[var(--secondary-color)] rounded-full">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--tertiary-color)]">{title}</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

         {/* Test Cards */}
         <div className="p-4 bg-gray-50 border-b">
           <p className="text-xs text-gray-600 mb-2">Test Cards:</p>
           <div className="flex flex-wrap gap-2">
             <button 
               type="button" 
               onClick={() => fillTestCard('visa')}
               className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
             >
               Visa
             </button>
             <button 
               type="button" 
               onClick={() => fillTestCard('mastercard')}
               className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
             >
               Mastercard
             </button>
             <button 
               type="button" 
               onClick={() => fillTestCard('amex')}
               className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
             >
               Amex
             </button>
             <button 
               type="button" 
               onClick={() => fillTestCard('declined')}
               className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
             >
               Declined
             </button>
           </div>
         </div>

         {/* Payment Form */}
         <form onSubmit={handleSubmit} className="p-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Left Column - Card Details */}
             <div className="space-y-4">
               <h3 className="text-lg font-semibold text-gray-800 mb-4">Card Information</h3>
               
               {/* Card Number */}
               <div className="space-y-2">
                 <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                   Card Number
                 </label>
                 <div className="relative">
                   <input
                     type="text"
                     id="cardNumber"
                     name="cardNumber"
                     value={formData.cardNumber}
                     onChange={handleInputChange}
                     placeholder="1234 5678 9012 3456"
                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] transition-colors ${
                       errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                     }`}
                     maxLength={19}
                     required
                   />
                   <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                 </div>
                 {errors.cardNumber && <span className="text-sm text-red-600">{errors.cardNumber}</span>}
               </div>

               {/* Expiry Date and CVV */}
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700">
                     Month
                   </label>
                   <select
                     id="expiryMonth"
                     name="expiryMonth"
                     value={formData.expiryMonth}
                     onChange={handleInputChange}
                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] transition-colors ${
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
                 
                 <div className="space-y-2">
                   <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700">
                     Year
                   </label>
                   <select
                     id="expiryYear"
                     name="expiryYear"
                     value={formData.expiryYear}
                     onChange={handleInputChange}
                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] transition-colors ${
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
               </div>
               
               {errors.expiry && <span className="text-sm text-red-600">{errors.expiry}</span>}
               
               {/* CVV */}
               <div className="space-y-2">
                 <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                   CVV
                 </label>
                 <div className="relative">
                   <input
                     type="text"
                     id="cvv"
                     name="cvv"
                     value={formData.cvv}
                     onChange={handleInputChange}
                     placeholder="123"
                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] transition-colors ${
                       errors.cvv ? 'border-red-500' : 'border-gray-300'
                     }`}
                     maxLength={4}
                     required
                   />
                   <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                 </div>
                 {errors.cvv && <span className="text-sm text-red-600">{errors.cvv}</span>}
               </div>
             </div>

             {/* Right Column - Payment Summary */}
             <div className="space-y-4">
               <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
               
               {/* Payment Amount Display */}
               <div className="p-6 bg-gradient-to-r from-[var(--primary-color)] to-[var(--card-color)] rounded-lg">
                 <div className="text-center">
                   <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                   <p className="text-3xl font-bold text-[var(--secondary-color)]">
                     {currency.toUpperCase()} {amount.toFixed(2)}
                   </p>
                 </div>
               </div>

               {/* Security Notice */}
               <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg">
                 <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                 <div>
                   <p className="text-sm text-green-800 font-medium">Secure Payment</p>
                   <p className="text-xs text-green-700">
                     Your payment information is encrypted and secure
                   </p>
                 </div>
               </div>

               {/* Submit Button */}
               <div className="pt-4">
                 <CustomButton 
                   type="submit" 
                   disabled={loading}
                   onClick={(e) => {
                     console.log('Button clicked');
                     e.preventDefault();
                     handleSubmit(e);
                   }}
                   className="w-full py-4 text-lg font-semibold"
                 >
                   {loading ? 'Processing...' : `Pay ${currency.toUpperCase()} ${amount.toFixed(2)}`}
                 </CustomButton>
               </div>
             </div>
           </div>
         </form>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t text-center">
          <p className="text-xs text-gray-500">
            Powered by CyberSource • SSL Secured
          </p>
        </div>
      </div>
    </div>
  );
};

export default CyberSourcePaymentModal;
