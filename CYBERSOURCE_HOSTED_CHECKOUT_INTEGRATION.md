# CyberSource Hosted Checkout Integration

This document explains the CyberSource Hosted Checkout integration implemented for the Gulf News Sustainability Excellence Awards 2025 frontend.

## Overview

The CyberSource Hosted Checkout integration provides a secure payment solution where customers are redirected to CyberSource's secure payment page to enter their card details. This approach ensures PCI compliance as sensitive payment data never touches your servers.

## Architecture Flow

1. **User submits nomination form** - Collects basic details and nomination information
2. **Server prepares payment request** - Creates signed payment parameters for CyberSource
3. **Redirect to CyberSource Hosted Checkout** - User is redirected to secure payment page
4. **Customer completes payment** - Payment processing handled by CyberSource
5. **CyberSource sends result back** - Customer redirected to return URL
6. **Website verifies response** - Signature verification and payment processing

## Components Created

### 1. CyberSource Hosted Checkout Service (`src/lib/cybersource-hosted-checkout.ts`)

Core service handling:
- Payment parameter creation
- Response signature verification
- Successful payment processing
- Error handling

**Key Methods:**
- `createPaymentParams()` - Creates signed payment parameters
- `verifyResponse()` - Verifies CyberSource response signature
- `processSuccessfulPayment()` - Processes successful payments on backend

### 2. CyberSource Hosted Checkout Component (`src/components/Payment/CyberSourceHostedCheckout.tsx`)

React component that:
- Displays payment summary
- Handles payment initiation
- Redirects to CyberSource Hosted Checkout
- Provides user feedback

**Props:**
- `amount` - Payment amount
- `currency` - Payment currency
- `customerEmail` - Customer email (required)
- `customerFirstName`, `customerLastName` - Customer details
- `customerAddress`, `customerCity`, `customerCountry` - Address details
- `referenceNumber` - Payment reference
- `onSuccess`, `onError`, `onCancel` - Event handlers

### 3. CyberSource Return Handler (`src/components/Payment/CyberSourceReturnHandler.tsx`)

Handles return from CyberSource:
- Parses response data from URL parameters
- Verifies response signature
- Processes successful payments
- Displays success/failure messages
- Handles navigation

### 4. Updated Nomination Payment (`src/components/Payment/NominationPayment.tsx`)

Updated to use Hosted Checkout instead of modal:
- Shows payment button initially
- Displays Hosted Checkout component when clicked
- Handles payment success/failure
- Provides back navigation

## Environment Configuration

### Frontend Environment Variables (`.env.local`)

```bash
# CyberSource Hosted Checkout Configuration
VITE_CYBERSOURCE_ACCESS_KEY=your_access_key_here
VITE_CYBERSOURCE_PROFILE_ID=your_profile_id_here
VITE_CYBERSOURCE_ENVIRONMENT=test

# API Configuration
VITE_API_BASE_URL=http://localhost:5000
```

### Backend Environment Variables (`.env`)

```bash
# CyberSource Hosted Checkout Configuration
CYBERSOURCE_ACCESS_KEY=your_access_key_here
CYBERSOURCE_PROFILE_ID=your_profile_id_here
CYBERSOURCE_ENVIRONMENT=test
```

## Routes Added

### 1. CyberSource Return Handler (`/cybersource-return`)

Handles return from CyberSource Hosted Checkout:
- Processes payment results
- Verifies signatures
- Updates payment status
- Redirects to appropriate success/failure pages

### 2. Demo Page (`/cybersource-hosted-demo`)

Test page for CyberSource Hosted Checkout:
- Form to input payment details
- Test card numbers provided
- Payment flow demonstration

## Usage Examples

### Basic Usage

```tsx
import CyberSourceHostedCheckout from './components/Payment/CyberSourceHostedCheckout';

<CyberSourceHostedCheckout
  amount={199}
  currency="AED"
  customerEmail="customer@example.com"
  customerFirstName="John"
  customerLastName="Doe"
  onSuccess={(paymentId) => console.log('Payment successful:', paymentId)}
  onError={(error) => console.error('Payment error:', error)}
/>
```

### Integration with Nomination Form

The nomination form automatically uses the Hosted Checkout when the "Pay AED 199 for Register" button is clicked. The flow is:

1. User fills out nomination form
2. Clicks "Pay AED 199 for Register"
3. Hosted Checkout component appears
4. User clicks "Pay with CyberSource"
5. Redirected to CyberSource payment page
6. After payment, redirected to `/cybersource-return`
7. Payment verified and processed
8. User redirected to thank you page

## Test Card Numbers

For testing purposes, use these test card numbers:

- **Visa:** 4111111111111111
- **Mastercard:** 5555555555554444
- **American Express:** 378282246310005
- **Declined:** 4000000000000002

Use any future expiry date and any 3-4 digit CVV.

## Security Features

1. **PCI Compliance** - No card data stored on your servers
2. **Signature Verification** - All responses verified with HMAC signatures
3. **Secure Redirect** - HTTPS-only communication with CyberSource
4. **Environment Separation** - Test and production environments properly separated

## Error Handling

The integration includes comprehensive error handling:

- Network errors
- Signature verification failures
- Payment declines
- Backend processing errors
- User cancellations

All errors are logged and appropriate user messages are displayed.

## Backend Requirements

The frontend expects these backend endpoints:

1. **POST** `/api/payments/cybersource-hosted/create-payment-params`
   - Creates signed payment parameters
   - Returns CyberSource parameters with signature

2. **POST** `/api/payments/cybersource-hosted/verify-response`
   - Verifies CyberSource response signature
   - Returns verification result

3. **POST** `/api/payments/cybersource-hosted/process-success`
   - Processes successful payments
   - Updates database records
   - Sends confirmation emails

## Testing

1. **Demo Page** - Visit `/cybersource-hosted-demo` to test the integration
2. **Nomination Form** - Use the nomination form to test the full flow
3. **Test Cards** - Use provided test card numbers for testing
4. **Environment** - Ensure test environment is configured

## Production Deployment

Before going live:

1. Update environment variables to production values
2. Configure production CyberSource credentials
3. Set up proper return URLs
4. Test with real (small) transactions
5. Monitor logs and error rates

## Support

For issues or questions:

1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure backend endpoints are responding
4. Test with provided test card numbers
5. Review CyberSource documentation for additional details
