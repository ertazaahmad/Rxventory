import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { load } from "@cashfreepayments/cashfree-js";
import { createOrder } from "../services/payment";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";




const cashfree = new Cashfree({ mode: "sandbox" });



const Subscription = () => {

const { user, userDoc } = useAuth();
 const navigate = useNavigate();

useEffect(() => {
  if (userDoc?.plan === "pro") {
    // Redirect + hard refresh
    window.location.replace("/inventory");
  }
}, [userDoc?.plan]);



const isFirstTime = userDoc?.hasPurchasedProBefore === false;
 const price = isFirstTime ? 249 : 349; 


 const handleUpgrade = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please login again");
      return;
    }

    const idToken = await user.getIdToken();

    // 1️⃣ Create order from backend
    const order = await createOrder(249, idToken);

    if (!order?.payment_session_id) {
      alert("Failed to initiate payment");
      return;
    }

    // 2️⃣ Open Cashfree popup
cashfree.checkout({
  paymentSessionId: order.payment_session_id,
  redirectTarget: "_modal",

onPaymentSuccess: async function () {
  try {
    await fetch("http://localhost:5000/activate-pro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });
  } catch (err) {
    console.error("Activation failed", err);
  }
},





  onPaymentFailure: function (data) {
    console.log("Payment failed:", data);
    alert("Payment failed or cancelled");
  },
});

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};




  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white py-6 sm:py-12 px-4">
      {/* Outer Container */}
      <div className="w-full max-w-6xl border border-white/20 rounded-2xl px-4 sm:px-6 py-4 sm:py-6 
                      relative bg-gradient-to-b from-white/6 to-white/0 backdrop-blur-md">
        
        {/* Top Bar */}
        <div className="flex justify-center items-center mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-semibold">Rxventory</h1>
        </div>

        {/* Close Button */}
        <button className="absolute top-3 sm:top-4 right-4 sm:right-6 text-white/60 hover:text-white 
                           text-xl sm:text-2xl"
         onClick={() => {
  if (userDoc?.plan === "pro") {
    window.location.replace("/inventory");
  } else {
    navigate("/inventory");
  }
}}
>
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            Choose the plan that fits your pharmacy
          </h2>
          <p className="text-sm sm:text-base text-white/60 px-2">
            Upgrade to unlock billing & unlimited inventory
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* FREE PLAN */}
          <div className="border border-white/20 rounded-xl p-5 sm:p-6 bg-white/5">
            <h3 className="text-base sm:text-lg font-semibold mb-1">FREE</h3>
            <p className="text-sm text-white/60 mb-4">₹0 / month</p>

            <button
              disabled
              className="w-full py-2 mb-6 rounded-md bg-white/10 text-white/50 cursor-not-allowed 
                         text-xs sm:text-sm"
            >
              YOUR CURRENT PLAN
            </button>

            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex gap-2">✅ Up to 10 meds</li>
              <li className="flex gap-2">✅ Inventory only</li>
              <li className="flex gap-2 text-white/40">❌ No Billing</li>
              <li className="flex gap-2 text-white/40">❌ Auto stock</li>
              <li className="flex gap-2 text-white/40">❌ Secure data backup</li>
            </ul>
          </div>

          {/* CENTER CTA - Hidden on mobile, visible on desktop */}
          <div className="text-center hidden lg:block">
            <p className="mb-3 text-white/70 text-sm sm:text-base">Ready to unlock billing?</p>
            <button className="text-purple-400 hover:text-purple-300 underline text-sm sm:text-base" onClick={handleUpgrade}>
              Upgrade to Pro
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="border border-white/30 rounded-xl p-5 sm:p-6 bg-white/10">
            <h3 className="text-base sm:text-lg font-semibold mb-1">PRO</h3>
            <p className="text-sm text-white/60 mb-4">₹{price} / month</p>

            <button className="w-full py-2 mb-6 rounded-md bg-purple-600 hover:bg-purple-700 
                               transition text-xs sm:text-sm active:scale-95" onClick={handleUpgrade}>
              UPGRADE TO PRO
            </button>

            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex gap-2">✅ Unlimited meds</li>
              <li className="flex gap-2">✅ Inventory & Billing</li>
              <li className="flex gap-2">✅ Auto stock deduction</li>
              <li className="flex gap-2">✅ Secure data backup</li>
            </ul>
          </div>

          {/* Mobile CTA - Only visible on mobile/tablet */}
          <div className="text-center lg:hidden col-span-1">
            <p className="mb-3 text-white/70 text-sm">Ready to unlock billing?</p>
            <button className="text-purple-400 hover:text-purple-300 underline text-sm" onClick={handleUpgrade}>
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;