import { useState } from "react";
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
} from "@mui/icons-material";

// Mock data – later to be replaced with real data from Supabase
const mockBookings = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    address: "123 Main St, Springfield, IL 62701",
    service: "Residential Cleaning",
    date: "2026-07-15",
    time: "09:00 AM",
    status: "pending",
    payment: "credit_card",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "janedoe@gmail.com",
    address: "456 Oak Ave, Austin, TX 78701",
    service: "Commercial Cleaning",
    date: "2026-07-16",
    time: "02:30 PM",
    status: "confirmed",
    payment: "paypal",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@example.com",
    address: "789 Pine Rd, Denver, CO 80202",
    service: "Deep Cleaning",
    date: "2026-07-14",
    time: "11:00 AM",
    status: "completed",
    payment: "cash",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james@example.com",
    address: "321 Elm St, Seattle, WA 98101",
    service: "Organization",
    date: "2026-07-17",
    time: "01:00 PM",
    status: "cancelled",
    payment: "bank_transfer",
  },
  {
    id: 5,
    name: "Maria Garcia",
    email: "maria@example.com",
    address: "654 Maple Dr, Miami, FL 33101",
    service: "Powerwashing",
    date: "2026-07-18",
    time: "10:30 AM",
    status: "pending",
    payment: "debit_card",
  },
];

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
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const AdminBooking = () => {
  const [bookings, setBookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter bookings based on search and status filter
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle delete (mock)
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setBookings(bookings.filter((b) => b.id !== id));
    }
  };

  // Handle status change (mock)
  const handleStatusChange = (id, newStatus) => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
    );
  };

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
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border-l-2 border-purple-500 bg-white p-4 shadow">
            <p className="font-quicksand text-sm text-gray-500">Total</p>
            <p className="font-cormorant spiffy-text-dark text-2xl font-bold">
              {bookings.length}
            </p>
          </div>
          <div className="rounded-xl border-l-2 border-yellow-500 bg-white p-4 shadow">
            <p className="font-quicksand text-sm text-gray-500">Pending</p>
            <p className="font-cormorant text-2xl font-bold text-yellow-600">
              {bookings.filter((b) => b.status === "pending").length}
            </p>
          </div>
          <div className="rounded-xl border-l-2 border-green-500 bg-white p-4 shadow">
            <p className="font-quicksand text-sm text-gray-500">Confirmed</p>
            <p className="font-cormorant text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "confirmed").length}
            </p>
          </div>
          <div className="rounded-xl border-l-2 border-blue-500 bg-white p-4 shadow">
            <p className="font-quicksand text-sm text-gray-500">Completed</p>
            <p className="font-cormorant text-2xl font-bold text-blue-600">
              {bookings.filter((b) => b.status === "completed").length}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-xl bg-white p-4 shadow md:flex-row md:items-center">
          <div className="relative w-full flex-1 md:w-auto">
            <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or service..."
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
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="spiffy-bg text-white">
                <tr>
                  <th className="font-quicksand px-6 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="font-quicksand px-6 py-3 text-left text-sm font-semibold">
                    Service
                  </th>
                  <th className="font-quicksand px-6 py-3 text-left text-sm font-semibold">
                    Date & Time
                  </th>
                  <th className="font-quicksand px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="font-quicksand px-6 py-3 text-left text-sm font-semibold">
                    Payment
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
                      {booking.service}
                    </td>
                    <td className="font-quicksand px-6 py-4 text-gray-700">
                      {booking.date} <br />
                      <span className="text-sm text-gray-500">
                        {booking.time}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="font-quicksand px-6 py-4 text-sm text-gray-600 capitalize">
                      {booking.payment.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="rounded-full p-1.5 text-blue-600 transition hover:bg-blue-50"
                          title="View"
                        >
                          <ViewIcon fontSize="small" />
                        </button>
                        <button
                          className="rounded-full p-1.5 text-green-600 transition hover:bg-green-50"
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="rounded-full p-1.5 text-red-600 transition hover:bg-red-50"
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                        {/* Quick status change dropdown */}
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            handleStatusChange(booking.id, e.target.value)
                          }
                          className="font-quicksand rounded border border-gray-300 px-2 py-1 text-xs focus:ring-1 focus:ring-purple-400"
                        >
                          <option value="pending">Set Pending</option>
                          <option value="confirmed">Set Confirmed</option>
                          <option value="completed">Set Completed</option>
                          <option value="cancelled">Set Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
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
                </div>
                <StatusBadge status={booking.status} />
              </div>
              <div className="font-quicksand mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Service:</span>{" "}
                  {booking.service}
                </div>
                <div>
                  <span className="font-medium">Date:</span> {booking.date}
                </div>
                <div>
                  <span className="font-medium">Time:</span> {booking.time}
                </div>
                <div>
                  <span className="font-medium">Payment:</span>{" "}
                  {booking.payment.replace("_", " ")}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1">
                  <button className="rounded-full p-1.5 text-blue-600 transition hover:bg-blue-50">
                    <ViewIcon fontSize="small" />
                  </button>
                  <button className="rounded-full p-1.5 text-green-600 transition hover:bg-green-50">
                    <EditIcon fontSize="small" />
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
                    handleStatusChange(booking.id, e.target.value)
                  }
                  className="font-quicksand rounded border border-gray-300 px-2 py-1 text-xs focus:ring-1 focus:ring-purple-400"
                >
                  <option value="pending">Set Pending</option>
                  <option value="confirmed">Set Confirmed</option>
                  <option value="completed">Set Completed</option>
                  <option value="cancelled">Set Cancelled</option>
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
    </div>
  );
};

export default AdminBooking;
