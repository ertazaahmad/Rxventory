import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Inventory from "./pages/Inventory.jsx";
import Billing from "./pages/Billing.jsx";
import Subscription from "./pages/Subscription.jsx";

import Nav from "./components/nav.jsx";
import Footer from "./components/Footer.jsx";
import NotFound from "./pages/NotFound";


const App = () => {


  return (
      <div className="flex flex-col min-h-screen">

        <Nav />

        <main className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />

      </div>
  );
};

export default App;
