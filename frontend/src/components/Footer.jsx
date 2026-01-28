const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 py-2">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">

        {/* Left */}
        <p className="text-center md:text-left">
        © Rxventory {new Date().getFullYear()}. All rights reserved
        </p>

        {/* Right */}
        <p className="text-center md:text-right">
          Built by : <span className="text-white font-medium">Mohd Ertaza Ahmad</span>
        </p>

      </div>
    </footer>
  );
};

export default Footer;
