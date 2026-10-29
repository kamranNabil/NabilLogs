import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close mobile menu and dropdown on page route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(false);
  }, [location.pathname]);

  // Track scroll position for floating dock transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Close profile dropdown on outside click
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
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-300 ease-out ${
        isScrolled ? "pt-2 px-3 sm:px-6" : "pt-4 px-3 sm:px-6"
      }`}
    >
      <nav
        className="
          pointer-events-auto
          w-full max-w-5xl h-14 sm:h-16 md:h-18 px-4 sm:px-6
          flex items-center justify-between
          rounded-full
          bg-white/70 backdrop-blur-xl saturate-150
          border border-white/80
          shadow-[0_8px_32px_0_rgba(31,38,135,0.07),inset_0_1px_1px_0_rgba(255,255,255,0.9)]
          transition-all duration-300
        "
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center transition hover:opacity-90 shrink-0">
          <img
            src="https://ik.imagekit.io/xljac05tb/public/NLlog.png?updatedAt=1792825870868"
            alt="NabilLogs"
            className="h-8 sm:h-9 md:h-11 w-auto object-contain"
            loading="eager"
          />
        </Link>

        {/* Desktop Navigation Links (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link
            to="/"
            className="px-3 py-1.5 rounded-full text-sm font-semibold text-slate-800 hover:text-[#099DFF] hover:bg-white/50 transition"
          >
            Home
          </Link>
          <Link
            to="/posts?sort=trending"
            className="px-3 py-1.5 rounded-full text-sm font-semibold text-slate-700 hover:text-[#099DFF] hover:bg-white/50 transition"
          >
            Trending
          </Link>
          <Link
            to="/write"
            className="px-3 py-1.5 rounded-full text-sm font-semibold text-slate-700 hover:text-[#099DFF] hover:bg-white/50 transition"
          >
            Write
          </Link>

          {/* Desktop Auth State */}
          {currentUser ? (
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setOpenDropdown((prev) => !prev)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white/70 hover:bg-white border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition"
              >
                <div className="w-7 h-7 rounded-full bg-[#099DFF] text-white flex items-center justify-center text-xs font-bold uppercase">
                  {currentUser.username?.[0] || "U"}
                </div>
                <span className="font-semibold text-slate-700 text-xs">
                  {currentUser.username}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                    openDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Desktop Dropdown */}
              {openDropdown && (
                <div className="absolute right-0 mt-3 w-52 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.09)] py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Signed in as
                    </p>
                    <p className="text-xs font-bold text-slate-800 truncate mt-0.5">
                      {currentUser.email}
                    </p>
                  </div>

                  <Link
                    to="/write"
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    Write an Article
                  </Link>

                  <button
                    onClick={() => {
                      setOpenDropdown(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50/60 transition flex items-center gap-2"
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
              className="ml-2 py-2 px-5 rounded-full bg-[#069DFF] hover:bg-blue-600 text-white font-semibold text-sm shadow-[0_4px_14px_rgba(9,157,255,0.35)] transition-all shrink-0"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Action Controls (Visible only on < 768px) */}
        <div className="flex items-center gap-2 md:hidden">
          {/* {!currentUser ? (
            <Link
              to="/login"
              className="py-1.5 px-3.5 rounded-full bg-[#099DFF] text-white font-semibold text-xs shadow-sm transition active:scale-95 whitespace-nowrap"
            >
              Sign In
            </Link>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#099DFF] text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
              {currentUser.username?.[0] || "U"}
            </div>
          )} */}

          {/* Hamburger / Close Icon */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="p-1.5 text-slate-700 hover:text-slate-900 rounded-full hover:bg-white/60 transition focus:outline-none"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Full Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/25 backdrop-blur-sm z-40 md:hidden pointer-events-auto transition-opacity"
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-20 left-4 right-4 z-50 md:hidden pointer-events-auto transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-white flex flex-col gap-3">
          {currentUser && (
            <div className="pb-3 border-b border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#099DFF] text-white flex items-center justify-center text-sm font-bold uppercase">
                {currentUser.username?.[0] || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">{currentUser.username}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Link
              to="/"
              className="px-3.5 py-2.5 rounded-xl font-semibold text-sm text-slate-800 hover:bg-slate-100/70 transition"
            >
              Home
            </Link>
            <Link
              to="/posts?sort=trending"
              className="px-3.5 py-2.5 rounded-xl font-semibold text-sm text-slate-800 hover:bg-slate-100/70 transition"
            >
              Trending Articles
            </Link>
            <Link
              to="/write"
              className="px-3.5 py-2.5 rounded-xl font-semibold text-sm text-slate-800 hover:bg-slate-100/70 transition"
            >
              Write an Article
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50/70 transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full block text-center py-2.5 rounded-xl bg-[#099DFF] text-white font-semibold text-sm shadow-sm"
              >
                Sign In / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;