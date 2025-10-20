import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaArrowRight, FaShieldAlt } from "react-icons/fa";

const UnauthorizedPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="spiffy-bg-light flex min-h-screen items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        {/* Header Section */}
        <div className="spiffy-bg relative overflow-hidden p-8 text-center text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 h-8 w-8 rounded-full border-2 border-white"></div>
            <div className="absolute right-4 bottom-4 h-6 w-6 rounded-full border-2 border-white"></div>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-4 flex justify-center"
          >
            <div className="relative">
              <FaLock className="h-16 w-16 text-white" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 rounded-full border-2 border-white/30"
              />
            </div>
          </motion.div>

          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-cinzel mb-2 text-3xl font-bold"
          >
            Access Restricted
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-quicksand text-lg text-purple-100"
          >
            Administrator Privileges Required
          </motion.p>
        </div>

        {/* Content Section */}
        <div className="space-y-6 p-8">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 text-center"
          >
            <p className="font-quicksand text-lg leading-relaxed text-gray-700">
              This section is reserved for authorized SpiffyFox administrators
              only. Please authenticate with proper credentials to continue.
            </p>

            {/* Action Button */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <Link
                to="/admin"
                className="group spiffy-bg font-quicksand inline-flex w-full transform items-center justify-center rounded-xl px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-purple-300 focus:outline-none"
              >
                <span>Access Admin Portal</span>
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FaArrowRight className="ml-3" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Alternative Options */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <p className="font-quicksand mb-3 text-sm text-gray-500">
              Looking for something else?
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="font-quicksand font-medium text-purple-600 transition-colors duration-200 hover:text-purple-700"
              >
                Return Home
              </Link>
              <span className="hidden text-gray-300 sm:inline">•</span>
              <Link
                to="/contact"
                className="font-quicksand font-medium text-purple-600 transition-colors duration-200 hover:text-purple-700"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="spiffy-bg-light mt-6 rounded-xl border border-purple-200 p-4"
          >
            <div className="flex items-center justify-center space-x-2">
              <FaShieldAlt className="text-purple-600" />
              <p className="font-quicksand text-center text-xs text-purple-700">
                All access attempts are monitored and logged for security
                compliance.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="border-t border-gray-100 p-4 text-center"
        >
          <p className="font-cinzel text-sm text-gray-400">
            SpiffyFox Security System
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default UnauthorizedPage;
