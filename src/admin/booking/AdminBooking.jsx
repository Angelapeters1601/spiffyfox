import { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  AccessTime as TimeIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EnvelopeIcon,
  Home as HomeIcon,
  PinDrop as PinIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from "@mui/icons-material";

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch bookings from Supabase
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
      );

      // Update selected booking if modal is open
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);

      if (error) throw error;

      setBookings(bookings.filter((b) => b.id !== id));
      if (selectedBooking && selectedBooking.id === id) {
        setShowDetailModal(false);
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone?.includes(searchTerm) ||
      booking.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.street_address
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.zipcode?.includes(searchTerm);

    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Format phone number for display
  const formatPhone = (phone) => {
    if (!phone) return "N/A";
    return phone;
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <PendingIcon fontSize="small" />,
      },
      confirmed: {
        color: "bg-green-100 text-green-800",
        icon: <CheckIcon fontSize="small" />,
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: <CancelIcon fontSize="small" />,
      },
      completed: {
        color: "bg-blue-100 text-blue-800",
        icon: <TimeIcon fontSize="small" />,
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${config.color}`}
      >
        {config.icon}
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending"}
      </span>
    );
  };

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  // View booking details
  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  // Detail Modal
  const DetailModal = () => {
    if (!selectedBooking) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
          {/* Close Button */}
          <button
            onClick={() => {
              setShowDetailModal(false);
              setSelectedBooking(null);
            }}
            className="absolute top-4 right-4 rounded-full bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"
          >
            <CloseIcon />
          </button>

          <div className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="font-cinzel spiffy-text-dark text-2xl font-bold">
                Booking Details
              </h2>
              <StatusBadge status={selectedBooking.status} />
            </div>

            <div className="space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="font-quicksand text-xs font-medium text-gray-500 uppercase">
                    Name
                  </label>
                  <p className="font-quicksand text-gray-900">
                    {selectedBooking.name}
                  </p>
                </div>
                <div>
                  <label className="font-quicksand text-xs font-medium text-gray-500 uppercase">
                    Service
                  </label>
                  <p className="font-quicksand text-gray-900">
                    {selectedBooking.service || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="font-quicksand flex items-center gap-1 text-xs font-medium text-gray-500 uppercase">
                    <EnvelopeIcon className="h-3 w-3" /> Email
                  </label>
                  <p className="font-quicksand text-gray-900">
                    {selectedBooking.email}
                  </p>
                </div>
                <div>
                  <label className="font-quicksand flex items-center gap-1 text-xs font-medium text-gray-500 uppercase">
                    <PhoneIcon className="h-3 w-3" /> Phone
                  </label>
                  <p className="font-quicksand text-gray-900">
                    {formatPhone(selectedBooking.phone)}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="font-quicksand flex items-center gap-1 text-xs font-medium text-gray-500 uppercase">
                  <HomeIcon className="h-3 w-3" /> Address
                </label>
                <p className="font-quicksand text-gray-900">
                  {selectedBooking.street_address || "N/A"}
                </p>
                {selectedBooking.zipcode && (
                  <p className="font-quicksand flex items-center gap-1 text-sm text-gray-600">
                    <PinIcon className="h-3 w-3" /> ZIP:{" "}
                    {selectedBooking.zipcode}
                  </p>
                )}
              </div>

              {/* Appointment */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="font-quicksand text-xs font-medium text-gray-500 uppercase">
                    Date
                  </label>
                  <p className="font-quicksand text-gray-900">
                    {selectedBooking.appointment_date}
                  </p>
                </div>
                <div>
                  <label className="font-quicksand text-xs font-medium text-gray-500 uppercase">
                    Time
                  </label>
                  <p className="font-quicksand text-gray-900">
                    {selectedBooking.appointment_time}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div>
                <label className="font-quicksand text-xs font-medium text-gray-500 uppercase">
                  Payment Preference
                </label>
                <p className="font-quicksand text-gray-900 capitalize">
                  {selectedBooking.payment_preference?.replace("_", " ") ||
                    "N/A"}
                </p>
              </div>

              {/* Consent */}
              <div className="flex items-center gap-2">
                <label className="font-quicksand text-xs font-medium text-gray-500 uppercase">
                  Consent to Contact:
                </label>
                {selectedBooking.consent_to_contact ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckBoxIcon className="h-5 w-5" /> Yes
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600">
                    <CheckBoxOutlineBlankIcon className="h-5 w-5" /> No
                  </span>
                )}
              </div>

              {/* Created At */}
              <div>
                <label className="font-quicksand text-xs font-medium text-gray-500 uppercase">
                  Created
                </label>
                <p className="font-quicksand text-sm text-gray-600">
                  {new Date(selectedBooking.created_at).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 border-t pt-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="font-quicksand text-sm font-medium text-gray-700">
                    Update Status:
                  </label>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) =>
                      handleStatusUpdate(selectedBooking.id, e.target.value)
                    }
                    disabled={updatingStatus}
                    className="font-quicksand rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleDelete(selectedBooking.id)}
                    className="font-quicksand rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white transition hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
          <p className="font-quicksand mt-3 text-gray-500">
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-cinzel spiffy-text-dark mb-2 text-3xl font-bold md:text-4xl">
            Booking Management
          </h1>
          <p className="font-quicksand text-gray-600">
            View and manage all service bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-xl border-l-4 border-purple-500 bg-white p-4 shadow">
            <p className="font-quicksand text-sm text-gray-500">Total</p>
            <p className="font-cormorant spiffy-text-dark text-2xl font-bold">
              {stats.total}
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-yellow-500 bg-white p-4 shadow">
            <p className="font-quicksand text-sm text-gray-500">Pending</p>
            <p className="font-cormorant text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-green-500 bg-white p-4 shadow">
            <p className="font-quicksand text-sm text-gray-500">Confirmed</p>
            <p className="font-cormorant text-2xl font-bold text-green-600">
              {stats.confirmed}
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-blue-500 bg-white p-4 shadow">
            <p className="font-quicksand text-sm text-gray-500">Completed</p>
            <p className="font-cormorant text-2xl font-bold text-blue-600">
              {stats.completed}
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-red-500 bg-white p-4 shadow">
            <p className="font-quicksand text-sm text-gray-500">Cancelled</p>
            <p className="font-cormorant text-2xl font-bold text-red-600">
              {stats.cancelled}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-xl bg-white p-4 shadow md:flex-row md:items-center">
          <div className="relative w-full flex-1 md:w-auto">
            <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, address, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="font-quicksand w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <FilterIcon className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="font-quicksand w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-400 md:w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={fetchBookings}
              className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50"
              title="Refresh"
            >
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="spiffy-bg text-white">
                <tr>
                  <th className="font-quicksand px-6 py-3 text-left text-sm font-semibold">
                    Customer
                  </th>
                  <th className="font-quicksand px-6 py-3 text-left text-sm font-semibold">
                    Service
                  </th>
                  <th className="font-quicksand px-6 py-3 text-left text-sm font-semibold">
                    Address
                  </th>
                  <th className="font-quicksand px-6 py-3 text-left text-sm font-semibold">
                    Date & Time
                  </th>
                  <th className="font-quicksand px-6 py-3 text-left text-sm font-semibold">
                    Phone
                  </th>
                  <th className="font-quicksand px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="font-quicksand px-6 py-3 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition hover:bg-purple-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-quicksand font-medium text-gray-900">
                        {booking.name}
                      </div>
                      <div className="font-quicksand text-sm text-gray-500">
                        {booking.email}
                      </div>
                    </td>
                    <td className="font-quicksand px-6 py-4 text-gray-700">
                      {booking.service || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-quicksand text-sm text-gray-700">
                        {booking.street_address || "N/A"}
                      </div>
                      {booking.zipcode && (
                        <div className="font-quicksand text-xs text-gray-500">
                          ZIP: {booking.zipcode}
                        </div>
                      )}
                    </td>
                    <td className="font-quicksand px-6 py-4 text-gray-700">
                      {booking.appointment_date} <br />
                      <span className="text-sm text-gray-500">
                        {booking.appointment_time}
                      </span>
                    </td>
                    <td className="font-quicksand px-6 py-4 text-sm text-gray-600">
                      {formatPhone(booking.phone)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => viewBookingDetails(booking)}
                          className="rounded-full p-1.5 text-blue-600 transition hover:bg-blue-50"
                          title="View Details"
                        >
                          <ViewIcon fontSize="small" />
                        </button>
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            handleStatusUpdate(booking.id, e.target.value)
                          }
                          className="font-quicksand rounded border border-gray-300 px-2 py-1 text-xs focus:ring-1 focus:ring-purple-400"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="rounded-full p-1.5 text-red-600 transition hover:bg-red-50"
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="font-quicksand px-6 py-8 text-center text-gray-500"
                    >
                      No bookings found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-4 md:hidden">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border-l-4 border-purple-400 bg-white p-4 shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-cormorant spiffy-text-dark text-lg font-bold">
                    {booking.name}
                  </h3>
                  <p className="font-quicksand text-sm text-gray-600">
                    {booking.email}
                  </p>
                  <p className="font-quicksand flex items-center gap-1 text-sm text-gray-600">
                    <PhoneIcon className="h-3 w-3" />{" "}
                    {formatPhone(booking.phone)}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              <div className="font-quicksand mt-3 space-y-1 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Service:</span>{" "}
                  {booking.service || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Address:</span>{" "}
                  {booking.street_address || "N/A"}
                </div>
                {booking.zipcode && (
                  <div>
                    <span className="font-medium">ZIP:</span> {booking.zipcode}
                  </div>
                )}
                <div>
                  <span className="font-medium">Date:</span>{" "}
                  {booking.appointment_date} at {booking.appointment_time}
                </div>
                <div>
                  <span className="font-medium">Consent:</span>{" "}
                  {booking.consent_to_contact ? "✅ Yes" : "❌ No"}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => viewBookingDetails(booking)}
                    className="rounded-full p-1.5 text-blue-600 transition hover:bg-blue-50"
                  >
                    <ViewIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="rounded-full p-1.5 text-red-600 transition hover:bg-red-50"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
                <select
                  value={booking.status}
                  onChange={(e) =>
                    handleStatusUpdate(booking.id, e.target.value)
                  }
                  className="font-quicksand rounded border border-gray-300 px-2 py-1 text-xs focus:ring-1 focus:ring-purple-400"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
          {filteredBookings.length === 0 && (
            <div className="font-quicksand rounded-xl bg-white p-8 text-center text-gray-500 shadow">
              No bookings found.
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && <DetailModal />}
    </div>
  );
};

export default AdminBooking;
