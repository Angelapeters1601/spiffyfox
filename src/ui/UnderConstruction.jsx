import React from "react";
import { motion } from "framer-motion";
import { FaTools, FaHardHat, FaExclamationTriangle } from "react-icons/fa";

const UnderConstruction = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative border-b-4 border-black bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg"
    >
      <div className="mx-auto max-w-7xl px-4 py-1">
        <div className="flex items-center justify-center space-x-4">
          {/* Left Icon */}
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <FaTools className="h-3 w-3 text-black" />
          </motion.div>

          {/* Main Text */}
          <div className="flex items-center space-x-3">
            <span className="font-cinzel text-sm font-bold tracking-wide text-black">
              UNDER CONSTRUCTION
            </span>
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FaExclamationTriangle className="h-3 w-3 text-black" />
            </motion.div>
          </div>

          {/* Right Icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            <FaHardHat className="h-3 w-3 text-black" />
          </motion.div>
        </div>
      </div>

      {/* Animated Construction Line */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="h-1 bg-gradient-to-r from-transparent via-black to-transparent bg-[length:200%_100%]"
      />
    </motion.div>
  );
};

export default UnderConstruction;
