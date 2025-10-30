# Backend Implementation Guide for CyberSource Hosted Checkout

This guide provides the backend implementation needed to support the CyberSource Hosted Checkout frontend integration.

## Required Endpoints

The frontend expects these three endpoints to be implemented:

### 1. Create Payment Parameters
**POST** `/api/payments/cybersource-hosted/create-payment-params`

Creates signed payment parameters for CyberSource Hosted Checkout.

**Request Body:**
```json
{
  "amount": "1.00",
  "currency": "AED",
  "customerEmail": "customer@example.com",
  "customerFirstName": "John",
  "customerLastName": "Doe",
  "customerAddress": "123 Main Street",
  "customerCity": "Dubai",
  "customerCountry": "AE",
  "referenceNumber": "EVENT-1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "params": {
    "access_key": "your_access_key",
    "profile_id": "your_profile_id",
    "transaction_uuid": "uuid-here",
    "signed_field_names": "access_key,profile_id,transaction_uuid,...",
    "unsigned_field_names": "",
    "signed_date_time": "2025-01-21T10:30:00Z",
    "locale": "en",
    "transaction_type": "sale",
    "reference_number": "EVENT-1234567890",
    "amount": "1.00",
    "currency": "AED",
    "bill_to_email": "customer@example.com",
    "bill_to_forename": "John",
    "bill_to_surname": "Doe",
    "bill_to_address_line1": "123 Main Street",
    "bill_to_address_city": "Dubai",
    "bill_to_address_country": "AE",
    "signature": "generated_signature_here"
  }
}
```

### 2. Verify Response
**POST** `/api/payments/cybersource-hosted/verify-response`

Verifies the signature of CyberSource response.

**Request Body:**
```json
{
  "transaction_id": "1234567890",
  "decision": "ACCEPT",
  "reason_code": "100",
  "signature": "response_signature",
  "signed_field_names": "transaction_id,decision,reason_code,...",
  // ... other CyberSource response fields
}
```

**Response:**
```json
{
  "success": true
}
```

### 3. Process Successful Payment
**POST** `/api/payments/cybersource-hosted/process-success`

Processes successful payments and updates database.

**Request Body:**
```json
{
  "transaction_id": "1234567890",
  "decision": "ACCEPT",
  "reason_code": "100",
  "auth_amount": "1.00",
  "auth_code": "831000",
  "auth_time": "2025-01-21T10:30:00Z",
  // ... other CyberSource response fields
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "paymentId": "1234567890"
}
```

## Implementation Example (Node.js/Express)

```javascript
const express = require('express');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// Environment variables
const CYBERSOURCE_ACCESS_KEY = process.env.CYBERSOURCE_ACCESS_KEY;
const CYBERSOURCE_PROFILE_ID = process.env.CYBERSOURCE_PROFILE_ID;
const CYBERSOURCE_SECRET_KEY = process.env.CYBERSOURCE_SECRET_KEY;
const CYBERSOURCE_ENVIRONMENT = process.env.CYBERSOURCE_ENVIRONMENT || 'test';

// Helper function to generate signature
function generateSignature(params, secretKey) {
  const signedFieldNames = params.signed_field_names.split(',');
  const dataToSign = signedFieldNames
    .map(field => `${field}=${params[field]}`)
    .join(',');
  
  return crypto
    .createHmac('sha256', secretKey)
    .update(dataToSign)
    .digest('base64');
}

// Helper function to verify signature
function verifySignature(params, secretKey) {
  const receivedSignature = params.signature;
  const signedFieldNames = params.signed_field_names.split(',');
  
  const dataToSign = signedFieldNames
    .map(field => `${field}=${params[field]}`)
    .join(',');
  
  const calculatedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(dataToSign)
    .digest('base64');
  
  return receivedSignature === calculatedSignature;
}

// 1. Create Payment Parameters
app.post('/api/payments/cybersource-hosted/create-payment-params', (req, res) => {
  try {
    const {
      amount,
      currency,
      customerEmail,
      customerFirstName,
      customerLastName,
      customerAddress,
      customerCity,
      customerCountry,
      referenceNumber
    } = req.body;

    // Validate required fields
    if (!amount || !currency || !customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Generate unique transaction ID
    const transactionUuid = uuidv4();
    const timestamp = new Date().toISOString().replace(/\.\d{3}/, '');

    // Create payment parameters
    const params = {
      access_key: CYBERSOURCE_ACCESS_KEY,
      profile_id: CYBERSOURCE_PROFILE_ID,
      transaction_uuid: transactionUuid,
      signed_field_names: 'access_key,profile_id,transaction_uuid,unsigned_field_names,signed_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,bill_to_email,bill_to_forename,bill_to_surname,bill_to_address_line1,bill_to_address_city,bill_to_address_country',
      unsigned_field_names: '',
      signed_date_time: timestamp,
      locale: 'en',
      transaction_type: 'sale',
      reference_number: referenceNumber || `EVENT-${Date.now()}`,
      amount: amount,
      currency: currency,
      bill_to_email: customerEmail,
      bill_to_forename: customerFirstName || 'Test',
      bill_to_surname: customerLastName || 'User',
      bill_to_address_line1: customerAddress || '123 Main Street',
      bill_to_address_city: customerCity || 'Dubai',
      bill_to_address_country: customerCountry || 'AE'
    };

    // Generate signature
    params.signature = generateSignature(params, CYBERSOURCE_SECRET_KEY);

    res.json({
      success: true,
      params: params
    });

  } catch (error) {
    console.error('Error creating payment parameters:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 2. Verify Response
app.post('/api/payments/cybersource-hosted/verify-response', (req, res) => {
  try {
    const responseData = req.body;

    // Verify signature
    const isValid = verifySignature(responseData, CYBERSOURCE_SECRET_KEY);

    res.json({
      success: isValid
    });

  } catch (error) {
    console.error('Error verifying response:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 3. Process Successful Payment
app.post('/api/payments/cybersource-hosted/process-success', (req, res) => {
  try {
    const {
      transaction_id,
      decision,
      reason_code,
      auth_amount,
      auth_code,
      auth_time,
      bill_to_email,
      bill_to_forename,
      bill_to_surname
    } = req.body;

    // Verify payment was successful
    if (decision !== 'ACCEPT' || reason_code !== '100') {
      return res.status(400).json({
        success: false,
        error: 'Payment was not successful'
      });
    }

    // Here you would typically:
    // 1. Save payment record to database
    // 2. Update nomination status
    // 3. Send confirmation email
    // 4. Log transaction

    console.log('Processing successful payment:', {
      transaction_id,
      amount: auth_amount,
      customer: bill_to_email,
      timestamp: auth_time
    });

    // TODO: Implement your business logic here
    // Example:
    // await savePaymentToDatabase({
    //   transactionId: transaction_id,
    //   amount: auth_amount,
    //   customerEmail: bill_to_email,
    //   status: 'completed',
    //   timestamp: new Date()
    // });

    res.json({
      success: true,
      message: 'Payment processed successfully',
      paymentId: transaction_id
    });

  } catch (error) {
    console.error('Error processing successful payment:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Environment Variables

Make sure these environment variables are set:

```bash
# CyberSource Hosted Checkout Configuration
CYBERSOURCE_ACCESS_KEY=your_access_key_here
CYBERSOURCE_PROFILE_ID=your_profile_id_here
CYBERSOURCE_SECRET_KEY=your_secret_key_here
CYBERSOURCE_ENVIRONMENT=test

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Testing

1. **Start your backend server** on port 5000
2. **Test the endpoints** using the demo page at `/cybersource-hosted-demo`
3. **Use test card numbers** provided in the frontend documentation
4. **Check console logs** for debugging information

## Security Notes

1. **Never expose secret keys** in frontend code
2. **Always verify signatures** before processing payments
3. **Use HTTPS** in production
4. **Validate all input data** before processing
5. **Log all transactions** for audit purposes

## Next Steps

1. Implement the three endpoints in your backend
2. Test with the frontend integration
3. Add database persistence for payment records
4. Implement email notifications
5. Add proper error handling and logging
6. Deploy to production with proper security measures
