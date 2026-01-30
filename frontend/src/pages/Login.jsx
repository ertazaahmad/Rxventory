import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";

const Login = () => {
  const { user } = useAuth();

  // if (user) {
  //   return <Navigate to="/" replace />;
  // }

  const navigate = useNavigate();

 const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // ✅ use a DIFFERENT variable name
    const firebaseUser = result.user;

    // ✅ get token from the correct user
    const idToken = await firebaseUser.getIdToken();

    // ✅ call backend
    const res = await fetch("https://rxventory.onrender.com/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();
    console.log("Create order response:", data);

    // reference to Firestore document
    const userRef = doc(db, "users", firebaseUser.uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const counterRef = doc(db, "counters", "users");

      const newUserId = await runTransaction(db, async (transaction) => {
        const counterSnap = await transaction.get(counterRef);

        let lastNumber = 0;
        if (counterSnap.exists()) {
          lastNumber = counterSnap.data().lastUserNumber;
        }

        const nextNumber = lastNumber + 1;

        transaction.update(counterRef, {
          lastUserNumber: nextNumber,
        });

        return `RX${String(nextNumber).padStart(4, "0")}`;
      });

      await setDoc(userRef, {
        userId: newUserId,
        name: firebaseUser.displayName || "",
        email: firebaseUser.email || "",
        role: "",
        clinicName: "",
        subscription: "Free",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    } else {
      await setDoc(
        userRef,
        { lastLogin: serverTimestamp() },
        { merge: true }
      );
    }

    navigate("/inventory");

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};


  return (
    <div
      className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-100px)] w-full 
                    bg-[url('/src/assets/login1.svg')] bg-no-repeat bg-cover bg-center 
                    items-center flex justify-center px-4 py-8"
    >
      {/* Login card */}
      <div
        className="flex flex-col w-full max-w-sm sm:w-80 items-center 
                        bg-blue-100 rounded-2xl p-8 sm:p-12 
                        shadow-xl hover:shadow-2xl transition"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mt-2">Rxventory</h1>
        <h1 className="text-xl sm:text-2xl font-bold mt-2">Login</h1>

        <button
          onClick={handleGoogleLogin}
          className="mt-8 sm:mt-12 mb-6 sm:mb-8 flex w-full sm:w-64 p-3 rounded-lg 
                     font-bold items-center justify-center 
                     bg-white border hover:bg-gray-50 transition 
                     hover:shadow-xl active:scale-95"
        >
          <img src="/google.svg" alt="Google" className="w-6 h-6" />
          <span className="ml-4 sm:ml-8 text-sm sm:text-base">
            Continue With Google
          </span>
        </button>

        <h1 className="text-xs sm:text-sm font-bold mt-4">
          Secure | Fast | Simple
        </h1>
        <p className="text-xs text-gray-500 mt-4 text-center">
          New here? Just continue with Google
        </p>
      </div>
    </div>
  );
};

export default Login;
