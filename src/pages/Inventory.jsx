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
                <td className="p-2 flex gap-2 justify-center">
                  <button className="px-2 py-1 bg-blue-400 text-white rounded flex">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-green-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 3h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 012-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8h6M9 12h6M9 16h4"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-100 border">
                <td className="p-3 border text-center">2</td>
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
                <td className="p-2 flex gap-2 justify-center">
                  <button className="px-2 py-1 bg-blue-400 text-white rounded flex">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-green-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 3h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 012-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8h6M9 12h6M9 16h4"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-100 border">
                <td className="p-3 border text-center">3</td>
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
                <td className="p-2 flex gap-2 justify-center">
                  <button className="px-2 py-1 bg-blue-400 text-white rounded flex">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-green-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 3h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 012-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8h6M9 12h6M9 16h4"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-100 border">
                <td className="p-3 border text-center">4</td>
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
                <td className="p-2 flex gap-2 justify-center">
                  <button className="px-2 py-1 bg-blue-400 text-white rounded flex">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-green-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 3h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 012-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8h6M9 12h6M9 16h4"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-100 border">
                <td className="p-3 border text-center">5</td>
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
                <td className="p-2 flex gap-2 justify-center">
                  <button className="px-2 py-1 bg-blue-400 text-white rounded flex">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-green-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 3h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 012-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8h6M9 12h6M9 16h4"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-100 border">
                <td className="p-3 border text-center">6</td>
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
                <td className="p-2 flex gap-2 justify-center">
                  <button className="px-2 py-1 bg-blue-400 text-white rounded flex">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-green-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 3h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 012-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8h6M9 12h6M9 16h4"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-100 border">
                <td className="p-3 border text-center">7</td>
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
                <td className="p-2 flex gap-2 justify-center">
                  <button className="px-2 py-1 bg-blue-400 text-white rounded flex">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-green-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 3h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 012-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8h6M9 12h6M9 16h4"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-100 border">
                <td className="p-3 border text-center">8</td>
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
                <td className="p-2 flex gap-2 justify-center">
                  <button className="px-2 py-1 bg-blue-400 text-white rounded flex">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-green-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 3h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 012-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8h6M9 12h6M9 16h4"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-100 border">
                <td className="p-3 border text-center">9</td>
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
                <td className="p-2 flex gap-2 justify-center">
                  <button className="px-2 py-1 bg-blue-400 text-white rounded flex">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-green-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 3h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 012-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8h6M9 12h6M9 16h4"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-100 border">
                <td className="p-3 border text-center">10</td>
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
                <td className="p-2 flex gap-2 justify-center">
                  <button className="px-2 py-1 bg-blue-400 text-white rounded flex">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-green-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 3h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 012-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8h6M9 12h6M9 16h4"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-100 border">
                <td className="p-3 border text-center">11</td>
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
                <td className="p-2 flex gap-2 justify-center">
                  <button className="px-2 py-1 bg-blue-400 text-white rounded flex">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                  <button className="px-2 py-1 bg-green-400 text-white rounded flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 3h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 012-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8h6M9 12h6M9 16h4"
                      />
                    </svg>
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
