import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaComments,
  FaChartBar,
  FaUsers,
  FaToolbox,
  FaQuestionCircle,
  FaEnvelope,
  FaUserShield,
  FaHome,
  FaSignOutAlt,
  FaChevronDown,
  FaNewspaper,
} from "react-icons/fa";
import { supabase } from "../../services/supabaseClient";

const AdminNav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Sign out function
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaHome className="text-lg" />,
    },
    {
      name: "Admin Contact",
      path: "/admin/contact",
      icon: <FaEnvelope className="text-lg" />,
    },
    {
      name: "Admin Newsletter",
      path: "/admin/newsletter",
      icon: <FaNewspaper className="text-lg" />,
    },
    {
      name: "Admin Contractor",
      path: "/admin/contractor",
      icon: <FaToolbox className="text-lg" />,
    },
    {
      name: "Admin Tips",
      path: "/admin/tips",
      icon: <FaUserShield className="text-lg" />,
    },
    {
      name: "Admin Client Portal",
      path: "/admin/client-portal",
      icon: <FaUsers className="text-lg" />,
    },
    {
      name: "Live Chat",
      path: "/admin/live-chat",
      icon: <FaComments className="text-lg" />,
    },
    {
      name: "Visitor Analytics",
      path: "/admin/analytics",
      icon: <FaChartBar className="text-lg" />,
    },
    {
      name: "FAQ Management",
      path: "/admin/faq",
      icon: <FaQuestionCircle className="text-lg" />,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const sidebarVariants = {
    closed: {
      x: -300,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const dropdownVariants = {
    closed: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Top Navigation Bar - Horizontal for large screens */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left Section - Logo and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-purple-50 hover:text-purple-600 lg:hidden"
              >
                <FaBars className="h-5 w-5" />
              </button>

              {/* Logo */}
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-400">
                  <FaUserShield className="text-sm text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-cinzel text-xl font-bold text-gray-800">
                    SpiffyFox
                  </h1>
                </div>
              </Link>
            </div>

            {/* Center Section - Horizontal Navigation (Large screens) */}
            <div className="hidden lg:flex lg:items-center lg:space-x-1">
              {menuItems.slice(0, 6).map((item) => (
                <div key={item.path} className="relative">
                  <Link
                    to={item.path}
                    className={`group flex items-center space-x-2 rounded-lg px-4 py-2 transition-all duration-200 ${
                      isActive(item.path)
                        ? "spiffy-bg text-white shadow-lg"
                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    }`}
                  >
                    <div
                      className={`${isActive(item.path) ? "text-white" : "text-gray-500 group-hover:text-purple-500"}`}
                    >
                      {item.icon}
                    </div>
                    <span className="font-quicksand font-semibold whitespace-nowrap">
                      {item.name.split(" ")[1] || item.name}
                    </span>
                  </Link>

                  {/* Active indicator */}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeNavTop"
                      className="spiffy-bg absolute -bottom-1 left-1/2 h-1 w-12 -translate-x-1/2 rounded-t-full"
                    />
                  )}
                </div>
              ))}

              {/* More dropdown for remaining items */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "more" ? null : "more")
                  }
                  className="flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-700 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600"
                >
                  <span className="font-quicksand font-semibold">More</span>
                  <motion.div
                    animate={{ rotate: activeDropdown === "more" ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaChevronDown className="h-3 w-3" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeDropdown === "more" && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="ring-opacity-5 absolute top-full right-0 z-50 mt-2 w-48 rounded-lg bg-white p-2 shadow-xl ring-1 ring-black"
                    >
                      {menuItems.slice(6).map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setActiveDropdown(null)}
                          className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-all duration-200 ${
                            isActive(item.path)
                              ? "spiffy-bg text-white"
                              : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          }`}
                        >
                          <div
                            className={`${isActive(item.path) ? "text-white" : "text-gray-400"}`}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <p className="font-quicksand text-sm font-semibold">
                              {item.name}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Section - User Info */}
            <div className="flex items-center space-x-4">
              <div className="hidden text-right md:block">
                <p className="font-quicksand font-semibold text-gray-800">
                  Sign out
                </p>
              </div>

              <motion.button
                onClick={handleSignOut}
                disabled={isSigningOut}
                whileHover={{ scale: isSigningOut ? 1 : 1.05 }}
                whileTap={{ scale: isSigningOut ? 1 : 0.95 }}
                className="rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSigningOut ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-5 w-5 rounded-full border-2 border-red-400 border-t-transparent"
                  />
                ) : (
                  <FaSignOutAlt className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Secondary row for descriptions (Large screens) */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-center space-x-8 border-t border-gray-100 py-2"></div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Sidebar */}
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 z-50 h-full w-80 overflow-y-auto bg-white shadow-xl lg:hidden"
            >
              {/* Sidebar Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-400">
                      <FaUserShield className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-cinzel text-lg font-bold text-gray-800">
                        SpiffyFox
                      </h2>
                      <p className="font-quicksand text-xs text-gray-500">
                        Admin Panel
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2 p-4">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`group flex items-center space-x-3 rounded-lg p-3 transition-all duration-200 ${
                        isActive(item.path)
                          ? "spiffy-bg text-white shadow-lg"
                          : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                      }`}
                    >
                      <div
                        className={`${isActive(item.path) ? "text-white" : "text-gray-400 group-hover:text-purple-500"}`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-quicksand font-semibold">
                          {item.name}
                        </p>
                      </div>
                      {isActive(item.path) && (
                        <motion.div
                          layoutId="activeNavMobile"
                          className="h-6 w-1 rounded-full bg-white"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Sign Out Button in Mobile Sidebar */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: menuItems.length * 0.1 }}
                >
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="group flex w-full items-center space-x-3 rounded-lg p-3 text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="text-gray-400 group-hover:text-red-500">
                      <FaSignOutAlt className="text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="font-quicksand text-left font-semibold">
                        {isSigningOut ? "Signing out..." : "Sign Out"}
                      </p>
                    </div>
                    {isSigningOut && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-4 w-4 rounded-full border-2 border-red-400 border-t-transparent"
                      />
                    )}
                  </button>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminNav;
