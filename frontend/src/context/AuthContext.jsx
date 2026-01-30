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





useEffect(() => {
  if (!userDoc?.proValidTill) return;

  const interval = setInterval(() => {
    const now = Date.now();
    const expiry = userDoc.proValidTill.toMillis();

    if (userDoc.plan === "pro" && expiry <= now) {
      console.log("🔻 Pro expired → switching to Free");

      // Option 1: reload page
      window.location.reload();

      // Option 2 (better): just update UI state
      // setIsPro(false)
    }
  }, 10 * 1000); // check every 10 seconds

  return () => clearInterval(interval);
}, [userDoc]);








  return (
    <AuthContext.Provider value={{ user, userDoc }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
