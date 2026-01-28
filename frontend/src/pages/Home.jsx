import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    if (user) {
      navigate("/inventory");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/background.png')] bg-no-repeat bg-cover">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/72"></div>

      <div className="relative z-10">
        <main className="hero flex justify-center items-center px-4 sm:px-6 md:px-8">
          <section className="text-center items-center flex flex-col gap-6 sm:gap-8 md:gap-10 mt-12 sm:mt-20 md:mt-32 lg:mt-45 max-w-4xl">
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-white font-bold font-mono leading-relaxed sm:leading-loose px-2">
              A Reliable Pharmacy Inventory and
              <br className="hidden sm:block" /> Billing System Built for
              <br className="hidden sm:block" /> Daily operations
            </h1>

            <p className="text-base sm:text-lg md:text-xl font-medium mx-4 sm:mx-5 text-white px-2 max-w-2xl">
              Track medicines, manage expiry dates, and generate bills with
              clarity and control.
            </p>

            <button
              onClick={handleStart}
              className="h-16 w-64 sm:h-20 sm:w-80 bg-blue-500 rounded-full transition-all duration-300
                         active:scale-95 shadow-blue-700 hover:shadow-lg
                         focus:outline-none focus:ring-4 focus:ring-blue-300
                         hover:tracking-wider mt-4"
            >
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white">
                Let's Get Started
              </span>
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;