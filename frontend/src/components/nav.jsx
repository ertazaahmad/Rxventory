import logo from "../assets/logo1.png";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Nav = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const logoutHandler = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-blue-500 flex justify-between items-center px-4 md:px-8 z-50">

      <button
        onClick={() => navigate("/")}
        className="flex items-center font-bold text-lg md:text-3xl text-white transition-transform duration-300 lg:hover:scale-90"
      >
        <img
          className="w-8 h-8 md:w-12 md:h-12 rounded-full object-contain"
          src={logo}
          alt="Rxventory logo"
        />
        <p className="-ml-1.5 pt-1.5">xventory</p>
      </button>

      <div className="flex items-center gap-2 text-md md:text-lg font-medium text-white">
        <a
          href="mailto:rxventory@gmail.com"
          className="w-28 cursor-pointer transition-all duration-300 active:scale-110 focus:outline-none"
        >
          Contact Us
        </a>

        {user ? (
          <button
            onClick={logoutHandler}
            className="w-16 md:w-20 cursor-pointer text-center transition-all duration-300 active:scale-110 focus:outline-none"
          >
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
