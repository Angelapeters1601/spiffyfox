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
  Phone as PhoneIcon,
  PinDrop as PinIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from "@mui/icons-material";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get selected service from navigation state
  const selectedService = location.state?.service || null;

  const [formData, setFormData] = useState({
    name: "",
    street_address: "",
    zipcode: "",
    email: "",
    phone: "",
    payment_preference: "cash",
    appointment_date: "",
    appointment_time: "",
    service: selectedService || "",
    consent_to_contact: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [fetchingBookings, setFetchingBookings] = useState(false);

  // Business hours configuration
  const businessHours = {
    sunday: { start: 8, end: 24 },
    monday: { start: 8, end: 24 },
    tuesday: { start: 8, end: 24 },
    wednesday: { start: 8, end: 24 },
    thursday: { start: 8, end: 24 },
    friday: { start: 8, end: 17 },
    saturday: { start: null, end: null },
  };

  // Get day of week from date
  const getDayOfWeek = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[date.getDay()];
  };

  // Check if a date is Saturday (closed)
  const isSaturday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date.getDay() === 6;
  };

  // Generate time slots based on the selected date
  const generateTimeSlots = (dateString) => {
    if (!dateString) return [];

    const day = getDayOfWeek(dateString);
    if (!day) return [];

    const hours = businessHours[day];
    if (!hours.start || !hours.end) return [];

    const times = [];
    let endHour, endMinute;

    if (hours.end === 24) {
      endHour = 23;
      endMinute = 59;
    } else {
      endHour = 16;
      endMinute = 0;
    }

    for (let i = hours.start; i < endHour; i += 0.5) {
      const hour = Math.floor(i);
      const minutes = i % 1 === 0 ? "00" : "30";
      const hour12 = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      times.push(`${hour12}:${minutes} ${ampm}`);
    }

    const finalHour12 = endHour > 12 ? endHour - 12 : endHour;
    const finalAmpm = endHour >= 12 ? "PM" : "AM";
    const finalTime = `${finalHour12}:${endMinute.toString().padStart(2, "0")} ${finalAmpm}`;
    times.push(finalTime);

    return times;
  };

  // Get the minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Check if a date is in the past
  const isPastDate = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    return date < today;
  };

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  // Validate phone number
  const isValidPhone = (phone) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length === 10;
  };

  // Fetch existing bookings for the selected date
  const fetchBookedSlots = async (date) => {
    if (!date) return;

    setFetchingBookings(true);
    try {
      const { data, error: supabaseError } = await supabase
        .from("bookings")
        .select("appointment_time")
        .eq("appointment_date", date)
        .in("status", ["pending", "confirmed"]);

      if (supabaseError) throw supabaseError;

      const bookedTimes = data.map((booking) => booking.appointment_time);
      setBookedSlots(bookedTimes);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
    } finally {
      setFetchingBookings(false);
    }
  };

  // Update available times when date changes
  useEffect(() => {
    if (formData.appointment_date) {
      if (isSaturday(formData.appointment_date)) {
        setAvailableTimes([]);
        setError("We are closed on Saturdays. Please select another day.");
        return;
      }

      if (isPastDate(formData.appointment_date)) {
        setAvailableTimes([]);
        setError("Please select a future date.");
        return;
      }

      const slots = generateTimeSlots(formData.appointment_date);
      setAvailableTimes(slots);
      fetchBookedSlots(formData.appointment_date);
      setError("");
    } else {
      setAvailableTimes([]);
      setBookedSlots([]);
    }
  }, [formData.appointment_date]);

  // Filter out booked slots
  const getAvailableTimeSlots = () => {
    if (!formData.appointment_date || isSaturday(formData.appointment_date)) {
      return [];
    }

    if (fetchingBookings) {
      return [];
    }

    return availableTimes.filter((time) => !bookedSlots.includes(time));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "appointment_date") {
      setFormData((prev) => ({
        ...prev,
        appointment_time: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (
        !formData.name ||
        !formData.street_address ||
        !formData.zipcode ||
        !formData.email ||
        !formData.phone ||
        !formData.appointment_date ||
        !formData.appointment_time
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Validate phone number
      if (!isValidPhone(formData.phone)) {
        throw new Error("Please enter a valid 10-digit phone number");
      }

      // Validate ZIP code (5 digits)
      if (!/^\d{5}$/.test(formData.zipcode)) {
        throw new Error("Please enter a valid 5-digit ZIP code");
      }

      // Validate consent - REQUIRED
      if (!formData.consent_to_contact) {
        throw new Error(
          "You must consent to be contacted via text, email, or SMS to complete your booking",
        );
      }

      // Check if selected date is Saturday
      if (isSaturday(formData.appointment_date)) {
        throw new Error(
          "We are closed on Saturdays. Please select another day.",
        );
      }

      // Check if selected date is in the past
      if (isPastDate(formData.appointment_date)) {
        throw new Error("Please select a future date.");
      }

      // Check if the selected time is still available
      const availableSlots = getAvailableTimeSlots();
      if (!availableSlots.includes(formData.appointment_time)) {
        throw new Error(
          "This time slot is no longer available. Please select another time.",
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Build address string
      const fullAddress =
        formData.street_address +
        (formData.zipcode ? `, ${formData.zipcode}` : "");

      // Insert booking into Supabase
      const { data, error: supabaseError } = await supabase
        .from("bookings")
        .insert([
          {
            name: formData.name,
            address: fullAddress,
            street_address: formData.street_address,
            zipcode: formData.zipcode || null,
            email: formData.email,
            phone: formData.phone,
            payment_preference: formData.payment_preference,
            appointment_date: formData.appointment_date,
            appointment_time: formData.appointment_time,
            service: formData.service || null,
            status: "pending",
            consent_to_contact: formData.consent_to_contact,
          },
        ])
        .select();

      if (supabaseError) throw supabaseError;

      setSuccess(true);
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

  const availableSlots = getAvailableTimeSlots();

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
          {/* Business Hours Notice */}
          <div className="mt-3 rounded-lg bg-purple-50 p-3 text-sm">
            <p className="font-quicksand text-gray-700">
              📅 <span className="font-semibold">Business Hours:</span>
            </p>
            <p className="font-quicksand text-xs text-gray-600">
              Sun-Thu: 8:00 AM - 12:00 AM (Midnight) | Fri: 8:00 AM - 4:00 PM |
              Sat: Closed
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="rounded-2xl bg-white p-6 shadow-xl md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection */}
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

            {/* Phone */}
            <div>
              <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <div className="relative">
                <PhoneIcon className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-400"
                  placeholder="(555) 123-4567"
                  maxLength="17"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Format: (XXX) XXX-XXXX
              </p>
            </div>

            {/* Street Address */}
            <div>
              <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                Street Address *
              </label>
              <div className="relative">
                <HomeIcon className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="street_address"
                  value={formData.street_address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-400"
                  placeholder="123 Main St"
                  required
                />
              </div>
            </div>

            {/* ZIP Code */}
            <div>
              <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                ZIP Code *
              </label>
              <div className="relative">
                <PinIcon className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-400"
                  placeholder="12345"
                  maxLength="5"
                  pattern="\d{5}"
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
                    min={getMinDate()}
                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
                {formData.appointment_date &&
                  isSaturday(formData.appointment_date) && (
                    <p className="mt-1 text-xs text-red-600">
                      ❌ We are closed on Saturdays
                    </p>
                  )}
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
                    disabled={
                      !formData.appointment_date ||
                      isSaturday(formData.appointment_date)
                    }
                  >
                    <option value="">Select time</option>
                    {fetchingBookings ? (
                      <option value="" disabled>
                        Loading available times...
                      </option>
                    ) : (
                      availableSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                {formData.appointment_date &&
                  !isSaturday(formData.appointment_date) &&
                  availableSlots.length === 0 &&
                  !fetchingBookings && (
                    <p className="mt-1 text-xs text-yellow-600">
                      ⚠️ No available times for this date. Please select another
                      day.
                    </p>
                  )}
                {formData.appointment_date &&
                  isSaturday(formData.appointment_date) && (
                    <p className="mt-1 text-xs text-red-600">
                      ⚠️ Please select another day (Saturdays closed)
                    </p>
                  )}
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

            {/* Consent Checkbox */}
            <div
              className={`flex items-start gap-3 rounded-lg border p-4 ${
                !formData.consent_to_contact && error?.includes("consent")
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    consent_to_contact: !prev.consent_to_contact,
                  }));
                  // Clear error when user clicks consent
                  if (error?.includes("consent")) {
                    setError("");
                  }
                }}
                className="mt-0.5 flex-shrink-0"
              >
                {formData.consent_to_contact ? (
                  <CheckBoxIcon className="h-6 w-6 text-purple-600" />
                ) : (
                  <CheckBoxOutlineBlankIcon className="h-6 w-6 text-gray-400" />
                )}
              </button>
              <div>
                <label className="font-quicksand text-sm font-medium text-gray-700">
                  Consent to Contact *
                </label>
                <p className="font-quicksand text-xs text-gray-600">
                  I consent to be contacted via text message, email, or SMS
                  regarding my booking and future promotions. Message and data
                  rates may apply.
                </p>
                <p className="font-quicksand mt-1 text-xs text-red-600">
                  ⚠️ Required to complete booking
                </p>
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
              disabled={
                loading ||
                !formData.appointment_date ||
                isSaturday(formData.appointment_date) ||
                availableSlots.length === 0 ||
                !formData.consent_to_contact
              }
              className={`font-quicksand w-full rounded-lg px-6 py-3 font-semibold text-white shadow-lg transition-all ${
                loading ||
                !formData.appointment_date ||
                isSaturday(formData.appointment_date) ||
                availableSlots.length === 0 ||
                !formData.consent_to_contact
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
