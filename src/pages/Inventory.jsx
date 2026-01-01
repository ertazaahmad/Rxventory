import React from "react";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Actionbar from "../components/Actionbar.jsx";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const Inventory = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [customName, setCustomName] = useState("");
  const [clinicName, setClinicName] = useState("");

useEffect(() => {
  if (!user) return;

  const fetchUserData = async () => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      setUserData(data);

      // show modal only first time
      if (!data.clinicName) {
        setShowProfileModal(true);
      }
    }
  };

  fetchUserData();
}, [user]);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!userData) {
    return <p>Loading...</p>;
  }


  const handleSaveProfile = async () => {
  if (!customName || !clinicName) {
    alert("Please fill all fields");
    return;
  }

  const userRef = doc(db, "users", user.uid);

  await setDoc(
    userRef,
    {
      name: customName,
      clinicName: clinicName,
    },
    { merge: true }
  );

  // update local UI instantly
  setUserData((prev) => ({
    ...prev,
    name: customName,
    clinicName: clinicName,
  }));

  setShowProfileModal(false);
};


  return (

    <div>
      {/* Top info section */}
      <div className="m-4 p-4 pl-20 bg-gray-200 rounded-xl grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-12 text-sm font-medium text-gray-800">
        <div>
          <p>User ID: {userData.userId}</p>
        </div>

        <div>
          <p>Name: {userData.name}</p>
        </div>


        <div>
          <p>Clinic: {userData.clinicName}</p>
        </div>

        <div>
          <p>Subscription: {userData.subscription}</p>
        </div>

      </div>

      {/* main */}
      <div className=" min-h-[calc(100vh-11.5rem)] m-4 p-4  bg-gray-200 rounded-xl  text-sm font-medium">
        {/* header of main */}
        <Actionbar 
        extraAction={[
            {
              label: "PRINT",
              className:
                "focus:ring-green-900/60 rounded-xl bg-green-400 hover:bg-green-500",
              onClick: () => console.log("BILLPRINTED"),
            },]}/>
        {/* table */}
        <div className="md:m-4 mt-8 h-[80vh] overflow-y-auto overflow-x-auto scrollbar-hide border">
          <table className="w-full h-full border-collapse text-left">
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
                <th className="p-3  border flex gap-6 justify-between">
                  <span className="mt-1">Actions</span>{" "}
                  <button className="bg-gray-400 text-white rounded flex">
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
                </th>
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


{showProfileModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-96">
          <h2 className="text-xl font-bold mb-4">Complete Profile</h2>

          <input
            type="text"
            placeholder="Your Name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full border p-2 mb-3"
          />

          <input
            type="text"
            placeholder="Clinic Name"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            className="w-full border p-2 mb-4"
          />

          <button
            onClick={handleSaveProfile}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Save & Continue
          </button>
        </div>
      </div>
    )}





    </div>
  );
};

export default Inventory;
