import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getDoc,
  setDoc,
  updateDoc,
  doc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import Actionbar from "../components/Actionbar.jsx";

const Billing = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [pharmacyPhone, setPharmacyPhone] = useState("");
  const [pharmacyGSTIN, setPharmacyGSTIN] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [gstPercent, setGstPercent] = useState(12);

  const emptyRow = {
    genericName: "",
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
    genericName: "",
    brand: "",
    batch: "",
    expiry: "",
    qty: "",
    packSize: "",
    mrp: "",
    rate: "",
    gstPercent: 12,
    amount: 0,
    status: "",
  });

  const [inventory, setInventory] = useState([]);

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

  const generateInvoiceNumber = async () => {
    const ref = doc(db, "counters", "invoices");
    const snap = await getDoc(ref);

    let newInvoiceNo;

    if (snap.exists()) {
      const last = Number(snap.data().lastInvoiceNo || 0);
      newInvoiceNo = last + 1;
      await updateDoc(ref, { lastInvoiceNo: newInvoiceNo });
    } else {
      newInvoiceNo = 1;
      await setDoc(ref, { lastInvoiceNo: 1 });
    }

    return newInvoiceNo;
  };

  const handleNewBill = async () => {
    localStorage.removeItem("billingDraft");

    setPatient({
      name: "",
      address: "",
      doctor: "",
    });

    // Reset to single empty row
    setBillItems([createEmptyRow()]);

    const invoiceNo = await generateInvoiceNumber();
    const now = new Date();

    setInvoiceMeta({
      invoiceNo: invoiceNo,
      date: now.toLocaleDateString("en-IN"),
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
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

    // Only generate new invoice if there's no draft AND no current invoice
    if (!savedDraft && !invoiceMeta.invoiceNo) {
      handleNewBill();
    }
  }, [isInitialized, loadingUserData, showPopup]);

  // SAVE DRAFT whenever patient or invoiceMeta changes (but not on first mount)
  useEffect(() => {
    if (!isInitialized) return;

    const draftBill = {
      patient,
      invoiceMeta,
      billItems,
    };

    localStorage.setItem("billingDraft", JSON.stringify(draftBill));
  }, [patient, invoiceMeta, billItems, isInitialized]);

  useEffect(() => {
    if (!user) return;

    const fetchInventory = async () => {
      const ref = collection(db, "users", user.uid, "medicines");
      const snap = await getDocs(ref);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setInventory(list);
    };

    fetchInventory();
  }, [user]);

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = billItems.reduce((sum, item) => {
      const qty = Number(item.qty) || 0;
      const mrp = Number(item.mrp) || 0;
      return sum + (qty * mrp);
    }, 0);

    const totalGST = billItems.reduce((sum, item) => {
      return sum + (Number(item.gstAmount) || 0);
    }, 0);

    const grandTotal = subtotal + totalGST;

    return {
      subtotal: subtotal.toFixed(2),
      totalGST: totalGST.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    };
  };

  const totals = calculateTotals();

  return (
    <div>
      {!loadingUserData && showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">
              Complete Pharmacy Details
            </h2>

            <input
              type="text"
              placeholder="Pharmacy Name"
              value={pharmacyName}
              onChange={(e) => setPharmacyName(e.target.value)}
              className="w-full border p-2 mb-3"
            />

            <input
              type="text"
              placeholder="Pharmacy Address"
              value={pharmacyAddress}
              onChange={(e) => setPharmacyAddress(e.target.value)}
              className="w-full border p-2 mb-4"
            />

            <input
              type="text"
              placeholder="Pharmacy Phone"
              value={pharmacyPhone}
              onChange={(e) => setPharmacyPhone(e.target.value)}
              className="w-full border p-2 mb-4"
            />

            <input
              type="text"
              placeholder="Pharmacy GSTIN"
              value={pharmacyGSTIN}
              onChange={(e) => setPharmacyGSTIN(e.target.value)}
              className="w-full border p-2 mb-4"
            />

            <button
              onClick={handleSavePharmacy}
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Save & Continue
            </button>
          </div>
        </div>
      )}

      <div className="min-h-[calc(100vh-6rem)] m-2 p-4 pb-1 bg-gray-200 rounded-xl text-sm font-medium">
        <Actionbar
          primarycolor="focus:ring-gray-900/60 rounded-xl bg-gray-400 hover:bg-gray-500"
          secondarycolor="focus:ring-blue-900/60 rounded-xl bg-blue-400 hover:bg-blue-500"
          extraAction={[
            {
              label: "PRINT",
              className:
                "focus:ring-green-900/60 rounded-xl bg-green-400 hover:bg-green-500",
              onClick: () => window.print(),
            },
            {
              label: "NEW BILL",
              className:
                "focus:ring-blue-900/60 rounded-xl bg-blue-400 hover:bg-blue-500",
              onClick: () => handleNewBill(),
            },
          ]}
        />
        <main id="print-area" className="border m-2 mb-1 h-[calc(100vh-11rem)]">
          <div className="pl-4 border-b border-black h-24 grid grid-cols-3 gap-80">
            <div className="flex flex-col gap-1">
              <h3 className="text-blue-600 font-extrabold">
                {userData?.pharmacyName || "—"}
              </h3>
              <p>{userData?.pharmacyAddress || "—"}</p>
              <p>Phone: +91 {userData?.pharmacyPhone || "—"}</p>
              <p>GSTIN: {userData?.pharmacyGSTIN || "—"}</p>
            </div>
            <div className="flex flex-col gap-3">
              <p>
                <span>Patient:</span>{" "}
                <input
                  value={patient.name}
                  placeholder="Enter Patient Name"
                  onChange={(e) =>
                    setPatient({ ...patient, name: e.target.value })
                  }
                />
              </p>
              <p>
                <span>Address:</span>{" "}
                <input
                  value={patient.address}
                  placeholder="Enter Patient Address"
                  onChange={(e) =>
                    setPatient({ ...patient, address: e.target.value })
                  }
                />
              </p>
              <p>
                <span>Doctor:</span>{" "}
                <input
                  value={patient.doctor}
                  placeholder="Enter Doctor Name"
                  onChange={(e) =>
                    setPatient({ ...patient, doctor: e.target.value })
                  }
                />
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <span className="font-semibold">Invoice No:</span>{" "}
                {invoiceMeta.invoiceNo}
              </div>

              <div>
                <span className="font-semibold">Date:</span> {invoiceMeta.date}
              </div>

              <div>
                <span className="font-semibold">Time:</span> {invoiceMeta.time}
              </div>
            </div>
          </div>

          <div className="m-2 h-[48vh] overflow-y-auto overflow-x-auto scrollbar-hide">
            <table className="w-full text-left divide-y divide-gray-400">
              <thead className="bg-gray-300 sticky top-0 z-10">
                <tr className="text-sm font-semibold">
                  <th className="px-4 py-2" style={{ width: 50 }}>
                    Sr.
                  </th>
                  <th className="px-4 py-2" style={{ width: 180 }}>
                    Generic Name
                  </th>
                  <th className="px-4 py-2">Brand</th>
                  <th className="px-4 py-2">Batch No.</th>
                  <th className="px-4 py-2">Expiry</th>
                  <th className="px-4 py-2">Qty </th>
                  <th className="px-4 py-2">Pack Size</th>
                  <th className="px-4 py-2">Rate</th>
                  <th className="px-4 py-2">MRP</th>
                  <th className="px-4 py-2">
                    <div className="flex flex-col gap-1 items-center">
                      <span>GST %</span>
                      <input
                        type="number"
                        value={gstPercent}
                        onChange={(e) =>
                          setGstPercent(Number(e.target.value) || 0)
                        }
                        className="w-12 px-1 py-1 border border-gray-400 rounded text-center bg-white text-sm"
                        min="0"
                        max="99"
                      />
                    </div>
                  </th>

                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {billItems.map((item, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-100">
                    {/* Sr. No */}
                    <td className="p-1 border text-center">{index + 1}</td>

                    {/* Generic Name */}
                    <td className="p-1 border">
                      <input
                        value={item.genericName}
                        onChange={(e) => {
                          const value = e.target.value;
                          const updated = [...billItems];
                          updated[index].genericName = value;

                          const match = inventory.find(
                            (m) =>
                              m.generic?.toLowerCase() === value.toLowerCase(),
                          );

                          if (match) {
                            updated[index] = {
                              ...updated[index],
                              medicineId: match.id,
                              genericName: match.generic,
                              brand: match.brand,
                              batch: match.batch,
                              expiry: match.expiry,
                              packSize: match.pack,
                              mrp: match.total,
                              rate: match.total / match.pack,
                              gstPercent: 12,
                              originalStock: match.qty,
                              qty: 0,
                            };
                          }

                          setBillItems(updated);
                        }}
                        className="w-full"
                      />
                    </td>

                    {/* Brand */}
                    <td className="p-1 border">
                      <input
                        value={item.brand}
                        onChange={(e) => {
                          const updated = [...billItems];
                          updated[index].brand = e.target.value;
                          setBillItems(updated);
                        }}
                        className="w-full"
                      />
                    </td>
                    {/* Batch No. */}
                    <td className="p-1 border">
                      <input
                        value={item.batch}
                        onChange={(e) => {
                          const updated = [...billItems];
                          updated[index].batch = e.target.value;
                          setBillItems(updated);
                        }}
                        className="w-full"
                      />
                    </td>

                    {/* Expiry */}
                    <td className="p-1 border text-center">
                      {item.expiry || "—"}
                    </td>

                    {/* Qty */}
                    <td className="p-1 border ">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => {
                          const qty = Number(e.target.value) || 0;
                          const updated = [...billItems];
                          const currentItem = updated[index];

                          if (qty > currentItem.originalStock) {
                            alert("Insufficient stock");
                            return;
                          }

                          currentItem.qty = qty;

                          // Calculate based on MRP (not rate)
                          const baseAmount = qty * Number(currentItem.mrp || 0);
                          const gstAmount = (baseAmount * gstPercent) / 100;

                          currentItem.gstAmount = gstAmount;
                          currentItem.amount = baseAmount + gstAmount;

                          setBillItems(updated);
                        }}
                        className="w-full text-right"
                      />
                    </td>

                    {/* Pack Size */}
                    <td className="p-1 border">
                      <input
                        type="number"
                        value={item.packSize}
                        onChange={(e) => {
                          const packSize = Number(e.target.value) || 0;
                          const updated = [...billItems];
                          updated[index].packSize = packSize;
                          setBillItems(updated);
                        }}
                        className="w-full text-right"
                      />
                    </td>

                    {/* Rate (for display only) */}
                    <td className="py-1 px-4 border">
                      <div className="relative flex items-center">
                        <span className="absolute left-2">₹</span>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => {
                            const rate = Number(e.target.value) || 0;
                            const updated = [...billItems];
                            updated[index].rate = rate;
                            setBillItems(updated);
                          }}
                          className="w-full text-right pr-1"
                          style={{ paddingLeft: '20px' }}
                        />
                      </div>
                    </td>

                    {/* MRP (used for calculations) */}
                    <td className="py-1 px-4 border">
                      <div className="relative flex items-center">
                        <span className="absolute left-2">₹</span>
                        <input
                          type="number"
                          value={item.mrp}
                          onChange={(e) => {
                            const mrp = Number(e.target.value) || 0;
                            const updated = [...billItems];
                            const currentItem = updated[index];
                            
                            currentItem.mrp = mrp;

                            // Recalculate amount based on new MRP
                            const qty = Number(currentItem.qty) || 0;
                            const baseAmount = qty * mrp;
                            const gstAmount = (baseAmount * gstPercent) / 100;

                            currentItem.gstAmount = gstAmount;
                            currentItem.amount = baseAmount + gstAmount;

                            setBillItems(updated);
                          }}
                          className="w-full text-right pr-1"
                          style={{ paddingLeft: '20px' }}
                        />
                      </div>
                    </td>

                    {/* GST Amount */}
                    <td className="p-1 border text-right">
                      ₹ {item.gstAmount?.toFixed(2) || "0.00"}
                    </td>

                    {/* Amount (read-only) */}
                    <td className="p-1 border text-right">₹ {item.amount?.toFixed(2) || "0.00"}</td>

                    {/* Status */}
                    <td className="p-1 border">
                      <input
                        value={item.status}
                        onChange={(e) => {
                          const updated = [...billItems];
                          updated[index].status = e.target.value;
                          setBillItems(updated);
                        }}
                        className="w-full"
                      />
                    </td>

                    {/* Actions */}
                    <td className="p-1 border text-center justify-around flex">
                      <button
                        onClick={() => {
                          const updated = billItems.filter(
                            (_, i) => i !== index,
                          );
                          setBillItems(updated.length ? updated : [emptyRow]);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => addRowAt(index + 1)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2 flex justify-between">
            <div className="left">
              <h2 className="font-bold">Terms & Conditions</h2>
              <ul className="list-disc list-inside">
                <li>Cut Strips will not be refunded</li>
                <li>Medicines can be returned within 5 days with bill.</li>
                <li>Prices inclusive of all taxes.</li>
                <li>Jurisdiction Applies</li>
              </ul>
            </div>

            <div className="right border w-60">
              <div className="sign border-b-2 h-3/7 p-1">
                <p className="text-xs">AUTHORISED SIGNATORY</p>
              </div>
              <div className="total p-1 text-xs flex justify-between">
                <div>
                  <p>Subtotal:</p>
                  <p>Total GST({gstPercent}%):</p>
                  <p className="font-bold">GRAND TOTAL:</p>
                </div>
                <div>
                  <p>₹{totals.subtotal}</p>
                  <p>₹{totals.totalGST}</p>
                  <p className="font-bold">₹{totals.grandTotal}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Billing;