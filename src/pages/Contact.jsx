import img from "../assets/img15.jpg";
import Map from "../ui/Map";
import { motion } from "framer-motion";

const Contact = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const leftSlideVariants = {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const rightSlideVariants = {
    hidden: {
      opacity: 0,
      x: 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const bottomUpVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Header */}
      <div className="font-cinzel spiffy-bg-light relative flex justify-center overflow-hidden p-14 text-5xl font-bold tracking-wider text-white">
        <div className="absolute inset-0"></div>
        <div className="relative z-10 text-center">
          Here to{" "}
          <span className="spiffy-text-dark border-b-4 border-purple-300 tracking-wider">
            help
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Contact Form Section - Slides from left */}
          <motion.div
            className="rounded-2xl bg-transparent p-8 shadow-lg"
            variants={leftSlideVariants}
          >
            <div className="mb-8 text-center">
              <h2 className="font-cinzel spiffy-text-dark mb-3 text-3xl font-bold">
                Get In Touch
              </h2>
              <p className="font-quicksand text-lg text-gray-600">
                We're here to assist you. Send us a message and we'll respond as
                soon as possible.
              </p>
            </div>

            <form className="space-y-6">
              {/* Full Name */}
              <motion.div variants={leftSlideVariants}>
                <label
                  htmlFor="fullName"
                  className="font-quicksand mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  className="font-quicksand w-full rounded-2xl border border-gray-300 bg-gray-200 px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full name"
                />
              </motion.div>

              {/* Email & Contact */}
              <motion.div
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                variants={leftSlideVariants}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="font-quicksand mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="font-quicksand w-full rounded-2xl border border-gray-300 bg-gray-200 px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact"
                    className="font-quicksand mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    className="font-quicksand w-full rounded-2xl border border-gray-300 bg-gray-200 px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </motion.div>

              {/* Country */}
              <motion.div variants={leftSlideVariants}>
                <label
                  htmlFor="country"
                  className="font-quicksand mb-2 block text-sm font-semibold text-gray-700"
                >
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  className="font-quicksand w-full appearance-none rounded-2xl border border-gray-300 bg-gray-200 px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select your country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>

              {/* Message */}
              <motion.div variants={leftSlideVariants}>
                <label
                  htmlFor="message"
                  className="font-quicksand mb-2 block text-sm font-semibold text-gray-700"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  className="font-quicksand w-full resize-none rounded-2xl border border-gray-300 bg-gray-200 px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={leftSlideVariants}>
                <button
                  type="submit"
                  className="spiffy-bg-dark font-quicksand w-full transform cursor-pointer rounded-lg px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Send Message
                </button>
              </motion.div>
            </form>
          </motion.div>

          {/* Image & Newsletter Section - Slides from right */}
          <motion.div className="space-y-8" variants={rightSlideVariants}>
            {/* Contact Image */}
            <motion.div
              className="group relative"
              variants={rightSlideVariants}
            >
              <img
                src={img}
                alt="Professional team collaboration"
                className="h-90 w-full transform rounded-2xl object-cover shadow-2xl shadow-[#0c005a] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end rounded-2xl bg-gradient-to-t from-black/50 to-transparent p-6">
                <div className="text-white">
                  <h3 className="font-cinzel mb-2 text-2xl font-bold">
                    Our Commitment
                  </h3>
                  <p className="font-quicksand text-sm opacity-90">
                    Dedicated to providing exceptional service and support
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Newsletter Section */}
            <motion.div
              className="spiffy-bg-medium rounded-2xl p-8 text-white shadow-2xl"
              variants={rightSlideVariants}
            >
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="font-cinzel spiffy-text-dark mb-3 text-2xl font-bold">
                  join our newsletter
                </h2>
                <p className="font-quicksand leading-relaxed text-purple-100">
                  Subscribe to our newsletter and be the first to receive
                  exclusive updates, industry insights, and special offers
                  directly to your inbox.
                </p>
              </div>

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="newsletterEmail"
                    className="font-quicksand mb-2 block text-sm font-semibold text-purple-100"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="newsletterEmail"
                    name="newsletterEmail"
                    required
                    className="font-quicksand w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-purple-200 transition-all duration-200 outline-none focus:border-white/30 focus:bg-white/20"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="submit"
                  className="font-quicksand w-full transform cursor-pointer rounded-lg bg-gray-200 px-6 py-3 font-semibold text-purple-600 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Subscribe Now
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="font-quicksand text-xs text-purple-200">
                  By subscribing, you agree to our Privacy Policy and consent to
                  receive updates from SpiffyFox. You can unsubscribe at any
                  time.
                </p>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="spiffy-bg-medium rounded-2xl p-6 shadow-lg"
              variants={rightSlideVariants}
            >
              <h3 className="font-cinzel spiffy-text-dark mb-4 text-xl font-bold text-gray-800">
                Contact Information
              </h3>
              <div className="font-cormorant space-y-3 text-gray-200">
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 text-purple-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>+1 (202) 670-6164</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 text-purple-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>help@spiffyfox.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 text-purple-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>1 SpiffyFox Way, Premium Plaza, DE 19809</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Map Section - Slides from bottom */}
        <motion.div className="col-span-full mt-5" variants={bottomUpVariants}>
          <Map />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
