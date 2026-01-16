import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDoc, setDoc, updateDoc, doc } from "firebase/firestore";
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

  const [patient, setPatient] = useState({
    name: "",
    doctor: "",
    address: "",
  });

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

  // RESTORE DRAFT ON MOUNT (runs only once)
  useEffect(() => {
    const savedDraft = localStorage.getItem("billingDraft");

    if (savedDraft) {
      try {
        const data = JSON.parse(savedDraft);
        if (data.patient) setPatient(data.patient);
        if (data.invoiceMeta) setInvoiceMeta(data.invoiceMeta);
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
    };

    localStorage.setItem("billingDraft", JSON.stringify(draftBill));
  }, [patient, invoiceMeta, isInitialized]);

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
        <main
          id="print-area"
          className="border m-2 mb-1 h-[calc(100vh-11rem)]"
        >
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
                  <th className="px-4 py-2" style={{width: 50}}>Sr.</th>
                  <th className="px-4 py-2" style={{width: 180}}>Generic Name</th>
                  <th className="px-4 py-2">Brand</th>
                  <th className="px-4 py-2">Batch No.</th>
                  <th className="px-4 py-2">Expiry</th>
                  <th className="px-4 py-2">Qty </th>
                  <th className="px-4 py-2">Pack Size</th>
                  <th className="px-4 py-2">MRP</th>
                  <th className="px-4 py-2">Rate</th>
                  <th className="px-4 py-2">GST</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {[...Array(10)].map((_, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-100">
                    <td className="p-1 border text-center">1</td>
                    <td className="p-1 border">Paracetamol</td>
                    <td className="p-1 border">Crocin</td>
                    <td className="p-1 border">B123</td>
                    <td className="p-1 border">12/26</td>
                    <td className="p-1 border">50</td>
                    <td className="p-1 border">10 tabs</td>
                    <td className="p-1 border">500</td>
                    <td className="p-1 border">₹25</td>
                    <td className="p-1 border">Tablet</td>
                    <td className="p-1 border">20</td>
                    <td className="p-1 border text-green-600 font-semibold">
                      In Stock
                    </td>
                    <td className="p-1 border">
                      <div className="flex gap-2 justify-center">
                        <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                            />
                          </svg>
                        </button>
                      </div>
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
                  <p>Total GST(12%):</p>
                  <p className="font-bold">GRAND TOTAL:</p>
                </div>
                <div>
                  <p>₹1500</p>
                  <p>₹180</p>
                  <p className="font-bold">₹1680</p>
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