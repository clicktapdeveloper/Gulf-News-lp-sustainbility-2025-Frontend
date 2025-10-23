// Environment configuration for Stripe integration
// Create a .env.local file in your project root with these variables

const normalizeApiBaseUrl = (url: string) => {
  let normalized = (url || '').trim();
  if (!normalized) return 'http://localhost:5000';
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  if (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
};

export const ENV_CONFIG = {
  // Stripe Configuration (legacy)
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  
  // CyberSource Configuration
  CYBERSOURCE_MERCHANT_ID: import.meta.env.VITE_CYBERSOURCE_MERCHANT_ID || '',
  CYBERSOURCE_KEY_ID: import.meta.env.VITE_CYBERSOURCE_KEY_ID || '',
  CYBERSOURCE_SECRET_KEY: import.meta.env.VITE_CYBERSOURCE_SECRET_KEY || '',
  CYBERSOURCE_RUN_ENVIRONMENT: import.meta.env.VITE_CYBERSOURCE_RUN_ENVIRONMENT || 'apitest.cybersource.com',
  
  // API Configuration
  API_BASE_URL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  
  // Event Configuration
  EVENT_NAME: import.meta.env.VITE_EVENT_NAME || 'Sustainability Excellence Awards 2025',
  EVENT_DATE: import.meta.env.VITE_EVENT_DATE || 'December 15, 2025',
  EVENT_LOCATION: import.meta.env.VITE_EVENT_LOCATION || 'Grand Convention Center, Dubai',
  
  // MongoDB Configuration (for reference)
  MONGODB_URI: import.meta.env.VITE_MONGODB_URI || '',
  
  // Email Configuration (for reference)
  EMAIL_USER: import.meta.env.VITE_EMAIL_USER || '',
  EMAIL_FROM: import.meta.env.VITE_EMAIL_FROM || '',
  
  // Mail Provider Configuration
  MAIL_PROVIDER: import.meta.env.VITE_MAIL_PROVIDER || 'resend',
  RESEND_API_KEY: import.meta.env.VITE_RESEND_API_KEY || '',
  RESEND_FROM_EMAIL: import.meta.env.VITE_RESEND_FROM_EMAIL || '',
  
  // Twilio Configuration (for reference)
  TWILIO_ACCOUNT_SID: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
  TWILIO_FROM_NUMBER: import.meta.env.VITE_TWILIO_FROM_NUMBER || '',
};

// Validation function to check if required environment variables are set
export const validateEnvironment = () => {
  const requiredVars = [
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'VITE_API_BASE_URL'
  ];
  
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
    console.warn('Please create a .env.local file with the required variables');
  }
  
  return missingVars.length === 0;
};
