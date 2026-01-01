import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Actionbar from "../components/Actionbar";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const Inventory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [customName, setCustomName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [search, setSearch] = useState("");

  /* ---------------- STATIC MEDICINES (TEMP) ---------------- */
  const medicines = Array.from({ length: 60 }).map((_, i) => ({
    id: i + 1,
    generic: i === 0 ? "Paracetamol" : "Amoxicillin",
    brand: i === 0 ? "Crocin" : "Mox",
    batch: i === 0 ? "B123" : "A221",
    expiry: i === 0 ? "12/26" : "10/25",
    qty: i === 0 ? 50 : 30,
    pack: i === 0 ? "10 tabs" : "6 caps",
    total: i === 0 ? 500 : 180,
    mrp: i === 0 ? 25 : 80,
    unit: i === 0 ? "Tablet" : "Capsule",
    minStock: i === 0 ? 20 : 10,
    status: "In Stock",
  }));

  const filteredMedicines = medicines.filter((med) =>
    med.generic.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        if (!data.clinicName) setShowProfileModal(true);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) return <Navigate to="/" />;
  if (!userData) return <p>Loading...</p>;

  /* ---------------- SAVE PROFILE ---------------- */
  const handleSaveProfile = async () => {
    if (!customName || !clinicName) return alert("Fill all fields");

    const ref = doc(db, "users", user.uid);
    await setDoc(ref, { name: customName, clinicName }, { merge: true });

    setUserData((p) => ({ ...p, name: customName, clinicName }));
    setShowProfileModal(false);
  };

  /* ---------------- PRINT ---------------- */
  const handlePrintTable = () => {
    window.scrollTo(0, 0);
    window.print();
  };

  return (
    <>
      {/* ================= SCREEN UI ================= */}
      <div className="p-4 no-print">
        {/* INFO */}
        <div className="bg-gray-200 rounded-xl p-4 mb-4 grid grid-cols-4 gap-4 text-sm font-medium">
          <p>User ID: {userData.userId}</p>
          <p>Name: {userData.name}</p>
          <p>Clinic: {userData.clinicName}</p>
          <p>Subscription: {userData.subscription}</p>
        </div>

        {/* ACTION BAR */}
        <Actionbar
          search={search}
          setSearch={setSearch}
          extraAction={[
            {
              label: "PRINT",
              className:
                "focus:ring-green-900/60 rounded-xl bg-green-400 hover:bg-green-500",
              onClick: handlePrintTable,
            },
          ]}
        />

        {/* TABLE (SCREEN) */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-300">
              <tr>
                {[
                  "Sr",
                  "Generic",
                  "Brand",
                  "Batch",
                  "Expiry",
                  "Qty",
                  "Pack",
                  "Total",
                  "MRP",
                  "Unit",
                  "Min",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="border p-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((med, i) => (
                <tr key={med.id}>
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{med.generic}</td>
                  <td className="border p-2">{med.brand}</td>
                  <td className="border p-2">{med.batch}</td>
                  <td className="border p-2">{med.expiry}</td>
                  <td className="border p-2">{med.qty}</td>
                  <td className="border p-2">{med.pack}</td>
                  <td className="border p-2">{med.total}</td>
                  <td className="border p-2">₹{med.mrp}</td>
                  <td className="border p-2">{med.unit}</td>
                  <td className="border p-2">{med.minStock}</td>
                  <td className="border p-2 text-green-600">{med.status}</td>
                  <td className="border p-2">
                    <button className="px-2 py-1 bg-blue-400 text-white rounded mr-2">
                      Edit
                    </button>
                    <button className="px-2 py-1 bg-red-400 text-white rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PRINT ONLY ================= */}
      <div id="print-only-area" className="print-only">
        <div className="print-header">
          <h1>RXVENTORY</h1>
          <p>Clinic: {userData.clinicName}</p>
          <p>Printed on: {new Date().toLocaleString()}</p>
        </div>

        <table>
          <thead>
            <tr>
              {[
                "Sr",
                "Generic",
                "Brand",
                "Batch",
                "Expiry",
                "Qty",
                "Pack",
                "Total",
                "MRP",
                "Unit",
                "Min",
                "Status",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((med, i) => (
              <tr key={med.id}>
                <td>{i + 1}</td>
                <td>{med.generic}</td>
                <td>{med.brand}</td>
                <td>{med.batch}</td>
                <td>{med.expiry}</td>
                <td>{med.qty}</td>
                <td>{med.pack}</td>
                <td>{med.total}</td>
                <td>₹{med.mrp}</td>
                <td>{med.unit}</td>
                <td>{med.minStock}</td>
                <td>{med.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Complete Profile</h2>

            <input
              className="w-full border p-2 mb-3"
              placeholder="Your Name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />

            <input
              className="w-full border p-2 mb-4"
              placeholder="Clinic Name"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
            />

            <button
              onClick={handleSaveProfile}
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Save & Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Inventory;
