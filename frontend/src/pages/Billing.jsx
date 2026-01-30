import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getDoc,
  setDoc,
  updateDoc,
  doc,
  collection,
  getDocs,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase";
import Actionbar from "../components/Actionbar.jsx";
import { useNavigate } from "react-router-dom";

const Billing = () => {
  const { user, userDoc } = useAuth();
  const userPlan = userDoc?.plan || "free";

  const [userData, setUserData] = useState(null);
  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [pharmacyPhone, setPharmacyPhone] = useState("");
  const [pharmacyGSTIN, setPharmacyGSTIN] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [gstPercent, setGstPercent] = useState(12);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [billStatus, setBillStatus] = useState("DRAFT");
  const navigate = useNavigate();
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expiredWarning, setExpiredWarning] = useState("");



  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const emptyRow = {
    generic: "",
    brand: "",
    batch: "",
    expiry: "",
    qty: "",
    packSize: "",
    mrp: "",
    rate: "",
    amount: 0,
    status: "",
  };
  const [billItems, setBillItems] = useState([emptyRow]);

  const createEmptyRow = () => ({
    generic: "",
    brand: "",
    batch: "",
    expiry: "",
    qty: "",
    unit: "TABLET",
    packSize: "",
    mrp: "",
    rate: "",
    gstPercent: 12,
    amount: 0,
    status: "",
  });

  const [patient, setPatient] = useState({
    name: "",
    doctor: "",
    address: "",
  });

  const formatExpiry = (value) => {
    if (!value) return "";
    const date = new Date(`${value}-01`);
    return date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const [invoiceMeta, setInvoiceMeta] = useState({
    invoiceNo: "",
    date: "",
    time: "",
  });

  const isFinalized = billStatus === "FINALIZED";

  const generateInvoiceNumber = async (db, userId) => {
    const year = new Date().getFullYear(); // 2026
    const userRef = doc(db, "users", userId);

    const invoiceNo = await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userRef);

      if (!userSnap.exists()) {
        throw new Error("User document does not exist");
      }

      const data = userSnap.data();
      const invoiceCounters = data.invoiceCounters || {};

      const currentCount = invoiceCounters[year] || 0;
      const newCount = currentCount + 1;

      transaction.update(userRef, {
        [`invoiceCounters.${year}`]: newCount,
      });

      const padded = String(newCount).padStart(4, "0");
      return `INV-${year}-${padded}`;
    });

    return invoiceNo;
  };

  const handleNewBill = async () => {
  setBillStatus("DRAFT");

    localStorage.removeItem("billingDraft");

    setPatient({
      name: "",
      address: "",
      doctor: "",
    });

    // Reset to single empty row
    setBillItems([createEmptyRow()]);

    const now = new Date();

    setInvoiceMeta({
      invoiceNo: "",
      date: "",
      time: "",
    });
  };

  const handleSavePharmacy = async () => {
    if (!user) return;
    if (
      !pharmacyName.trim() ||
      !pharmacyAddress.trim() ||
      !pharmacyPhone.trim() ||
      !pharmacyGSTIN.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    const ref = doc(db, "users", user.uid);

    try {
      await updateDoc(ref, {
        pharmacyName: pharmacyName.trim(),
        pharmacyAddress: pharmacyAddress.trim(),
        pharmacyPhone: pharmacyPhone.trim(),
        pharmacyGSTIN: pharmacyGSTIN.trim(),
      });
    } catch (error) {
      console.error("Error updating pharmacy details: ", error);
      alert("Failed to save pharmacy details. Please try again.");
    }

    setUserData((prev) => ({
      ...prev,
      pharmacyName: pharmacyName.trim(),
      pharmacyAddress: pharmacyAddress.trim(),
      pharmacyPhone: pharmacyPhone.trim(),
      pharmacyGSTIN: pharmacyGSTIN.trim(),
    }));
    setShowPopup(false);
    handleNewBill();
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        setUserData(snapshot.data());
      }
      setLoadingUserData(false);
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    setHighlightIndex(-1);
  }, [suggestions]);

  // Update pharmacy fields when userData changes
  useEffect(() => {
    if (userData) {
      setPharmacyName(userData.pharmacyName || "");
      setPharmacyAddress(userData.pharmacyAddress || "");
      setPharmacyPhone(userData.pharmacyPhone || "");
      setPharmacyGSTIN(userData.pharmacyGSTIN || "");
    }
  }, [userData]);

  // Show popup if pharmacy details incomplete
  useEffect(() => {
    if (loadingUserData) return;

    if (!userData) {
      setShowPopup(true);
      return;
    }

    const isValid = (val) => typeof val === "string" && val.trim() !== "";

    const isComplete =
      isValid(userData.pharmacyName) &&
      isValid(userData.pharmacyAddress) &&
      isValid(userData.pharmacyPhone) &&
      isValid(userData.pharmacyGSTIN);

    setShowPopup(!isComplete);
  }, [userData, loadingUserData]);

  const addRowAt = (index) => {
    if (billStatus === "FINALIZED") return;
   if (userPlan === "free" && billItems.length >= 3) {
  setShowUpgradePopup(true);
  return;
}

    const updated = [...billItems];
    updated.splice(index, 0, createEmptyRow());
    setBillItems(updated);
  };

  // RESTORE DRAFT ON MOUNT (runs only once)
  useEffect(() => {
    const savedDraft = localStorage.getItem("billingDraft");

    if (savedDraft) {
      try {
        const data = JSON.parse(savedDraft);

        if (data.patient) setPatient(data.patient);
        if (data.invoiceMeta) setInvoiceMeta(data.invoiceMeta);
        if (data.billItems && data.billItems.length) {
          setBillItems(data.billItems);
        }

  setInvoiceMeta({
        invoiceNo: "",
        date: "",
        time: "",
      });

      } catch (error) {
        console.error("Error restoring draft:", error);
      }
    }

    setIsInitialized(true);
  }, []); // Only run once on mount

  // Generate first invoice if no draft exists
useEffect(() => {
  if (!isInitialized || loadingUserData || showPopup) return;

  const savedDraft = localStorage.getItem("billingDraft");

  // If no draft exists, initialize a new empty draft ONCE
  if (!savedDraft && billItems.length === 1 && !billItems[0].generic) {
    handleNewBill();
  }
}, [isInitialized, loadingUserData, showPopup]);


  // SAVE DRAFT whenever patient or invoiceMeta changes (but not on first mount)
  // Debounced to prevent interference with typing
  useEffect(() => {
    if (!isInitialized) return;

    const timeoutId = setTimeout(() => {
      const draftBill = {
        patient,
        invoiceMeta,
        billItems,
      };

      localStorage.setItem("billingDraft", JSON.stringify(draftBill));
    }, 500); // Wait 500ms after last change before saving

    return () => clearTimeout(timeoutId);
  }, [patient, invoiceMeta, billItems, isInitialized]);

  // Fetch inventory
  const fetchInventory = async () => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "medicines");
    const snap = await getDocs(ref);

    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setInventory(list);
  };

  useEffect(() => {
    fetchInventory();
  }, [user]);

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let totalGST = 0;

    billItems.forEach((item) => {
      const qty = Number(item.qty) || 0;
      if (qty === 0) return;

      const unit = item.unit || "TABLET";
      const packSize = Number(item.packSize) || 1;

      const tabletsSold = unit === "STRIP" ? qty * packSize : qty;

      const stripRate = Number(item.rate) || 0;
      const tabletRate = stripRate / packSize;

      const baseAmount = tabletsSold * tabletRate;
      const gstAmount = (baseAmount * gstPercent) / 100;

      subtotal += baseAmount;
      totalGST += gstAmount;
    });

    return {
      subtotal: subtotal.toFixed(2),
      totalGST: totalGST.toFixed(2),
      grandTotal: (subtotal + totalGST).toFixed(2),
    };
  };

  const totals = calculateTotals();

  const finalizeBill = async () => {

    if (isSaving) return; // 🔒 HARD LOCK
  setIsSaving(true);

  try {
    if (billStatus === "FINALIZED") {
      window.print();
      return;
    }

    // 1️⃣ VALIDATE ITEMS
    if (!billItems.length || billItems.every(i => !i.qty)) {
      alert("Add at least one medicine");
      return;
    }

    // 2️⃣ CHECK & DEDUCT INVENTORY FIRST
    for (const item of billItems) {
      if (!item.medicineId || !item.qty) continue;

      const medRef = doc(db, "users", user.uid, "medicines", item.medicineId);
      const medSnap = await getDoc(medRef);

      if (!medSnap.exists()) continue;

      const medData = medSnap.data();
      const totalTablets = Number(medData.total) || 0;
      const packSize = Number(medData.pack) || 1;

      const tabletsSold =
        item.unit === "STRIP"
          ? Number(item.qty) * packSize
          : Number(item.qty);

      if (tabletsSold > totalTablets) {
        alert(`Insufficient stock for ${item.generic}`);
        return; // 🚫 NO invoice generated
      }

      const newTotal = totalTablets - tabletsSold;
      const newQty = Math.floor(newTotal / packSize);

      await updateDoc(medRef, {
        total: newTotal,
        qty: newQty,
      });
    }

    // 🔥 3️⃣ NOW generate invoice number (SAFE POINT)
    const invoiceNo = await generateInvoiceNumber(db, user.uid);

    const now = new Date();

    // 4️⃣ CREATE BILL
    const billRef = doc(db, "users", user.uid, "bills", invoiceNo);

    await setDoc(billRef, {
      invoiceNo,
      patient,
      items: billItems,
      totals,
      status: "FINALIZED",
      createdAt: serverTimestamp(),
      finalizedAt: serverTimestamp(),
    });

    // 5️⃣ UPDATE UI
    setInvoiceMeta({
      invoiceNo,
      date: now.toLocaleDateString("en-IN"),
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    });

    setBillStatus("FINALIZED");
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);

  } catch (error) {
    console.error("Error finalizing bill:", error);
    alert("Failed to save bill. Please try again.");
  } finally {
    setIsSaving(false); // 🔓 UNLOCK
  }
};

  const primaryAction =
    billStatus === "DRAFT"
      ? {
         label: isSaving ? "SAVING..." : "SAVE BILL",
onClick: finalizeBill,
className: `
  focus:ring-green-900/60 rounded-xl
  ${isSaving
    ? "bg-green-300 cursor-not-allowed opacity-60"
    : "bg-green-400 hover:bg-green-500"}
`,
          className:
            "focus:ring-green-900/60 rounded-xl bg-green-400 hover:bg-green-500",
        }
      : {
          label: "PRINT",
          onClick: () => window.print(),
          className:
            "focus:ring-blue-900/60 rounded-xl bg-blue-400 hover:bg-blue-500",
        };

  const fillMedicineRow = (index, medicine) => {

    if (medicine.expiry) {
  const expiryDate = new Date(medicine.expiry + "-01");
  const today = new Date();

  if (expiryDate < today) {
    setExpiredWarning("❌ This medicine is expired");
    setTimeout(() => setExpiredWarning(""), 2000);
    return; // 🚫 BLOCK ADDING
  }
}


    const updated = [...billItems];

    updated[index] = {
      ...updated[index],
      medicineId: medicine.id,
      generic: medicine.generic,
      brand: medicine.brand || "",
      batch: medicine.batch || "",
      expiry: medicine.expiry || "",
      packSize: medicine.pack || 1,
      rate: medicine.rate || 0,
      mrp: medicine.rate || 0,
      gstPercent: 12,
      status: medicine.status || "In Stock",
      inventoryUnit: medicine.unit || "Tablet",
      unit: medicine.unit === "Tablet" ? "TABLET" : medicine.unit.toUpperCase(),
      qty: "",
    };

    setBillItems(updated);
  };

  return (
    <div>
      <style>{`
/* ================= PRINT ONLY ================= */
@media print {

  /* kill all viewport-based heights */
  [class*="min-h"],
  [class*="h-["] {
    min-height: auto !important;
    height: auto !important;
  }


 .header-section input {
    color: #000 !important;
    -webkit-text-fill-color: #000 !important;
    background: transparent !important;
  }

  /* --- TABLE CORE --- */
  table {
    width: 100% !important;
    table-layout: fixed !important;
    border-collapse: collapse !important;
  }

  th, td {
    box-sizing: border-box !important;
    border: 1px solid #000 !important;
    padding: 3px !important;
    font-size: 11px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  /* --- REMOVE STATUS & ACTIONS COMPLETELY IN PRINT --- */
  col:nth-child(13),
  col:nth-child(14) {
    display: none !important;
  }

  th:nth-child(13),
  td:nth-child(13),
  th:nth-child(14),
  td:nth-child(14) {
    display: none !important;
  }

  /* --- HEADER GRID LOCK --- */
  .header-section {
    display: grid !important;
    grid-template-columns: 33% 34% 33% !important;
    width: 100% !important;
    overflow: hidden !important;
  }

  .header-section * {
    max-width: 100% !important;
    box-sizing: border-box !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .header-section input {
    width: 100% !important;
    min-width: 0 !important;
    border: none !important;
  }

  /* --- PAGE CONTROL --- */
  #print-area {
   margin: 0 !important;
      width: calc(100% - 10px) !important;
    border: 1px solid #000 !important;
    box-sizing: border-box !important;
     min-height: auto !important;
    height: auto !important;
     padding-bottom: 0 !important;
  }

  html, body {
    height: auto !important;
  }

     body {
    margin: 0 !important;
  }

  .footer-section {
    page-break-inside: avoid !important;
    margin-top: 10px !important;
  }

  /* --- HIDE UI --- */
  .no-print,
  .print-hide,
  button,
  nav {
    display: none !important;
  }

  @page {
    size: A4 landscape;
    margin: 10mm;
  }
}

/* ================= END PRINT ================= */



`}</style>

      {!loadingUserData && showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-md sm:w-96">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Complete Pharmacy Details
            </h2>

            <input
              type="text"
              placeholder="Pharmacy Name"
              value={pharmacyName}
              onChange={(e) => setPharmacyName(e.target.value)}
              className="w-full border p-2 mb-3 text-sm sm:text-base"
            />

            <input
              type="text"
              placeholder="Pharmacy Address"
              value={pharmacyAddress}
              onChange={(e) => setPharmacyAddress(e.target.value)}
              className="w-full border p-2 mb-4 text-sm sm:text-base"
            />

            <input
              type="text"
              placeholder="Pharmacy Phone"
              value={pharmacyPhone}
              onChange={(e) => setPharmacyPhone(e.target.value)}
              className="w-full border p-2 mb-4 text-sm sm:text-base"
            />

            <input
              type="text"
              placeholder="Pharmacy GSTIN"
              value={pharmacyGSTIN}
              onChange={(e) => setPharmacyGSTIN(e.target.value)}
              className="w-full border p-2 mb-4 text-sm sm:text-base"
            />

            <button
              onClick={handleSavePharmacy}
              className="w-full bg-blue-600 text-white p-2 rounded text-sm sm:text-base active:scale-95 transition"
            >
              Save & Continue
            </button>
          </div>
        </div>
      )}

      <div className="min-h-[calc(100vh-6rem)] m-1 sm:m-2 p-2 sm:p-4 pb-1 bg-gray-200 rounded-xl text-xs sm:text-sm font-medium">
        <Actionbar
          primarycolor="focus:ring-gray-900/60 rounded-xl bg-gray-400 hover:bg-gray-500"
          secondarycolor="focus:ring-blue-900/60 rounded-xl bg-blue-400 hover:bg-blue-500"
          extraAction={[
            primaryAction,
            {
              label: "NEW BILL",
              className:
                billStatus === "FINALIZED"
                  ? "focus:ring-blue-900/60 rounded-xl bg-blue-400 hover:bg-blue-500"
                  : "rounded-xl bg-gray-300 cursor-not-allowed opacity-60",
              onClick: () => {
                if (billStatus !== "FINALIZED") return;
                handleNewBill();
              },
            },
          ]}
          showSearch={false}
        />
        <main
          id="print-area"
          className="border m-1 sm:m-2 mb-1 min-h-[calc(100vh-14rem)] sm:h-[calc(100vh-11rem)] flex flex-col"
        >
          {activeRow !== null && suggestions.length > 0 && (
            <div
              className="fixed z-[9999] bg-white border shadow-lg max-h-40 overflow-y-auto text-xs"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              }}
            >
              {suggestions.map((med, i) => (
                <div
                  key={med.id}
                  onClick={() => {
                    fillMedicineRow(activeRow, med);
                    setSuggestions([]);
                    setActiveRow(null);
                    setHighlightIndex(-1);
                  }}
                  className={`px-2 py-1 cursor-pointer ${
                    i === highlightIndex
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-100"
                  }`}
                >
                  {med.generic}
                </div>
              ))}
            </div>
          )}

          <div className="pl-2 sm:pl-4 border-b border-black py-3 sm:py-0 sm:h-24 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-16 header-section shrink-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-blue-600 font-extrabold text-sm sm:text-base">
                {userData?.pharmacyName || "—"}
              </h3>
              <p className="text-xs sm:text-sm">
                {userData?.pharmacyAddress || "—"}
              </p>
              <p className="text-xs sm:text-sm">
                Phone: +91 {userData?.pharmacyPhone || "—"}
              </p>
              <p className="text-xs sm:text-sm">
                GSTIN: {userData?.pharmacyGSTIN || "—"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Patient:</span>{" "}
                <input
                  value={patient.name}
                  placeholder="Enter Patient Name"
                  disabled={isFinalized}
                  onChange={(e) =>
                    setPatient({ ...patient, name: e.target.value })
                  }
                  className="border-b border-gray-300 outline-none w-full sm:w-auto text-xs sm:text-sm px-1 no-print"
                />
                {/* Print */}
                <span className="hidden print:inline">
                  {patient.name || "—"}
                </span>
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Address:</span>{" "}
                <input
                  value={patient.address}
                  placeholder="Enter Patient Address"
                  disabled={isFinalized}
                  onChange={(e) =>
                    setPatient({ ...patient, address: e.target.value })
                  }
                  className="border-b border-gray-300 outline-none w-full sm:w-auto text-xs sm:text-sm px-1 no-print"
                />
                {/* Print */}
                <span className="hidden print:inline">
                  {patient.address || "—"}
                </span>
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Doctor:</span>{" "}
                <input
                  value={patient.doctor}
                  placeholder="Enter Doctor Name"
                  disabled={isFinalized}
                  onChange={(e) =>
                    setPatient({ ...patient, doctor: e.target.value })
                  }
                  className="border-b border-gray-300 outline-none w-full sm:w-auto text-xs sm:text-sm px-1 no-print"
                />
                {/* Print */}
                <span className="hidden print:inline">
                  {patient.doctor || "—"}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs sm:text-sm">
                <span className="font-semibold">Invoice No:</span>{" "}
                {invoiceMeta.invoiceNo}
              </div>

              <div className="text-xs sm:text-sm">
                <span className="font-semibold">Date:</span> {invoiceMeta.date}
              </div>

              <div className="text-xs sm:text-sm">
                <span className="font-semibold">Time:</span> {invoiceMeta.time}
              </div>
            </div>
          </div>

          <div className="m-1 sm:m-2 flex-1 overflow-y-auto overflow-x-auto scrollbar-hide table-container">
            <table className="w-full text-left divide-y divide-gray-400">
              <colgroup>
                <col style={{ width: "3%" }} /> {/* Sr */}
                <col style={{ width: "16%" }} /> {/* Generic Name (WIDE) */}
                <col style={{ width: "8%" }} /> {/* Brand */}
                <col style={{ width: "8%" }} /> {/* Batch */}
                <col style={{ width: "7%" }} /> {/* Expiry */}
                <col style={{ width: "6%" }} /> {/* Qty */}
                <col style={{ width: "6%" }} /> {/* Unit (SMALLER) */}
                <col style={{ width: "6%" }} /> {/* Pack Size (SMALLER) */}
                <col style={{ width: "6%" }} /> {/* Rate (SMALLER) */}
                <col style={{ width: "7%" }} /> {/* MRP */}
                <col style={{ width: "6%" }} /> {/* GST */}
                <col style={{ width: "7%" }} /> {/* Amount */}
                <col style={{ width: "%" }} /> {/* Status */}
                <col style={{ width: "%" }} /> {/* Actions */}
              </colgroup>
              <thead className="bg-gray-300 sticky top-0 z-10 text-center">
                <tr className="text-xs sm:text-sm font-semibold">
                  <th className="px-1 sm:px-2 py-1">Sr.</th>
                  <th className="px-1 sm:px-2 py-1">Generic Name</th>
                  <th className="px-1 sm:px-2 py-1">Brand</th>
                  <th className="px-1 sm:px-2 py-1">Batch No.</th>
                  <th className="px-1 sm:px-2 py-1">Expiry</th>
                  <th className="px-1 sm:px-2 py-1">Qty </th>
                  <th className="px-1 sm:px-2 py-1">Unit</th>
                  <th className="px-1 sm:px-2 py-1">Pack Size</th>
                  <th className="px-1 sm:px-2 py-1">Rate</th>
                  <th className="px-1 sm:px-2 py-1">MRP</th>
                  <th className="px-1 sm:px-2 py-1">
                    <div className="flex items-center gap-1 justify-center">
                      <span className="text-xs no-print">GST %</span>
                      <span className="hidden print:inline text-xs">
                        GST {gstPercent}%
                      </span>
                      <input
                        type="number"
                        value={gstPercent}
                        onChange={(e) =>
                          setGstPercent(Number(e.target.value) || 0)
                        }
                        className="w-8 sm:w-10 px-1 py-0.5 border border-gray-400 rounded text-center bg-white text-xs no-print"
                        min="0"
                        max="99"
                      />
                    </div>
                  </th>

                  <th className="px-1 sm:px-2 py-1">Amount</th>
                  <th className="px-1 sm:px-2 py-1 print-hide">Status</th>
                  <th className="px-1 sm:px-2 py-1 print-hide">Actions</th>
                </tr>
              </thead>

              <tbody>
                {billItems.map((item, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-100">
                    {/* Sr. No */}
                    <td className="p-1 border text-center text-xs">
                      {index + 1}
                    </td>

                    {/* Generic Name - FIXED */}
                    <td className="p-1 border relative">
                      <input
                        type="text"
                        value={item.generic || ""}
                        disabled={isFinalized}
                        onChange={(e) => {
                          const value = e.target.value;
                          const updated = [...billItems];

                          // 1️⃣ Always allow typing
                          updated[index] = {
                            ...updated[index],
                            generic: value,
                          };
                          setBillItems(updated);
                          setActiveRow(index);

                          // 👇 GET INPUT POSITION
                          const rect = e.target.getBoundingClientRect();
                          setDropdownPosition({
                            top: rect.bottom + window.scrollY,
                            left: rect.left + window.scrollX,
                            width: rect.width,
                          });

                          // 2️⃣ Show suggestions (partial match)
                          if (value.trim()) {
                            const matches = inventory.filter((m) =>
                              m.generic
                                ?.toLowerCase()
                                .includes(value.toLowerCase()),
                            );
                            setSuggestions(matches.slice(0, 5));
                          } else {
                            setSuggestions([]);
                          }

                          // 3️⃣ Delayed exact match auto-fill (your previous logic, safe)
                          if (typingTimeout) clearTimeout(typingTimeout);

                          const timeout = setTimeout(() => {
                            const exactMatch = inventory.find(
                              (m) =>
                                m.generic &&
                                m.generic.toLowerCase() === value.toLowerCase(),
                            );

                            if (exactMatch) {
                              fillMedicineRow(index, exactMatch);
                              setSuggestions([]);
                            }
                          }, 400);

                          setTypingTimeout(timeout);
                        }}
                        onKeyDown={(e) => {
                          if (!suggestions.length) return;

                          // ⬇ Arrow Down
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setHighlightIndex((prev) =>
                              prev < suggestions.length - 1 ? prev + 1 : 0,
                            );
                          }

                          // ⬆ Arrow Up
                          if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setHighlightIndex((prev) =>
                              prev > 0 ? prev - 1 : suggestions.length - 1,
                            );
                          }

                          // ⏎ Enter → select
                          if (e.key === "Enter" && highlightIndex >= 0) {
                            e.preventDefault();
                            fillMedicineRow(
                              activeRow,
                              suggestions[highlightIndex],
                            );
                            setSuggestions([]);
                            setActiveRow(null);
                          }

                          // ⎋ Escape → close dropdown
                          if (e.key === "Escape") {
                            setSuggestions([]);
                            setActiveRow(null);
                          }
                        }}
                        className="w-full px-2 "
                        placeholder="Type generic name..."
                        autoComplete="off"
                      />
                    </td>

                    {/* Brand - READ-ONLY when auto-filled */}
                    <td className="p-1 border text-center">
                      <div className="flex items-center justify-center">
                        {item.brand || "—"}
                      </div>
                    </td>

                    {/* Batch No. - READ-ONLY when auto-filled */}
                    <td className="p-1 border text-center">
                      <div className="flex items-center justify-center">
                        {item.batch || "—"}
                      </div>
                    </td>

                    {/* Expiry - ALWAYS READ-ONLY */}
                    <td className="p-1 border text-center">
                      <div className="flex items-center justify-center">
                        {item.expiry || "—"}
                      </div>
                    </td>

                    {/* Qty */}
                    <td className="p-1 border">
                      <input
                        type="number"
                        value={item.qty}
                        min="0"
                        disabled={isFinalized}
                        onChange={(e) => {
                          let enteredQty = Number(e.target.value) || 0;
                          if (enteredQty < 0) return;

                          const updated = [...billItems];
                          const currentItem = updated[index];

                          const unit = currentItem.unit || "TABLET";
                          const packSize = Number(currentItem.packSize) || 1;

                          // 🔍 FIND INVENTORY ITEM (SAFE)
                          const inventoryItem = inventory.find(
                            (m) => m.id === currentItem.medicineId,
                          );

                          // 🔒 CALCULATE MAX ALLOWED QTY
                          let maxAllowedQty = 0;

                          if (inventoryItem) {
                            if (unit === "TABLET") {
                              maxAllowedQty = Number(inventoryItem.total || 0);
                            } else {
                              maxAllowedQty = Number(inventoryItem.qty || 0);
                            }
                          }

                          // ❌ BLOCK OVERSELLING
                          if (enteredQty > maxAllowedQty) {
                            enteredQty = maxAllowedQty;
                          }

                          currentItem.qty = enteredQty;

                          // 🔢 tablets sold
                          const tabletsSold =
                            unit === "STRIP"
                              ? enteredQty * packSize
                              : enteredQty;

                          // 💰 pricing
                          const stripRate = Number(currentItem.rate || 0);
                          const tabletRate = stripRate / packSize;

                          const baseAmount = tabletsSold * tabletRate;
                          const gstAmount = (baseAmount * gstPercent) / 100;

                          currentItem.gstAmount = gstAmount;
                          currentItem.amount = baseAmount + gstAmount;

                          setBillItems(updated);
                        }}
                        className="w-full text-right px-2"
                        autoComplete="off"
                      />
                    </td>

                    {/* Unit */}
                    <td className="p-1 border text-center">
                      {item.inventoryUnit === "Tablet" ? (
                        // ✅ Tablet → allow Tablet / Strip
                        <select
                          value={item.unit}
                          disabled={isFinalized}
                          onChange={(e) => {
                            const updated = [...billItems];
                            updated[index].unit = e.target.value;
                            setBillItems(updated);
                          }}
                          className="unit-select w-full text-xs px-1"
                        >
                          <option value="TABLET">Tablet</option>
                          <option value="STRIP">Strip</option>
                        </select>
                      ) : (
                        // ❌ Not Tablet → show fixed unit
                        <span className="block text-xs font-semibold pr-12">
                          {item.inventoryUnit || "—"}
                        </span>
                      )}
                    </td>

                    {/* Pack Size - READ-ONLY when auto-filled */}
                    <td className="p-1 border text-center">
                      <div className=" flex items-center justify-center">
                        {item.packSize || "—"}
                      </div>
                    </td>

                    {/* Rate - when auto-filled */}
                    <td className="p-1 border text-center">
                      <div className=" flex items-center justify-center">
                        ₹ {item.rate ?? "—"}
                      </div>
                    </td>

                    {/* MRP (used for calculations) */}
                    <td className="py-1 px-2 border">
                      <div className="relative flex items-center">
                        <span className="absolute left-3 pointer-events-none">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={item.mrp || ""}
                          min="0"
                          onChange={(e) => {
                            const mrp = Number(e.target.value) || 0;

                            // Prevent negative values
                            if (mrp < 0) {
                              return;
                            }

                            const updated = [...billItems];
                            const currentItem = updated[index];

                            currentItem.mrp = mrp;

                            // Recalculate amount based on new MRP
                            const qty = Number(currentItem.qty) || 0;
                            const unit = currentItem.unit || "TABLET";
                            const packSize = Number(currentItem.packSize) || 1;

                            const tabletsSold =
                              unit === "STRIP" ? qty * packSize : qty;

                            const stripRate = Number(currentItem.rate || 0);
                            const tabletRate = stripRate / packSize;

                            const baseAmount = tabletsSold * tabletRate;

                            const gstAmount = (baseAmount * gstPercent) / 100;

                            currentItem.gstAmount = gstAmount;
                            currentItem.amount = baseAmount + gstAmount;

                            setBillItems(updated);
                          }}
                          className="w-full text-right pr-2 pl-6"
                        />
                      </div>
                    </td>

                    {/* GST Amount */}
                    <td className="p-1 border text-right">
                      ₹ {item.gstAmount?.toFixed(2) || "0.00"}
                    </td>

                    {/* Amount (read-only) */}
                    <td className="p-1 border text-right">
                      ₹ {item.amount?.toFixed(2) || "0.00"}
                    </td>

                    {/* Status - Display from inventory */}
                    <td className="p-1 border print-hide pl-6">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          item.status === "In Stock"
                            ? "bg-green-200 text-green-800"
                            : item.status === "Low Stock"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-red-200 text-red-800"
                        }`}
                      >
                        {item.status || "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-1 px-2 border print-hide">
                      <div className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-2">
                        {!isFinalized && (
                          <button
                            onClick={async () => {
                              const updated = billItems.filter(
                                (_, i) => i !== index,
                              );
                              setBillItems(
                                updated.length ? updated : [emptyRow],
                              );
                            }}
                            className="text-red-600 hover:text-red-800 px-3 py-2 text-xs font-semibold whitespace-nowrap touch-manipulation"
                          >
                            Delete
                          </button>
                        )}
                        {!isFinalized && (
                          <button
                            onClick={() => addRowAt(index + 1)}
                            className="text-blue-600 hover:text-blue-800 px-3 py-2 text-xs font-semibold"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2 px-4 flex flex-col sm:flex-row justify-between items-end gap-4 footer-section shrink-0">
            <div className="left shrink-0 w-full sm:w-auto">
              <h2 className="font-bold text-xs sm:text-sm mb-1">
                Terms & Conditions
              </h2>
              <ul className="list-disc list-inside text-xs leading-tight space-y-0.5">
                <li>Cut Strips will not be refunded</li>
                <li>Medicines can be returned within 5 days with bill.</li>
                <li>Prices inclusive of all taxes.</li>
                <li>Jurisdiction Applies</li>
              </ul>
            </div>

            <div className="right border w-full sm:w-60 shrink-0">
              <div className="sign border-b-2 h-10 sm:h-12 p-1 flex items-start">
                <p className="text-xs">AUTHORISED SIGNATORY</p>
              </div>
              <div className="total p-2 text-xs flex justify-between gap-4">
                <div className="space-y-0.5">
                  <p>Subtotal:</p>
                  <p>Total GST({gstPercent}%):</p>
                  <p className="font-bold">GRAND TOTAL:</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p>₹{totals.subtotal}</p>
                  <p>₹{totals.totalGST}</p>
                  <p className="font-bold">₹{totals.grandTotal}</p>
                </div>
              </div>
            </div>
          </div>
          {showUpgradePopup && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-[#1f1f1f] rounded-xl p-6 w-[320px] relative text-center">
                {/* Close button */}
                <button
                  onClick={() => setShowUpgradePopup(false)}
                  className="absolute top-2 right-3 text-white text-xl"
                >
                  ×
                </button>

                <h3 className="text-xl font-semibold text-red-400 mb-2">
                  Unlock Billing with Pro
                </h3>
                <br />

                <p className="text-sm text-gray-300 mb-4">
                  Free plan allows only <b>3 medicines per bill</b>.<br />
                  <br />
                  <span className="font-bold text-green-500 text-lg">
                    Upgrade to Pro
                  </span>{" "}
                  <br />
                  <br />
                  for unlimited billing & auto deduction.
                </p>

                <button
                  onClick={() => navigate("/subscription")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg w-full"
                >
                  Unlock Pro Features
                </button>
              </div>
            </div>
          )}
        </main>

{expiredWarning && (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
    {expiredWarning}
  </div>
)}

        {showSaveSuccess && (
          <div className="fixed top-6 right-6 z-[9999] bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            ✅ Bill saved successfully
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
