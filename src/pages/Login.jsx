import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {doc, getDoc, setDoc, serverTimestamp, runTransaction} from "firebase/firestore";


const Login = () => {

    const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

const user = result.user; // Firebase Auth user

    // reference to Firestore document
    const userRef = doc(db, "users", user.uid);

    // check if user already exists
    const userSnap = await getDoc(userRef);

    // if first login → create user document
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
        name: user.displayName || "",
        email: user.email || "",
        role: "",
        clinicName: "",
        subscription: "Free",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    } else {
      // if returning user → just update last login
      await setDoc(
        userRef,
        { lastLogin: serverTimestamp() },
        { merge: true }
      );
    }

    // redirect after login
    navigate("/inventory");

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};


  return (
    <div className="md:min-h-[calc(100vh-100px)] min-h-[calc(100vh-120px)] w-full bg-[url('/src/assets/login1.svg')] bg-no-repeat bg-cover items-center flex justify-center">
      
   
        {/* Login card */}
        <div className="flex flex-col w-80 items-center bg-blue-100 rounded-2xl p-12  shadow-xl hover:shadow-2xl transition">
          <h1 className="text-4xl font-bold mt-2">Rxventory</h1>
          <h1 className="text-2xl font-bold mt-2">Login</h1>

          <button onClick={handleGoogleLogin} 
          className="mt-12 mb-8 flex w-64 p-3 rounded-lg font-bold items-center justify-center bg-white border hover:bg-gray-50 transition hover:shadow-xl active:scale-95">
            <img src="/google.svg" alt="Google" className="w-6 h-6" />
            <span className="ml-8">Continue With Google</span>
          </button>

          <h1 className="text-sm font-bold mt-4">Secure | Fast | Simple</h1>
          <p className="text-xs text-gray-500 mt-4">
            New here? Just continue with Google
          </p>
        </div>

      </div>
  );
};

export default Login;
