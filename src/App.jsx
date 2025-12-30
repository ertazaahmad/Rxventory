import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Inventory from "./pages/Inventory.jsx";
import Billing from "./pages/Billing.jsx";

import Nav from "./components/nav.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {


  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">

        <Nav />

        <main className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/billing" element={<Billing />} />
          </Routes>
        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
};

export default App;
