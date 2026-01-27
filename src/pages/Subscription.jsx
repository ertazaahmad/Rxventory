import { useNavigate } from "react-router-dom";

const Subscription = () => {

 const navigate = useNavigate();
    
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white py-12">
      {/* Outer Container */}
      <div className="w-full max-w-6xl border border-white/20 rounded-2xl px-6 py-2 relative bg-gradient-to-b from-white/6 to-white/0 backdrop-blur-md">
        
        {/* Top Bar */}
        <div className="flex justify-center items-center mb-1">
          <h1 className="text-xl font-semibold">Rxventory</h1>
        </div>

        {/* Close Button */}
        <button className="absolute top-2 right-6 text-white/60 hover:text-white text-xl"
         onClick={() => navigate("/")}>
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold mb-0">
            Choose the plan that fits your pharmacy
          </h2>
          <p className="text-white/60">
            Upgrade to unlock billing & unlimited inventory
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* FREE PLAN */}
          <div className="border border-white/20 rounded-xl p-6 bg-white/5">
            <h3 className="text-lg font-semibold mb-1">FREE</h3>
            <p className="text-sm text-white/60 mb-4">₹0 / month</p>

            <button
              disabled
              className="w-full py-2 mb-6 rounded-md bg-white/10 text-white/50 cursor-not-allowed text-sm"
            >
              YOUR CURRENT PLAN
            </button>

            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">✅ Up to 10 meds</li>
              <li className="flex gap-2">✅ Inventory only</li>
              <li className="flex gap-2 text-white/40">❌ No Billing</li>
              <li className="flex gap-2 text-white/40">❌ Auto stock</li>
              <li className="flex gap-2 text-white/40">❌ Secure data backup</li>
            </ul>
          </div>

          {/* CENTER CTA */}
          <div className="text-center">
            <p className="mb-3 text-white/70">Ready to unlock billing?</p>
            <button className="text-purple-400 hover:text-purple-300 underline">
              Upgrade to Pro
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="border border-white/30 rounded-xl p-6 bg-white/10">
            <h3 className="text-lg font-semibold mb-1">PRO</h3>
            <p className="text-sm text-white/60 mb-4">₹399 / month</p>

            <button className="w-full py-2 mb-6 rounded-md bg-purple-600 hover:bg-purple-700 transition text-sm">
              UPGRADE TO PRO
            </button>

            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">✅ Unlimited meds</li>
              <li className="flex gap-2">✅ Inventory & Billing</li>
              <li className="flex gap-2">✅ Auto stock deduction</li>
              <li className="flex gap-2">✅ Secure data backup</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;