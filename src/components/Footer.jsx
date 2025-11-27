import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import {
  Phone as PhoneIcon,
  Sms as SmsIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

import logo from "../assets/spiffyLogo2.jpg";

export default function Footer() {
  const navLinks = [
    { text: "Home", path: "/" },
    { text: "Tips", path: "/tips" },
    { text: "Services", path: "/services" },
    { text: "Location", path: "/location" },
    { text: "Policy", path: "/policy" },
    { text: "Join", path: "/join" },
    { text: "Contact", path: "/contact" },
  ];

  // Animation variants
  const footerVariants = {
    hidden: {
      opacity: 0,
      y: 80,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const socialIconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: 0.5,
      },
    },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
      },
    },
    tap: {
      scale: 0.9,
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.5,
      },
    }),
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={footerVariants}
      className="spiffy-bg-medium mt-12 px-4 py-10 leading-relaxed tracking-wide text-gray-100"
    >
      <div className="container mx-auto flex max-w-6xl flex-col items-center gap-10">
        {/* Logo + Links + Socials */}
        <motion.div
          variants={itemVariants}
          className="flex w-full flex-col items-center gap-8"
        >
          {/* Logo */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-2"
          >
            <Link to="/">
              <motion.img
                whileHover={{
                  scale: 1.05,
                  rotate: 2,
                  boxShadow: "0 10px 30px rgba(177, 156, 217, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                src={logo}
                alt="SpiffyFox logo"
                className="h-12 w-12 rounded-full bg-purple-50 object-contain p-1 shadow-lg shadow-purple-400"
              />
            </Link>
            <motion.h3
              variants={itemVariants}
              className="font-cinzel text-xl font-bold text-white"
            >
              SpiffyFox
            </motion.h3>
            <motion.p
              variants={itemVariants}
              className="font-lora max-w-md text-center text-sm text-gray-200"
            >
              Premium Services & Expert Tips for All Your Needs
            </motion.p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={itemVariants}
            className="spiffy-bg-light w-full max-w-3xl rounded-lg p-4"
          >
            <motion.h4
              variants={itemVariants}
              className="font-cormorant mb-3 text-center font-semibold text-white"
            >
              Quick Navigation
            </motion.h4>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  custom={index}
                  variants={linkVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Link
                    to={link.path}
                    className="font-cormorant hover:spiffy-text text-sm whitespace-nowrap text-white underline-offset-2 transition-colors hover:underline"
                  >
                    {link.text}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          {/* Social Media */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center"
          >
            <motion.h4
              variants={itemVariants}
              className="font-cormorant spiffy-bg-light mb-3 rounded-full p-2 font-semibold text-white"
            >
              Follow SpiffyFox 👣
            </motion.h4>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: <FaFacebook />, label: "Facebook" },
                { icon: <FaTwitter />, label: "Twitter" },
                { icon: <FaLinkedin />, label: "LinkedIn" },
                { icon: <FaYoutube />, label: "YouTube" },
                { icon: <FaInstagram />, label: "Instagram" },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  variants={socialIconVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  whileTap="tap"
                  viewport={{ once: true }}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:spiffy-text transform cursor-pointer text-white transition-colors duration-200 hover:text-purple-200"
                  aria-label={social.label}
                >
                  <span className="text-2xl">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          variants={itemVariants}
          className="font-cormorant flex flex-col flex-wrap items-center justify-center gap-6 text-center md:flex-row"
        >
          {/* Phone */}
          <motion.div
            variants={itemVariants}
            className="group flex items-center gap-2"
          >
            <PhoneIcon
              className="group-hover:!spiffy-text !text-white !transition-colors !duration-200"
              fontSize="small"
            />
            <span className="font-cormorant font-semibold">Call:</span>
            <a
              href="tel:+12026706161"
              className="hover:spiffy-text text-white underline-offset-2 transition-colors duration-200 hover:underline"
            >
              (202) 670-6164
            </a>
          </motion.div>

          {/* SMS */}
          <motion.div
            variants={itemVariants}
            className="group flex items-center gap-2"
          >
            <SmsIcon
              className="group-hover:!spiffy-text !text-white !transition-colors !duration-200"
              fontSize="small"
            />
            <span className="font-semibold">Text:</span>
            <a
              href="sms:+13027037500"
              className="hover:spiffy-text text-white underline-offset-2 transition-colors duration-200 hover:underline"
            >
              (302) 703-7595
            </a>
          </motion.div>

          {/* Email */}
          <motion.div
            variants={itemVariants}
            className="group flex items-center gap-2"
          >
            <EmailIcon
              className="group-hover:!spiffy-text !text-white !transition-colors !duration-200"
              fontSize="small"
            />
            <span className="font-semibold">Email:</span>
            <a
              href="mailto:help@spiffyfox.com"
              className="hover:spiffy-text text-white underline-offset-2 transition-colors duration-200 hover:underline"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              help@spiffyfox.com
            </a>
          </motion.div>

          {/* Address */}
          <motion.div
            variants={itemVariants}
            className="group flex items-start justify-center gap-2"
          >
            <LocationIcon className="hover:!spiffy-text mt-0.5 !text-lg !text-white !transition-colors !duration-200" />
            <p className="font-cormorant text-sm text-white">
              1 SpiffyFox Way, Premium Plaza, DE 19809
            </p>
          </motion.div>
        </motion.div>

        {/* Business Hours */}
        <motion.div
          variants={itemVariants}
          className="font-cormorant spiffy-bg-medium max-w-md rounded-lg p-4 text-center"
        >
          <motion.h4
            variants={itemVariants}
            className="font-cormorant mb-2 font-semibold text-white"
          >
            Business Hours
          </motion.h4>
          <motion.p variants={itemVariants} className="text-sm text-gray-200">
            Monday - Friday: 8:00 AM - 8:00 PM
          </motion.p>
          <motion.p variants={itemVariants} className="text-sm text-gray-200">
            Saturday: Closed
          </motion.p>
          <motion.p variants={itemVariants} className="text-sm text-gray-200">
            Sunday: 9:00 AM - 5:00 PM
          </motion.p>
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="w-full border-t border-purple-400/30 pt-6 text-center"
        >
          <motion.p
            variants={itemVariants}
            className="font-cormorant text-sm tracking-wide text-gray-200"
          >
            &copy; {new Date().getFullYear()} SpiffyFox Corporation. All rights
            reserved.
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="font-cormorant mt-1 text-xs text-gray-300"
          >
            Premium Solutions for Modern Living.
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
