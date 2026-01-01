import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Actionbar from "../components/Actionbar.jsx";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const Inventory = () => {
  const { user } = useAuth();

  /* ---------------- USER DATA ---------------- */
  const [userData, setUserData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [customName, setCustomName] = useState("");
  const [clinicName, setClinicName] = useState("");

  /* ---------------- SEARCH ---------------- */
  const [search, setSearch] = useState("");

  /* ---------------- MEDICINES (TEMP DATA) ---------------- */
  const medicines = [
    {
      id: 1,
      generic: "Paracetamol",
      brand: "Crocin",
      batch: "B123",
      expiry: "12/26",
      qty: 50,
      pack: "10 tabs",
      total: 500,
      mrp: 25,
      unit: "Tablet",
      minStock: 20,
      status: "In Stock",
    },
    {
      id: 2,
      generic: "Amoxicillin",
      brand: "Mox",
      batch: "A221",
      expiry: "10/25",
      qty: 30,
      pack: "6 caps",
      total: 180,
      mrp: 80,
      unit: "Capsule",
      minStock: 10,
      status: "In Stock",
    },
    {
      id: 3,
      generic: "Zandu Bam",
      brand: "Zandu",
      batch: "A441",
      expiry: "11/25",
      qty: 10,
      pack: "1 bottle",
      total: 10,
      mrp: 50,
      unit: "Baam",
      minStock: 10,
      status: "In Stock",
    },
  ];

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredMedicines = medicines.filter((med) =>
    med.generic.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);

        if (!data.clinicName) {
          setShowProfileModal(true);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) return <Navigate to="/" />;
  if (!userData) return <p>Loading...</p>;

  /* ---------------- SAVE PROFILE ---------------- */
  const handleSaveProfile = async () => {
    if (!customName || !clinicName) {
      alert("Please fill all fields");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    await setDoc(
      userRef,
      {
        name: customName,
        clinicName: clinicName,
      },
      { merge: true }
    );

    setUserData((prev) => ({
      ...prev,
      name: customName,
      clinicName,
    }));

    setShowProfileModal(false);
  };

  return (
    <div className="p-4">

      {/* ================= PRINT AREA ONLY ================= */}
      <div id="print-area">

        {/* PRINT HEADER */}
        <div className="print-only print-header">
          <div className="print-title">RXVENTORY</div>
          <div className="print-subtitle">
            Clinic: {userData.clinicName}
          </div>
        </div>

        {/* PRINT META */}
        <div className="print-only print-meta">
          Printed on: {new Date().toLocaleString()}
        </div>

        {/* INFO SECTION */}
        <div className="m-4 p-4 bg-gray-200 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
      onClick: () => window.print(),
    },
  ]}
/>

      

        {/* TABLE */}
        <table className="w-full border-collapse text-left mt-4">
          <thead className="bg-gray-300">
            <tr>
              <th className="border p-2">Sr</th>
              <th className="border p-2">Generic</th>
              <th className="border p-2">Brand</th>
              <th className="border p-2">Batch</th>
              <th className="border p-2">Expiry</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Pack</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">MRP</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Min</th>
              <th className="border p-2">Status</th>
              <th className="border p-2 no-print">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMedicines.length === 0 ? (
              <tr>
                <td colSpan="13" className="text-center p-4 text-gray-500">
                  No medicine found
                </td>
              </tr>
            ) : (
              filteredMedicines.map((med, index) => (
                <tr key={med.id}>
                  <td className="border p-2">{index + 1}</td>
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
                  <td className="border p-2 text-green-600">
                    {med.status}
                  </td>
                  <td className="border p-2 no-print">
                    <button className="bg-blue-400 px-2 py-1 text-white rounded mr-2">
                      Edit
                    </button>
                    <button className="bg-red-400 px-2 py-1 text-white rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PRINT FOOTER */}
        <div className="print-only print-watermark">RXVENTORY</div>
        <div className="print-only print-footer">
          Page <span className="pageNumber"></span>
        </div>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">
              Complete Profile
            </h2>

            <input
              type="text"
              placeholder="Your Name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full border p-2 mb-3"
            />

            <input
              type="text"
              placeholder="Clinic Name"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full border p-2 mb-4"
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
    </div>
  );
};

export default Inventory;
