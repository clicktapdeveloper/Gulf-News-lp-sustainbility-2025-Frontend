import React, { useEffect, useRef, useState } from 'react';
import { loadFlexLibrary, fetchCaptureContext, createMicroform, tokenizeCard, chargePayment } from '../../lib/cybersource';
import { cyberSourcePaymentService } from '../../lib/cybersource-payment-service';
import type { PaymentData } from '../../lib/cybersource-payment-service';
import { showPaymentToast, showLoadingToast, dismissToast } from '../../lib/toast';
import CustomButton from '../../screens/CustomButton';

interface CyberSourcePaymentProps {
	amount: number;
	currency: string;
	referenceId?: string;
	customerEmail?: string;
	onSuccess?: (paymentId?: string) => void;
	onError?: (message: string) => void;
	useDirectAPI?: boolean; // New prop to choose between Flex SDK and Direct API
}

const CyberSourcePayment: React.FC<CyberSourcePaymentProps> = ({ amount, currency, referenceId, customerEmail, onSuccess, onError, useDirectAPI = true }) => {
	const cardNumberRef = useRef<HTMLDivElement | null>(null);
	const cvvRef = useRef<HTMLDivElement | null>(null);
	const microformRef = useRef<any | null>(null);
	const [isReady, setIsReady] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [expiryMonth, setExpiryMonth] = useState('');
	const [expiryYear, setExpiryYear] = useState('');
	
	// Direct API form state
	const [formData, setFormData] = useState({
		cardNumber: '',
		expiryMonth: '',
		expiryYear: '',
		cvv: ''
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (useDirectAPI) {
			setIsReady(true);
			return;
		}
		
		let isMounted = true;
		(async () => {
			try {
				// Check if we're running over HTTPS or localhost
				if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
					console.warn('CyberSource Flex SDK requires HTTPS. Falling back to Direct API.');
					setIsReady(true);
					return;
				}
				
				await loadFlexLibrary();
				const captureContext = await fetchCaptureContext();
				if (!cardNumberRef.current || !cvvRef.current) return;
				const { microform } = await createMicroform({
					captureContext,
					cardNumberContainer: cardNumberRef.current,
					securityCodeContainer: cvvRef.current,
				});
				if (!isMounted) return;
				microformRef.current = microform;
				setIsReady(true);
			} catch (e) {
				console.warn('Flex SDK failed to load, falling back to Direct API:', e);
				// Fallback to Direct API if Flex SDK fails
				setIsReady(true);
			}
		})();
		return () => {
			isMounted = false;
		};
	}, [onError, useDirectAPI]);

	const onPay = async () => {
		if (useDirectAPI || !microformRef.current) {
			await handleDirectPayment();
			return;
		}
		
		setIsLoading(true);
		try {
			const { transientToken } = await tokenizeCard(microformRef.current, { expirationMonth: expiryMonth, expirationYear: expiryYear });
			const result = await chargePayment({ amount, currency, transientToken, referenceId, customerEmail });
			if (!result.success) throw new Error(result.message || 'Payment failed');
			onSuccess?.(result.paymentId);
		} catch (e) {
			console.warn('Flex SDK payment failed, falling back to Direct API:', e);
			// Fallback to Direct API if Flex SDK payment fails
			await handleDirectPayment();
		} finally {
			setIsLoading(false);
		}
	};

	// Direct API methods
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

	const handleDirectPayment = async (e?: React.FormEvent) => {
		// Prevent default form submission
		if (e) {
			e.preventDefault();
		}
		
		console.log('Form submitted, preventing default behavior');
		
		if (!validateForm()) {
			console.log('Form validation failed');
			return;
		}
		
		console.log('Starting payment processing...');
		setIsLoading(true);
		
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
			const result = await cyberSourcePaymentService.processPayment(paymentData);
			console.log('Backend response:', result);
			
			// Dismiss loading toast
			dismissToast(loadingToastId);
			
			// Show appropriate toast based on result
			const isFullySuccessful = showPaymentToast(result);
			
			if (isFullySuccessful) {
				console.log('Payment successful:', result.paymentId);
				// Reset form on success
				setFormData({
					cardNumber: '',
					expiryMonth: '',
					expiryYear: '',
					cvv: ''
				});
				
				onSuccess?.(result.paymentId);
			} else {
				console.error('Payment failed/declined:', result.error);
				onError?.(result.error || 'Payment failed');
			}
			
		} catch (error) {
			console.error('Payment processing error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Payment failed';
			
			// Dismiss loading toast
			dismissToast(loadingToastId);
			
			// Show error toast
			showPaymentToast({ success: false, error: errorMessage });
			onError?.(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			{useDirectAPI || !microformRef.current ? (
				// Direct API Form (default or fallback)
				<form onSubmit={handleDirectPayment} className="space-y-4">
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
							disabled={isLoading}
							onClick={(e) => {
								e.preventDefault();
								handleDirectPayment();
							}}
							className="min-w-40 px-6 py-2"
						>
							{isLoading ? 'Processing...' : `Pay ${currency.toUpperCase()} ${amount}`}
						</CustomButton>
					</div>
				</form>
			) : (
				// Flex SDK Form (Original)
				<>
					<div className="grid grid-cols-1 gap-3">
						<label className="block">
							<span className="text-sm">Card number</span>
							<div ref={cardNumberRef} className="mt-1 p-3 border rounded-md" />
						</label>
						<div className="grid grid-cols-3 gap-3">
							<label className="block col-span-1">
								<span className="text-sm">MM</span>
								<input value={expiryMonth} onChange={e => setExpiryMonth(e.target.value)} placeholder="MM" className="mt-1 p-3 border rounded-md w-full" />
							</label>
							<label className="block col-span-1">
								<span className="text-sm">YYYY</span>
								<input value={expiryYear} onChange={e => setExpiryYear(e.target.value)} placeholder="YYYY" className="mt-1 p-3 border rounded-md w-full" />
							</label>
							<label className="block col-span-1">
								<span className="text-sm">CVV</span>
								<div ref={cvvRef} className="mt-1 p-3 border rounded-md" />
							</label>
						</div>
					</div>

					<div className="pt-2">
						<CustomButton type="button" onClick={onPay} disabled={!isReady || isLoading} className="min-w-40 px-6 py-2">
							{isLoading ? 'Processing...' : `Pay ${currency.toUpperCase()} ${amount}`}
						</CustomButton>
					</div>
				</>
			)}
		</div>
	);
};

export default CyberSourcePayment;



