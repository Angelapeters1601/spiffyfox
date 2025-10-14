import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Close as CloseIcon,
  ArrowBackIos as PrevIcon,
  ArrowForwardIos as NextIcon,
} from "@mui/icons-material";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import img5 from "../assets/img5.jpg";
import img6 from "../assets/img6.jpg";
import img7 from "../assets/img7.jpg";
import img8 from "../assets/img8.jpg";
import img9 from "../assets/img9.jpg";
import img10 from "../assets/img10.jpg";
import img11 from "../assets/img11.jpg";
import img12 from "../assets/img12.jpg";
import img13 from "../assets/img13.jpg";
import img14 from "../assets/img14.jpg";
import img15 from "../assets/img15.jpg";
import img16 from "../assets/img16.jpg";
import img17 from "../assets/img17.jpg";
import img19 from "../assets/img19.jpg";
import img20 from "../assets/img20.jpg";
import logo from "../assets/logo.jpg";
import icon from "../assets/favicon.jpg";

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const services = [
    {
      name: "Residential Cleaning",
      image: img1,
      description:
        "Transform your living space into a pristine sanctuary with our comprehensive residential cleaning services.",
      features: [
        "Complete dusting and vacuuming",
        "Kitchen and bathroom deep cleaning",
        "Floor care and maintenance",
        "Eco-friendly cleaning products",
        "Customizable cleaning schedules",
      ],
      price: "Starting at $150",
      images: [img1, img6, img4],
    },
    {
      name: "Commercial Cleaning",
      image: img2,
      description:
        "Maintain a professional and welcoming business environment with our commercial cleaning solutions.",
      features: [
        "Office space cleaning",
        "Common area maintenance",
        "Restroom sanitation",
        "Floor and carpet care",
        "After-hours service available",
      ],
      price: "Custom quotes available",
      images: [img2, img13, img19],
    },
    {
      name: "Deep Cleaning",
      image: img3,
      description:
        "Thorough cleaning that reaches every corner, perfect for seasonal cleaning or move-in/move-out.",
      features: [
        "Inside appliance cleaning",
        "Baseboard and molding detail",
        "Window track cleaning",
        "Light fixture dusting",
        "Cabinet organization",
      ],
      price: "Starting at $250",
      images: [img3, img9, img8],
    },
    {
      name: "Organization",
      image: img12,
      description:
        "Create harmonious and functional spaces with our professional organization services.",
      features: [
        "Closet optimization",
        "Pantry organization",
        "Home office setup",
        "Storage solutions",
        "Decluttering services",
      ],
      price: "Starting at $200",
      images: [img12, img10, img11],
    },
    {
      name: "Powerwashing",
      image: img5,
      description:
        "Restore your property's exterior to its original beauty with our professional powerwashing services.",
      features: [
        "House exterior cleaning",
        "Driveway and walkway restoration",
        "Deck and patio cleaning",
        "Fence and gate maintenance",
        "Eco-friendly cleaning solutions",
      ],
      price: "Starting at $175",
      images: [img5, img16, img19],
    },
    {
      name: "Junk Removal",
      image: img6,
      description:
        "Efficient and responsible removal of unwanted items, from household clutter to construction debris.",
      features: [
        "Same-day service available",
        "Environmentally conscious disposal",
        "Heavy item removal",
        "Construction cleanouts",
        "Donation coordination",
      ],
      price: "Starting at $100",
      images: [img6, img13, img8],
    },
    {
      name: "Packing & Unpacking",
      image: img7,
      description:
        "Stress-free moving experience with our professional packing and unpacking services.",
      features: [
        "Professional packing materials",
        "Fragile item specialists",
        "Labeling and inventory system",
        "Room-by-room unpacking",
        "Setup and organization",
      ],
      price: "Custom quotes available",
      images: [img7, img17, img20],
    },
    {
      name: "Personal Assistant",
      image: img14,
      description:
        "Simplify your life with our personalized assistance services for busy professionals and families.",
      features: [
        "Errand running",
        "Grocery shopping",
        "Home management",
        "Vendor coordination",
        "Personal organization",
      ],
      price: "$45/hour",
      images: [img14, img10, img15],
    },
  ];

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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  const openModal = (service) => {
    setSelectedService(service);
    setCurrentImageIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedService(null);
    document.body.style.overflow = "unset";
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedService.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedService.images.length - 1 : prev - 1,
    );
  };

  return (
    <>
      {/* Header */}
      <div className="font-cinzel spiffy-bg flex justify-center p-12 text-4xl font-bold text-white">
        Our Services
      </div>

      {/* Services Grid */}
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Service Items */}
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                variants={itemVariants}
                className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
                onClick={() => openModal(service)}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={service.image}
                    alt={service.name}
                    className="h-full w-full object-cover"
                    whileHover={{
                      scale: 1.15,
                      rotate: [0, -0.5, 0.5, 0],
                      transition: {
                        duration: 0.6,
                        ease: "easeInOut",
                        scale: { duration: 0.4 },
                      },
                    }}
                  />
                  {/* Overlay with View Details */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all duration-300 group-hover:bg-black/20">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="text-center text-white"
                    >
                      <div className="font-cinzel mb-1 text-lg font-semibold">
                        View Details
                      </div>
                      <div className="mx-auto h-0.5 w-8 bg-white"></div>
                    </motion.div>
                  </div>
                </div>

                {/* Service Name */}
                <div className="p-6 text-center">
                  <h3 className="font-lora group-hover:spiffy-text text-xl font-semibold text-gray-800 transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="font-quicksand mt-2 text-sm text-gray-500">
                    {service.price}
                  </p>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-300 group-hover:border-purple-400 group-hover:shadow-lg" />
              </motion.div>
            ))}

            {/* Center Logo Card */}
            <motion.div
              variants={itemVariants}
              className="group relative cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-white shadow-lg transition-all duration-300 hover:shadow-2xl md:col-start-2 md:row-start-2"
              onClick={() =>
                openModal({
                  name: "SpiffyFox",
                  description:
                    "Your trusted partner for premium cleaning and organizational services. With years of experience and a commitment to excellence, we transform spaces and simplify lives.",
                  features: [
                    "Professional and insured team",
                    "Eco-friendly cleaning products",
                    "Customized service plans",
                    "Satisfaction guaranteed",
                    "24/7 customer support",
                  ],
                  price: "Free consultations available",
                  images: [logo, img9, icon],
                })
              }
            >
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={logo}
                  alt="SpiffyFox Logo"
                  className="h-full w-full object-contain p-8"
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -3, 3, 0],
                    transition: {
                      duration: 0.8,
                      ease: "easeInOut",
                      rotate: { duration: 1 },
                    },
                  }}
                />
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="spiffy-bg-light absolute top-0 left-0 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: 1,
                    }}
                    className="spiffy-bg-light absolute right-0 bottom-0 h-16 w-16 translate-x-1/2 translate-y-1/2 rounded-full"
                  />
                </div>
              </div>

              <div className="p-6 text-center">
                <h3 className="font-cinzel text-2xl font-bold text-gray-800">
                  SpiffyFox
                </h3>
                <p className="font-cinzel mt-2 text-gray-600">
                  Premium Services & Expert Care
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="font-quicksand mt-2 text-sm text-purple-600"
                >
                  Click to learn more
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <h2 className="font-cormorant mb-4 text-3xl font-semibold text-gray-800">
              Ready to Transform Your Space?
            </h2>
            <p className="font-quicksand mx-auto mb-8 max-w-2xl text-gray-600">
              Experience the SpiffyFox difference with our comprehensive range
              of professional services tailored to your needs.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="spiffy-bg font-quicksand rounded-lg px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <Link to="/contact">Book Your Service Today</Link>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-gray-600 transition-all hover:bg-white hover:text-gray-800"
              >
                <CloseIcon />
              </button>

              {/* Image Gallery */}
              <div className="relative h-80 overflow-hidden bg-gray-100 sm:h-96">
                <motion.img
                  key={currentImageIndex}
                  src={selectedService.images[currentImageIndex]}
                  alt={selectedService.name}
                  className="h-full w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Navigation Arrows */}
                {selectedService.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-700 transition-all hover:bg-white hover:text-gray-900"
                    >
                      <PrevIcon fontSize="small" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-700 transition-all hover:bg-white hover:text-gray-900"
                    >
                      <NextIcon fontSize="small" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                  {selectedService.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h2 className="font-cinzel mb-4 text-3xl font-bold text-gray-800">
                  {selectedService.name}
                </h2>

                <p className="font-quicksand mb-6 text-lg leading-relaxed text-gray-600">
                  {selectedService.description}
                </p>

                <div className="mb-6">
                  <h3 className="font-cormorant mb-3 text-xl font-semibold text-gray-800">
                    Service Features
                  </h3>
                  <ul className="font-quicksand space-y-2 text-gray-600">
                    {selectedService.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="spiffy-bg mr-3 h-1.5 w-1.5 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between border-t pt-6">
                  <div className="font-cormorant spiffy-text text-2xl font-semibold">
                    {selectedService.price}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="spiffy-bg font-quicksand rounded-lg px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                    onClick={closeModal}
                  >
                    <Link to="/contact">Book This Service</Link>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Services;
