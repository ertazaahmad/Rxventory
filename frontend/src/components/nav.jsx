import logo from "../assets/logo1.png";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Nav = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutHandler = async () => {
    await signOut(auth);
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-blue-500 flex justify-between items-center px-4 md:px-8 z-50">

      <button
        onClick={() => navigate("/")}
        className="flex items-center font-bold text-base sm:text-lg md:text-2xl lg:text-3xl text-white 
                   transition-transform duration-300 lg:hover:scale-90"
      >
        <img
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-contain"
          src={logo}
          alt="Rxventory logo"
        />
        <p className="-ml-1 sm:-ml-1.5 pt-1 sm:pt-1.5">xventory</p>
      </button>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-4 md:gap-6 text-sm sm:text-base md:text-lg font-medium text-white">
        <a
          href="mailto:rxventory@gmail.com"
          className="cursor-pointer transition-all duration-300 hover:scale-105 active:scale-110 focus:outline-none"
        >
          Contact Us
        </a>

        {user ? (
          <button
            onClick={logoutHandler}
            className="cursor-pointer text-center transition-all duration-300 hover:scale-105 active:scale-110 focus:outline-none"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="hover:scale-105 transition-all duration-300">
            Login
          </Link>
        )}
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="sm:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-blue-500 shadow-lg sm:hidden z-40">
          <div className="flex flex-col items-center gap-4 py-4 text-white font-medium">
            <a
              href="mailto:rxventory@gmail.com"
              className="w-full text-center py-2 hover:bg-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </a>

            {user ? (
              <button
                onClick={logoutHandler}
                className="w-full text-center py-2 hover:bg-blue-600 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full text-center py-2 hover:bg-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;