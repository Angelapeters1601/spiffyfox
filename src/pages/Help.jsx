import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiArrowRight,
  FiMail,
  FiHelpCircle,
  FiMessageSquare,
  FiTool,
  FiShield,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiClock,
  FiChevronDown,
  FiBookOpen,
  FiPhone,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import {
  FaHandSparkles,
  FaHome,
  FaBuilding,
  FaTruckMoving,
  FaBroom,
  FaRegLightbulb,
} from "react-icons/fa";
import Faq from "./Faq";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedArticle, setExpandedArticle] = useState(null);

  // Detailed help articles with full content
  const helpArticles = [
    {
      id: 1,
      title: "Getting Started with Residential Cleaning",
      category: "services",
      icon: <FaHome className="text-xl" />,
      description:
        "Learn how to book and prepare for your first cleaning service",
      readTime: "5 min read",
      content: `Our residential cleaning service is designed for homes of all sizes. We use eco-friendly products and professional equipment. Our team conducts a thorough 150-point checklist ensuring every corner sparkles. You can schedule recurring cleanings or one-time deep cleans through our app or website.`,
      tips: [
        "Declutter surfaces before our team arrives",
        "Let us know about any special requirements",
        "Pets should be secured during cleaning hours",
      ],
    },
    {
      id: 2,
      title: "Commercial Cleaning Guidelines",
      category: "services",
      icon: <FaBuilding className="text-xl" />,
      description: "Everything you need to know about our commercial services",
      readTime: "7 min read",
      content: `We provide comprehensive commercial cleaning for offices, retail spaces, and industrial facilities. Our services include daily janitorial, deep cleaning, carpet cleaning, and specialized sanitization. We work around your business hours to minimize disruption. All our commercial staff undergo additional security clearance.`,
      tips: [
        "Schedule cleaning during off-hours",
        "Provide access cards in advance",
        "Inform us about sensitive equipment",
      ],
    },
    {
      id: 3,
      title: "Pricing & Payment Methods",
      category: "billing",
      icon: <FiDollarSign className="text-xl" />,
      description: "Understand our pricing structure and payment options",
      readTime: "6 min read",
      content: `SpiffyFox offers transparent pricing with no hidden fees. We charge based on property size, service type, and frequency. All major credit cards, PayPal, and corporate billing are accepted. Recurring customers receive discounted rates and can manage subscriptions through their dashboard.`,
      tips: [
        "Save 15% with monthly subscriptions",
        "Corporate accounts get net-30 terms",
        "First-time customers get 20% off",
      ],
    },
    {
      id: 4,
      title: "Booking & Scheduling System",
      category: "booking",
      icon: <FiCalendar className="text-xl" />,
      description: "How to book, reschedule, or cancel appointments",
      readTime: "3 min read",
      content: `Book services 24/7 through our website or mobile app. Our real-time scheduling shows available slots. You can reschedule up to 12 hours before service without penalty. Cancellations within 4 hours may incur a 25% fee. All bookings receive confirmation emails and SMS reminders.`,
      tips: [
        "Book recurring services for preferred time slots",
        "Set up SMS reminders for appointments",
        "Use the app for last-minute bookings",
      ],
    },
    {
      id: 5,
      title: "Safety & Security Protocols",
      category: "safety",
      icon: <FiShield className="text-xl" />,
      description: "Our commitment to your safety and property security",
      readTime: "8 min read",
      content: `All SpiffyFox contractors undergo rigorous background checks, drug testing, and comprehensive training. We use GPS-tracked vehicles and provide real-time service updates. All team members wear uniforms with photo IDs. We're fully insured and bonded for your protection.`,
      tips: [
        "Verify contractor ID before granting access",
        "Use the app to track arrival times",
        "Report any concerns immediately",
      ],
    },
    {
      id: 6,
      title: "Contractor Background Checks",
      category: "contractors",
      icon: <FiUser className="text-xl" />,
      description: "How we vet and train our cleaning professionals",
      readTime: "5 min read",
      content: `Every contractor undergoes a 7-step vetting process: criminal background check, employment verification, reference checks, skills assessment, personality evaluation, drug screening, and ongoing performance reviews. We provide 80 hours of initial training and continuous education.`,
      tips: [
        "You can request specific contractors",
        "Ratings help us improve service quality",
        "All contractors speak English fluently",
      ],
    },
    {
      id: 7,
      title: "Junk Removal Process",
      category: "services",
      icon: <FaTruckMoving className="text-xl" />,
      description: "How we handle junk removal from start to finish",
      readTime: "4 min read",
      content: `Our junk removal service handles everything from furniture to construction debris. We provide on-site quotes, same-day service availability, and eco-friendly disposal. We donate usable items to local charities and recycle whenever possible.`,
      tips: [
        "Sort items by category before our arrival",
        "Measure large items for accurate quotes",
        "Ask about our donation receipts for tax purposes",
      ],
    },
    {
      id: 8,
      title: "Deep Cleaning vs. Regular Cleaning",
      category: "services",
      icon: <FaBroom className="text-xl" />,
      description: "Understanding the difference between our service tiers",
      readTime: "4 min read",
      content: `Regular cleaning maintains cleanliness with basic tasks. Deep cleaning is a comprehensive service that includes behind appliances, inside cabinets, window tracks, baseboards, and other often-missed areas. We recommend deep cleaning quarterly for optimal results.`,
      tips: [
        "Schedule deep cleaning seasonally",
        "Combine with carpet cleaning for best results",
        "Book early for holiday season availability",
      ],
    },
  ];

  const categories = [
    {
      id: "all",
      label: "All Topics",
      icon: <FiBookOpen />,
      description: "Browse all help articles and guides",
      count: helpArticles.length,
    },
    {
      id: "services",
      label: "Services",
      icon: <FaHandSparkles />,
      description: "Cleaning, junk removal, and specialty services",
      count: helpArticles.filter((a) => a.category === "services").length,
    },
    {
      id: "billing",
      label: "Billing",
      icon: <FiDollarSign />,
      description: "Pricing, payments, and invoices",
      count: helpArticles.filter((a) => a.category === "billing").length,
    },
    {
      id: "booking",
      label: "Booking",
      icon: <FiCalendar />,
      description: "Scheduling, rescheduling, and cancellations",
      count: helpArticles.filter((a) => a.category === "booking").length,
    },
    {
      id: "safety",
      label: "Safety",
      icon: <FiShield />,
      description: "Security protocols and insurance",
      count: helpArticles.filter((a) => a.category === "safety").length,
    },
    {
      id: "contractors",
      label: "Contractors",
      icon: <FiUser />,
      description: "Team vetting, training, and management",
      count: helpArticles.filter((a) => a.category === "contractors").length,
    },
  ];

  const filteredArticles = helpArticles.filter(
    (article) =>
      (activeCategory === "all" || article.category === activeCategory) &&
      (searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const toggleArticle = (id) => {
    setExpandedArticle(expandedArticle === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="from-spiffy-bg-light/30 absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] via-transparent to-transparent"></div>

        <div className="relative container mx-auto px-4 py-12 md:px-6 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div>
                <span className="spiffy-bg-dark spiffy-border mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1">
                  <FiHelpCircle className="spiffy-text" />
                  <span className="font-quicksand spiffy-text-dark text-sm font-medium">
                    Help Center
                  </span>
                </span>
                <h1 className="font-cinzel mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
                  How can we <span className="spiffy-text">help</span> you
                  today?
                </h1>
                <p className="font-lora mb-8 text-sm text-gray-600 md:text-xl">
                  Find answers to your questions about our cleaning services,
                  booking process, pricing, and more. Everything you need to
                  know about SpiffyFox.
                </p>
              </div>

              {/* New to SpiffyFox Card */}
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                className="group cursor-pointer"
              >
                <Link
                  to="/services"
                  className="spiffy-border block rounded-2xl border bg-gradient-to-r from-white to-purple-200 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-spiffy-bg-light rounded-lg p-2">
                          <FaHandSparkles className="spiffy-text text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-cinzel text-xl font-semibold text-gray-900">
                            New to SpiffyFox?
                          </h3>
                          <p className="font-quicksand text-gray-600">
                            Discover our premium cleaning services
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="spiffy-text flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-2">
                      <span className="font-quicksand text-sm font-semibold">
                        Start from here
                      </span>
                      <FiArrowRight className="text-xl" />
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative max-w-2xl"
              >
                <div className="relative">
                  <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 transform text-xl text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for help articles, guides, or FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="font-quicksand w-full rounded-xl border border-gray-200 bg-white py-4 pr-4 pl-12 text-sm shadow-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none"
                  />
                  <button className="font-quicksand spiffy-bg-dark absolute top-1/2 right-2 -translate-y-1/2 transform rounded-lg px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90">
                    Search
                  </button>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Image/Graphics */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-[400px] overflow-hidden rounded-3xl lg:h-[500px]">
                <div className="from-spiffy-bg/20 absolute inset-0 z-10 bg-gradient-to-r to-purple-400/10"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200')] bg-cover bg-center"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section with Filtering */}
      <section className="spiffy-bg-light py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-cinzel mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Browse Help <span className="spiffy-text">Categories</span>
            </h2>
            <p className="font-lora mx-auto max-w-2xl text-gray-600">
              Click on any category to filter articles. Each expands with
              detailed information.
            </p>
          </motion.div>

          {/* Enhanced Category Filters*/}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`font-quicksand flex min-w-[140px] flex-col items-center gap-2 rounded-xl px-5 py-4 font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? "spiffy-bg-dark text-white shadow-lg"
                    : "border border-gray-200 bg-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="text-xl">{category.icon}</div>
                <div>
                  <div className="font-medium">{category.label}</div>
                  <div className="mt-1 text-xs font-normal opacity-80">
                    {category.count} articles
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-gray-900">
                  {activeCategory === "all"
                    ? "All Help Articles"
                    : categories.find((c) => c.id === activeCategory)?.label +
                      " Articles"}
                </h3>
                <p className="font-quicksand text-sm text-gray-600">
                  {filteredArticles.length} article
                  {filteredArticles.length !== 1 ? "s" : ""} found
                </p>
              </div>
              {activeCategory !== "all" && (
                <button
                  onClick={() => setActiveCategory("all")}
                  className="font-quicksand flex items-center gap-1 text-sm text-purple-600 transition-all hover:gap-2 hover:text-purple-800"
                >
                  <FiArrowRight className="rotate-180" />
                  Back to all topics
                </button>
              )}
            </div>
          </div>

          {/* Articles with Accordion Functionality */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="hover:border-spiffy-border overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300"
                >
                  <button
                    onClick={() => toggleArticle(article.id)}
                    className="w-full cursor-pointer p-6 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`rounded-xl p-3 ${
                            expandedArticle === article.id
                              ? "bg-spiffy-bg-medium"
                              : "bg-spiffy-bg-light"
                          } transition-colors`}
                        >
                          <div className="spiffy-text">{article.icon}</div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <h3 className="font-cinzel text-sm font-semibold text-gray-900">
                              {article.title}
                            </h3>
                            <span className="font-quicksand rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                              {article.category}
                            </span>
                          </div>
                          <p className="font-quicksand mb-2 text-gray-600">
                            {article.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="font-quicksand flex items-center gap-1">
                              <FiClock />
                              {article.readTime}
                            </span>
                            {article.tips && (
                              <span className="font-quicksand flex items-center gap-1">
                                <FaRegLightbulb className="text-amber-500" />
                                {article.tips.length} tips
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <FiChevronDown
                        className={`text-gray-400 transition-transform duration-300 ${
                          expandedArticle === article.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedArticle === article.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100"
                      >
                        <div className="bg-gradient-to-b from-gray-50 to-white p-6">
                          <div className="grid gap-8 md:grid-cols-2">
                            {/* Content Column */}
                            <div>
                              <h4 className="font-cinzel mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <FiInfo className="text-blue-500" />
                                Detailed Information
                              </h4>
                              <p className="font-quicksand mb-4 text-sm leading-relaxed text-gray-700">
                                {article.content}
                              </p>

                              {article.tips && (
                                <div className="mt-6">
                                  <h4 className="font-cinzel mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <FaRegLightbulb className="text-amber-500" />
                                    Pro Tips
                                  </h4>
                                  <ul className="space-y-2">
                                    {article.tips.map((tip, index) => (
                                      <li
                                        key={index}
                                        className="font-quicksand flex items-start gap-2 text-sm text-gray-700"
                                      >
                                        <FiCheckCircle className="mt-1 flex-shrink-0 text-green-500" />
                                        <span>{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* FAQ Section*/}
      <section className="spiffy-bg py-1">
        {/* FAQ Component */}
        <Faq />
      </section>

      {/* Contact CTA  */}
      <section className="bg-purple-100 py-15">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex h-5 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <FiMail className="rounded-full text-3xl text-purple-800 shadow-[0_0_25px] shadow-purple-600/70" />
            </div>
            <h2 className="font-cinzel mb-4 text-2xl font-bold text-purple-800 md:text-4xl">
              Didn't find an answer?
            </h2>
            <p className="font-lora mx-auto mb-8 max-w-2xl text-sm text-purple-500 md:text-lg">
              Our dedicated support team is just a message away and ready to
              answer your questions personally. We're here to help 24/7.
            </p>

            {/* Contact Buttons */}
            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <motion.a
                href="tel:+15551234567"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group font-quicksand hover:shadow-3xl inline-flex cursor-pointer items-center justify-center gap-4 rounded-xl bg-purple-50 px-8 py-4 text-lg font-semibold text-gray-900 shadow-2xl transition-all duration-300"
              >
                <FiPhone className="text-sm" />
                <span className="text-sm">Call Us: (202) 670-6164</span>
              </motion.a>

              <motion.a
                href="mailto:support@spiffyfox.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group from-spiffy-bg font-quicksand hover:shadow-3xl spiffy-bg-dark inline-flex cursor-pointer items-center justify-center gap-4 rounded-xl px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300"
              >
                <FiMail className="text-sm" />
                <span className="text-sm">Email Support</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Help;
