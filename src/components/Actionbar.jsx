import React from 'react'

const Actionbar = ({
  primarycolor = "focus:ring-blue-900/60 rounded-xl bg-blue-400 hover:bg-blue-500" ,
  secondarycolor = "focus:ring-gray-900/60 rounded-xl bg-gray-400 hover:bg-gray-500",
  extraAction = [],
}) => {
  return (
    <div>
         <div className="flex justify-between">
          <div className="flex md:gap-4 gap-2">
            <button className={`p-2 font-bold text-white shadow-sm focus:ring-2 ${primarycolor}`} >
              INVENTORY
            </button>
            <button className={`p-2 font-bold text-white shadow-sm focus:ring-2 ${secondarycolor}`} >
              BILLING
            </button>

                {/* 👇 Render ONLY if extraAction exists */}
        {extraAction.map((action, index) =>(
          <button
          key = {index}
            onClick={action.onClick}
            className={`${action.className} p-2 font-bold text-white shadow-sm focus:ring-2 `}
          >
            {action.label}
          </button>
        ))}
          </div>

          <div className="relative md:w-64 w-40">
            {/* Input */}
            <input
              type="text"
              placeholder="Search Medicine..."
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
    </div>
  )
}

export default Actionbar