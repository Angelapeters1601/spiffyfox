import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaBroom,
  FaBoxes,
  FaSprayCan,
  FaTrash,
  FaBoxOpen,
  FaHandsHelping,
  FaStar,
  FaShieldAlt,
  FaRecycle,
  FaClock,
} from "react-icons/fa";

import tip1 from "../assets/img1.jpg";
import tip2 from "../assets/img2.jpg";
import tip3 from "../assets/img3.jpg";
import tip4 from "../assets/img4.jpg";
import tip5 from "../assets/img5.jpg";
import tip6 from "../assets/img6.jpg";
import tip7 from "../assets/img7.jpg";
import tip8 from "../assets/img8.jpg";

const Tip = () => {
  const services = [
    {
      id: 1,
      title: "Residential Cleaning",
      icon: <FaHome className="text-3xl" />,
      description:
        "Transform your living space into a sanctuary of cleanliness and comfort with our expert residential cleaning services.",
      tips: [
        "Establish a daily 15-minute tidy-up routine",
        "Use microfiber cloths for dusting and cleaning",
        "Clean from top to bottom to avoid recontamination",
        "Implement zone cleaning for efficiency",
      ],
      image: tip1,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: 2,
      title: "Commercial Cleaning",
      icon: <FaBuilding className="text-3xl" />,
      description:
        "Maintain a professional, hygienic workspace that boosts productivity and impresses clients.",
      tips: [
        "Schedule deep cleaning during off-hours",
        "Use EPA-approved disinfectants",
        "Implement color-coded cleaning systems",
        "Focus on high-touch surface sanitation",
      ],
      image: tip2,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 3,
      title: "Deep Cleaning",
      icon: <FaBroom className="text-3xl" />,
      description:
        "Go beyond surface cleaning with our intensive deep cleaning solutions for a truly pristine environment.",
      tips: [
        "Start with decluttering before cleaning",
        "Use steam cleaners for sanitization",
        "Pay attention to often-missed areas",
        "Allow proper drying time between steps",
      ],
      image: tip3,
      color: "from-green-500 to-green-600",
    },
    {
      id: 4,
      title: "Organization",
      icon: <FaBoxes className="text-3xl" />,
      description:
        "Create harmonious, efficient spaces through strategic organization and systematic decluttering.",
      tips: [
        "Implement the 'one in, one out' rule",
        "Use vertical storage solutions",
        "Categorize items by frequency of use",
        "Label everything for easy identification",
      ],
      image: tip4,
      color: "from-orange-500 to-orange-600",
    },
    {
      id: 5,
      title: "Power Washing",
      icon: <FaSprayCan className="text-3xl" />,
      description:
        "Restore your property's exterior to its original glory with professional-grade power washing.",
      tips: [
        "Test pressure on inconspicuous area first",
        "Use appropriate nozzles for different surfaces",
        "Work from top to bottom systematically",
        "Apply eco-friendly cleaning solutions",
      ],
      image: tip5,
      color: "from-red-500 to-red-600",
    },
    {
      id: 6,
      title: "Junk Removal",
      icon: <FaTrash className="text-3xl" />,
      description:
        "Efficient, eco-friendly junk removal that clears your space while respecting the environment.",
      tips: [
        "Sort items into keep, donate, recycle, trash",
        "Schedule removal during convenient hours",
        "Consider item repurposing possibilities",
        "Follow local disposal regulations",
      ],
      image: tip6,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      id: 7,
      title: "Packing & Unpacking",
      icon: <FaBoxOpen className="text-3xl" />,
      description:
        "Stress-free relocation services with meticulous packing, secure transport, and organized unpacking.",
      tips: [
        "Create detailed inventory lists",
        "Use quality packing materials",
        "Pack room by room systematically",
        "Label boxes with contents and destination",
      ],
      image: tip7,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: 8,
      title: "Personal Assistance",
      icon: <FaHandsHelping className="text-3xl" />,
      description:
        "Comprehensive personal assistance services designed to simplify your life and save you time.",
      tips: [
        "Establish clear communication protocols",
        "Create prioritized task lists",
        "Use digital tools for coordination",
        "Schedule regular check-in meetings",
      ],
      image: tip8,
      color: "from-teal-500 to-teal-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="font-cinzel spiffy-bg-light relative flex items-center justify-center p-16 text-5xl font-bold text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center">
            Expert Tips & Insights
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mx-auto mt-4 h-1 rounded-full bg-white"
            />
          </div>
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 mx-auto max-w-4xl px-4 py-12 text-center"
        >
          <h2 className="font-cinzel mb-6 text-3xl font-bold text-gray-800">
            Professional Cleaning & Organization Mastery
          </h2>
          <p className="font-quicksand text-xl leading-relaxed text-gray-600">
            Discover expert strategies, proven techniques, and innovative
            solutions from SpiffyFox professionals. Transform your spaces with
            our comprehensive guides covering every aspect of modern cleaning
            and organization.
          </p>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl px-4 py-16"
      >
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <FaStar />,
              text: "Expert Verified",
              color: "text-yellow-500",
            },
            {
              icon: <FaShieldAlt />,
              text: "Proven Methods",
              color: "text-green-500",
            },
            {
              icon: <FaRecycle />,
              text: "Eco-Friendly",
              color: "text-blue-500",
            },
            {
              icon: <FaClock />,
              text: "Time-Saving",
              color: "text-purple-500",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div
                className={`${feature.color} mb-4 flex justify-center text-3xl`}
              >
                {feature.icon}
              </div>
              <h3 className="font-cinzel text-lg font-semibold text-gray-800">
                {feature.text}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Services Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-20"
        >
          {services.map((service, index) => (
            <motion.section
              key={service.id}
              variants={itemVariants}
              className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-12`}
            >
              {/* Image Section */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="flex-1"
              >
                <div className="group relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-80 w-full transform rounded-3xl object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105 lg:h-96"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute right-4 bottom-4 left-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="font-quicksand text-sm">
                      Professional {service.title} Solutions
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Content Section */}
              <motion.div variants={cardVariants} className="flex-1 space-y-6">
                {/* Service Header */}
                <div className="mb-6 flex items-center space-x-4">
                  <div
                    className={`rounded-2xl bg-gradient-to-r p-4 ${service.color} text-white shadow-lg`}
                  >
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-cinzel text-3xl font-bold text-gray-800">
                      {service.title}
                    </h3>
                    <div
                      className={`h-1 w-20 bg-gradient-to-r ${service.color} mt-2 rounded-full`}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="font-quicksand text-lg leading-relaxed text-gray-600">
                  {service.description}
                </p>

                {/* Tips List */}
                <div className="space-y-3">
                  <h4 className="font-cinzel text-xl font-semibold text-gray-800">
                    Professional Tips:
                  </h4>
                  <ul className="space-y-2">
                    {service.tips.map((tip, tipIndex) => (
                      <motion.li
                        key={tipIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + tipIndex * 0.1 }}
                        className="font-quicksand flex items-start space-x-3 text-gray-700"
                      >
                        <div
                          className={`h-2 w-2 rounded-full bg-gradient-to-r ${service.color} mt-2 flex-shrink-0`}
                        />
                        <span>{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Call to Action */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <button
                    className={`font-quicksand bg-gradient-to-r px-6 py-3 ${service.color} rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
                  >
                    Learn More About {service.title}
                  </button>
                </motion.div>
              </motion.div>
            </motion.section>
          ))}
        </motion.div>
      </motion.div>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="spiffy-bg py-16 text-white"
      >
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-cinzel mb-6 text-4xl font-bold">
            Ready to Transform Your Space?
          </h2>
          <p className="font-quicksand mb-8 text-xl opacity-90">
            Let our experts bring SpiffyFox's professional standards to your
            home or business. Experience the difference that comes with true
            cleaning mastery.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-quicksand rounded-xl bg-white px-8 py-4 font-semibold text-purple-600 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <Link to="/contact">Schedule a Consultation</Link>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-quicksand rounded-xl border-2 border-white bg-transparent px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-purple-600"
            >
              <Link to="/services"> View Service Packages</Link>
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto max-w-4xl px-4 py-12 text-center"
      >
        <p className="font-quicksand text-lg text-gray-600">
          <strong>Note:</strong> This tips section will be dynamically populated
          from our admin dashboard. Our experts continuously update these
          insights with the latest industry standards and innovative techniques.
        </p>
      </motion.div>
    </div>
  );
};

export default Tip;
