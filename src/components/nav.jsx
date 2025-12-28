import logo from "../assets/logo1.png";


const Nav = () => {
  return (
    
      <nav className="w-full h-16 bg-blue-500 flex justify-between items-center px-4 md:px-8">

        <div className="flex items-center font-bold text-lg md:text-3xl text-white transition-transform duration-300 hover:scale-90 ">

          <img className="w-8 h-8 md:w-12 md:h-12 rounded-full object-contain" src={logo} alt='Rxventory logo' />

          <p className="-ml-1.5 pt-1.5">
            xventory
          </p>
        </div>

{/* left */}
        <div className="flex items-center gap-2 text-md md:text-lg font-medium text-white">
          <button className="w-20 md:w-28 cursor-pointer transition-all duration-300 hover:scale-110 focus:outline-none ">
            Contact Us
          </button>
          <button className="w-16 md:w-20 cursor-pointer text-center transition-all duration-300 hover:scale-110 focus:outline-none ">
            Login
          </button>
        </div>
      </nav>
  
  );
};

export default Nav;
