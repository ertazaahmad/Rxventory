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
{/* table */}
<div className="m-4 h-[60vh] overflow-y-auto overflow-x-auto scrollbar-hide">
  <table className="w-full border-collapse text-left">
   <thead className="bg-gray-300 sticky top-0 z-10">
      <tr className="text-sm font-semibold">
        <th className="p-3 border">Sr. No.</th>
        <th className="p-3 border">Generic Name</th>
        <th className="p-3 border">Brand</th>
        <th className="p-3 border">Batch No.</th>
        <th className="p-3 border">Expiry</th>
        <th className="p-3 border">Qty Left</th>
        <th className="p-3 border">Pack Size</th>
        <th className="p-3 border">Total</th>
        <th className="p-3 border">MRP</th>
        <th className="p-3 border">Unit</th>
        <th className="p-3 border">Min Stock</th>
        <th className="p-3 border">Status</th>
        <th className="p-3 border">Actions</th>
      </tr>
    </thead>

    <tbody>
      {/* Empty row for now */}
      <tr className="bg-white hover:bg-gray-100 border">
        <td className="p-3 border text-center">1</td>
        <td className="p-3 border">Paracetamol</td>
        <td className="p-3 border">Crocin</td>
        <td className="p-3 border">B123</td>
        <td className="p-3 border">12/26</td>
        <td className="p-3 border">50</td>
        <td className="p-3 border">10 tabs</td>
        <td className="p-3 border">500</td>
        <td className="p-3 border">₹25</td>
        <td className="p-3 border">Tablet</td>
        <td className="p-3 border">20</td>
        <td className="p-3 border text-green-600 font-semibold">
          In Stock
        </td>
        <td className="p-2 border flex gap-2 justify-center ">
          <button className="px-2 py-1 bg-blue-400 text-white rounded flex">
            <img
    src="/edit.svg"
    alt="edit"
    className="w-4 h-5"
  />
          </button>
          <button className="px-2 py-1 bg-red-400 text-white rounded flex">
                <img
    src="/delete.svg"
    alt="edit"
    className="w-4 h-5"
  />
          </button>
          <button className="px-2 py-1 bg-green-400 text-white rounded flex">
                <img
    src="/bill.svg"
    alt="edit"
    className="w-4 h-5"
  />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>


      </div>
    </div>
  );
};

export default Inventory;
