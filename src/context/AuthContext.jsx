import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          // ✅ FIRST TIME USER (CREATE FULL DOC)
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email || "",
            name: currentUser.displayName || "",
            clinicName: "",
            userId: "",
            role: "",
            subscription: "Free",
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          });
        } else {
          // ✅ EXISTING USER (ONLY UPDATE LAST LOGIN)
          await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
          });
        }

        setUser(currentUser);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
