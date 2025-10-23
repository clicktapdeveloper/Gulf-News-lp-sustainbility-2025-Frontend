# CyberSource Payment Gateway Implementation

This implementation provides a complete CyberSource payment gateway integration using the direct HTTP API approach as outlined in the CyberSource API Guide.

## 🚀 Features

- **Direct API Integration**: Direct HTTP calls to CyberSource APIs for better control and debugging
- **Flex SDK Support**: Backward compatibility with existing Flex SDK implementation
- **Multiple Payment Methods**: Support for direct payment processing, token creation, and legacy charge
- **Comprehensive Error Handling**: Detailed error messages and validation
- **Test Components**: Built-in test components for debugging and development
- **TypeScript Support**: Full TypeScript implementation with proper type definitions

## 📁 File Structure

```
src/
├── lib/
│   └── cybersource-payment-service.ts    # Main payment service class
├── components/
│   └── Payment/
│       ├── CyberSourceDirectPayment.tsx   # Direct API payment component
│       ├── CyberSourceSignatureTest.tsx   # Signature test component
│       └── CyberSourcePayment.tsx         # Updated component with both methods
└── cybersource-test/
    └── page.tsx                           # Test page for development
```

## 🔧 Setup

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
# CyberSource Configuration
VITE_CYBERSOURCE_MERCHANT_ID=your_merchant_id_here
VITE_CYBERSOURCE_KEY_ID=your_key_id_here
VITE_CYBERSOURCE_SECRET_KEY=your_secret_key_here
VITE_CYBERSOURCE_RUN_ENVIRONMENT=apitest.cybersource.com

# API Configuration
VITE_API_BASE_URL=http://localhost:5000
```

### 2. Backend Server

Ensure your backend server is running with the CyberSource API endpoints:

- `POST /api/payments/cybersource/process` - Direct payment processing
- `POST /api/payments/cybersource/token` - Create payment token
- `POST /api/payments/cybersource/charge` - Legacy charge with transient token
- `POST /api/payments/cybersource/signature-test` - Test signature generation

## 💻 Usage

### Basic Payment Processing

```tsx
import { cyberSourcePaymentService } from '../lib/cybersource-payment-service';

// Process a payment
const paymentData = {
  amount: '10.00',
  currency: 'AED',
  cardNumber: '4111111111111111',
  expiryMonth: '12',
  expiryYear: '2025',
  cvv: '123'
};

try {
  const result = await cyberSourcePaymentService.processPayment(paymentData);
  console.log('Payment successful:', result.paymentId);
} catch (error) {
  console.error('Payment failed:', error.message);
}
```

### Using Payment Components

#### Direct API Component (Recommended)

```tsx
import CyberSourceDirectPayment from '../components/Payment/CyberSourceDirectPayment';

<CyberSourceDirectPayment
  amount={10.00}
  currency="AED"
  referenceId="ORDER-123"
  customerEmail="customer@example.com"
  onSuccess={(paymentId) => console.log('Success:', paymentId)}
  onError={(error) => console.error('Error:', error)}
/>
```

#### Updated Component with Method Selection

```tsx
import CyberSourcePayment from '../components/Payment/CyberSourcePayment';

// Use Direct API (recommended)
<CyberSourcePayment
  amount={10.00}
  currency="AED"
  useDirectAPI={true}
  onSuccess={(paymentId) => console.log('Success:', paymentId)}
  onError={(error) => console.error('Error:', error)}
/>

// Use Flex SDK (legacy)
<CyberSourcePayment
  amount={10.00}
  currency="AED"
  useDirectAPI={false}
  onSuccess={(paymentId) => console.log('Success:', paymentId)}
  onError={(error) => console.error('Error:', error)}
/>
```

### Testing

#### Signature Test

```tsx
import CyberSourceSignatureTest from '../components/Payment/CyberSourceSignatureTest';

<CyberSourceSignatureTest />
```

#### Complete Test Page

Visit `/cybersource-test` to access the comprehensive test page that includes:
- API connection testing
- Payment method selection
- Test card buttons
- Real-time payment processing
- Error handling demonstration

## 🧪 Test Cards

| Card Type | Number | CVV | Expiry |
|-----------|--------|-----|--------|
| Visa | 4111111111111111 | Any 3 digits | Any future date |
| Mastercard | 5555555555554444 | Any 3 digits | Any future date |
| American Express | 378282246310005 | Any 4 digits | Any future date |
| Declined | 4000000000000002 | Any 3 digits | Any future date |

## 🔍 API Methods

### CyberSourcePaymentService

#### `processPayment(paymentData: PaymentData): Promise<PaymentResponse>`
Process a payment directly with card details.

#### `createToken(cardData: CardData): Promise<string>`
Create a reusable payment token.

#### `chargePayment(chargeData: ChargeData): Promise<PaymentResponse>`
Process payment using legacy charge endpoint with transient token.

#### `testSignature(): Promise<SignatureTestResponse>`
Test signature generation for debugging.

#### `getTestCards(): TestCards`
Get test card numbers for development.

## ⚠️ Error Handling

The implementation includes comprehensive error handling:

- **Validation Errors**: Input validation with detailed error messages
- **Network Errors**: Proper handling of network failures and SSL issues
- **API Errors**: CyberSource API error responses
- **User-Friendly Messages**: Clear error messages for end users

## 🔒 Security Features

- **Input Validation**: Client-side validation for all payment fields
- **Environment Variables**: Secure credential management
- **HTTPS Required**: Ensures secure communication
- **No Card Storage**: Card details are never stored locally

## 🚀 Quick Start

1. **Set up environment variables** in `.env.local`
2. **Start your backend server** with CyberSource endpoints
3. **Test the signature endpoint** to verify connectivity
4. **Use the test page** at `/cybersource-test` for development
5. **Integrate components** into your application

## 📚 Additional Resources

- [CyberSource API Guide](./CYBERSOURCE_API_GUIDE.md) - Comprehensive API documentation
- [CyberSource Setup Guide](./CYBERSOURCE_SETUP.md) - Setup instructions
- [Test Page](./src/cybersource-test/page.tsx) - Complete test implementation

## 🔄 Migration from Flex SDK

If you're migrating from the Flex SDK implementation:

1. Set `useDirectAPI={true}` in your existing `CyberSourcePayment` components
2. Update environment variables to use `VITE_CYBERSOURCE_RUN_ENVIRONMENT`
3. Test with the signature test endpoint
4. Gradually migrate components to use `CyberSourceDirectPayment`

The implementation maintains backward compatibility, so existing Flex SDK implementations will continue to work.
