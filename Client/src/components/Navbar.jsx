import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Track window scroll offset
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-300 ease-out ${isScrolled
          ? "pt-0 px-4 sm:px-6" // Floating dock gap while scrolling
          : "pt-4 px-4 sm:px-6" // Pinned flush to the top edge when scroll = 0 // Floating dock gap while scrolling
        }`}
    >
      <nav
        className="
          pointer-events-auto
          w-full max-w-5xl h-16 md:h-18 px-5 sm:px-7
          flex items-center justify-between
          rounded-full
          bg-white/55 backdrop-blur-xl saturate-150
          border border-white/80
          shadow-[0_8px_32px_0_rgba(31,38,135,0.07),inset_0_1px_1px_0_rgba(255,255,255,0.9)]
          transition-all duration-300
        "
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center transition hover:opacity-90 scale-[1.09]">
          <img
            src="https://ik.imagekit.io/xljac05tb/public/NLlog.png?updatedAt=1792825870868"
            alt="NabilLogs"
            className="h-9 sm:h-10 md:h-12 w-auto object-contain"
            loading="eager"
          />
        </Link>

        {/* Center Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-6">
          <Link
            to="/"
            className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-900 hover:text-blue-600 hover:bg-white/50 transition"
          >
            Home
          </Link>
          <Link
            to="/posts?sort=trending"
            className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-white/40 transition"
          >
            Trending
          </Link>
          <Link
            to="/write"
            className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-white/40 transition"
          >
            Write
          </Link>

          {/* Dynamic Auth Section */}
          {currentUser ? (
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setOpenDropdown((prev) => !prev)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-white/60 hover:bg-white/80 border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {currentUser.username?.[0] || "U"}
                </div>
                <span className="font-semibold text-slate-700 text-xs hidden sm:inline">
                  {currentUser.username}
                </span>
                <svg
                  className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${openDropdown ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Glass Dropdown */}
              {openDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.08)] py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-200/40">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Signed in as
                    </p>
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {currentUser.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setOpenDropdown(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50/50 transition flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 py-1.5 px-4 rounded-full bg-[#099DFF] hover:bg-blue-600 text-white font-medium text-xs sm:text-sm shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] transition-all"
            >
              Sign In / Sign Up
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;