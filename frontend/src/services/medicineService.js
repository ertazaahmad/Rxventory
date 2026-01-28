import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

/* ---------------- ADD EMPTY MEDICINE ---------------- */
export const addEmptyMedicine = async (userId) => {
  const ref = collection(db, "users", userId, "medicines");

  await addDoc(ref, {
    generic: "",
    brand: "",
    batch: "",
    expiry: "",
    qty: 0,
    pack: 1,
    total: 0,
    mrp: 0,
    unit: "Tablet",
    minStock: 0,
    status: "In Stock",
    createdAt: serverTimestamp(),
  });
};

/* ---------------- GET MEDICINES ---------------- */
export const getMedicines = async (userId) => {
  const ref = collection(db, "users", userId, "medicines");
  const snapshot = await getDocs(ref);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const deleteMedicine = async (userId, medicineId) => {
  const ref = doc(db, "users", userId, "medicines", medicineId);
  await deleteDoc(ref);
};
