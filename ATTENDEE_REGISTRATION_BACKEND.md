# Attendee Registration Backend (Express + MongoDB)

This guide provides a ready-to-use Express route to accept attendee registrations at `POST /api/register-attendee`, persist them to MongoDB, and send emails.

## Prerequisites
- Node.js 18+
- MongoDB connection URI in `process.env.MONGODB_URI`
- Email utilities for sending confirmation and admin notification emails

## Environment Variables
Set these in your server environment (e.g., `.env`):

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority
EMAIL_FROM=events@example.com
EMAIL_USER=apikey-or-username
EMAIL_PROVIDER=resend|smtp|sendgrid|ses
```

## MongoDB Client Helper (`clientPromise`)
Create a reusable MongoDB client in your backend project (example `lib/mongodb.ts`):

```ts
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
```

## Email Utilities (placeholders)
Wire these up to your provider (Resend, SendGrid, SES, SMTP, etc.).

```ts
export async function sendRegistrationConfirmationEmail(to: string, payload: any) {
  // Implement provider-specific logic here
}

export async function sendRegistrationNotificationEmail(payload: any) {
  // Implement provider-specific logic here
}
```

## Express Route
Add this route to your Express server (e.g., in `routes/register-attendee.ts` or directly in `server.ts`). It matches the requested shape.

```ts
import type { Request, Response } from 'express';
import clientPromise from './lib/mongodb';
import { sendRegistrationConfirmationEmail, sendRegistrationNotificationEmail } from './lib/emails';

// POST /api/register-attendee
export async function postRegisterAttendee(req: Request, res: Response) {
  try {
    const body = req.body || {};
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      position,
      industry,
      interests,
      dietaryRequirements
    } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = await clientPromise;
    const db = client.db('eventTicketingDB');

    const attendeeData = {
      firstName,
      lastName,
      email,
      phone,
      company: company || null,
      position: position || null,
      industry: industry || null,
      interests: interests || null,
      dietaryRequirements: dietaryRequirements || null,
      submittedAt: new Date(),
      status: 'registered'
    };

    const result = await db.collection('attendee_registrations').insertOne(attendeeData);
    console.log('Attendee registration saved successfully:', result.insertedId);

    try {
      await sendRegistrationConfirmationEmail(email, body);
    } catch (emailErr) {
      console.warn('Failed to send confirmation email:', emailErr);
    }

    try {
      await sendRegistrationNotificationEmail(body);
    } catch (emailErr) {
      console.warn('Failed to send admin notification email:', emailErr);
    }

    return res.json({ success: true, message: 'Registration submitted successfully' });
  } catch (error) {
    console.error('Error submitting registration:', error);
    return res.status(500).json({ error: 'Failed to submit registration' });
  }
}
```

### Mounting in Express

```ts
import express from 'express';
import bodyParser from 'body-parser';
import { postRegisterAttendee } from './routes/register-attendee';

const app = express();
app.use(bodyParser.json());

app.post('/api/register-attendee', postRegisterAttendee);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});
```

## Response Shape
On success:

```json
{ "success": true, "message": "Registration submitted successfully" }
```

On validation error:

```json
{ "error": "Missing required fields" }
```

On server error:

```json
{ "error": "Failed to submit registration" }
```

## Notes
- Align your frontend `ENV_CONFIG.API_BASE_URL` to point at this backend.
- Add rate-limiting and bot protection (e.g., reCAPTCHA) as needed.
- Sanitize inputs and consider additional validation per business rules.


