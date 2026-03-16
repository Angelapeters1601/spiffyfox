import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/spiffyLogo2.jpg";
import UnderConstruction from "../ui/UnderConstruction";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Tips", path: "/tips" },
    { name: "Location", path: "/location" },
    { name: "Policy", path: "/policy" },
    { name: "Help", path: "/help" },
    { name: "Client", path: "/client-login" },
    { name: "Contractor", path: "/contractor-login" },
    { name: "Contact", path: "/contact" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if a nav item is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-purple-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-xl backdrop-blur-md" : "shadow-lg"
      }`}
    >
      <UnderConstruction />
      {/* Main Navigation Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <div className="flex flex-shrink-0 cursor-pointer items-center">
              <img
                src={logo}
                alt="SpiffyFox Logo"
                className="h-10 w-38 rounded-lg"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.path}
                    className={`font-cormorant relative block rounded-lg px-4 py-2 text-lg font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? "spiffy-text font-semibold"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                    {isActive(item.path) && (
                      <div className="spiffy-bg absolute bottom-0 left-0 h-0.5 w-full" />
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:spiffy-bg-light hover:spiffy-text inline-flex items-center justify-center rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none focus:ring-inset"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-[102px] z-50 max-h-[calc(100vh-72px)] overflow-y-auto border-t border-gray-200 bg-white shadow-xl md:hidden">
          <div className="spiffy-border spiffy-bg-light space-y-1 bg-white p-4">
            {navItems.map((item, index) => (
              <div key={item.name} className="mb-1">
                <Link
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-cormorant flex items-center rounded-xl px-5 py-4 text-lg font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "spiffy-bg text-white shadow-lg"
                      : "hover:spiffy-bg-light hover:spiffy-text text-gray-700 hover:shadow-md"
                  }`}
                >
                  {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optional Header Banner */}
      <div className="spiffy-bg font-cinzel py-3 text-center text-white">
        <h2 className="text-xl font-bold">Premium Services & Expert Tips</h2>
      </div>
    </nav>
  );
};

export default Nav;
