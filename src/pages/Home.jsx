import React from "react";
import Nav from "../components/nav.jsx";

const Home = () => {
  return (
    <div className="relative min-h-screen bg-[url('/src/assets/background.png')] bg-no-repeat bg-cover opacity-100">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/84"></div>
      <div className="relative z-10">
        <Nav />
        <section className="hero flex  justify-center -mt-16">
          <div className="text-center items-center flex flex-col gap-10 mt-50">
            <h1 className="text-5xl text-white font-bold font-mono leading-18">
              A Reliable Pharmacy Inventory and
              <br /> Billing System Built for
              <br /> Daily operations
            </h1>
            <h3 className="text-xl font-medium m-5 text-white">
              Track medicines, manage expiry dates, and generate bills with
              clarity and control.
            </h3>
            <button className="items-center h-26 w-90 bg-blue-500 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
              <span className="text-3xl font-extrabold transition-all duration-300 hover:tracking-wider">Let's Get Started</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
