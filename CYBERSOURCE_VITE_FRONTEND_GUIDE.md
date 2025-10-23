# CyberSource Payment Gateway Integration - Vite Frontend Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Setup](#project-setup)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Implementation](#implementation)
7. [Components](#components)
8. [API Integration](#api-integration)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)
11. [Security Best Practices](#security-best-practices)

## 🎯 Overview

This guide covers the complete frontend integration of CyberSource payment gateway with Vite + React applications. This frontend works seamlessly with the Node.js backend implementation.

### Key Features
- ✅ Payment form with validation
- ✅ Real-time payment processing
- ✅ Token creation and management
- ✅ Error handling and user feedback
- ✅ Responsive design
- ✅ TypeScript support

## 🔧 Prerequisites

### Required Software
- Node.js 16+
- npm or yarn package manager
- Vite development server
- Backend API running (Node.js implementation)

### Required Knowledge
- React/TypeScript basics
- HTTP client usage (fetch/axios)
- Form handling and validation
- CSS/styling

## 🚀 Project Setup

### Step 1: Create Vite Project
```bash
# Create new Vite + React + TypeScript project
npm create vite@latest cybersource-frontend -- --template react-ts

# Navigate to project directory
cd cybersource-frontend

# Install dependencies
npm install
```

### Step 2: Install Additional Dependencies
```bash
# Install UI and utility libraries
npm install @types/node
npm install lucide-react  # For icons
npm install clsx          # For conditional classes
```

## 📦 Installation

### Core Dependencies
```bash
# Essential packages
npm install lucide-react clsx
npm install @types/node --save-dev
```

### Optional Dependencies
```bash
# For enhanced UI (optional)
npm install tailwindcss @tailwindcss/forms
npm install @headlessui/react

# For form handling (optional)
npm install react-hook-form @hookform/resolvers zod
```

## ⚙️ Configuration

### Environment Variables
Create `.env.local` file:

```bash
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_CYBERSOURCE_MERCHANT_ID=your_merchant_id
VITE_CYBERSOURCE_KEY_ID=your_key_id
VITE_CYBERSOURCE_SECRET_KEY=your_secret_key
VITE_CYBERSOURCE_ENVIRONMENT=sandbox
```

### Vite Configuration
Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  define: {
    global: 'globalThis',
  }
})
```

## 🔨 Implementation

### Type Definitions
Create `src/types/cybersource.ts`:

```typescript
export interface PaymentRequest {
  amount: string;
  currency: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  tokenId?: string;
  status?: string;
  error?: string;
  response?: any;
  details?: any;
}

export interface CyberSourceConfig {
  merchantID: string;
  keyId: string;
  secretKey: string;
  environment: string;
}

export interface FormErrors {
  amount?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
}
```

### Configuration Service
Create `src/services/config.ts`:

```typescript
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  cybersource: {
    merchantID: import.meta.env.VITE_CYBERSOURCE_MERCHANT_ID || '',
    keyId: import.meta.env.VITE_CYBERSOURCE_KEY_ID || '',
    secretKey: import.meta.env.VITE_CYBERSOURCE_SECRET_KEY || '',
    environment: import.meta.env.VITE_CYBERSOURCE_ENVIRONMENT || 'sandbox'
  }
};

// Debug logging (remove in production)
if (import.meta.env.DEV) {
  console.log('Frontend Config:', {
    apiBaseUrl: config.apiBaseUrl,
    cybersource: {
      merchantID: config.cybersource.merchantID,
      keyId: config.cybersource.keyId,
      secretKey: config.cybersource.secretKey ? '***hidden***' : 'NOT_SET',
      environment: config.cybersource.environment
    }
  });
}
```

### API Service
Create `src/services/api.ts`:

```typescript
import { PaymentRequest, PaymentResponse } from '../types/cybersource';
import { config } from './config';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  private async makeRequest(endpoint: string, data: any): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred'
      };
    }
  }

  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    return await this.makeRequest('/api/payment', paymentData);
  }

  async createToken(paymentData: PaymentRequest): Promise<PaymentResponse> {
    return await this.makeRequest('/api/token', paymentData);
  }

  async testSignature(): Promise<PaymentResponse> {
    return await this.makeRequest('/api/signature-test', { test: true });
  }

  async getConfigStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/config-status`);
      return await response.json();
    } catch (error: any) {
      return { error: error.message };
    }
  }
}

export const apiService = new ApiService();
```

### Validation Utilities
Create `src/utils/validation.ts`:

```typescript
import { FormErrors } from '../types/cybersource';

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleanNumber);
};

export const validateExpiryDate = (month: string, year: string): boolean => {
  const expiryDate = new Date(parseInt(year), parseInt(month) - 1);
  return expiryDate > new Date();
};

export const validateAmount = (amount: string): boolean => {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount > 0 && numAmount <= 999999.99;
};

export const validateCVV = (cvv: string, cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  const isAmex = cleanNumber.startsWith('34') || cleanNumber.startsWith('37');
  const expectedLength = isAmex ? 4 : 3;
  return /^\d+$/.test(cvv) && cvv.length === expectedLength;
};

export const validateForm = (formData: any): FormErrors => {
  const errors: FormErrors = {};

  if (!validateAmount(formData.amount)) {
    errors.amount = 'Please enter a valid amount between $0.01 and $999,999.99';
  }

  if (!validateCardNumber(formData.cardNumber)) {
    errors.cardNumber = 'Please enter a valid card number (13-19 digits)';
  }

  if (!validateExpiryDate(formData.expiryMonth, formData.expiryYear)) {
    errors.expiryMonth = 'Please select a future expiry date';
    errors.expiryYear = 'Please select a future expiry date';
  }

  if (!validateCVV(formData.cvv, formData.cardNumber)) {
    const isAmex = formData.cardNumber.replace(/\s/g, '').startsWith('34') || 
                   formData.cardNumber.replace(/\s/g, '').startsWith('37');
    errors.cvv = isAmex ? 'Please enter a valid 4-digit CVV' : 'Please enter a valid 3-digit CVV';
  }

  return errors;
};

export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return v;
  }
};

export const detectCardType = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  if (/^6/.test(cleanNumber)) return 'discover';
  
  return 'unknown';
};
```

## 🧩 Components

### Payment Form Component
Create `src/components/PaymentForm.tsx`:

```typescript
import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { PaymentRequest, PaymentResponse, FormErrors } from '../types/cybersource';
import { apiService } from '../services/api';
import { validateForm, formatCardNumber, detectCardType } from '../utils/validation';
import clsx from 'clsx';

export default function PaymentForm() {
  const [formData, setFormData] = useState<PaymentRequest>({
    amount: '10.00',
    currency: 'USD',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PaymentResponse | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formatted = formatCardNumber(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setResult(null);

    try {
      const response = await apiService.processPayment(formData);
      setResult(response);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Payment processing failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createToken = async () => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setResult(null);

    try {
      const response = await apiService.createToken(formData);
      setResult(response);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Token creation failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cardType = detectCardType(formData.cardNumber);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-6">
        <CreditCard className="w-8 h-8 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">CyberSource Payment</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className={clsx(
                "w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.amount ? "border-red-500" : "border-gray-300"
              )}
              placeholder="0.00"
              required
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.amount}
            </p>
          )}
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
          </select>
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              className={clsx(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.cardNumber ? "border-red-500" : "border-gray-300"
              )}
              maxLength={19}
              required
            />
            {cardType !== 'unknown' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className={clsx(
                  "w-6 h-4 rounded text-xs flex items-center justify-center text-white font-bold",
                  cardType === 'visa' && "bg-blue-600",
                  cardType === 'mastercard' && "bg-red-600",
                  cardType === 'amex' && "bg-green-600",
                  cardType === 'discover' && "bg-orange-600"
                )}>
                  {cardType.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.cardNumber}
            </p>
          )}
        </div>

        {/* Expiry Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleInputChange}
              className={clsx(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.expiryMonth ? "border-red-500" : "border-gray-300"
              )}
              required
            >
              <option value="">MM</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {String(i + 1).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleInputChange}
              className={clsx(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.expiryYear ? "border-red-500" : "border-gray-300"
              )}
              required
            >
              <option value="">YYYY</option>
              {Array.from({ length: 10 }, (_, i) => {
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

        {/* CVV */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVV
          </label>
          <div className="relative">
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              placeholder="123"
              className={clsx(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.cvv ? "border-red-500" : "border-gray-300"
              )}
              maxLength={4}
              required
            />
            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.cvv && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.cvv}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Process Payment
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={createToken}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Create Token
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results */}
      {result && (
        <div className={clsx(
          "mt-6 p-4 rounded-md",
          result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        )}>
          <div className="flex items-center mb-2">
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            )}
            <h3 className={clsx(
              "text-lg font-semibold",
              result.success ? "text-green-800" : "text-red-800"
            )}>
              {result.success ? 'Success!' : 'Error'}
            </h3>
          </div>
          
          {result.success ? (
            <div className="text-sm text-green-700">
              <p><strong>Payment ID:</strong> {result.paymentId || result.tokenId}</p>
              <p><strong>Status:</strong> {result.status}</p>
            </div>
          ) : (
            <p className="text-sm text-red-700">{result.error}</p>
          )}
          
          {result.response && (
            <details className="mt-2">
              <summary className="text-sm font-medium cursor-pointer">View Full Response</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(result.response, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
```

### Test Cards Component
Create `src/components/TestCards.tsx`:

```typescript
import React from 'react';
import { CreditCard, Copy, Check } from 'lucide-react';

interface TestCard {
  type: string;
  number: string;
  cvv: string;
  color: string;
}

const testCards: TestCard[] = [
  { type: 'Visa', number: '4111111111111111', cvv: '123', color: 'bg-blue-600' },
  { type: 'Mastercard', number: '5555555555554444', cvv: '123', color: 'bg-red-600' },
  { type: 'American Express', number: '378282246310005', cvv: '1234', color: 'bg-green-600' },
  { type: 'Discover', number: '6011111111111117', cvv: '123', color: 'bg-orange-600' },
];

export default function TestCards() {
  const [copiedCard, setCopiedCard] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, cardType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCard(cardType);
      setTimeout(() => setCopiedCard(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CreditCard className="w-5 h-5 mr-2" />
        Test Card Numbers
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testCards.map((card) => (
          <div key={card.type} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-5 ${card.color} rounded text-xs flex items-center justify-center text-white font-bold`}>
                {card.type.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700">{card.type}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Number:</span>
                <div className="flex items-center">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-2">
                    {card.number}
                  </code>
                  <button
                    onClick={() => copyToClipboard(card.number, card.type)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {copiedCard === card.type ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">CVV:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {card.cvv}
                </code>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Use any future expiry date. These are test cards that won't charge real money.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Configuration Status Component
Create `src/components/ConfigStatus.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';

interface ConfigStatus {
  merchantID: string;
  keyId: string;
  secretKey: string;
  runEnvironment: string;
  isConfigured: boolean;
}

export default function ConfigStatus() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigStatus = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const status = await apiService.getConfigStatus();
      setConfigStatus(status);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigStatus();
  }, []);

  const getStatusIcon = (isConfigured: boolean) => {
    if (isLoading) return <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />;
    if (error) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return isConfigured ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusText = (isConfigured: boolean) => {
    if (isLoading) return 'Checking...';
    if (error) return 'Error checking status';
    return isConfigured ? 'All credentials configured' : 'Credentials need setup';
  };

  const getStatusColor = (isConfigured: boolean) => {
    if (isLoading) return 'text-blue-600';
    if (error) return 'text-yellow-600';
    return isConfigured ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Configuration Status</h2>
        <button
          onClick={fetchConfigStatus}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Overall Status</span>
          <div className="flex items-center">
            {getStatusIcon(configStatus?.isConfigured ?? false)}
            <span className={`ml-2 font-medium ${getStatusColor(configStatus?.isConfigured ?? false)}`}>
              {getStatusText(configStatus?.isConfigured ?? false)}
            </span>
          </div>
        </div>

        {configStatus && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Merchant ID</span>
              <span className={`text-sm ${configStatus.merchantID === 'your_merchant_id' ? 'text-red-600' : 'text-green-600'}`}>
                {configStatus.merchantID === 'your_merchant_id' ? '❌ Not Set' : '✅ Configured'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Key ID</span>
              <span className={`text-sm ${configStatus.keyId === 'your_key_id' ? 'text-red-600' : 'text-green-600'}`}>
                {configStatus.keyId === 'your_key_id' ? '❌ Not Set' : '✅ Configured'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Secret Key</span>
              <span className={`text-sm ${configStatus.secretKey === 'your_shared_secret' ? 'text-red-600' : 'text-green-600'}`}>
                {configStatus.secretKey === 'your_shared_secret' ? '❌ Not Set' : '✅ Configured'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Environment</span>
              <span className="text-sm text-blue-600">{configStatus.runEnvironment}</span>
            </div>
          </>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

## 🌐 API Integration

### Main App Component
Update `src/App.tsx`:

```typescript
import React, { useState } from 'react';
import PaymentForm from './components/PaymentForm';
import TestCards from './components/TestCards';
import ConfigStatus from './components/ConfigStatus';
import { Settings, CreditCard, TestTube } from 'lucide-react';

type TabType = 'payment' | 'test-cards' | 'config';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('payment');

  const tabs = [
    { id: 'payment' as TabType, label: 'Payment Form', icon: CreditCard },
    { id: 'test-cards' as TabType, label: 'Test Cards', icon: TestTube },
    { id: 'config' as TabType, label: 'Configuration', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                CyberSource Payment Integration
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Vite + React + TypeScript Frontend
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {activeTab === 'payment' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Process Payment
              </h2>
              <p className="text-gray-600">
                Test payment processing with CyberSource sandbox
              </p>
            </div>
            <PaymentForm />
          </div>
        )}

        {activeTab === 'test-cards' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Test Card Numbers
              </h2>
              <p className="text-gray-600">
                Use these test cards for development and testing
              </p>
            </div>
            <TestCards />
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Configuration Status
              </h2>
              <p className="text-gray-600">
                Check your CyberSource credentials and configuration
              </p>
            </div>
            <ConfigStatus />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>CyberSource Payment Integration - Frontend Demo</p>
            <p className="mt-1">
              Make sure your backend API is running on{' '}
              <code className="bg-gray-100 px-1 rounded">http://localhost:3001</code>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

## 🧪 Testing

### Test Card Numbers
```typescript
const testCards = [
  { type: 'Visa', number: '4111111111111111', cvv: '123' },
  { type: 'Mastercard', number: '5555555555554444', cvv: '123' },
  { type: 'American Express', number: '378282246310005', cvv: '1234' },
  { type: 'Discover', number: '6011111111111117', cvv: '123' },
];
```

### Running Tests
```bash
# Start development server
npm run dev

# Run tests (if configured)
npm run test

# Build for production
npm run build
```

### Manual Testing Checklist
- [ ] Form validation works correctly
- [ ] Card number formatting functions properly
- [ ] Payment processing returns expected response
- [ ] Token creation works
- [ ] Error handling displays appropriate messages
- [ ] Configuration status shows correct information
- [ ] Responsive design works on mobile devices

## 🐛 Troubleshooting

### Common Frontend Issues

#### 1. CORS Errors
**Error**: `Access to fetch at 'http://localhost:3001' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution**: 
- Ensure backend has CORS enabled
- Use Vite proxy configuration
- Check API base URL configuration

#### 2. Network Errors
**Error**: `Network error occurred`

**Solution**:
- Verify backend API is running
- Check API base URL in environment variables
- Ensure network connectivity

#### 3. Form Validation Issues
**Error**: Form submits with invalid data

**Solution**:
- Check validation functions
- Verify input event handlers
- Ensure error state management

#### 4. Styling Issues
**Error**: Components not styled correctly

**Solution**:
- Install and configure Tailwind CSS
- Check CSS imports
- Verify class names

### Debug Tools

#### Console Logging
```typescript
// Enable debug logging in development
if (import.meta.env.DEV) {
  console.log('Payment data:', formData);
  console.log('API response:', result);
}
```

#### Network Tab
- Open browser DevTools
- Go to Network tab
- Monitor API requests and responses
- Check for failed requests

## 🔒 Security Best Practices

### 1. Environment Variables
```bash
# Never commit sensitive data
VITE_API_BASE_URL=http://localhost:3001
VITE_CYBERSOURCE_MERCHANT_ID=your_merchant_id
VITE_CYBERSOURCE_KEY_ID=your_key_id
VITE_CYBERSOURCE_SECRET_KEY=your_secret_key
```

### 2. Input Sanitization
```typescript
// Sanitize user input
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '');
};
```

### 3. HTTPS in Production
```typescript
// Use HTTPS in production
const apiBaseUrl = import.meta.env.PROD 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:3001';
```

### 4. Error Handling
```typescript
// Don't expose sensitive information in errors
const handleError = (error: any) => {
  console.error('Payment error:', error);
  return {
    success: false,
    error: 'Payment processing failed'
  };
};
```

## 📚 Additional Resources

### Documentation
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

### UI Libraries
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.com/)
- [Lucide React](https://lucide.dev/)

### Form Handling
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

---

## 📝 Project Structure

```
cybersource-frontend/
├── src/
│   ├── components/
│   │   ├── PaymentForm.tsx
│   │   ├── TestCards.tsx
│   │   └── ConfigStatus.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── config.ts
│   ├── types/
│   │   └── cybersource.ts
│   ├── utils/
│   │   └── validation.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.local
├── vite.config.ts
├── package.json
└── README.md
```

---

## 📝 Changelog

### Version 1.0.0
- Initial Vite + React implementation
- Payment form with validation
- Test cards component
- Configuration status checking
- TypeScript support

### Version 1.1.0
- Enhanced error handling
- Improved UI/UX
- Better form validation
- Responsive design

---

**Last Updated**: December 2024  
**Compatible With**: Node.js Backend Implementation  
**License**: MIT
