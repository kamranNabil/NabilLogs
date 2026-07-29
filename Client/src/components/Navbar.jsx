import { useState } from "react";
import Image from "./image";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import { useEffect } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then(
      (token) => {
        console.log(token);
      },
      [getToken()]
    );
  });

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
        <Image src="https://ik.imagekit.io/xljac05tb/public/logo.png" alt="NabilLogs" w={160} h={50} className="h-10 w-auto object-contain mix-blend-multiply" />
      </Link>

      {/* Mobile Menu */}
      <div className="md:hidden relative">
        {/* Mobile Button */}
        <div
          className="cursor-pointer text-4xl z-50 relative"
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </div>

        {/* Mobile LinkList */}
        <div
          className={`fixed top-16 left-0 w-full h-screen flex flex-col justify-center items-center gap-8 font-medium text-xl bg-indigo-50 transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/" onClick={() => setOpen(false)}>
            Trending
          </Link>
          <Link to="/" onClick={() => setOpen(false)}>
            Most Read
          </Link>
          <Link to="/" onClick={() => setOpen(false)}>
            About
          </Link>

          <div className="flex flex-col gap-4">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
              Login 🫡
            </button>
            {/* <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
            Signup 🙌
            </button> */}
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <Link to="/">Home</Link>
        <Link to="/">Trending</Link>
        <Link to="/">Most Read</Link>
        <Link to="/">About</Link>
        <SignedOut>
          <Link to="/Login">
            <div className="flex gap-4">
              <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
                Login🫡
              </button>
              {/* <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
                Signup 🙌
              </button> */}
            </div>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
