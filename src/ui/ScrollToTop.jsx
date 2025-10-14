import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { KeyboardArrowUp as ArrowUpIcon } from "@mui/icons-material";
import { useState } from "react";

// Scroll to top on route change
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

// Scroll to top button component
export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{
            scale: 1.1,
            backgroundColor: "rgba(177, 156, 217, 0.9)",
          }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="spiffy-bg fixed right-8 bottom-8 z-50 rounded-full p-3 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="!text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export const ScrollToTopHandler = () => {
  return (
    <>
      <ScrollToTop />
      <ScrollToTopButton />
    </>
  );
};
