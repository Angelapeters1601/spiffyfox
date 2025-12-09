import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/spiffyLogo2.jpg";
import UnderConstruction from "../ui/UnderConstruction";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Tips", path: "/tips" },
    { name: "Services", path: "/services" },
    { name: "Location", path: "/location" },
    { name: "Policy", path: "/policy" },
    { name: "Join", path: "/join" },
    { name: "Contractor", path: "/contractor" },
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

  // Animation variants
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 290,
        damping: 20,
        duration: 0.5,
      },
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const navItemVariants = {
    hover: {
      scale: 1.05,
      color: "#b19cd9",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const logoVariants = {
    hover: {
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  // Check if a nav item is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
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
            <motion.div
              variants={logoVariants}
              whileHover="hover"
              className="flex flex-shrink-0 cursor-pointer items-center"
            >
              <motion.img
                src={logo}
                alt="SpiffyFox Logo"
                className="h-10 w-38 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  variants={navItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
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
                      <motion.div
                        layoutId="activeNav"
                        className="spiffy-bg absolute bottom-0 left-0 h-0.5 w-full"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <motion.div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:spiffy-bg-light hover:spiffy-text inline-flex items-center justify-center rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none focus:ring-inset"
            >
              <motion.svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
                animate={isMenuOpen ? "open" : "closed"}
                variants={{
                  open: { rotate: 90 },
                  closed: { rotate: 0 },
                }}
                transition={{ duration: 0.2 }}
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
              </motion.svg>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-x-0 top-[102px] z-50 max-h-[calc(100vh-72px)] overflow-y-auto border-t border-gray-200 bg-white shadow-xl md:hidden"
          >
            <div className="spiffy-border spiffy-bg-light space-y-1 bg-white p-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-1"
                >
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optional Header Banner */}
      <motion.div
        className="spiffy-bg font-cinzel py-3 text-center text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.h2
          className="text-xl font-bold"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.7 }}
        >
          Premium Services & Expert Tips
        </motion.h2>
      </motion.div>
    </motion.nav>
  );
};

export default Nav;
