import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import {
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon,
  Person as UserIcon,
  Email as EnvelopeIcon,
  Home as HomeIcon,
  Payment as CreditCardIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowLeftIcon,
} from "@mui/icons-material";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get selected service from navigation state
  const selectedService = location.state?.service || null;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    payment_preference: "credit_card",
    appointment_date: "",
    appointment_time: "",
    service: selectedService || "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);

  // Generate available time slots (9 AM to 5 PM)
  useEffect(() => {
    const times = [];
    for (let i = 9; i <= 17; i++) {
      const hour = i > 12 ? i - 12 : i;
      const ampm = i >= 12 ? "PM" : "AM";
      times.push(`${hour}:00 ${ampm}`);
      if (i !== 17) {
        times.push(`${hour}:30 ${ampm}`);
      }
    }
    setAvailableTimes(times);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (
        !formData.name ||
        !formData.address ||
        !formData.email ||
        !formData.appointment_date ||
        !formData.appointment_time
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Insert booking into Supabase
      const { data, error: supabaseError } = await supabase
        .from("bookings")
        .insert([
          {
            name: formData.name,
            address: formData.address,
            email: formData.email,
            payment_preference: formData.payment_preference,
            appointment_date: formData.appointment_date,
            appointment_time: formData.appointment_time,
            service: formData.service || null,
            status: "pending",
          },
        ])
        .select();

      if (supabaseError) throw supabaseError;

      setSuccess(true);
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/services");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="font-cinzel mb-4 text-2xl font-bold text-gray-800">
            Booking Confirmed! 🎉
          </h2>
          <p className="font-quicksand mb-4 text-gray-600">
            Thank you for booking with SpiffyFox. We'll send you a confirmation
            email shortly.
          </p>
          {formData.service && (
            <p className="font-quicksand mb-6 text-sm text-purple-600">
              Service: <span className="font-semibold">{formData.service}</span>
            </p>
          )}
          <div className="animate-pulse">
            <p className="font-quicksand text-sm text-gray-500">
              Redirecting to services...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/services")}
          className="font-quicksand mb-6 flex items-center text-gray-600 transition-colors hover:text-purple-600"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to Services
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-cinzel spiffy-text-dark mb-2 text-4xl font-bold">
            Book Your Service
          </h1>
          <p className="font-quicksand text-gray-600">
            {selectedService ? (
              <>
                You're booking:{" "}
                <span className="spiffy-text-dark text-lg font-semibold">
                  {selectedService}
                </span>
              </>
            ) : (
              "Fill in your details to schedule a service"
            )}
          </p>
        </div>

        {/* Booking Form */}
        <div className="rounded-2xl bg-white p-6 shadow-xl md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection (hidden if pre-selected) */}
            {!selectedService && (
              <div>
                <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                  Select Service *
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-400"
                  required
                >
                  <option value="">Choose a service...</option>
                  <option value="Residential Cleaning">
                    Residential Cleaning
                  </option>
                  <option value="Commercial Cleaning">
                    Commercial Cleaning
                  </option>
                  <option value="Deep Cleaning">Deep Cleaning</option>
                  <option value="Organization">Organization</option>
                  <option value="Powerwashing">Powerwashing</option>
                  <option value="Junk Removal">Junk Removal</option>
                  <option value="Packing & Unpacking">
                    Packing & Unpacking
                  </option>
                  <option value="Personal Assistant">Personal Assistant</option>
                </select>
              </div>
            )}

            {/* Show selected service as read-only if pre-selected */}
            {selectedService && (
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <p className="font-quicksand text-sm text-gray-600">
                  Selected Service:
                </p>
                <p className="font-quicksand text-lg font-semibold text-purple-700">
                  {selectedService}
                </p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-400"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-400"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                Address *
              </label>
              <div className="relative">
                <HomeIcon className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-400"
                  placeholder="123 Main St, City, State, ZIP"
                  required
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                  Appointment Date *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                  Appointment Time *
                </label>
                <div className="relative">
                  <ClockIcon className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                  <select
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-400"
                    required
                  >
                    <option value="">Select time</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Preference */}
            <div>
              <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                Payment Preference *
              </label>
              <div className="relative">
                <CreditCardIcon className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                <select
                  name="payment_preference"
                  value={formData.payment_preference}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-400"
                  required
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                <p className="font-quicksand text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`font-quicksand w-full rounded-lg px-6 py-3 font-semibold text-white shadow-lg transition-all ${
                loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "spiffy-bg hover:scale-[1.02] hover:shadow-xl"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Submitting...
                </div>
              ) : (
                "Book Now"
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="font-quicksand text-center text-sm text-gray-500">
              We'll confirm your booking within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
