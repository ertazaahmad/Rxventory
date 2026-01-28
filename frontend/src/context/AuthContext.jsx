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
  const [userDoc, setUserDoc] = useState(null);

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        // ✅ FIRST TIME USER
        const newUserData = {
          uid: currentUser.uid,
          email: currentUser.email || "",
          name: currentUser.displayName || "",
          clinicName: "",
          userId: "",
          role: "",
          plan: "free",
          hasPurchasedProBefore: false,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        };

        await setDoc(userRef, newUserData);
        setUserDoc(newUserData);
      } else {
        // ✅ EXISTING USER
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
        });

        setUserDoc(snap.data());
      }

      setUser(currentUser);
    } else {
      setUser(null);
      setUserDoc(null);
    }

    setLoading(false);
  });

  return unsub;
}, []);


  return (
  <AuthContext.Provider value={{ user, userDoc }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
