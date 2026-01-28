# Cashfree Payment Backend

Minimal Node.js backend for handling Cashfree payments with Firebase Authentication.

## Setup Steps

1. **Install dependencies**
```bash
   npm install
```

2. **Configure environment**
   - Copy `.env.example` to `.env`
   - Add your Cashfree credentials (App ID and Secret Key from Cashfree Dashboard)
   - Get Cashfree test credentials from: https://merchant.cashfree.com/merchants/login

3. **Add Firebase credentials**
   - Download your Firebase service account JSON from Firebase Console
   - Save it as `serviceAccountKey.json` in the project root
   - Firebase Console → Project Settings → Service Accounts → Generate New Private Key

4. **Start server**
```bash
   npm start
```

## API Endpoints

### POST /create-order
Creates a new payment order

**Request Body:**
```json
{
  "amount": 100,
  "idToken": "firebase_id_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "order_id": "order_1234567890_abc",
  "payment_session_id": "session_xxx"
}
```

### GET /check-status?order_id=xxx
Check payment status

**Response:**
```json
{
  "order_id": "order_1234567890_abc",
  "status": "PAID",
  "raw_status": "PAID"
}
```

## Testing

1. Use Cashfree sandbox/test mode credentials
2. Frontend sends Firebase ID token after user login
3. Use returned `payment_session_id` to show Cashfree payment UI
4. Poll `/check-status` to verify payment completion

## Security Notes

- Never commit `.env` or `serviceAccountKey.json`
- Always verify Firebase tokens before processing payments
- Use environment variables for all secrets
- This is for test/development - add rate limiting and validation for production