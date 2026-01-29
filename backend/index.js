require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const admin = require("firebase-admin");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());

// ✅ JSON for normal APIs
app.use("/create-order", express.json());

// ✅ RAW body ONLY for webhook
app.use(
  "/cashfree-webhook",
  express.raw({ type: "application/json" })
);

/* =========================
   FIREBASE ADMIN INIT
========================= */
if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized");
} else {
  console.log("⚠️ Firebase Admin NOT initialized");
}

/* =========================
   CASHFREE CONFIG
========================= */
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_URL = process.env.CASHFREE_API_URL;

/* =========================
   HELPERS
========================= */
async function verifyFirebaseToken(idToken) {
  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch {
    return null;
  }
}

function generateOrderId() {
  return `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ✅ CORRECT signature verification
function verifyCashfreeSignature(rawBody, timestamp, signature) {
  const expectedSignature = crypto
    .createHmac("sha256", CASHFREE_SECRET_KEY)
    .update(timestamp + rawBody)
    .digest("base64");

  return expectedSignature === signature;
}

/* =========================
   CREATE ORDER
========================= */
app.post("/create-order", async (req, res) => {
  try {
    const { amount, idToken } = req.body;

    if (!amount || !idToken) {
      return res.status(400).json({ error: "Amount & token required" });
    }

    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount < 1) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const decoded = await verifyFirebaseToken(idToken);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid Firebase token" });
    }

    const orderId = generateOrderId();

    await admin.firestore().collection("orders").doc(orderId).set({
      uid: decoded.uid,
      amount: parsedAmount,
      status: "PENDING",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const orderPayload = {
      order_id: orderId,
      order_amount: parsedAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: decoded.uid,
        customer_email: decoded.email,
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: "https://your-app.com/payment-success",
        notify_url:
          "https://nonpunctuating-brittney-overcool.ngrok-free.dev/cashfree-webhook",
      },
    };

    const response = await axios.post(
      `${CASHFREE_API_URL}/orders`,
      orderPayload,
      {
        headers: {
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
        },
      }
    );

    res.json({
      success: true,
      order_id: response.data.order_id,
      payment_session_id: response.data.payment_session_id,
    });
  } catch (err) {
    console.error("Create order error:", err.response?.data || err.message);
    res.status(500).json({ error: "Create order failed" });
  }
});

/* =========================
   CASHFREE WEBHOOK
========================= */
app.post("/cashfree-webhook", async (req, res) => {
  try {
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    const rawBody = req.body.toString("utf8");

    if (!verifyCashfreeSignature(rawBody, timestamp, signature)) {
      console.log("❌ Invalid Cashfree signature");
      return res.status(401).send("Invalid signature");
    }

    console.log("✅ Cashfree signature verified");

    const body = JSON.parse(rawBody);

    const paymentStatus = body?.data?.payment?.payment_status;
    const customerId = body?.data?.customer_details?.customer_id;
    const paymentId = body?.data?.payment?.cf_payment_id;


    if (paymentStatus !== "SUCCESS" || !customerId) {
      return res.status(200).json({ ignored: true });
    }


    const paymentRef = admin.firestore().collection("payments").doc(paymentId);
const existing = await paymentRef.get();

if (existing.exists) {
  console.log("⚠️ Duplicate webhook ignored:", paymentId);
  return res.status(200).json({ duplicate: true });
}

await paymentRef.set({
  customerId,
  orderId: body.data.order.order_id,
  amount: body.data.payment.payment_amount,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
});


    const proValidTill = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );



    await admin.firestore().collection("users").doc(customerId).update({
      plan: "pro",
      proValidTill,
      hasPurchasedProBefore: true,
    });

    console.log("🎉 USER UPGRADED TO PRO:", customerId);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).json({ error: "Webhook failed" });
  }
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({ message: "Cashfree backend running ✅" });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
