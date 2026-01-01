import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  getDoc,          // ✅ ADD THIS
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
    const minStock =
      field === "minStock" ? Number(value) : med.minStock;

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
  const EditableCell = ({
    med,
    field,
    value,
    type = "text",
    options = [],
  }) => {
    const isEditing =
      editingCell?.id === med.id && editingCell?.field === field;

    return (
      <td className="border p-2">
        {isEditing ? (
          type === "select" ? (
            <select
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveField(med, field)}
              className="border px-1 py-1"
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
            className="cursor-pointer"
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
  return (
    <div className="p-4">

{/* ================= INFO SECTION ================= */}
<div className="mb-4 bg-gray-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium">
  <div>
    <span className="text-gray-600">User ID:</span>{" "}
    <span className="font-semibold">
      {userData?.userId || "—"}
    </span>
  </div>

  <div>
    <span className="text-gray-600">Name:</span>{" "}
    <span className="font-semibold">
      {userData?.name || user?.displayName || "—"}
    </span>
  </div>

  <div>
    <span className="text-gray-600">Clinic:</span>{" "}
    <span className="font-semibold">
      {userData?.clinicName || "Rxventory"}
    </span>
  </div>

  <div>
    <span className="text-gray-600">Subscription:</span>{" "}
    <span className="font-semibold text-green-700">
      {userData?.subscription || "Free"}
    </span>
  </div>
</div>



      <Actionbar
        extraAction={[
          {
            label: "+",
            className: "bg-green-500 hover:bg-green-600 rounded px-3",
            onClick: addEmptyMedicine,
          },
        ]}
      />

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Sr</th>
              <th className="border p-2">Generic</th>
              <th className="border p-2">Brand</th>
              <th className="border p-2">Batch</th>
              <th className="border p-2">Expiry</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Pack</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Min</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((med, i) => (
              <tr key={med.id}>
                <td className="border p-2">{i + 1}</td>

                <EditableCell med={med} field="generic" value={med.generic} />
                <EditableCell med={med} field="brand" value={med.brand} />
                <EditableCell med={med} field="batch" value={med.batch} />
                <EditableCell med={med} field="expiry" value={med.expiry} />

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

                <td className="border p-2 font-semibold">
                  {med.total}
                </td>

                <EditableCell
                  med={med}
                  field="unit"
                  value={med.unit}
                  type="select"
                  options={["Tablet", "Capsule", "Syrup", "Injection"]}
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
    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
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
