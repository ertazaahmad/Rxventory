import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import Actionbar from "../components/Actionbar";

const Inventory = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [userData, setUserData] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [profileClinic, setProfileClinic] = useState("");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);

  /* ================= PROFILE POPUP ================= */
  const handleSaveProfile = async () => {
    if (!user) return;
    if (!profileName.trim() || !profileClinic.trim()) {
      alert("Please fill all fields");
      return;
    }

    const ref = doc(db, "users", user.uid);

    await updateDoc(ref, {
      name: profileName.trim(),
      clinicName: profileClinic.trim(),
    });

    setUserData((prev) => ({
      ...prev,
      name: profileName.trim(),
      clinicName: profileClinic.trim(),
    }));
  };

  /* ================= FETCH ================= */
  const fetchMedicines = async () => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "medicines");
    const snap = await getDocs(ref);

    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setMedicines(list);
  };

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUserData(snap.data());
      }
    };

    fetchUserData();
  }, [user]);

  const shouldShowProfilePopup =
    !userData ||
    !userData.name ||
    userData.name.trim() === "" ||
    !userData.clinicName ||
    userData.clinicName.trim() === "";

  useEffect(() => {
    fetchMedicines();
  }, [user]);



  /* ================= ADD EMPTY MEDICINE ================= */
  const addEmptyMedicine = async () => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "medicines");

    await addDoc(ref, {
      generic: "",
      brand: "",
      batch: "",
      expiry: "",
      qty: 0,
      pack: 1,
      total: 0,
      unit: "Tablet",
      rate: 0,
      minStock: 0,
      status: "In Stock",
      createdAt: serverTimestamp(),
    });

    fetchMedicines();
  };

  /* ================= SAVE INLINE EDIT ================= */
  const saveField = async (med, field) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid, "medicines", med.id);

    const value =
      typeof editValue === "string" && !isNaN(editValue)
        ? Number(editValue)
        : editValue;

    let updated = { [field]: value };

    const qty = field === "qty" ? Number(value) : med.qty;
    const pack = field === "pack" ? Number(value) : med.pack;
    const minStock = field === "minStock" ? Number(value) : med.minStock;

    updated.total = qty * pack;
    if (qty === 0) {
      updated.status = "Out of Stock";
    } else if (qty <= minStock) {
      updated.status = "Low Stock";
    } else {
      updated.status = "In Stock";
    }

    await updateDoc(ref, updated);

    setEditingCell(null);
    setEditValue("");
    fetchMedicines();
  };

  const deleteMedicine = async (medicineId) => {
    console.log("DELETE ID:", medicineId);
    console.log("USER ID:", user.uid);

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medicine?"
    );

    if (!confirmDelete) return;

    const ref = doc(db, "users", user.uid, "medicines", medicineId);
    await deleteDoc(ref);

    fetchMedicines();
  };

  /* ================= EDITABLE CELL ================= */
  const EditableCell = ({ med, field, value, type = "text", options = [] }) => {
    const isEditing =
      editingCell?.id === med.id && editingCell?.field === field;

    let statusClass = "";

    if (field === "status") {
      if (value === "In Stock") statusClass = "status instock";
      else if (value === "Low Stock") statusClass = "status lowstock";
      else if (value === "Out of Stock") statusClass = "status outofstock";
    }

    return (
      <td className={`border p-1 sm:p-2 text-xs sm:text-sm ${!isEditing ? statusClass : ""}`}>
        {isEditing ? (
          type === "select" ? (
            <select
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveField(med, field)}
              className="border px-2 py-2 w-full text-xs sm:text-sm "
            >
              {options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input
              autoFocus
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveField(med, field)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveField(med, field);
              }}
              className="border px-2 py-2 w-full text-xs sm:text-sm "
            />
          )
        ) : (
     <span
  className="cursor-pointer font-medium block py-2 sm:py-0"
  onClick={() => {
    setEditingCell({ id: med.id, field });
    setEditValue(value ?? "");
  }}
>
  {field === "rate"
    ? value !== undefined && value !== null && value !== ""
      ? `₹ ${value}`
      : "—"
    : value || "—"}
</span>
        )}
      </td>
    );
  };

  /* ================= UI ================= */


const getExpiryType = (expiry) => {
  if (!expiry) return "valid";

  const today = new Date();
  const [year, month] = expiry.split("-");
  const expiryDate = new Date(year, month - 1, 1);

  const diffDays =
    (expiryDate - today) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "expired";
  if (diffDays <= 30) return "nearExpiry";
  return "valid";
};




const filteredMedicines = medicines.filter((med) => {
  // SEARCH - with null safety
  const matchesSearch =
    !search ||
    (med.generic && med.generic.toLowerCase().includes(search.toLowerCase()));

  // EXPIRY TYPE
  const expiryType = getExpiryType(med.expiry);

  const expirySelected =
    selectedStatus.includes("Expired") ||
    selectedStatus.includes("Near Expiry");

  let matchesExpiry = true;
  if (expirySelected) {
    matchesExpiry =
      (selectedStatus.includes("Expired") && expiryType === "expired") ||
      (selectedStatus.includes("Near Expiry") && expiryType === "nearExpiry");
  }

  // STOCK STATUS
  const stockSelected =
    selectedStatus.includes("Out of Stock") ||
    selectedStatus.includes("Low Stock");

  let matchesStock = true;
  if (stockSelected) {
    matchesStock = selectedStatus.includes(med.status);
  }

  return matchesSearch && matchesExpiry && matchesStock;
});

  return (
    <div className="p-2 sm:p-4">
      {/* ================= PROFILE POPUP ================= */}
      {shouldShowProfilePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-md sm:w-96">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Complete Your Profile</h2>

            <input
              type="text"
              placeholder="Your Full Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full border p-2 mb-3 text-sm sm:text-base"
            />

            <input
              type="text"
              placeholder="Clinic Name"
              value={profileClinic}
              onChange={(e) => setProfileClinic(e.target.value)}
              className="w-full border p-2 mb-4 text-sm sm:text-base"
            />

            <button
              onClick={handleSaveProfile}
              className="w-full bg-blue-600 text-white p-2 rounded text-sm sm:text-base active:scale-95 transition"
            >
              Save & Continue
            </button>
          </div>
        </div>
      )}

      {/* ================= INFO SECTION ================= */}
      <div className="mb-4 bg-gray-200 rounded-xl p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
                      gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
        <div>
          <span className="text-gray-600">User ID:</span>{" "}
          <span className="font-semibold">{userData?.userId || "—"}</span>
        </div>

        <div>
          <span className="text-gray-600">Name:</span>{" "}
          <span className="font-semibold">
            {userData?.name || user?.displayName || "—"}
          </span>
        </div>

        <div>
          <span className="text-gray-600">Pharmacy:</span>{" "}
          <span className="font-semibold">
            {userData?.clinicName || "Rxventory"}
          </span>
        </div>

        <div>
          <span className="text-gray-600">Subscription:</span>{" "}
          <span className="font-semibold text-red-900">
            {userData?.subscription || "Free"}
          </span>
        </div>
      </div>

      <Actionbar
        search={search}
        setSearch={setSearch}
        extraAction={[
          {
            label: "+",
            className: "bg-green-500 hover:bg-green-600 rounded-lg px-3",
            onClick: addEmptyMedicine,
          },
          {
            label: "Print",
            className: "bg-blue-500 hover:bg-blue-600 rounded-lg px-3",
            onClick: () => window.print(),
          },
        ]}
      />

      {/* ===== MAIN TABLE ===== */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-gray-300" id="print-area">
        {/* ===== PRINT HEADER ===== */}
        <div className="print-header">
          <h1 className="print-title">RXVENTORY</h1>
          <p className="print-subtitle">
            {userData?.clinicName || "Pharmacy Name"}
          </p>
        </div>

        {/* Mobile: Show editable card view, Desktop: Show full table */}
        <div className="block lg:hidden">
          {/* MOBILE CARD VIEW */}
          {filteredMedicines.map((med, i) => (
            <div key={med.id} className="bg-white border-b p-3">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="font-bold text-sm mb-1">{i + 1}. Medicine Details</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  med.status === "In Stock" 
                    ? "bg-green-200 text-green-800" 
                    : med.status === "Low Stock"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}>
                  {med.status}
                </span>
              </div>
              
              <div className="space-y-2">
                {/* Generic Name */}
                <div>
                  <label className="text-xs text-gray-600 font-semibold block mb-1">Generic Name:</label>
                  <input
                    type="text"
                    value={med.generic || ""}
                    onChange={(e) => {
                      const ref = doc(db, "users", user.uid, "medicines", med.id);
                      updateDoc(ref, { generic: e.target.value });
                      fetchMedicines();
                    }}
                    className="w-full border rounded px-2 py-2 text-sm "
                    placeholder="Enter generic name"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="text-xs text-gray-600 font-semibold block mb-1">Brand:</label>
                  <input
                    type="text"
                    value={med.brand || ""}
                    onChange={(e) => {
                      const ref = doc(db, "users", user.uid, "medicines", med.id);
                      updateDoc(ref, { brand: e.target.value });
                      fetchMedicines();
                    }}
                    className="w-full border rounded px-2 py-2 text-sm "
                    placeholder="Enter brand"
                  />
                </div>

                {/* Batch and Expiry Row */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600 font-semibold block mb-1">Batch:</label>
                    <input
                      type="text"
                      value={med.batch || ""}
                      onChange={(e) => {
                        const ref = doc(db, "users", user.uid, "medicines", med.id);
                        updateDoc(ref, { batch: e.target.value });
                        fetchMedicines();
                      }}
                      className="w-full border rounded px-2 py-2 text-sm "
                      placeholder="Batch"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-semibold block mb-1">Expiry:</label>
                    <input
                      type="month"
                      value={med.expiry || ""}
                      onChange={(e) => {
                        const ref = doc(db, "users", user.uid, "medicines", med.id);
                        updateDoc(ref, { expiry: e.target.value });
                        fetchMedicines();
                      }}
                      className="w-full border rounded px-2 py-2 text-sm "
                    />
                  </div>
                </div>

                {/* Qty and Pack Row */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600 font-semibold block mb-1">Qty:</label>
                    <input
                      type="number"
                      value={med.qty || 0}
                      onChange={(e) => {
                        const newQty = Number(e.target.value) || 0;
                        const ref = doc(db, "users", user.uid, "medicines", med.id);
                        const newTotal = newQty * (med.pack || 1);
                        
                        let newStatus = "In Stock";
                        if (newQty === 0) {
                          newStatus = "Out of Stock";
                        } else if (newQty <= (med.minStock || 0)) {
                          newStatus = "Low Stock";
                        }
                        
                        updateDoc(ref, { 
                          qty: newQty,
                          total: newTotal,
                          status: newStatus
                        });
                        fetchMedicines();
                      }}
                      className="w-full border rounded px-2 py-2 text-sm "
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-semibold block mb-1">Pack:</label>
                    <input
                      type="number"
                      value={med.pack || 1}
                      onChange={(e) => {
                        const newPack = Number(e.target.value) || 1;
                        const ref = doc(db, "users", user.uid, "medicines", med.id);
                        const newTotal = (med.qty || 0) * newPack;
                        updateDoc(ref, { 
                          pack: newPack,
                          total: newTotal
                        });
                        fetchMedicines();
                      }}
                      className="w-full border rounded px-2 py-2 text-sm "
                    />
                  </div>
                </div>

                {/* Unit and Min Stock Row */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600 font-semibold block mb-1">Unit:</label>
                    <select
                      value={med.unit || "Tablet"}
                      onChange={(e) => {
                        const ref = doc(db, "users", user.uid, "medicines", med.id);
                        updateDoc(ref, { unit: e.target.value });
                        fetchMedicines();
                      }}
                      className="w-full border rounded px-2 py-2 text-sm "
                    >
                      <option>Tablet</option>
                      <option>Capsule</option>
                      <option>Syrup</option>
                      <option>Injection</option>
                      <option>Ointment</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-semibold block mb-1">Min Stock:</label>
                    <input
                      type="number"
                      value={med.minStock || 0}
                      onChange={(e) => {
                        const newMinStock = Number(e.target.value) || 0;
                        const ref = doc(db, "users", user.uid, "medicines", med.id);
                        
                        let newStatus = "In Stock";
                        if ((med.qty || 0) === 0) {
                          newStatus = "Out of Stock";
                        } else if ((med.qty || 0) <= newMinStock) {
                          newStatus = "Low Stock";
                        }
                        
                        updateDoc(ref, { 
                          minStock: newMinStock,
                          status: newStatus
                        });
                        fetchMedicines();
                      }}
                      className="w-full border rounded px-2 py-2 text-sm "
                    />
                  </div>
                </div>

               {/* Rate and Total Row */}
<div className="grid grid-cols-2 gap-2">
 {/* Rate */}
<div>
  <label className="text-xs text-gray-600 font-semibold block mb-1">
    Rate:
  </label>

  <div className="flex items-center border rounded bg-white">
    <span className="px-3 text-gray-700 select-none">₹</span>

    <input
      type="number"
      value={med.rate ?? ""}
      onChange={(e) => {
        const newRate = Number(e.target.value) || 0;
        const ref = doc(db, "users", user.uid, "medicines", med.id);
        updateDoc(ref, { rate: newRate });
        fetchMedicines();
      }}
      className="flex-1 outline-none px-2 py-2 text-sm"
      min="0"
    />
  </div>
</div>


  {/* Total (read-only) */}
  <div>
    <label className="text-xs text-gray-600 font-semibold block mb-1">
      Total:
    </label>
    <div className="w-full border rounded px-2 py-2 text-sm bg-gray-100 flex items-center">
      {med.total || 0}
    </div>
  </div>
</div>
              </div>
              
              <button
                onClick={() => deleteMedicine(med.id)}
                className="mt-3 bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded text-sm w-full active:scale-95 transition "
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE VIEW */}
        <table className="w-full border-collapse hidden lg:table">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr className="text-xs lg:text-sm">
              <th className="border p-2" style={{width: "50px"}}>Sr</th>
              <th className="border p-2" style={{width: "200px"}}>Generic</th>
              <th className="border p-2">Brand</th>
              <th className="border p-2">Batch</th>
              <th className="border p-2">Expiry</th>
              <th className="border p-2">Qty (Strips)</th>
              <th className="border p-2">Pack </th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Min</th>
              <th className="border p-2">
                <div className="relative inline-flex items-center gap-2">
                  <span>Status</span>

                  <button
                    onClick={() => {
                      setIsOpen(!isOpen);
                    }}
                    className=" flex items-center gap-1 focus:outline-none"
                  >
                    <svg
                      className={`h-6 w-6 mt-1 transition-transform duration-300 ${
                        !isOpen ? "rotate-0" : "rotate-180"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="dropdown fixed w-33  mt-40  bg-white border p-2 rounded shadow-lg  z-10 flex flex-col space-y-1 items-start">
                      <label className="cursor-pointer hover:bg-gray-100 w-full p-1 rounded text-sm">
                        <input
                          type="checkbox"
                          checked={selectedStatus.includes("Out of Stock")}
                          onChange={() => {
                            setSelectedStatus((prev) =>
                              prev.includes("Out of Stock")
                                ? prev.filter((s) => s !== "Out of Stock")
                                : [...prev, "Out of Stock"]
                            );
                          }}
                          className="mr-2"
                        />
                        Out of Stock
                      </label>

                      <label className="cursor-pointer hover:bg-gray-100 w-full p-1 rounded text-sm">
                        <input
                          type="checkbox"
                          checked={selectedStatus.includes("Low Stock")}
                          onChange={() => {
                            setSelectedStatus((prev) =>
                              prev.includes("Low Stock")
                                ? prev.filter((s) => s !== "Low Stock")
                                : [...prev, "Low Stock"]
                            );
                          }}
                          className="mr-2"
                        />
                        Low Stock
                      </label>

                      <label className="cursor-pointer hover:bg-gray-100 w-full p-1 rounded text-sm">
                         <input
                          type="checkbox"
                          checked={selectedStatus.includes("Near Expiry")}
                          onChange={() => {
                            setSelectedStatus((prev) =>
                              prev.includes("Near Expiry")
                                ? prev.filter((s) => s !== "Near Expiry")
                                : [...prev, "Near Expiry"]
                            );
                          }}
                          className="mr-2"
                        />
                        Near Expiry
                      </label>

                      <label className="cursor-pointer hover:bg-gray-100 w-full p-1 rounded text-sm">
                         <input
                          type="checkbox"
                          checked={selectedStatus.includes("Expired")}
                          onChange={() => {
                            setSelectedStatus((prev) =>
                              prev.includes("Expired")
                                ? prev.filter((s) => s !== "Expired")
                                : [...prev, "Expired"]
                            );
                          }}
                          className="mr-2"
                        />
                        Expired
                      </label>
                    </div>
                  )}
                </div>
              </th>
              <th className="border p-2 no-print">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMedicines.map((med, i) => (
              <tr key={med.id} className="hover:bg-gray-50">
                <td className="border p-2 text-xs lg:text-sm">{i + 1}</td>

                <EditableCell med={med} field="generic" value={med.generic} />
                <EditableCell med={med} field="brand" value={med.brand} />
                <EditableCell med={med} field="batch" value={med.batch} />
                <EditableCell med={med} field="expiry" value={med.expiry} type="month" />
                <EditableCell med={med} field="qty" value={med.qty} type="number" />
                <EditableCell med={med} field="pack" value={med.pack} type="number" />

                <td className="border p-2 font-semibold text-xs lg:text-sm">{med.total}</td>

                <EditableCell med={med} field="unit" value={med.unit} type="select" options={["Tablet", "Capsule", "Syrup", "Injection", "Ointment"]} />

                <EditableCell med={med} field="rate" value={med.rate} type="number" />

                <EditableCell med={med} field="minStock" value={med.minStock} type="number" />

                <EditableCell med={med} field="status" value={med.status} type="select" options={["In Stock", "Low Stock", "Out of Stock"]} />

                <td className="border p-2 no-print">
                  <button
                    onClick={() => deleteMedicine(med.id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded text-xs active:scale-95 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;