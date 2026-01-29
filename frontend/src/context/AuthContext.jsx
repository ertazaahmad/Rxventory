import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubUser = null;

    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setUserDoc(null);
        setLoading(false);
        if (unsubUser) unsubUser();
        return;
      }

      setUser(currentUser);

      const userRef = doc(db, "users", currentUser.uid);

      unsubUser = onSnapshot(userRef, async (snap) => {
        if (!snap.exists()) {
          const newUserData = {
            uid: currentUser.uid,
            email: currentUser.email || "",
            name: currentUser.displayName || "",
            clinicName: "",
            userId: "",
            role: "",
            plan: "free",
            hasPurchasedProBefore: false,
            proValidTill: null,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          };

          await setDoc(userRef, newUserData);
          setUserDoc(newUserData);
        } else {
          const data = snap.data();

          // Auto downgrade
          if (
            data.plan === "pro" &&
            data.proValidTill &&
            data.proValidTill.toMillis() < Date.now()
          ) {
            await updateDoc(userRef, {
              plan: "free",
              proValidTill: null,
            });
            setUserDoc({ ...data, plan: "free", proValidTill: null });
          } else {
            setUserDoc(data);
          }
        }

        setLoading(false);
      });
    });

    // ✅ Proper cleanup
    return () => {
      unsubAuth();
      if (unsubUser) unsubUser();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userDoc }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
