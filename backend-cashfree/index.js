require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin (only if service account is provided)
if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin initialized");
} else {
  console.log("Firebase Admin NOT initialized (dev mode)");
}

// Cashfree Config
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_URL = process.env.CASHFREE_API_URL;

// Helper: Verify Firebase ID Token
async function verifyFirebaseToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    return null;
  }
}

// Helper: Generate unique order ID
function generateOrderId() {
  return 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Route: Create Order
app.post('/create-order', async (req, res) => {
  try {
    const { amount, idToken } = req.body;

    // Validate input
    if (!amount || !idToken) {
      return res.status(400).json({ error: 'Amount and idToken are required' });
    }

    if (amount < 1) {
      return res.status(400).json({ error: 'Amount must be at least 1' });
    }

    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(idToken);
    if (!decodedToken) {
      return res.status(401).json({ error: 'Invalid or expired Firebase token' });
    }

    const userId = decodedToken.uid;
    const orderId = generateOrderId();

    // Create Cashfree order
    const orderData = {
      order_id: orderId,
      order_amount: parseFloat(amount),
      order_currency: 'INR',
      customer_details: {
        customer_id: userId,
        customer_phone: '9999999999',
        customer_email: decodedToken.email || 'user@example.com'
      },
      order_meta: {
        return_url: 'https://your-app.com/payment-success',
        notify_url: 'https://your-backend.com/webhook'
      }
    };

    const response = await axios.post(
      `${CASHFREE_API_URL}/orders`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET_KEY,
          'x-api-version': '2023-08-01'
        }
      }
    );

    const { order_id, payment_session_id } = response.data;

    res.json({
      success: true,
      order_id,
      payment_session_id
    });

  } catch (error) {
    console.error('Create order error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.response?.data || error.message
    });
  }
});

// Route: Check Payment Status
app.get('/check-status', async (req, res) => {
  try {
    const { order_id } = req.query;

    if (!order_id) {
      return res.status(400).json({ error: 'order_id is required' });
    }

    // Fetch order status from Cashfree
    const response = await axios.get(
      `${CASHFREE_API_URL}/orders/${order_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET_KEY,
          'x-api-version': '2023-08-01'
        }
      }
    );

    const orderStatus = response.data.order_status;
    
    // Map Cashfree status to simple response
    const isPaid = orderStatus === 'PAID';
    
    res.json({
      order_id,
      status: isPaid ? 'PAID' : 'NOT_PAID',
      raw_status: orderStatus
    });

  } catch (error) {
    console.error('Check status error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to check payment status',
      details: error.response?.data || error.message
    });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Cashfree payment backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});