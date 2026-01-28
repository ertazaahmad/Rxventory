import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  getDoc, // ✅ ADD THIS
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
      <td className={`border p-2 ${!isEditing ? statusClass : ""}`}>
        {isEditing ? (
          type === "select" ? (
            <select
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveField(med, field)}
              className="border px-1 py-1 w-full"
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
              className="border px-1 w-full"
            />
          )
        ) : (
          <span
            className="cursor-pointer font-medium"
            onClick={() => {
              setEditingCell({ id: med.id, field });
              setEditValue(value ?? "");
            }}
          >
            {value || "—"}
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
  if (diffDays <= 30) return "nearExpiry"; // you can change 30
  return "valid";
};




const filteredMedicines = medicines.filter((med) => {
  // SEARCH
  const matchesSearch =
    !search ||
    med.generic?.toLowerCase().includes(search.toLowerCase());

  // EXPIRY TYPE
  const expiryType = getExpiryType(med.expiry);

  const expirySelected =
    selectedStatus.includes("Expired") ||
    selectedStatus.includes("Near Expiry");

  const matchesExpiry =
    !expirySelected ||
    (selectedStatus.includes("Expired") && expiryType === "expired") ||
    (selectedStatus.includes("Near Expiry") && expiryType === "nearExpiry");

  // STOCK STATUS (IGNORE when expiry filter is active)
  const matchesStatus =
    expirySelected ||
    selectedStatus.length === 0 ||
    selectedStatus.includes(med.status);

  return matchesSearch && matchesStatus && matchesExpiry;
});





  return (
    <div className="p-4">
      {shouldShowProfilePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Complete Profile</h2>

            <input
              type="text"
              placeholder="Your Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full border p-2 mb-3"
            />

            <input
              type="text"
              placeholder="Clinic Name"
              value={profileClinic}
              onChange={(e) => setProfileClinic(e.target.value)}
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

      {/* ================= INFO SECTION ================= */}
      <div className="mb-4 bg-gray-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium">
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
      <div className="mt-4 overflow-x-auto" id="print-area">
        {/* ===== PRINT HEADER ===== */}
        <div className="print-header">
          <h1 className="print-title">RXVENTORY</h1>
          <p className="print-subtitle">
            {userData?.clinicName || "Pharmacy Name"}
          </p>
        </div>

        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2" style={{width: "50px"}}>Sr</th>
              <th className="border p-2" style={{width: "200px"}}>Generic</th>
              <th className="border p-2">Brand</th>
              <th className="border p-2">Batch</th>
              <th className="border p-2">Expiry</th>
              <th className="border p-2">Qty (Strips)</th>
              <th className="border p-2">Pack </th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Unit</th>
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
                      <label>
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
                        />
                        Out of Stock
                      </label>

                      <label>
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
                        />
                        Low Stock
                      </label>

                      <label>
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
                        />
                        Near Expiry
                      </label>

                      <label>
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
                <td className="border p-2">{i + 1}</td>

                <EditableCell med={med} field="generic" value={med.generic} />
                <EditableCell med={med} field="brand" value={med.brand} />
                <EditableCell med={med} field="batch" value={med.batch} />
                <EditableCell
                  med={med}
                  field="expiry"
                  value={med.expiry}
                  type="month"
                />
                <EditableCell
                  med={med}
                  field="qty"
                  value={med.qty}
                  type="number"
                />
                <EditableCell
                  med={med}
                  field="pack"
                  value={med.pack}
                  type="number"
                />

                <td className="border p-2 font-semibold">{med.total}</td>

                <EditableCell
                  med={med}
                  field="unit"
                  value={med.unit}
                  type="select"
                  options={["Tablet", "Capsule", "Syrup", "Injection", "Ointment"]}
                />

                <EditableCell
                  med={med}
                  field="minStock"
                  value={med.minStock}
                  type="number"
                />

                <EditableCell
                  med={med}
                  field="status"
                  value={med.status}
                  type="select"
                  options={["In Stock", "Low Stock", "Out of Stock"]}
                />

                <td className="border p-2 no-print">
                  <button
                    onClick={() => deleteMedicine(med.id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
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
