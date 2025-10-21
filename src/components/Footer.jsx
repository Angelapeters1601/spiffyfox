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

  return (
    <footer className="spiffy-bg-medium mt-12 px-4 py-10 leading-relaxed tracking-wide text-gray-100">
      <div className="container mx-auto flex max-w-6xl flex-col items-center gap-10">
        {/* Logo + Links + Socials */}
        <div className="flex w-full flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <Link to="/">
              <img
                src={logo}
                alt="SpiffyFox logo"
                className="h-12 w-12 rounded-full bg-purple-50 object-contain p-1 shadow-lg shadow-purple-400 transition-transform hover:scale-105"
              />
            </Link>
            <h3 className="font-cinzel text-xl font-bold text-white">
              SpiffyFox
            </h3>
            <p className="font-lora max-w-md text-center text-sm text-gray-200">
              Premium Services & Expert Tips for All Your Needs
            </p>
          </div>

          {/* Quick Links */}
          <div className="spiffy-bg-light w-full max-w-3xl rounded-lg p-4">
            <h4 className="font-cormorant mb-3 text-center font-semibold text-white">
              Quick Navigation
            </h4>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-cormorant hover:spiffy-text text-sm whitespace-nowrap text-white underline-offset-2 transition-colors hover:underline"
                >
                  {link.text}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center">
            <h4 className="font-cormorant spiffy-bg-light mb-3 rounded-full p-2 font-semibold text-white">
              Follow SpiffyFox 👣
            </h4>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: <FaFacebook />, label: "Facebook" },
                { icon: <FaTwitter />, label: "Twitter" },
                { icon: <FaLinkedin />, label: "LinkedIn" },
                { icon: <FaYoutube />, label: "YouTube" },
                { icon: <FaInstagram />, label: "Instagram" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:spiffy-text transform cursor-pointer text-white transition-colors duration-200 hover:scale-110 hover:text-purple-200"
                  aria-label={social.label}
                >
                  <span className="text-2xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="font-cormorant flex flex-col flex-wrap items-center justify-center gap-6 text-center md:flex-row">
          {/* Phone */}
          <div className="group flex items-center gap-2">
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
          </div>

          {/* SMS */}
          <div className="group flex items-center gap-2">
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
          </div>

          {/* Email */}
          <div className="group flex items-center gap-2">
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
          </div>

          {/* Address */}
          <div className="group flex items-start justify-center gap-2">
            <LocationIcon className="hover:!spiffy-text mt-0.5 !text-lg !text-white !transition-colors !duration-200" />
            <p className="font-cormorant text-sm text-white">
              1 SpiffyFox Way, Premium Plaza, DE 19809
            </p>
          </div>
        </div>

        {/* Business Hours */}
        <div className="font-cormorant spiffy-bg-medium max-w-md rounded-lg p-4 text-center">
          <h4 className="font-cormorant mb-2 font-semibold text-white">
            Business Hours
          </h4>
          <p className="text-sm text-gray-200">
            Monday - Friday: 8:00 AM - 8:00 PM
          </p>
          <p className="text-sm text-gray-200">Saturday: Closed</p>
          <p className="text-sm text-gray-200">Sunday: 9: 00 AM - 5:00 PM</p>
        </div>

        {/* Copyright */}
        <div className="w-full border-t border-purple-400/30 pt-6 text-center">
          <p className="font-cormorant text-sm tracking-wide text-gray-200">
            &copy; {new Date().getFullYear()} SpiffyFox Corporation. All rights
            reserved.
          </p>
          <p className="font-cormorant mt-1 text-xs text-gray-300">
            Premium Solutions for Modern Living.
          </p>
        </div>
      </div>
    </footer>
  );
}
