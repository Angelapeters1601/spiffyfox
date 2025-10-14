import { motion } from "framer-motion";
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
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    { name: "Residential Cleaning", image: img1 },
    { name: "Commercial Cleaning", image: img2 },
    { name: "Deep Cleaning", image: img3 },
    { name: "Organization", image: img4 },
    { name: "Powerwashing", image: img5 },
    { name: "Junk Removal", image: img6 },
    { name: "Packing & Unpacking", image: img7 },
    { name: "Personal Assistant", image: img8 },
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
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={service.image}
                    alt={service.name}
                    className="h-full w-full object-cover"
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.4, ease: "easeOut" },
                    }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 transition-all duration-300 group-hover:bg-black/10" />
                </div>

                {/* Service Name */}
                <div className="p-6 text-center">
                  <h3 className="font-lora group-hover:spiffy-text text-xl font-semibold text-gray-800 transition-colors duration-300">
                    {service.name}
                  </h3>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-300 group-hover:border-purple-300" />
              </motion.div>
            ))}

            {/* Center Logo Card */}
            <motion.div
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-white shadow-lg transition-all duration-300 hover:shadow-2xl md:col-start-2 md:row-start-2"
            >
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={logo}
                  alt="SpiffyFox Logo"
                  className="h-full w-full object-contain p-8"
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, -2, 2, 0],
                    transition: { duration: 0.6, ease: "easeInOut" },
                  }}
                />
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="spiffy-bg-light absolute top-0 left-0 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                  <div className="spiffy-bg-light absolute right-0 bottom-0 h-16 w-16 translate-x-1/2 translate-y-1/2 rounded-full" />
                </div>
              </div>

              <div className="p-6 text-center">
                <h3 className="font-cinzel text-2xl font-bold text-gray-800">
                  SpiffyFox
                </h3>
                <p className="font-cinzel mt-2 text-gray-600">
                  Premium Services & Expert Care
                </p>
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
    </>
  );
};

export default Services;
