import React from "react";
import Actionbar from "../components/Actionbar.jsx";

const Billing = () => {
  return (
    <div>
      <div className=" min-h-[calc(100vh-6rem)] m-4 p-4 pb-1 bg-gray-200 rounded-xl  text-sm font-medium">
        <Actionbar
          primarycolor="focus:ring-gray-900/60 rounded-xl bg-gray-400 hover:bg-gray-500"
          secondarycolor="focus:ring-blue-900/60 rounded-xl bg-blue-400 hover:bg-blue-500"
          extraAction={[
            {
              label: "PRINT",
              className:
                "focus:ring-green-900/60 rounded-xl bg-green-400 hover:bg-green-500",
              onClick: () => console.log("BILLPRINTED"),
            },
            {
              label: "NEW BILL",
              className:
                "focus:ring-blue-900/60 rounded-xl bg-blue-400 hover:bg-blue-500",
              onClick: () => console.log("NEW BILL MADE"),
            },
             {
              label: "EDIT BILL",
              className:
                "focus:ring-gray-900/60 rounded-xl bg-gray-400 hover:bg-gray-500",
              onClick: () => console.log("NEW BILL MADE"),
            },
          ]}
        />
        {/* bill */}
        <main className="border m-2 mb-1 h-[calc(100vh-11rem)] ">
          <div className=" pl-4 border-b border-black h-24 grid grid-cols-3 gap-80">
            <div className="flex flex-col gap-1">
              <h3 className="text-blue-600 font-extrabold">Yashfeen Medical</h3>
              <p>Lakshmipur, Sahaspur, Dehradun</p>
              <p>Phone: +91 9999999999</p>
              <p>GSTIN: 45HJK22</p>
            </div>
            <div className="flex flex-col gap-3">
              <p>Patient: Arsh Ahmad</p>
              <p>Address: Azad Enclave Dehradun</p>
              <p>Doctor: Dr. Nizam Hussain</p>
            </div>
            <div className="flex flex-col gap-3">
              <p>Invoice: RX001</p>
              <p>Date: 25-04-2005</p>
              <p>Time: 11:50 AM</p>
            </div>
          </div>

          {/* table */}
          <div className="m-2 h-[48vh] overflow-y-auto overflow-x-auto scrollbar-hide">
            <table className="w-full text-left divide-y divide-gray-400">
              <thead className="bg-gray-300 sticky top-0 z-10">
                <tr className="text-sm font-semibold">
                  <th className="p-3">Sr. No.</th>
                  <th className="p-3">Generic Name</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Batch No.</th>
                  <th className="p-3">Expiry</th>
                  <th className="p-3">Qty Left</th>
                  <th className="p-3">Pack Size</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">MRP</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Min Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">
                    <div className="flex gap-6 justify-between items-center">
                      <span className="">Actions</span>
                      <button className="bg-gray-400 text-white rounded">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-6 h-6 text-black"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 5v14M5 12h14"
                          />
                        </svg>
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* Empty row for now */}
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100">
                  <td className="p-1 border text-center">1</td>
                  <td className="p-1 border">Paracetamol</td>
                  <td className="p-1 border">Crocin</td>
                  <td className="p-1 border">B123</td>
                  <td className="p-1 border">12/26</td>
                  <td className="p-1 border">50</td>
                  <td className="p-1 border">10 tabs</td>
                  <td className="p-1 border">500</td>
                  <td className="p-1 border">₹25</td>
                  <td className="p-1 border">Tablet</td>
                  <td className="p-1 border">20</td>
                  <td className="p-1 border text-green-600 font-semibold">
                    In Stock
                  </td>
                  <td className="p-1 border">
                    <div className="flex gap-2 justify-center">
                      <button className="px-1 py-1 bg-red-400 text-white rounded flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
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
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BOTTOM */}
          <div className="p-2 flex justify-between">
            <div className="left">
              <h2 className="font-bold">Terms & Conditions</h2>
              <ul className="list-disc list-inside">
                <li>Cut Strips will not be refunded</li>
                <li>Medicines can be returned within 5 days with bill.</li>
                <li>Prices inclusive of all taxes.</li>
                <li>Jurisdiction Applies</li>
              </ul>
            </div>

            <div className="right border  w-60">
              <div className="sign border-b-2 h-3/7 p-1">
                <p className="text-xs">AUTHORISED SIGNATORY</p>
              </div>
              <div className="total p-1 text-xs flex justify-between">
                <div>
                <p>Subtotal:</p>
                <p>GST(12%):</p>
                <p className="font-bold">GRAND TOTAL:</p>
                </div>
                <div>
                <p>₹1500</p>
                <p>₹180</p>
                <p className="font-bold">₹1680</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Billing;
