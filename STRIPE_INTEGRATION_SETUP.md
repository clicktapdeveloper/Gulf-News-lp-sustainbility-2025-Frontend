# Stripe Payment Integration Setup

This project now includes Stripe payment integration for nominations and event tickets. Follow these steps to set up the payment system:

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Event Configuration (optional)
VITE_EVENT_NAME=Sustainability Excellence Awards 2025
VITE_EVENT_DATE=December 15, 2025
VITE_EVENT_LOCATION=Grand Convention Center, Dubai
```

## 2. Stripe Setup

1. **Create a Stripe Account**: Go to [stripe.com](https://stripe.com) and create an account
2. **Get Your Keys**: 
   - Go to your Stripe Dashboard
   - Navigate to Developers > API Keys
   - Copy your **Publishable key** (starts with `pk_test_` for test mode)
   - Update `VITE_STRIPE_PUBLISHABLE_KEY` in your `.env.local` file

3. **Backend Configuration**: Make sure your backend server has the corresponding **Secret key** (starts with `sk_test_`) in its environment variables

## 3. Payment Flow

### For Nominations (`/apply-for-nomination`)
- User fills out the nomination form
- Clicks "Pay AED 199 for Register"
- Redirects to Stripe Checkout
- After successful payment, redirects to `/success` page
- User receives confirmation email

### For Event Tickets (`/register-for-attend`)
- User fills out the registration form
- Clicks submit (no payment required for this form)
- Receives confirmation email

## 4. Success and Cancel Pages

- **Success Page** (`/success`): Shows payment confirmation and next steps
- **Cancel Page** (`/cancel`): Shows when user cancels payment

## 5. Testing

### Test Cards (Stripe Test Mode)
Use these test card numbers for testing:

- **Successful Payment**: `4242 4242 4242 4242`
- **Declined Payment**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

## 6. File Structure

```
src/
├── components/
│   └── Payment/
│       ├── NominationPayment.tsx    # Payment component for nominations
│       └── EventTicketPayment.tsx   # Payment component for event tickets
├── config/
│   └── env.ts                       # Environment configuration
├── lib/
│   └── stripe.ts                    # Stripe utilities and API calls
├── success/
│   └── page.tsx                     # Payment success page
├── cancel/
│   └── page.tsx                     # Payment cancel page
└── screens/
    └── UnifiedForm/
        └── index.tsx                # Updated form with payment integration
```

## 7. Backend Integration

The frontend integrates with your existing backend endpoints:
- `POST /api/checkout_sessions` - Creates Stripe checkout session
- `GET /api/verify-payment` - Verifies payment after completion
- `POST /api/sponsorship` - Handles sponsorship requests
- `POST /api/register-attendee` - Handles attendee registration

## 8. Security Notes

- Never commit your `.env.local` file to version control
- Use test keys during development
- Switch to live keys only in production
- Always validate payments on the backend

## 9. Troubleshooting

### Common Issues:

1. **"No checkout URL provided"**: Check your Stripe publishable key
2. **CORS errors**: Ensure your backend allows requests from your frontend URL
3. **Payment verification fails**: Check your backend Stripe secret key

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test API endpoints directly
4. Check Stripe Dashboard for payment logs
