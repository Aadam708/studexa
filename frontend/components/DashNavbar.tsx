"use client"
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.png";

const NavLink:React.FC<{href:string, label:string}> = ({href,label}) =>{
  const pathname = usePathname() || "/"
  const isActive = pathname === href || pathname.startsWith(href +"/");

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={
        `p-2 px-3 rounded-2xl text-center font-medium font-sans transition-colors duration-200 inline-flex items-center ` +
        (isActive
          ? "text-indigo-600 hover:bg-gray-100"
          : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100")
      }
    >
      {label}
    </Link>
  );

}

const DashNavbar = () => {
  return (
    <nav className="h-20 border-b-[#d4d4d4] border-b-3  flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border-gray-100">
      <div>
        <Image
          src={logo}
          alt="logo of studexa"
          className="h-30 w-auto object-contain max-h-full"
        />
      </div>

      <div className="flex items-center gap-2">
        <NavLink href="/dashboard" label="Dashboard" />
        <NavLink href="/revise" label="Revise" />
        <NavLink href="/leaderboard" label="Leaderboard" />
        <NavLink href="/logout" label="Logout"></NavLink>
      </div>
    </nav>
  );
};

export default DashNavbar;
