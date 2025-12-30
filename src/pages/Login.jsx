import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      console.log("User:", result.user);

      // redirect after login
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };


  return (
    <div className="min-h-screen w-full bg-[url('/src/assets/login1.svg')] bg-no-repeat bg-cover">
      
      {/* Centering wrapper */}
      <div className="flex min-h-screen items-center justify-center">
        
        {/* Login card */}
        <div className="flex flex-col w-80 items-center bg-blue-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition">
          <h1 className="text-4xl font-bold mt-2">Rxventory</h1>
          <h1 className="text-2xl font-bold mt-2">Login</h1>

          <button onClick={handleGoogleLogin} 
          className="mt-16 flex w-64 p-3 rounded-lg font-bold items-center justify-center bg-white border hover:bg-gray-50 transition hover:shadow-xl active:scale-95">
            <img src="/google.svg" alt="Google" className="w-6 h-6" />
            <span className="ml-8">Continue With Google</span>
          </button>

          <h1 className="text-sm font-bold mt-4">Secure | Fast | Simple</h1>
          <p className="text-xs text-gray-500 mt-4">
            New here? Just continue with Google
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
