import React, { useState } from "react";

import { Link } from "react-router-dom";

const Home = () => {

 

  return (

    
    <div className="relative min-h-screen bg-[url('/src/assets/background.png')] bg-no-repeat bg-cover opacity-100">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/72"></div>
    <div className="relative z-10 pt-16">


        <main className="hero flex  justify-center -mt-24">
          <section className="text-center items-center flex flex-col gap-10 mt-45">
            <h1 className="text-2xl md:text-5xl text-white font-bold font-mono leading-loose">
              A Reliable Pharmacy Inventory and
              <br /> Billing System Built for
              <br /> Daily operations
            </h1>
            <p className="text-lg md:text-xl font-medium m-5 text-white">
              Track medicines, manage expiry dates, and generate bills with
              clarity and control.
            </p>
            <button className="items-center h-20 w-80 md:h-26 md:w-90 bg-blue-500 rounded-full transition-all duration-300 active:scale-95 shadow-blue-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 hover:tracking-wider">
              <span className="text-xl md:text-3xl font-extrabold">
                <Link to = '/login'>Let's Get Started</Link>
                </span>
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
