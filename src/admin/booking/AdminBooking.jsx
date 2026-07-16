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
} from "@mui/icons-material";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <PendingIcon fontSize="small" />,
    },
    confirmed: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckIcon fontSize="small" />,
    },
    cancelled: {
      color: "bg-rose-50 text-rose-700 border-rose-200",
      icon: <CancelIcon fontSize="small" />,
    },
    completed: {
      color: "bg-sky-50 text-sky-700 border-sky-200",
      icon: <TimeIcon fontSize="small" />,
    },
  };
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
      );

      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update booking status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);

      if (error) throw error;

      setBookings(bookings.filter((b) => b.id !== id));
      if (selectedBooking?.id === id) {
        setIsModalOpen(false);
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          <p className="font-quicksand text-gray-500">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-cinzel spiffy-text-dark text-3xl font-bold md:text-4xl">
              Bookings
            </h1>
            <p className="font-quicksand mt-1 text-sm text-gray-500">
              Manage all service appointments
            </p>
          </div>
          <button
            onClick={fetchBookings}
            className="spiffy-bg font-quicksand flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:shadow-lg"
          >
            <svg
              className="h-4 w-4"
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
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="font-quicksand text-xs tracking-wider text-gray-400 uppercase">
              Total
            </p>
            <p className="font-cormorant spiffy-text-dark mt-1 text-3xl font-bold">
              {stats.total}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="font-quicksand text-xs tracking-wider text-gray-400 uppercase">
              Pending
            </p>
            <p className="font-cormorant mt-1 text-3xl font-bold text-amber-600">
              {stats.pending}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="font-quicksand text-xs tracking-wider text-gray-400 uppercase">
              Confirmed
            </p>
            <p className="font-cormorant mt-1 text-3xl font-bold text-emerald-600">
              {stats.confirmed}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="font-quicksand text-xs tracking-wider text-gray-400 uppercase">
              Completed
            </p>
            <p className="font-cormorant mt-1 text-3xl font-bold text-sky-600">
              {stats.completed}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative w-full flex-1">
            <SearchIcon className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="font-quicksand w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="flex w-full items-center gap-3 md:w-auto">
            <FilterIcon className="text-sm text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="font-quicksand w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-400 md:w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="font-quicksand px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="font-quicksand px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Service
                  </th>
                  <th className="font-quicksand px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Appointment
                  </th>
                  <th className="font-quicksand px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="font-quicksand px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Payment
                  </th>
                  <th className="font-quicksand px-6 py-4 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-purple-50/30"
                  >
                    <td className="px-6 py-4">
                      <div className="font-quicksand text-sm font-medium text-gray-800">
                        {booking.name}
                      </div>
                      <div className="font-quicksand text-xs text-gray-400">
                        {booking.email}
                      </div>
                    </td>
                    <td className="font-quicksand px-6 py-4 text-sm text-gray-600">
                      {booking.service || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-quicksand text-sm text-gray-700">
                        {booking.appointment_date}
                      </div>
                      <div className="font-quicksand text-xs text-gray-400">
                        {booking.appointment_time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="font-quicksand px-6 py-4 text-xs text-gray-500 capitalize">
                      {booking.payment_preference?.replace("_", " ") || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openBookingDetails(booking)}
                          className="rounded-lg p-1.5 text-indigo-500 transition hover:bg-indigo-50"
                          title="View"
                        >
                          <ViewIcon fontSize="small" />
                        </button>
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            handleStatusUpdate(booking.id, e.target.value)
                          }
                          disabled={updating}
                          className="font-quicksand rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs focus:border-transparent focus:ring-2 focus:ring-purple-400"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="completed">Complete</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-50"
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
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl">📋</div>
                        <p className="font-quicksand text-gray-400">
                          No bookings found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="space-y-4 lg:hidden">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-cormorant spiffy-text-dark text-lg font-bold">
                    {booking.name}
                  </h3>
                  <p className="font-quicksand text-sm text-gray-500">
                    {booking.email}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              <div className="font-quicksand mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-xs text-gray-400">Service</span>
                  <p className="text-gray-700">{booking.service || "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Payment</span>
                  <p className="text-gray-700 capitalize">
                    {booking.payment_preference?.replace("_", " ") || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Date</span>
                  <p className="text-gray-700">{booking.appointment_date}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Time</span>
                  <p className="text-gray-700">{booking.appointment_time}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-50 pt-3">
                <div className="flex gap-1">
                  <button
                    onClick={() => openBookingDetails(booking)}
                    className="rounded-lg p-1.5 text-indigo-500 transition hover:bg-indigo-50"
                  >
                    <ViewIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-50"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
                <select
                  value={booking.status}
                  onChange={(e) =>
                    handleStatusUpdate(booking.id, e.target.value)
                  }
                  disabled={updating}
                  className="font-quicksand rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs focus:border-transparent focus:ring-2 focus:ring-purple-400"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirm</option>
                  <option value="completed">Complete</option>
                  <option value="cancelled">Cancel</option>
                </select>
              </div>
            </div>
          ))}
          {filteredBookings.length === 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
              <div className="mb-2 text-4xl">📋</div>
              <p className="font-quicksand text-gray-400">No bookings found</p>
            </div>
          )}
        </div>

        {/* Booking Detail Modal */}
        {isModalOpen && selectedBooking && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-white px-6 py-4">
                <h2 className="font-cinzel spiffy-text-dark text-xl font-bold">
                  Booking Details
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1.5 transition hover:bg-gray-100"
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="space-y-4 p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="font-quicksand text-xs tracking-wider text-gray-400 uppercase">
                      Name
                    </p>
                    <p className="font-quicksand mt-1 font-medium text-gray-800">
                      {selectedBooking.name}
                    </p>
                  </div>
                  <div>
                    <p className="font-quicksand text-xs tracking-wider text-gray-400 uppercase">
                      Email
                    </p>
                    <p className="font-quicksand mt-1 text-gray-800">
                      {selectedBooking.email}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-quicksand text-xs tracking-wider text-gray-400 uppercase">
                      Address
                    </p>
                    <p className="font-quicksand mt-1 text-gray-800">
                      {selectedBooking.address}
                    </p>
                  </div>
                  <div>
                    <p className="font-quicksand text-xs tracking-wider text-gray-400 uppercase">
                      Service
                    </p>
                    <p className="font-quicksand mt-1 text-gray-800">
                      {selectedBooking.service || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="font-quicksand text-xs tracking-wider text-gray-400 uppercase">
                      Payment
                    </p>
                    <p className="font-quicksand mt-1 text-gray-800 capitalize">
                      {selectedBooking.payment_preference?.replace("_", " ") ||
                        "—"}
                    </p>
                  </div>
                  <div>
                    <p className="font-quicksand text-xs tracking-wider text-gray-400 uppercase">
                      Date
                    </p>
                    <p className="font-quicksand mt-1 text-gray-800">
                      {selectedBooking.appointment_date}
                    </p>
                  </div>
                  <div>
                    <p className="font-quicksand text-xs tracking-wider text-gray-400 uppercase">
                      Time
                    </p>
                    <p className="font-quicksand mt-1 text-gray-800">
                      {selectedBooking.appointment_time}
                    </p>
                  </div>
                  <div>
                    <p className="font-quicksand text-xs tracking-wider text-gray-400 uppercase">
                      Status
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={selectedBooking.status} />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-quicksand text-xs tracking-wider text-gray-400 uppercase">
                      Created
                    </p>
                    <p className="font-quicksand mt-1 text-sm text-gray-600">
                      {new Date(selectedBooking.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                  <select
                    value={selectedBooking.status}
                    onChange={(e) =>
                      handleStatusUpdate(selectedBooking.id, e.target.value)
                    }
                    disabled={updating}
                    className="font-quicksand rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="pending">Set Pending</option>
                    <option value="confirmed">Set Confirmed</option>
                    <option value="completed">Set Completed</option>
                    <option value="cancelled">Set Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleDelete(selectedBooking.id)}
                    className="font-quicksand rounded-xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
                  >
                    Delete Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooking;
