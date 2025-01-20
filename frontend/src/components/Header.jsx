import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoIcon from "../assets/logo.png";
import LogoIconSmall from "../assets/logoMobileView.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLoginClick = () => {
    navigate("/login");
    window.scrollTo(0, 0);
  };

  const handleSignupClick = () => {
    navigate("/signup");
    window.scrollTo(0, 0);
  };

  const handleFAQClick = () => {
    navigate("/faq");
    window.scrollTo(0, 0);
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 w-full font-['Poppins']">
      <nav className="relative max-w-[85rem] w-full mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative flex items-center z-30 border border-gray-100 justify-between gap-x-8 bg-white/80 backdrop-blur-lg rounded-full px-4 md:px-6 lg:px-8 py-3 shadow-md">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            {/* Mobile View Logo */}
            <img
              src={LogoIconSmall}
              alt="Logo Icon"
              className="w-8 h-8 md:hidden"
            />

            {/* Desktop View Logo */}
            <img
              src={LogoIcon}
              alt="Full Logo"
              className="hidden md:block w-full h-7"
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center size-9 text-sm font-semibold rounded-lg border border-neutral-200 text-gray-500 hover:bg-neutral-100 focus:outline-none transition-colors duration-200"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-x-0 ms-auto font-poppins">
            {/* Menu Items */}
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-indigo-600 px-3 py-2 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm text-gray-600 hover:text-indigo-600 px-3 py-2 transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              to="/services"
              className="text-sm text-gray-600 hover:text-indigo-600 px-3 py-2 transition-colors duration-200"
            >
              Services
            </Link>
            <Link
              to="/faq"
              className="text-sm text-gray-600 hover:text-indigo-600 px-3 py-2 transition-colors duration-200"
            >
              FAQs
            </Link>
            <Link
              to="/contactus"
              className="text-sm text-gray-600 hover:text-indigo-600 px-3 py-2 transition-colors duration-200"
            >
              Contact
            </Link>

            <div className="h-6 border-l border-gray-300 mx-3"></div>

            <div className="flex items-center justify-center gap-x-6">
              <button
                onClick={handleLoginClick}
                className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200"
              >
                Log in <span aria-hidden="true">→</span>
              </button>
              <button
                onClick={handleSignupClick}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all duration-200"
              >
                Get started
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden absolute top-full left-0 right-0 mt-2 transition-all duration-300 origin-top ${
              isMenuOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-4 invisible"
            }`}
          >
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg divide-y divide-gray-300">
              <div className="p-2">
                <Link
                  to="/"
                  className="block text-sm text-gray-900 hover:text-indigo-600 px-4 py-2 transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block text-sm text-gray-900 hover:text-indigo-600 px-4 py-2 transition-colors duration-200"
                >
                  About Us
                </Link>
                <Link
                  to="/services"
                  className="block text-sm text-gray-900 hover:text-indigo-600 px-4 py-2 transition-colors duration-200"
                >
                  Services
                </Link>
                <Link
                  to="/faq"
                  className="block text-sm text-gray-900 hover:text-indigo-600 px-4 py-2 transition-colors duration-200"
                >
                  FAQs
                </Link>
                <Link
                  to="/contactus"
                  className="block text-sm text-gray-900 hover:text-indigo-600 px-4 py-2 transition-colors duration-200"
                >
                  Contact
                </Link>
              </div>
              <div className="p-2 space-y-2">
                <button
                  onClick={handleLoginClick}
                  className="block w-full text-sm font-semibold text-gray-900 hover:text-indigo-600 px-4 py-2 text-left transition-colors duration-200"
                >
                  Log in <span aria-hidden="true">→</span>
                </button>
                <button
                  onClick={handleSignupClick}
                  className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all duration-200"
                >
                  Get started
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
