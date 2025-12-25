import logo from "../../assets/logo1.png";


const Nav = () => {
  return (
    <div>
      <nav className="w-full h-16 bg-blue-500 flex justify-between items-center px-8">

        <div className="flex items-center  font-bold text-3xl text-white transition-transform duration-300 hover:scale-50 ">

          <img className=" w-12 h-10 rounded-full object-contain" src={logo} />

          <h3 className="-ml-2 pt-1.5">
            xventory
          </h3>
        </div>

{/* left */}
        <div className="flex items-center gap-2 text-lg font-medium text-white">
          <button className="w-28 cursor-pointer transition-all duration-300 hover:scale-110 focus:outline-none ">
            Contact Us
          </button>
          <button className="w-20 cursor-pointer text-center transition-all duration-300 hover:scale-110 focus:outline-none ">
            Login
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
