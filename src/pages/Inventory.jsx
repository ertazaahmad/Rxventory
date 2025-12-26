import React from "react";
import Nav from "../components/nav";

const Inventory = () => {
  const user = {
    userId: "RX001",
    name: "Demo User",
    role: "Owner",
    clinic: "Demo Clinic",
    subscription: "Free",
    login: "24-12-2025",
  };

  return (
 
    <div>
      <Nav />
{/* Top info section */}
      <div className="m-4 p-4 pl-20 bg-gray-200 rounded-xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-4 gap-x-12 text-sm font-medium">
        <div>
          <p className="text-gray-500">User ID</p>
          <p>{user.userId}</p>
        </div>

        <div>
          <p className="text-gray-500">User Name</p>
          <p>{user.name}</p>
        </div>

        <div>
          <p className="text-gray-500">Role</p>
          <p>{user.role}</p>
        </div>

        <div>
          <p className="text-gray-500">Clinic Name</p>
          <p>{user.clinic}</p>
        </div>

        <div>
          <p className="text-gray-500">Subscription</p>
          <p>{user.subscription}</p>
        </div>

        <div>
          <p className="text-gray-500">Last Login</p>
          <p>{user.login}</p>
        </div>
      </div>

{/* main */}
      <div className=" min-h-[calc(100vh-11.5rem)] m-4 p-4  bg-gray-200 rounded-xl  text-sm font-medium">
{/* header of main */}
        <div className="flex justify-between">
          <div className="flex gap-4">
            <button className="p-2 font-bold text-white shadow-sm focus:ring-2 focus:ring-blue-900/60 rounded-xl bg-blue-400 hover:bg-blue-500">
              INVENTORY
            </button>
            <button className="p-2 font-bold text-white shadow-sm focus:ring-2 focus:ring-gray-900/60 rounded-xl bg-gray-400 hover:bg-gray-500">
              BILLING
            </button>
          </div>

          <div className="relative w-64">
            {/* Input */}
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-3 pl-4 pr-12 text-black placeholder-black/70
               bg-gray-300 rounded-xl outline-none
               shadow-md focus:shadow-lg
               focus:ring-2 focus:ring-gray-500/40
 transition"
            />

            {/* Search Icon */}
            <img
              src="/search.svg"
              alt="Search"
              className="absolute right-4 top-1/2 -translate-y-1/2
               w-5 h-5 opacity-60 pointer-events-none"
            />
          </div>
        </div>
        <br />
{/* table */}
<table className="">
  <th>Sr. No.</th>
  <th>Generic Name</th>
  <th>Brand</th>
  <th>Batch Number</th>
  <th>Expiry Date</th>
  <th>Quantity Left</th>
  <th>Pack Size</th>
  <th>Total</th>
  <th>MRP</th>
  <th>Unit Type</th>
  <th>Min. Stock Level</th>
  <th>Stock Status</th>
  <th>Actions</th>
</table>


      </div>
    </div>
  );
};

export default Inventory;
