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
if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
  console.log("✅ Firebase Admin initialized");
} else {
  console.log("⚠️ Firebase Admin NOT initialized (env vars missing)");
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
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "Token required" });
    }

    const decoded = await verifyFirebaseToken(idToken);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid Firebase token" });
    }

    const userRef = admin.firestore().collection("users").doc(decoded.uid);
    const userSnap = await userRef.get();
    const userData = userSnap.exists ? userSnap.data() : {};

    const now = Date.now();

    // 🔒 Block active Pro users
    const isProActive =
      userData.plan === "pro" &&
      userData.proValidTill &&
      userData.proValidTill.toDate().getTime() > now;

    if (isProActive) {
      return res.status(400).json({
        error: "Active Pro subscription already exists",
      });
    }

    // 💰 Decide price on backend ONLY
    const finalAmount = userData.hasPurchasedProBefore ? 349 : 249;

    const orderId = generateOrderId();

    // Save order
    await admin.firestore().collection("orders").doc(orderId).set({
      uid: decoded.uid,
      amount: finalAmount,
      status: "PENDING",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const orderPayload = {
      order_id: orderId,
      order_amount: finalAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: decoded.uid,
        customer_email: decoded.email || "no-email@rxventory.com",
        customer_phone: "9999999999",
      },
   order_tags: {
  uid: decoded.uid,
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
const uid = body?.data?.order?.order_tags?.uid;
const paymentId = body?.data?.payment?.cf_payment_id;
const orderId = body?.data?.order?.order_id;

if (!uid || !orderId) {
  console.log("❌ Missing uid or orderId", { uid, orderId });
  return res.status(400).send("Invalid webhook payload");
}


    if (!uid) {
      console.log("❌ Webhook missing uid");
      return res.status(400).send("Missing uid");
    }

    if (paymentStatus !== "SUCCESS") {
      return res.status(200).json({ ignored: true });
    }

    // Prevent duplicate webhook
   if (!paymentId) {
  console.log("❌ Missing cf_payment_id for SUCCESS payment", body.data);
  return res.status(400).send("Missing paymentId");
}

// Prevent duplicate webhook (idempotent & safe)
const paymentRef = admin
  .firestore()
  .collection("payments")
  .doc(`${orderId}_${paymentId}`);

    const existing = await paymentRef.get();

    if (existing.exists) {
      console.log("⚠️ Duplicate webhook ignored:", paymentId);
      return res.status(200).json({ duplicate: true });
    }

    await paymentRef.set({
      uid,
      orderId: body.data.order.order_id,
      amount: body.data.payment.payment_amount,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

await admin.firestore().collection("orders").doc(orderId).update({
  status: "SUCCESS",
  paidAt: admin.firestore.FieldValue.serverTimestamp(),
});


    const proValidTill = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    await admin.firestore().collection("users").doc(uid).update({
      plan: "pro",
      proValidTill,
      hasPurchasedProBefore: true,
    });

    console.log("🎉 USER UPGRADED TO PRO:", uid);

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
