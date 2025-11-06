import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import favicon from "../assets/favicon.jpg";
import {
  FiShield,
  FiUsers,
  FiFileText,
  FiLock,
  FiGlobe,
  FiHeart,
  FiChevronDown,
  FiDownload,
  FiMail,
  FiArrowRight,
  FiCheckCircle,
  FiStar,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Policy = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activePolicy, setActivePolicy] = useState(null);
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScroll = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);
  const y = useTransform(heroScroll.scrollYProgress, [0, 1], [0, -200]);
  const textY = useTransform(heroScroll.scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(
    heroScroll.scrollYProgress,
    [0, 0.8],
    [1, 0],
  );

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const policySections = [
    {
      icon: <FiShield className="text-3xl" />,
      title: "Privacy Policy",
      description:
        "Your trust means everything to us. We are committed to protecting your personal information and being transparent about what we collect and how we use it.",
      detailedDescription:
        "We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or destruction. Our privacy practices are regularly audited and updated to comply with global data protection regulations.",
      points: [
        "Data collection and usage transparency",
        "Third-party sharing policies",
        "Cookie and tracking technologies",
        "Your rights and choices",
        "Data retention periods",
        "International data transfers",
      ],
      compliance: ["GDPR", "CCPA", "PIPEDA"],
      lastUpdated: "11-06-2025",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: <FiFileText className="text-3xl" />,
      title: "Terms of Service",
      description:
        "Clear guidelines that ensure a safe, respectful, and professional environment for all our clients and team members.",
      detailedDescription:
        "These terms govern your use of our services and outline the responsibilities of both parties. We believe in fair and transparent agreements that protect everyone's interests.",
      points: [
        "Service agreements and scope",
        "User responsibilities and conduct",
        "Payment and cancellation policies",
        "Dispute resolution process",
        "Intellectual property rights",
        "Limitation of liability",
      ],
      compliance: ["Commercial Law", "Consumer Protection"],
      lastUpdated: "11-06-2025",
      color: "from-purple-500 to-pink-400",
    },
    {
      icon: <FiUsers className="text-3xl" />,
      title: "Code of Conduct",
      description:
        "Our commitment to excellence, integrity, and respect in every interaction with our clients, team, and community.",
      detailedDescription:
        "This code establishes the ethical framework that guides our team's behavior and decision-making processes. We hold ourselves to the highest standards of professionalism and accountability in all our operations.",
      points: [
        "Professional standards and ethics",
        "Health and safety protocols",
        "Environmental responsibility",
        "Community engagement",
        "Anti-discrimination policies",
        "Confidentiality agreements",
      ],
      compliance: ["ISO 26000", "UN Global Compact"],
      lastUpdated: "11-06-2025",
      color: "from-green-500 to-emerald-400",
    },
    {
      icon: <FiLock className="text-3xl" />,
      title: "Security Policy",
      description:
        "State-of-the-art security measures to protect your data, property, and peace of mind during every service engagement.",
      detailedDescription:
        "Our multi-layered security approach ensures comprehensive protection across all touchpoints. We continuously monitor and enhance our security posture.",
      points: [
        "Data encryption and protection",
        "Background verified professionals",
        "Insurance and liability coverage",
        "Emergency protocols",
        "Physical security measures",
        "Cybersecurity protocols",
      ],
      compliance: ["ISO 27001", "SOC 2"],
      lastUpdated: "11-06-2025",
      color: "from-red-500 to-orange-400",
    },
    {
      icon: <FiGlobe className="text-3xl" />,
      title: "Sustainability Policy",
      description:
        "Our dedication to environmentally responsible practices that minimize our ecological footprint while maximizing service quality.",
      detailedDescription:
        "We integrate sustainable practices throughout our operations, from supply chain management to service delivery, contributing to a healthier planet.",
      points: [
        "Eco-friendly cleaning products",
        "Water and energy conservation",
        "Waste reduction strategies",
        "Sustainable supply chain",
        "Carbon footprint monitoring",
        "Biodiversity protection",
      ],
      compliance: ["UN SDGs", "Paris Agreement"],
      lastUpdated: "11-06-2025",
      color: "from-teal-500 to-green-400",
    },
    {
      icon: <FiHeart className="text-3xl" />,
      title: "Quality Guarantee",
      description:
        "Uncompromising standards that ensure every service exceeds expectations, backed by our 100% satisfaction guarantee.",
      detailedDescription:
        "Our quality management system ensures consistent excellence across all services. We measure, analyze, and improve our processes continuously.",
      points: [
        "Service quality standards",
        "Customer satisfaction metrics",
        "Continuous improvement",
        "Warranty and guarantees",
        "Quality audits",
        "Performance benchmarks",
      ],
      compliance: ["ISO 9001", "Six Sigma"],
      lastUpdated: "11-06-2025",
      color: "from-pink-500 to-rose-400",
    },
    {
      icon: <FiStar className="text-3xl" />,
      title: "Service Excellence",
      description:
        "Our unwavering dedication to delivering exceptional quality and exceeding customer expectations in every service.",
      detailedDescription:
        "This policy defines our commitment to service excellence through rigorous standards, continuous improvement, and customer-centric approaches that ensure consistent outstanding performance.",
      points: [
        "Quality assurance protocols",
        "Customer feedback integration",
        "Service delivery standards",
        "Performance metrics",
        "Continuous training",
        "Innovation adoption",
      ],
      compliance: ["ISO 9001", "Customer First"],
      lastUpdated: "11-06-2025",
      color: "from-yellow-500 to-amber-400",
    },
  ];

  const gridLayouts = [
    "md:col-span-2 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-2 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-2 md:row-span-1",
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <img
            src={favicon}
            alt="SpiffyFox Professional Standards"
            className="h-full w-full object-cover"
            loading="eager"
          />
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/70 to-blue-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: textY }}
          className="relative z-10 flex h-full items-center justify-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-6xl text-center text-white"
          >
            <motion.h1
              className="font-cinzel mb-6 text-6xl font-bold tracking-tight md:text-8xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Our Commitment
            </motion.h1>
            <motion.p
              className="font-cormorant mb-8 text-2xl leading-relaxed opacity-95 md:text-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Excellence, Integrity, and Transparency in Every Detail
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mx-auto h-1 w-32 origin-center transform bg-gradient-to-r from-purple-400 to-pink-400"
            />

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="mt-12 flex flex-wrap justify-center gap-8"
            >
              {[
                { number: "100%", label: "Satisfaction Guarantee" },
                { number: "24/7", label: "Support" },
                { number: "50+", label: "Policies" },
                { number: "ISO", label: "Certified" },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="font-cinzel text-3xl font-bold text-purple-300">
                    {stat.number}
                  </div>
                  <div className="font-quicksand text-sm opacity-80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center text-white"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex h-12 w-8 items-start justify-center rounded-full border-2 border-white/50"
            >
              <div className="mt-2 h-3 w-1 rounded-full bg-white" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Policy Grid Section */}
      <section className="relative z-20 bg-gradient-to-b from-white to-gray-50 px-4 py-24">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <FiShield className="text-2xl text-white" />
            </motion.div>
            <h2 className="font-cinzel mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Our Policies & Standards
            </h2>
            <div className="mx-auto mb-8 h-1.5 w-40 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
            <p className="font-cormorant mx-auto max-w-4xl text-2xl leading-relaxed text-gray-600">
              At SpiffyFox, exceptional service begins with clear standards and
              unwavering commitment to our values. Explore our comprehensive
              policies that guide every aspect of our operation.
            </p>
          </motion.div>

          {/* Enhanced Policy Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-3">
            {policySections.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{
                  y: -12,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                className={`group hover:shadow-3xl relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl transition-all duration-500 ${gridLayouts[index]}`}
                onClick={() =>
                  setActivePolicy(activePolicy === index ? null : index)
                }
              >
                {/* Animated Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${policy.color} opacity-0 transition-all duration-700 group-hover:opacity-5`}
                />

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 blur-xl transition-all duration-700 group-hover:opacity-20" />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col p-8">
                  {/* Header */}
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex-1">
                      <div
                        className={`mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${policy.color} p-3 text-white shadow-lg`}
                      >
                        {policy.icon}
                      </div>
                      <h3 className="font-cinzel text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-gray-800">
                        {policy.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {policy.compliance.map((comp) => (
                          <span
                            key={comp}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: activePolicy === index ? 180 : 0 }}
                      className="ml-4 text-gray-400"
                    >
                      <FiChevronDown className="text-xl" />
                    </motion.div>
                  </div>

                  {/* Description */}
                  <p className="font-quicksand mb-6 flex-grow leading-relaxed text-gray-600">
                    {policy.description}
                  </p>

                  {/* Points */}
                  <ul className="space-y-3">
                    {policy.points.slice(0, 3).map((point, pointIndex) => (
                      <motion.li
                        key={pointIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: pointIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="font-quicksand flex items-center text-sm text-gray-500"
                      >
                        <FiCheckCircle className="mr-3 flex-shrink-0 text-green-400" />
                        {point}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="font-quicksand text-xs text-gray-400">
                      Updated {policy.lastUpdated}
                    </span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center text-sm font-medium text-purple-600"
                    >
                      Learn more <FiArrowRight className="ml-1" />
                    </motion.div>
                  </div>

                  {/* Hover Border Effect */}
                  <div
                    className={`absolute bottom-0 left-0 h-1.5 w-full scale-x-0 transform bg-gradient-to-r ${policy.color} transition-transform duration-500 group-hover:scale-x-100`}
                  />
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {activePolicy === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100 bg-gray-50"
                    >
                      <div className="p-8">
                        <h4 className="font-cinzel mb-4 text-lg font-bold text-gray-900">
                          Detailed Overview
                        </h4>
                        <p className="font-quicksand mb-6 leading-relaxed text-gray-600">
                          {policy.detailedDescription}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          {policy.points.map((point, idx) => (
                            <div key={idx} className="flex items-center">
                              <FiCheckCircle className="mr-2 flex-shrink-0 text-green-500" />
                              <span className="font-quicksand text-sm text-gray-600">
                                {point}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <div className="relative overflow-hidden rounded-4xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-16 shadow-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple-400 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-pink-400 blur-3xl" />
              </div>

              <div className="relative z-10 text-center">
                <h3 className="font-cinzel mb-6 text-4xl font-bold text-gray-900">
                  Need More Information?
                </h3>
                <p className="font-cormorant mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-600">
                  Our team is ready to provide detailed explanations and ensure
                  complete transparency in all our operations. Download our full
                  policy documents or schedule a consultation.
                </p>
                <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="font-quicksand flex items-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-5 font-semibold text-white shadow-xl transition-all duration-300"
                  >
                    <FiMail className="mr-3" />

                    <Link to="/contact">Contact Our Team</Link>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="font-quicksand flex items-center rounded-2xl border-2 border-purple-600 bg-white px-10 py-5 font-semibold text-purple-600 transition-all duration-300 hover:bg-purple-50"
                  >
                    <FiDownload className="mr-3" />
                    Download Full Policy PDF
                  </motion.button>
                </div>
                <p className="font-quicksand mt-8 text-sm text-gray-500">
                  All documents available in multiple languages and formats
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Policy;
