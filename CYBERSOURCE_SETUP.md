# CyberSource Payment Gateway Setup Guide

## Issue Resolution: "Failed to load CyberSource Flex SDK"

The error you're seeing occurs because CyberSource Flex SDK requires HTTPS for security reasons, but your development server is running on HTTP.

## Solution 1: Enable HTTPS in Development (Recommended)

I've updated your `vite.config.ts` to enable HTTPS. Now restart your development server:

```bash
npm run dev
```

Your app will now run on `https://localhost:3000` instead of `http://localhost:3000`.

**Note**: Your browser will show a security warning about the self-signed certificate. Click "Advanced" and "Proceed to localhost" to continue.

## Solution 2: Alternative Development Setup

If you prefer not to use HTTPS in development, you can use a tunneling service:

### Using ngrok (Recommended for testing)

1. Install ngrok:
   ```bash
   npm install -g ngrok
   ```

2. Start your regular HTTP server:
   ```bash
   npm run dev
   ```

3. In another terminal, create an HTTPS tunnel:
   ```bash
   ngrok http 3000
   ```

4. Use the HTTPS URL provided by ngrok (e.g., `https://abc123.ngrok.io`)

## Required Environment Variables

Make sure you have these CyberSource credentials in your `.env.local` file:

```env
# CyberSource Configuration
VITE_CYBERSOURCE_MERCHANT_ID=your_merchant_id_here
VITE_CYBERSOURCE_KEY_ID=your_key_id_here
VITE_CYBERSOURCE_SECRET_KEY=your_secret_key_here
VITE_CYBERSOURCE_ENVIRONMENT=sandbox
```

## Backend Requirements

Your backend server needs to implement these CyberSource endpoints:

1. **Capture Context Endpoint**:
   ```
   GET /api/payments/cybersource/capture-context
   ```

2. **Charge Payment Endpoint**:
   ```
   POST /api/payments/cybersource/charge
   ```

## Testing CyberSource Integration

1. Start your development server with HTTPS
2. Navigate to your payment form
3. Use CyberSource test card numbers:
   - **Visa**: 4111111111111111
   - **Mastercard**: 5555555555554444
   - **CVV**: Any 3-digit number
   - **Expiry**: Any future date

## Troubleshooting

### Still getting "Failed to load CyberSource Flex SDK"?

1. **Check HTTPS**: Ensure you're accessing the site via `https://localhost:3000`
2. **Check Network**: Open browser dev tools → Network tab to see if the SDK is loading
3. **Check Console**: Look for any CORS or security errors
4. **Check Environment**: Verify your CyberSource credentials are correct

### Browser Security Warnings

When using HTTPS in development, browsers will show security warnings about self-signed certificates. This is normal and safe for development.

## Production Deployment

For production, ensure:
- Your domain has a valid SSL certificate
- CyberSource credentials are set to production environment
- All environment variables are properly configured

## Need Help?

If you're still experiencing issues:
1. Check the browser console for detailed error messages
2. Verify your CyberSource merchant account is active
3. Ensure your backend CyberSource endpoints are implemented
4. Test with CyberSource's sandbox environment first
