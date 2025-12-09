import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiBriefcase,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTool,
  FiShield,
  FiCheck,
  FiArrowRight,
  FiAward,
  FiArrowLeft,
} from "react-icons/fi";
import img1 from "../assets/img1.jpg";

const Contractor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [submitMessage, setSubmitMessage] = useState("");

  // Initialize form data with all fields and proper types
  const initialFormData = useMemo(
    () => ({
      // Personal Information
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "US",

      // Job Information
      job_applied: "",
      experience_years: null,
      expected_salary: null,

      // Services
      services_offered: [],
      availability: "Immediate",

      // Equipment & Transportation
      has_vehicle: false,
      vehicle_type: "",
      has_equipment: false,
    }),
    [],
  );

  const [formData, setFormData] = useState(initialFormData);

  // List of countries for dropdown
  const countries = [
    "US",
    "CA",
    "MX",
    "UK",
    "DE",
    "FR",
    "IT",
    "ES",
    "NL",
    "BE",
    "CH",
    "AT",
    "AU",
    "NZ",
    "JP",
    "KR",
    "CN",
    "IN",
    "BR",
    "AR",
    "CO",
    "PE",
    "CL",
    "ZA",
    "NG",
    "EG",
    "SA",
    "AE",
    "IL",
    "TR",
  ];

  const countryNames = {
    US: "United States",
    CA: "Canada",
    MX: "Mexico",
    UK: "United Kingdom",
    DE: "Germany",
    FR: "France",
    IT: "Italy",
    ES: "Spain",
    NL: "Netherlands",
    BE: "Belgium",
    CH: "Switzerland",
    AT: "Austria",
    AU: "Australia",
    NZ: "New Zealand",
    JP: "Japan",
    KR: "South Korea",
    CN: "China",
    IN: "India",
    BR: "Brazil",
    AR: "Argentina",
    CO: "Colombia",
    PE: "Peru",
    CL: "Chile",
    ZA: "South Africa",
    NG: "Nigeria",
    EG: "Egypt",
    SA: "Saudi Arabia",
    AE: "United Arab Emirates",
    IL: "Israel",
    TR: "Turkey",
  };

  // Debounced input handler with proper type conversion
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    let processedValue;

    if (type === "checkbox") {
      processedValue = checked;
    } else if (type === "number") {
      processedValue = value === "" ? null : Number(value);
    } else {
      processedValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  }, []);

  // Special handler for number fields to prevent NaN
  const handleNumberChange = useCallback((e) => {
    const { name, value } = e.target;
    const numValue = value === "" ? null : Number(value);

    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  }, []);

  const handleServiceToggle = useCallback((service) => {
    setFormData((prev) => {
      const services = [...prev.services_offered];
      if (services.includes(service)) {
        return {
          ...prev,
          services_offered: services.filter((s) => s !== service),
        };
      } else {
        return { ...prev, services_offered: [...services, service] };
      }
    });
  }, []);

  const validateStep = useCallback(
    (step) => {
      switch (step) {
        case 1:
          return (
            formData.first_name.trim() &&
            formData.last_name.trim() &&
            formData.email.trim() &&
            formData.phone.trim() &&
            formData.address.trim()
          );
        case 2:
          return formData.job_applied && formData.experience_years !== null;
        case 3:
          return formData.services_offered.length > 0;
        default:
          return true;
      }
    },
    [formData],
  );

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      setSubmitMessage("");
    } else {
      setSubmitMessage("Please fill in all required fields before proceeding.");
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setSubmitMessage("");
  }, []);

  // Prepare data for Supabase submission
  const prepareSubmissionData = useCallback(() => {
    // Create a clean copy of formData with proper type conversions
    const submissionData = { ...formData };

    // Ensure all boolean fields are proper booleans
    submissionData.has_vehicle = Boolean(formData.has_vehicle);
    submissionData.has_equipment = Boolean(formData.has_equipment);

    // Ensure arrays are properly formatted
    if (!Array.isArray(submissionData.services_offered)) {
      submissionData.services_offered = [];
    }

    // Convert empty strings to null for optional fields
    const optionalFields = ["vehicle_type"];

    optionalFields.forEach((field) => {
      if (submissionData[field] === "") {
        submissionData[field] = null;
      }
    });

    // Add timestamp
    submissionData.updated_at = new Date().toISOString();
    // Add application date
    submissionData.application_date = new Date().toISOString().split("T")[0];
    // Add default application status
    submissionData.application_status = "new";

    return submissionData;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage("");

    try {
      const submissionData = prepareSubmissionData();

      console.log("Submitting data:", submissionData);

      const { data, error: submitError } = await supabase
        .from("contractors")
        .insert([submissionData])
        .select();

      if (submitError) {
        console.error("Supabase error:", submitError);
        throw submitError;
      }

      // Only set success to true, don't navigate automatically
      setSuccess(true);
      setSubmitMessage(
        "Application submitted successfully! Thank you for applying.",
      );
    } catch (err) {
      console.error("Error submitting application:", err);
      setSubmitMessage(
        err.message ||
          "Failed to submit application. Please check all fields and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Memoized step components to prevent re-renders
  const steps = useMemo(
    () => [
      { number: 1, title: "Personal Info", icon: FiUser },
      { number: 2, title: "Job Details", icon: FiBriefcase },
      { number: 3, title: "Services", icon: FiTool },
      { number: 4, title: "Review & Submit", icon: FiCheckCircle },
    ],
    [],
  );

  const jobTypes = useMemo(
    () => [
      { value: "residential_cleaning", label: "Residential Cleaning" },
      { value: "commercial_cleaning", label: "Commercial Cleaning" },
      { value: "deep_cleaning", label: "Deep Cleaning" },
      { value: "organization", label: "Organization" },
      { value: "powerwashing", label: "Power Washing" },
      { value: "junk_removal", label: "Junk Removal" },
      { value: "packing_unpacking", label: "Packing & Unpacking" },
      { value: "personal_assistance", label: "Personal Assistance" },
    ],
    [],
  );

  const servicesList = useMemo(
    () => [
      "residential_cleaning",
      "commercial_cleaning",
      "deep_cleaning",
      "organization",
      "powerwashing",
      "junk_removal",
      "packing_unpacking",
      "personal_assistance",
    ],
    [],
  );

  const availabilityOptions = useMemo(
    () => [
      "Immediate",
      "Within 1 week",
      "Within 2 weeks",
      "Within 1 month",
      "Flexible",
      "Part-time only",
    ],
    [],
  );

  const formatJobType = useCallback((jobType) => {
    const jobTypesMap = {
      residential_cleaning: "Residential Cleaning",
      commercial_cleaning: "Commercial Cleaning",
      deep_cleaning: "Deep Cleaning",
      organization: "Organization",
      powerwashing: "Power Washing",
      junk_removal: "Junk Removal",
      packing_unpacking: "Packing & Unpacking",
      personal_assistance: "Personal Assistance",
    };
    return jobTypesMap[jobType] || jobType;
  }, []);

  // Step Indicator Component
  const StepIndicator = useMemo(
    () => (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 md:h-12 md:w-12 ${
                    currentStep >= step.number
                      ? "border-purple-600 bg-purple-600 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  } ${currentStep === step.number ? "ring-4 ring-purple-200" : ""}`}
                >
                  <step.icon className="text-lg" />
                </div>
                <span
                  className={`font-quicksand mt-2 text-xs font-medium md:text-sm ${
                    currentStep >= step.number
                      ? "text-purple-700"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {step.number < steps.length && (
                <div className="mx-2 h-1 flex-1 md:mx-4">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      currentStep > step.number
                        ? "bg-purple-600"
                        : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    ),
    [currentStep, steps],
  );

  // Step Components with optimized rendering
  const Step1 = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="mb-6">
          <h2 className="font-cinzel mb-2 text-2xl font-bold text-gray-900">
            Personal Information
          </h2>
          <p className="font-quicksand text-gray-600">
            Tell us about yourself so we can get in touch with you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div>
            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
              className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
              placeholder="John"
            />
          </div>
          <div>
            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
              className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
              placeholder="Doe"
            />
          </div>
          <div className="md:col-span-2">
            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
              placeholder="(123) 456-7890"
            />
          </div>
          <div>
            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
              Country *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
            >
              {countries.map((code) => (
                <option key={code} value={code}>
                  {countryNames[code] || code}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
              Street Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
              placeholder="123 Main St"
            />
          </div>
          <div>
            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
              placeholder="New York"
            />
          </div>
          <div>
            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
              State/Province *
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
              className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
              placeholder="NY"
            />
          </div>
          <div>
            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
              ZIP/Postal Code *
            </label>
            <input
              type="text"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleInputChange}
              required
              className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
              placeholder="10001"
            />
          </div>
        </div>
      </motion.div>
    ),
    [formData, handleInputChange, countries, countryNames],
  );

  const Step2 = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="mb-6">
          <h2 className="font-cinzel mb-2 text-2xl font-bold text-gray-900">
            Job Details
          </h2>
          <p className="font-quicksand text-gray-600">
            Tell us about the position you're interested in and your experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div className="md:col-span-2">
            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
              Position You're Applying For *
            </label>
            <select
              name="job_applied"
              value={formData.job_applied}
              onChange={handleInputChange}
              required
              className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
            >
              <option value="">Select a position</option>
              {jobTypes.map((job) => (
                <option key={job.value} value={job.value}>
                  {job.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
              Years of Experience *
            </label>
            <input
              type="number"
              name="experience_years"
              value={
                formData.experience_years === null
                  ? ""
                  : formData.experience_years
              }
              onChange={handleNumberChange}
              required
              min="0"
              max="50"
              className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
              placeholder="5"
            />
          </div>
          <div>
            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
              Expected Salary (per hour/year)
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                name="expected_salary"
                value={
                  formData.expected_salary === null
                    ? ""
                    : formData.expected_salary
                }
                onChange={handleNumberChange}
                className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pl-8 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
                placeholder="50000"
              />
            </div>
          </div>
        </div>
      </motion.div>
    ),
    [formData, handleInputChange, handleNumberChange, jobTypes],
  );

  const Step3 = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="mb-6">
          <h2 className="font-cinzel mb-2 text-2xl font-bold text-gray-900">
            Services & Availability
          </h2>
          <p className="font-quicksand text-gray-600">
            Select the services you can provide and tell us about your
            availability.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="font-quicksand mb-4 block text-sm font-medium text-gray-700">
              Services You Can Provide *
            </label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {servicesList.map((service) => {
                const isChecked = formData.services_offered.includes(service);
                return (
                  <div
                    key={service}
                    onClick={() => handleServiceToggle(service)}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-all duration-200 md:rounded-xl ${
                      isChecked
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full transition-all md:h-6 md:w-6 ${
                          isChecked ? "bg-purple-600" : "bg-gray-200"
                        }`}
                      >
                        {isChecked && (
                          <FiCheck className="text-xs text-white md:text-sm" />
                        )}
                      </div>
                      <span className="font-quicksand text-sm font-medium text-gray-900 md:text-base">
                        {formatJobType(service)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
              When Can You Start? *
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
            >
              {availabilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div className="space-y-4">
              <h3 className="font-cinzel text-lg font-semibold text-gray-800">
                Equipment & Transportation
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-quicksand text-gray-700">
                    Do you have a vehicle?
                  </label>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      name="has_vehicle"
                      checked={formData.has_vehicle}
                      onChange={handleInputChange}
                      className="peer sr-only"
                    />
                    <div className="peer h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-purple-600 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white md:h-6 md:w-11 md:after:top-0.5 md:after:left-0.5 md:after:h-5 md:after:w-5"></div>
                  </label>
                </div>
                {formData.has_vehicle && (
                  <div>
                    <input
                      type="text"
                      name="vehicle_type"
                      value={formData.vehicle_type || ""}
                      onChange={handleInputChange}
                      className="font-quicksand w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none md:rounded-xl"
                      placeholder="What type of vehicle?"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <label className="font-quicksand text-gray-700">
                    Do you have your own equipment?
                  </label>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      name="has_equipment"
                      checked={formData.has_equipment}
                      onChange={handleInputChange}
                      className="peer sr-only"
                    />
                    <div className="peer h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-purple-600 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white md:h-6 md:w-11 md:after:top-0.5 md:after:left-0.5 md:after:h-5 md:after:w-5"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    ),
    [
      formData,
      handleInputChange,
      handleServiceToggle,
      servicesList,
      availabilityOptions,
      formatJobType,
    ],
  );

  const Step4 = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="mb-6">
          <h2 className="font-cinzel mb-2 text-2xl font-bold text-gray-900">
            Review Your Application
          </h2>
          <p className="font-quicksand text-gray-600">
            Please review all information before submitting your application.
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Info Summary */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 md:rounded-xl md:p-6">
            <h3 className="font-cinzel mb-4 text-lg font-semibold text-gray-800">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                  Name
                </p>
                <p className="font-quicksand text-sm font-medium text-gray-900 md:text-base">
                  {formData.first_name} {formData.last_name}
                </p>
              </div>
              <div>
                <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                  Email
                </p>
                <p className="font-quicksand text-sm font-medium text-gray-900 md:text-base">
                  {formData.email}
                </p>
              </div>
              <div>
                <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                  Phone
                </p>
                <p className="font-quicksand text-sm font-medium text-gray-900 md:text-base">
                  {formData.phone}
                </p>
              </div>
              <div>
                <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                  Location
                </p>
                <p className="font-quicksand text-sm font-medium text-gray-900 md:text-base">
                  {formData.city}, {formData.state} {formData.zip_code},{" "}
                  {countryNames[formData.country]}
                </p>
              </div>
            </div>
          </div>

          {/* Job Details Summary */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 md:rounded-xl md:p-6">
            <h3 className="font-cinzel mb-4 text-lg font-semibold text-gray-800">
              Job Details
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                  Position
                </p>
                <p className="font-quicksand text-sm font-medium text-gray-900 md:text-base">
                  {formatJobType(formData.job_applied) || "Not specified"}
                </p>
              </div>
              <div>
                <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                  Experience
                </p>
                <p className="font-quicksand text-sm font-medium text-gray-900 md:text-base">
                  {formData.experience_years || "0"} years
                </p>
              </div>
              <div>
                <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                  Expected Salary
                </p>
                <p className="font-quicksand text-sm font-medium text-gray-900 md:text-base">
                  {formData.expected_salary
                    ? `$${formData.expected_salary.toLocaleString()}`
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Services Summary */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 md:rounded-xl md:p-6">
            <h3 className="font-cinzel mb-4 text-lg font-semibold text-gray-800">
              Services & Availability
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-quicksand mb-2 text-xs text-gray-600 md:text-sm">
                  Services Offered
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.services_offered.length > 0 ? (
                    formData.services_offered.map((service) => (
                      <span
                        key={service}
                        className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 md:text-sm"
                      >
                        {formatJobType(service)}
                      </span>
                    ))
                  ) : (
                    <p className="font-quicksand text-gray-500">
                      No services selected
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                    Availability
                  </p>
                  <p className="font-quicksand text-sm font-medium text-gray-900 md:text-base">
                    {formData.availability}
                  </p>
                </div>
                <div>
                  <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                    Service Areas
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                    Has Vehicle
                  </p>
                  <p className="font-quicksand text-sm font-medium text-gray-900 md:text-base">
                    {formData.has_vehicle ? "Yes" : "No"}
                    {formData.vehicle_type && ` (${formData.vehicle_type})`}
                  </p>
                </div>
                <div>
                  <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                    Has Equipment
                  </p>
                  <p className="font-quicksand text-sm font-medium text-gray-900 md:text-base">
                    {formData.has_equipment ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Submit */}
          <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 md:rounded-xl md:p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <FiShield className="text-xl text-purple-600" />
                </div>
                <div>
                  <h4 className="font-cinzel mb-1 font-semibold text-gray-800">
                    Privacy & Confidentiality
                  </h4>
                  <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                    Your information is secure and will only be used for the
                    application process. We respect your privacy and will not
                    share your details with third parties.
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="font-quicksand text-xs text-blue-800 md:text-sm">
                  By submitting this application, you agree that all information
                  provided is accurate and complete to the best of your
                  knowledge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    ),
    [formData, formatJobType, countryNames],
  );

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="mx-auto w-full max-w-md p-6 text-center md:p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 md:h-24 md:w-24"
          >
            <FiCheckCircle className="text-3xl text-white md:text-4xl" />
          </motion.div>
          <h2 className="font-cinzel mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
            Application Submitted!
          </h2>
          <p className="font-quicksand mb-6 text-gray-600">
            Thank you for applying to join SpiffyFox. We've received your
            application and will review it shortly.
          </p>
          <div className="mb-6 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 p-5 md:p-6">
            <h4 className="font-cinzel mb-2 font-semibold text-purple-800">
              What's Next?
            </h4>
            <ul className="font-quicksand space-y-1 text-xs text-purple-700 md:text-sm">
              <li>✓ Application under review</li>
              <li>✓ Initial screening call</li>
              <li>✓ Background verification</li>
              <li>✓ Final decision</li>
            </ul>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="font-quicksand w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl md:px-8 md:py-3"
            >
              Return to Home
            </button>
            <button
              onClick={() => {
                // Reset form and allow new application
                setSuccess(false);
                setCurrentStep(1);
                setFormData(initialFormData);
                setSubmitMessage("");
              }}
              className="font-quicksand w-full rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 md:px-8 md:py-3"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Image Section */}
      <div className="relative h-48 overflow-hidden md:h-64">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${img1})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-purple-700/60 backdrop-blur-sm"></div>
        </div>
        <div className="relative flex h-full items-center">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl"
            >
              <button
                onClick={() => navigate(-1)}
                className="font-quicksand mb-4 flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30 md:mb-6 md:px-4 md:py-2.5"
              >
                <FiArrowLeft className="text-sm md:text-base" />
                <span className="text-sm md:text-base">Back</span>
              </button>
              <h1 className="font-cinzel mb-2 text-2xl font-bold text-white md:mb-3 md:text-4xl">
                Join SpiffyFox Team
              </h1>
              <p className="font-quicksand max-w-2xl text-sm text-purple-100 md:text-lg">
                Apply now to become a contractor with SpiffyFox. Complete this
                form and we'll get back to you within 48 hours.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="relative z-10 container mx-auto -mt-6 px-4 pb-8 md:-mt-10 md:px-6 md:pb-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xl md:rounded-2xl md:p-6 lg:p-8">
            {/* Step Indicator */}
            {StepIndicator}

            {/* Form Steps */}
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              {currentStep === 1 && Step1}
              {currentStep === 2 && Step2}
              {currentStep === 3 && Step3}
              {currentStep === 4 && Step4}

              {/* Navigation Buttons */}
              <div className="mt-6 flex justify-between border-t border-gray-200 pt-4 md:mt-8 md:pt-6">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="font-quicksand rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 md:rounded-xl md:px-6 md:py-3 md:text-base"
                  >
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="font-quicksand flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl md:rounded-xl md:px-8 md:py-3 md:text-base"
                  >
                    Continue
                    <FiArrowRight className="text-sm md:text-base" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="font-quicksand flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 md:rounded-xl md:px-8 md:py-3 md:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent md:h-4 md:w-4"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="text-sm md:text-base" />
                        Submit Application
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Submit Message Display (only on last step) */}
              {currentStep === 4 && submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-4 text-white shadow-lg ${
                    submitMessage.includes("Failed") ||
                    submitMessage.includes("Error")
                      ? "bg-gradient-to-r from-rose-500 to-rose-600"
                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {submitMessage.includes("Failed") ||
                    submitMessage.includes("Error") ? (
                      <FiXCircle className="text-lg md:text-xl" />
                    ) : (
                      <FiCheckCircle className="text-lg md:text-xl" />
                    )}
                    <p className="font-quicksand text-sm font-medium md:text-base">
                      {submitMessage}
                    </p>
                  </div>
                </motion.div>
              )}
            </form>

            {/* Progress Indicator */}
            <div className="mt-4 md:mt-6">
              <div className="mb-2 flex justify-between">
                <span className="font-quicksand text-xs text-gray-600 md:text-sm">
                  Step {currentStep} of {steps.length}
                </span>
                <span className="font-quicksand text-xs font-semibold text-purple-700 md:text-sm">
                  {Math.round((currentStep / steps.length) * 100)}% Complete
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-200 md:h-2">
                <motion.div
                  initial={{
                    width: `${((currentStep - 1) / steps.length) * 100}%`,
                  }}
                  animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:rounded-xl md:p-5">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 md:mb-3 md:h-12 md:w-12">
                <FiAward className="text-lg text-blue-600 md:text-xl" />
              </div>
              <h4 className="font-cinzel mb-1 text-sm font-semibold text-gray-800 md:mb-2 md:text-base">
                Why Join SpiffyFox?
              </h4>
              <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                Competitive rates, flexible hours, and professional support.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:rounded-xl md:p-5">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 md:mb-3 md:h-12 md:w-12">
                <FiShield className="text-lg text-emerald-600 md:text-xl" />
              </div>
              <h4 className="font-cinzel mb-1 text-sm font-semibold text-gray-800 md:mb-2 md:text-base">
                Safe & Secure
              </h4>
              <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                Your information is protected with enterprise-grade security.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:rounded-xl md:p-5">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 md:mb-3 md:h-12 md:w-12">
                <FiClock className="text-lg text-amber-600 md:text-xl" />
              </div>
              <h4 className="font-cinzel mb-1 text-sm font-semibold text-gray-800 md:mb-2 md:text-base">
                Quick Response
              </h4>
              <p className="font-quicksand text-xs text-gray-600 md:text-sm">
                We review applications within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contractor;
