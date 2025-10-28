# Trade License Upload API Implementation Guide

## Overview
The Trade License field has been converted from a text input to a PDF upload field, similar to the `supportingDocument` field. This document provides backend implementation instructions.

## Frontend Changes
- **Field Type**: Changed from `text` to `pdf-upload`
- **File Limit**: 1 file maximum
- **File Size**: 10MB maximum
- **File Format**: PDF only

## API Endpoint
**POST** `/api/nominations`

## Request Body Structure

The `tradeLicense` field now accepts a comma-separated string of uploaded file URLs, similar to `supportingDocument`.

### Updated Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "companyName": "Example Company",
  "designation": "CEO",
  "phone": "+971501234567",
  "tradeLicense": "https://example.com/uploads/trade-license-123.pdf",
  "supportingDocument": "https://example.com/uploads/doc1.pdf,https://example.com/uploads/doc2.pdf",
  "message": "Optional message"
}
```

### Field Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | string | Yes | First name |
| `lastName` | string | Yes | Last name |
| `email` | string | Yes | Email address |
| `companyName` | string | Yes | Company name |
| `designation` | string | Yes | Job title/designation |
| `phone` | string | Yes | Phone number with country code |
| `tradeLicense` | string \| null | Optional | Comma-separated URLs of uploaded trade license PDF files (max 1 file) |
| `supportingDocument` | string \| null | Optional | Comma-separated URLs of uploaded supporting documents (max 3 files) |
| `message` | string \| null | Optional | Message/description |

## Backend Implementation

### 1. Database Schema Update

**MongoDB/NoSQL Example:**
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  companyName: String,
  designation: String,
  phone: String,
  tradeLicense: String | null,  // Comma-separated URLs (single file)
  supportingDocument: String | null,  // Comma-separated URLs (max 3 files)
  message: String | null,
  status: String,  // 'unpaid' or 'paid'
  // ... payment fields
  createdAt: Date,
  updatedAt: Date
}
```

**SQL Example:**
```sql
CREATE TABLE nominations (
  id VARCHAR(255) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  trade_license TEXT NULL,
  supporting_document TEXT NULL,
  message TEXT NULL,
  status VARCHAR(50) DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. API Endpoint Implementation

#### Node.js/Express Example

```javascript
// POST /api/nominations
app.post('/api/nominations', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      companyName,
      designation,
      phone,
      tradeLicense,
      supportingDocument,
      message
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !companyName || !designation || !phone) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Validate trade license (if provided)
    if (tradeLicense) {
      // tradeLicense is a comma-separated string of URLs
      // For single file: "https://example.com/file.pdf"
      const tradeLicenseUrls = tradeLicense.split(',').filter(url => url.trim());
      
      if (tradeLicenseUrls.length > 1) {
        return res.status(400).json({ 
          error: 'Only one trade license file is allowed' 
        });
      }
    }

    // Validate supporting document (if provided)
    if (supportingDocument) {
      const supportingUrls = supportingDocument.split(',').filter(url => url.trim());
      
      if (supportingUrls.length > 3) {
        return res.status(400).json({ 
          error: 'Maximum 3 supporting documents allowed' 
        });
      }
    }

    // Create nomination record
    const nomination = await Nomination.create({
      firstName,
      lastName,
      email,
      companyName,
      designation,
      phone,
      tradeLicense: tradeLicense || null,
      supportingDocument: supportingDocument || null,
      message: message || null,
      status: 'unpaid',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      _id: nomination._id,
      id: nomination._id,
      success: true
    });
  } catch (error) {
    console.error('Error creating nomination:', error);
    res.status(500).json({ 
      error: 'Failed to create nomination' 
    });
  }
});
```

#### Python/Flask Example

```python
from flask import Flask, request, jsonify
from datetime import datetime

@app.route('/api/nominations', methods=['POST'])
def create_nomination():
    try:
        data = request.get_json()
        
        # Extract fields
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        company_name = data.get('companyName')
        designation = data.get('designation')
        phone = data.get('phone')
        trade_license = data.get('tradeLicense')
        supporting_document = data.get('supportingDocument')
        message = data.get('message')
        
        # Validate required fields
        if not all([first_name, last_name, email, company_name, designation, phone]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Validate trade license (if provided)
        if trade_license:
            trade_license_urls = [url.strip() for url in trade_license.split(',') if url.strip()]
            
            if len(trade_license_urls) > 1:
                return jsonify({'error': 'Only one trade license file is allowed'}), 400
        
        # Validate supporting document (if provided)
        if supporting_document:
            supporting_urls = [url.strip() for url in supporting_document.split(',') if url.strip()]
            
            if len(supporting_urls) > 3:
                return jsonify({'error': 'Maximum 3 supporting documents allowed'}), 400
        
        # Create nomination record
        nomination = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'company_name': company_name,
            'designation': designation,
            'phone': phone,
            'trade_license': trade_license if trade_license else None,
            'supporting_document': supporting_document if supporting_document else None,
            'message': message if message else None,
            'status': 'unpaid',
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        
        # Insert into database (example with MongoDB)
        result = collection.insert_one(nomination)
        
        return jsonify({
            '_id': str(result.inserted_id),
            'id': str(result.inserted_id),
            'success': True
        }), 201
        
    except Exception as e:
        print(f'Error creating nomination: {e}')
        return jsonify({'error': 'Failed to create nomination'}), 500
```

### 3. Data Validation Rules

1. **tradeLicense**:
   - Optional field (can be `null` or `undefined`)
   - If provided, must be a string of comma-separated URLs
   - Maximum 1 file allowed
   - URL format validation recommended

2. **supportingDocument**:
   - Optional field (can be `null` or `undefined`)
   - If provided, must be a string of comma-separated URLs
   - Maximum 3 files allowed
   - URL format validation recommended

3. **Other Fields**:
   - All personal information fields are required
   - Email validation required
   - Phone number format: includes country code (e.g., `+971501234567`)

### 4. Response Format

**Success Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "507f1f77bcf86cd799439011",
  "success": true
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing required fields"
}
```

```json
{
  "error": "Only one trade license file is allowed"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Failed to create nomination"
}
```

## Testing

### Test Cases

1. **Valid Request with Trade License**:
```bash
curl -X POST http://localhost:3000/api/nominations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "companyName": "Test Company",
    "designation": "CEO",
    "phone": "+971501234567",
    "tradeLicense": "https://example.com/uploads/trade-license.pdf"
  }'
```

2. **Valid Request without Trade License**:
```bash
curl -X POST http://localhost:3000/api/nominations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "companyName": "Test Company",
    "designation": "CEO",
    "phone": "+971501234567"
  }'
```

3. **Invalid Request - Multiple Trade Licenses**:
```bash
curl -X POST http://localhost:3000/api/nominations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "companyName": "Test Company",
    "designation": "CEO",
    "phone": "+971501234567",
    "tradeLicense": "https://example.com/file1.pdf,https://example.com/file2.pdf"
  }'
```

## Migration Notes

If you have existing nominations with text-based `tradeLicense` values:

1. **Option 1**: Keep both formats temporarily:
   ```javascript
   tradeLicense: {
     type: mongoose.Schema.Types.Mixed,  // Can be string or array
     validate: function(value) {
       return typeof value === 'string' || Array.isArray(value);
     }
   }
   ```

2. **Option 2**: Migrate existing data:
   - Backup existing `tradeLicense` text values
   - Add new `tradeLicenseUrls` field for new uploads
   - Mark old `tradeLicense` as deprecated

## Summary

- **Frontend**: `tradeLicense` is now a PDF upload field (max 1 file)
- **Backend**: Accepts comma-separated URL string (single URL)
- **Validation**: Ensure only 1 file is allowed
- **Schema**: Update to handle URL string (nullable)
- **API**: Same endpoint, updated field handling

