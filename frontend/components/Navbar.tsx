import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.png";

const Navbar = () => {
  return (
    <nav className="h-20 border-b-[#d4d4d4] border-b-3  flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border-gray-100">
      <div>
        <Image
          src={logo}
          alt="logo of studexa"
          className="h-30 w-auto object-contain max-h-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 pr-3 pl-3 rounded-2xl text-center font-medium font-sans text-gray-600 hover:text-indigo-600
          transition-colors duration-350 hover:bg-gray-100"
        >
          <Link href="#">About Us</Link>
        </button>

        <button
          className="p-2 px-3 rounded-2xl text-center font-medium font-sans text-gray-600 hover:text-indigo-600
          transiton-colors duration-350 hover:bg-gray-100"
        >
          <Link href="#">Login</Link>
        </button>

        <button
          className="px-4 py-2 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 text-center
            font-medium font-sans
            hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-teal-200 hover:shadow-teal-300
            transition-all duration-300 hover:-translate-y-0.5"
        >
          <Link href="#" className="text-white">
            Register
          </Link>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
