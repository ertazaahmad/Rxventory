import React from "react";
import { useNavigate } from "react-router-dom";

const Actionbar = ({
  primarycolor = "focus:ring-blue-900/60 rounded-xl bg-blue-400 hover:bg-blue-500",
  secondarycolor = "focus:ring-gray-900/60 rounded-xl bg-gray-400 hover:bg-gray-500",
  extraAction = [],
  showSearch = true,
  search = "",
  setSearch = () => {},
}) => {
  const navigate = useNavigate();

  return (
    <div className="no-print">
      {/* Main Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">

        {/* LEFT BUTTONS */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 flex-wrap">
          <button
            onClick={() => navigate("/inventory")}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base font-bold 
                        active:scale-95 text-white shadow-sm focus:ring-2 ${primarycolor} 
                        flex-1 sm:flex-none min-w-[100px]`}
          >
            INVENTORY
          </button>

          <button
            onClick={() => navigate("/billing")}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base font-bold 
                        active:scale-95 text-white shadow-sm focus:ring-2 ${secondarycolor} 
                        flex-1 sm:flex-none min-w-[100px]`}
          >
            BILLING
          </button>

          {extraAction.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`${action.className} px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base 
                          font-bold active:scale-95 text-white shadow-sm focus:ring-2`}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* SEARCH INPUT - Only show if showSearch is true */}
        {showSearch && (
          <div className="relative w-full sm:w-48 md:w-64">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-2 rounded w-full text-sm sm:text-base 
                         focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <img
              src="/search.svg"
              alt="Search"
              className="absolute right-3 top-1/2 -translate-y-1/2
                        w-4 h-4 sm:w-5 sm:h-5 opacity-60 pointer-events-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Actionbar;