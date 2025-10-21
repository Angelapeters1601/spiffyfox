import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

const NotFoundPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
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

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-purple-300 p-7 px-4">
      <motion.div
        className="w-full max-w-2xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated 404 Number */}
        <motion.div className="relative mb-8" variants={itemVariants}>
          <motion.div
            className="font-cinzel text-9xl font-black text-gray-100 md:text-[12rem]"
            animate={floatingAnimation}
          >
            404
          </motion.div>
          <motion.div
            className="spiffy-bg absolute -top-4 -right-4 h-8 w-8 rounded-full"
            animate={pulseAnimation}
          />
          <motion.div
            className="spiffy-border absolute -bottom-2 -left-4 h-6 w-6 rounded-full border-2"
            animate={pulseAnimation}
            transition={{ delay: 1 }}
          />
        </motion.div>

        {/* Main Message */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="font-cinzel mb-4 text-3xl font-bold tracking-widest text-gray-800 md:text-4xl">
            Page Not Found
          </h1>
          <p className="font-quicksand mx-auto max-w-md text-lg text-gray-600">
            Oops! The page you're looking for seems to have wandered off into
            the digital wilderness. Let's get you back on track.
          </p>
        </motion.div>

        {/* Animated Illustration */}
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.div
            className="relative mx-auto h-32 w-32"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="spiffy-border flex h-full w-full items-center justify-center rounded-full border-4">
              <motion.div
                className="spiffy-border h-16 w-16 rounded-full border-2"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            </div>
            <motion.div
              className="spiffy-bg-dark absolute top-0 left-1/2 h-8 w-1 -translate-x-1/2 transform"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="font-quicksand spiffy-bg flex items-center gap-2 rounded-lg px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <HomeIcon fontSize="small" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => window.history.back()}
              className="font-quicksand spiffy-border flex items-center gap-2 rounded-lg border-2 px-8 py-3 font-semibold text-gray-100 transition-all duration-200 hover:bg-purple-400"
            >
              <ArrowBackIcon fontSize="small" />
              Go Back
            </button>
          </motion.div>
        </motion.div>

        {/* Additional Help */}
        <motion.div variants={itemVariants} className="mt-8">
          <p className="font-quicksand text-sm text-white">
            Need help?{" "}
            <Link
              to="/contact"
              className="font-semibold text-slate-900 hover:underline"
            >
              Contact our support team
            </Link>
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="spiffy-bg absolute bottom-10 left-10 h-4 w-4 rounded-full opacity-60"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
        <motion.div
          className="spiffy-border absolute top-10 right-10 h-6 w-6 rounded-full border-2 opacity-40"
          animate={{
            y: [0, 15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 1,
          }}
        />
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
