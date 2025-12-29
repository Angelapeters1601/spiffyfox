import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase2 } from "../services/supabaseClient";
import img from "../assets/join.png";
import { Link } from "react-router-dom";

const Join = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    address: "",
    zip_code: "",
    gender: "",
    phone: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const roles = [
    "Residential Cleaning Specialist",
    "Commercial Cleaning Technician",
    "Deep Cleaning Expert",
    "Organization Consultant",
    "Power Washing Operator",
    "Junk Removal Specialist",
  ];

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(
      () => setNotification({ show: false, type: "", message: "" }),
      5000,
    );
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = "Full name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // ZIP Code validation
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!formData.zip_code) {
      newErrors.zip_code = "ZIP code is required";
    } else if (!zipRegex.test(formData.zip_code)) {
      newErrors.zip_code = "Please enter a valid ZIP code";
    }

    // Phone validation
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      phone: formatted,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification(
        "error",
        "Please fix the errors in the form before submitting.",
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase2.from("join_applications").insert([
        {
          fullname: formData.fullname,
          email: formData.email,
          address: formData.address,
          zip_code: formData.zip_code,
          gender: formData.gender,
          phone: formData.phone,
          role: formData.role,
          status: "pending",
        },
      ]);

      if (error) throw error;

      // Reset form
      setFormData({
        fullname: "",
        email: "",
        address: "",
        zip_code: "",
        gender: "",
        phone: "",
        role: "",
      });

      showNotification(
        "success",
        "Application submitted successfully! We'll review your application and get back to you soon.",
      );
    } catch (error) {
      console.error("Error submitting application:", error);
      showNotification(
        "error",
        "Failed to submit application. Please try again or contact us directly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transform rounded-xl px-6 py-4 shadow-lg ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              {notification.type === "success" ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <span className="font-quicksand font-medium">
                {notification.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with View Profile Button */}
      <div className="relative">
        <div className="font-cinzel spiffy-bg-dark relative flex items-center justify-center overflow-hidden p-12 text-4xl font-bold text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center"
          >
            <h1 className="mb-4 text-5xl sm:text-6xl">Join Our Team</h1>
            <p className="font-quicksand mx-auto max-w-2xl text-xl opacity-90">
              Build your career with SpiffyFox and help us transform spaces and
              lives
            </p>

            {/* View Profile Button - Beautifully placed in hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8"
            >
              <Link
                to="/client"
                className="group font-quicksand relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-white/20 to-white/10 px-8 py-4 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:backdrop-blur-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-transparent to-purple-600/30 transition-all duration-300 group-hover:translate-x-full"></div>
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="relative">View Your Profile</span>
                <svg
                  className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        {/* Background Image */}
        <div className="h-96 overflow-hidden">
          <img
            src={img}
            alt="SpiffyFox Team"
            className="h-full w-full scale-105 transform object-cover"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
              {/* Header with Floating View Profile Button */}
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h2 className="font-cinzel mb-2 text-3xl font-bold text-gray-900">
                    Application Form
                  </h2>
                  <p className="font-quicksand text-gray-600">
                    Complete the form below to start your journey with
                    SpiffyFox. We're excited to learn more about you!
                  </p>
                </div>

                {/* Desktop View Profile Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:block"
                >
                  <Link
                    to="/client"
                    className="group font-quicksand relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-3 font-semibold text-purple-700 transition-all duration-300 hover:shadow-lg"
                  >
                    <svg
                      className="h-5 w-5 text-purple-600 transition-transform duration-300 group-hover:rotate-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>View Profile</span>
                  </Link>
                </motion.div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className={`font-quicksand w-full rounded-xl border px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                      errors.fullname
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullname && (
                    <p className="font-quicksand mt-1 text-sm text-red-600">
                      {errors.fullname}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Email */}
                  <div>
                    <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`font-quicksand w-full rounded-xl border px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                        errors.email
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="font-quicksand mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={`font-quicksand w-full rounded-xl border px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                        errors.phone
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="(555) 123-4567"
                      maxLength="14"
                    />
                    {errors.phone && (
                      <p className="font-quicksand mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`font-quicksand w-full rounded-xl border px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                      errors.address
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="font-quicksand mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* ZIP Code */}
                  <div>
                    <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleInputChange}
                      className={`font-quicksand w-full rounded-xl border px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                        errors.zip_code
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="12345"
                      maxLength="10"
                    />
                    {errors.zip_code && (
                      <p className="font-quicksand mt-1 text-sm text-red-600">
                        {errors.zip_code}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="font-quicksand w-full cursor-pointer rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                    Desired Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`font-quicksand w-full cursor-pointer rounded-xl border px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                      errors.role
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="font-quicksand mt-1 text-sm text-red-600">
                      {errors.role}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="font-quicksand spiffy-bg-dark w-full transform cursor-pointer rounded-xl px-8 py-4 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-purple-700 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-purple-400"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Submitting Application...</span>
                      </div>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-6"
          >
            {/* Quick Access Card */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white shadow-xl">
              <h3 className="font-cinzel mb-4 text-xl font-bold">
                Quick Access
              </h3>
              <p className="font-quicksand mb-4 opacity-90">
                Already have a profile? Check your application status and update
                your information.
              </p>
              <Link
                to="/client"
                className="group font-quicksand flex w-full items-center justify-center gap-2 rounded-xl bg-white/20 px-4 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:shadow-lg"
              >
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>View Your Profile</span>
                <svg
                  className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Why Join Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
              <h3 className="font-cinzel mb-4 text-xl font-bold text-gray-900">
                Why Join SpiffyFox?
              </h3>
              <ul className="font-quicksand space-y-3 text-gray-600">
                <li className="flex items-start space-x-3">
                  <div className="spiffy-bg-light mt-1 rounded-full p-1">
                    <svg
                      className="h-4 w-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>Competitive pay with performance bonuses</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="spiffy-bg-light mt-1 rounded-full p-1">
                    <svg
                      className="h-4 w-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>Flexible scheduling options</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="spiffy-bg-light mt-1 rounded-full p-1">
                    <svg
                      className="h-4 w-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>Professional training & development</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="spiffy-bg-light mt-1 rounded-full p-1">
                    <svg
                      className="h-4 w-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>Supportive team environment</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="spiffy-bg-light mt-1 rounded-full p-1">
                    <svg
                      className="h-4 w-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>Career growth opportunities</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-xl">
              <h3 className="font-cinzel mb-4 text-xl font-bold">
                Have Questions?
              </h3>
              <p className="font-quicksand mb-4 opacity-90">
                Our hiring team is here to help you through the application
                process.
              </p>
              <div className="space-y-2">
                <p className="font-quicksand flex items-center space-x-2">
                  <svg
                    className="h-5 w-5"
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
                  <span>(202) 670-6164</span>
                </p>
                <p className="font-quicksand flex items-center space-x-2">
                  <svg
                    className="h-5 w-5"
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
                </p>
              </div>
            </div>

            {/* Process Timeline */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
              <h3 className="font-cinzel mb-4 text-xl font-bold text-gray-900">
                Application Process
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="spiffy-bg-light flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-purple-600">
                    1
                  </div>
                  <div>
                    <p className="font-quicksand font-medium text-gray-900">
                      Submit Application
                    </p>
                    <p className="font-quicksand text-sm text-gray-600">
                      We'll review your details
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="spiffy-bg-light flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-purple-600">
                    2
                  </div>
                  <div>
                    <p className="font-quicksand font-medium text-gray-900">
                      Phone Screening
                    </p>
                    <p className="font-quicksand text-sm text-gray-600">
                      Brief introductory call
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="spiffy-bg-light flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-purple-600">
                    3
                  </div>
                  <div>
                    <p className="font-quicksand font-medium text-gray-900">
                      In-Person Interview
                    </p>
                    <p className="font-quicksand text-sm text-gray-600">
                      Meet the team
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="spiffy-bg-light flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-purple-600">
                    4
                  </div>
                  <div>
                    <p className="font-quicksand font-medium text-gray-900">
                      Job Offer
                    </p>
                    <p className="font-quicksand text-sm text-gray-600">
                      Welcome to the team!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Join;
