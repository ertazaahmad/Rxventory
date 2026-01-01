import React from "react";
import { useNavigate } from "react-router-dom";

const Actionbar = ({
  primarycolor = "focus:ring-blue-900/60 rounded-xl bg-blue-400 hover:bg-blue-500",
  secondarycolor = "focus:ring-gray-900/60 rounded-xl bg-gray-400 hover:bg-gray-500",
  extraAction = [],
  search = "",
  setSearch = () => {},
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center no-print">

      {/* LEFT BUTTONS */}
      <div className="flex md:gap-4 gap-2">
        <button
          onClick={() => navigate("/inventory")}
          className={`p-2 font-bold active:scale-95 text-white shadow-sm focus:ring-2 ${primarycolor}`}
        >
          INVENTORY
        </button>

        <button
          onClick={() => navigate("/billing")}
          className={`p-2 font-bold active:scale-95 text-white shadow-sm focus:ring-2 ${secondarycolor}`}
        >
          BILLING
        </button>

        {extraAction.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.className} p-2 font-bold active:scale-95 text-white shadow-sm focus:ring-2`}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* SEARCH INPUT */}
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Search by generic name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <img
          src="/search.svg"
          alt="Search"
          className="absolute right-3 top-1/2 -translate-y-1/2
          w-5 h-5 opacity-60 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default Actionbar;
