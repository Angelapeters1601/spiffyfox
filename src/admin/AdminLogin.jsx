import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaArrowLeft,
} from "react-icons/fa";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Simulate login process (will be replaced with Supabase)
    try {
      // TODO: Add Supabase authentication here
      console.log("Login attempt:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes - redirect to home
      // In real app, this would redirect to admin dashboard
      navigate("/");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back to Home */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Link
            to="/"
            className="font-quicksand inline-flex items-center text-purple-600 transition-colors duration-200 hover:text-purple-700"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-2xl bg-white shadow-xl"
        >
          {/* Header */}
          <div className="spiffy-bg relative overflow-hidden p-8 text-center text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 h-8 w-8 rounded-full border-2 border-white"></div>
              <div className="absolute right-4 bottom-4 h-6 w-6 rounded-full border-2 border-white"></div>
            </div>

            <motion.div
              variants={itemVariants}
              className="mb-4 flex justify-center"
            >
              <div className="relative">
                <FaShieldAlt className="h-12 w-12 text-white" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-3 rounded-full border-2 border-white/20"
                />
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-cinzel mb-2 text-2xl font-bold"
            >
              Admin Portal
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="font-quicksand text-purple-100"
            >
              Secure Access to SpiffyFox Dashboard
            </motion.p>
          </div>

          {/* Login Form */}
          <motion.div variants={containerVariants} className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="email"
                  className="font-quicksand mb-2 block font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="font-quicksand w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    placeholder="admin@spiffyfox.com"
                    disabled={isLoading}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="password"
                  className="font-quicksand mb-2 block font-semibold text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="font-quicksand w-full rounded-lg border border-gray-300 py-3 pr-12 pl-10 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors duration-200 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-red-200 bg-red-50 p-3"
                >
                  <p className="font-quicksand text-center text-sm text-red-600">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="spiffy-bg font-quicksand w-full rounded-lg py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="mr-2 h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                      />
                      Authenticating...
                    </div>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Security Notice */}
            <motion.div
              variants={itemVariants}
              className="mt-8 rounded-lg border border-purple-200 bg-purple-50 p-4"
            >
              <div className="flex items-start space-x-3">
                <FaShieldAlt className="mt-0.5 flex-shrink-0 text-purple-600" />
                <div>
                  <p className="font-quicksand text-sm text-purple-700">
                    <strong>Security Notice:</strong> This portal is restricted
                    to authorized personnel only. All access attempts are logged
                    and monitored.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Support Link */}
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <p className="font-quicksand text-sm text-gray-500">
                Need help?{" "}
                <Link
                  to="/contact"
                  className="font-semibold text-purple-600 transition-colors duration-200 hover:text-purple-700"
                >
                  Contact System Administrator
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="font-cinzel text-sm text-gray-400">
            SpiffyFox Admin System v1.0
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
