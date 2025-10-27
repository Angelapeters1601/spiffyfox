import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../services/supabaseClient";
import {
  FaEye,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaUser,
  FaCalendar,
  FaSearch,
  FaTimes,
  FaFilter,
  FaMapMarkerAlt,
  FaComment,
  FaUserCircle,
} from "react-icons/fa";

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    let filtered = contacts;

    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.message?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (activeFilter === "with-phone") {
      filtered = filtered.filter((contact) => contact.phone);
    } else if (activeFilter === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(
        (contact) => new Date(contact.created_at) > oneWeekAgo,
      );
    }

    setFilteredContacts(filtered);
    setCurrentPage(1);
  }, [searchTerm, contacts, activeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentContacts = filteredContacts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleDeleteContact = async (contactId) => {
    setDeleteLoading(contactId);
    try {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", contactId);

      if (error) throw error;

      setContacts(contacts.filter((contact) => contact.id !== contactId));
      if (selectedContact?.id === contactId) {
        setShowModal(false);
        setSelectedContact(null);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-gray-300 border-t-purple-600"
          />
          <p className="font-quicksand text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-cinzel text-xl font-bold text-gray-900 sm:text-2xl">
                Contact Management
              </h1>
              <p className="font-lora mt-1 text-gray-600">
                Manage contact form submissions
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {/* Search */}
              <div className="relative flex-1 sm:min-w-[280px]">
                <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="font-quicksand w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm transition-colors outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-300"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <FaFilter className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="font-quicksand w-full rounded-lg border border-gray-300 py-2 pr-8 pl-10 text-sm transition-colors outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-300 sm:w-auto"
                >
                  <option value="all">All Contacts</option>
                  <option value="with-phone">With Phone</option>
                  <option value="recent">Last 7 Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Total Contacts",
              value: contacts.length,
              color: "bg-blue-700",
              icon: FaUserCircle,
            },
            {
              label: "This Month",
              value: contacts.filter((contact) => {
                const contactDate = new Date(contact.created_at);
                const now = new Date();
                return (
                  contactDate.getMonth() === now.getMonth() &&
                  contactDate.getFullYear() === now.getFullYear()
                );
              }).length,
              color: "bg-green-600",
              icon: FaCalendar,
            },
            {
              label: "With Phone",
              value: contacts.filter((contact) => contact.phone).length,
              color: "bg-purple-600",
              icon: FaPhone,
            },
            {
              label: "Countries",
              value: new Set(contacts.map((contact) => contact.country)).size,
              color: "bg-orange-600",
              icon: FaGlobe,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-lora text-sm text-gray-600">
                    {stat.label}
                  </p>
                  <p className="font-lora text-sm font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`h-8 w-8 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-lora text-lg font-semibold text-gray-900">
                Contact Submissions
              </h3>
              <div className="flex items-center gap-4">
                <span className="font-lora text-sm text-gray-600">
                  {filteredContacts.length} contacts
                </span>
                {/* Pagination Info */}
                {totalPages > 1 && (
                  <span className="font-lora text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="font-quicksand px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6">
                    Contact
                  </th>
                  <th className="font-quicksand px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6">
                    Message
                  </th>
                  <th className="font-quicksand hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6 md:table-cell">
                    Date & Location
                  </th>
                  <th className="font-quicksand px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentContacts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-12 text-center sm:px-6">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <FaComment className="mb-3 h-12 w-12" />
                        <p className="font-cinzel text-lg text-gray-500">
                          No contacts found
                        </p>
                        <p className="font-quicksand text-gray-500">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "No contact submissions yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentContacts.map((contact) => (
                    <motion.tr
                      key={contact.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="cursor-pointer transition-colors hover:bg-gray-50"
                      onClick={() => handleViewContact(contact)}
                    >
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="font-lora spiffy-text-dark flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold">
                            {getInitials(contact.full_name)}
                          </div>
                          <div className="ml-3">
                            <div className="font-lora font-medium text-gray-900">
                              {contact.full_name}
                            </div>
                            <div className="font-lora flex items-center py-2 text-xs text-gray-500">
                              <FaEnvelope className="mr-1 h-3 w-3" />
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="font-lora flex items-center text-xs text-gray-500">
                                <FaPhone className="mr-1 h-3 w-3" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="max-w-xs">
                          <p className="font-lora line-clamp-2 text-xs text-gray-900">
                            {contact.message}
                          </p>
                        </div>
                      </td>
                      <td className="hidden px-4 py-4 sm:px-6 md:table-cell">
                        <div className="space-y-1">
                          <div className="font-lora text-xs text-gray-900">
                            {formatDate(contact.created_at)}
                          </div>
                          <div className="font-lora text-xs text-gray-500">
                            {formatTime(contact.created_at)}
                          </div>
                          <div className="font-lora flex items-center text-xs text-gray-400">
                            <FaMapMarkerAlt className="mr-1 h-3 w-3" />
                            {contact.country}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewContact(contact);
                            }}
                            className="rounded-lg p-2 text-xs text-gray-400 transition-colors hover:bg-blue-50 hover:text-purple-400"
                            title="View Details"
                          >
                            <FaEye className="h-3 w-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteContact(contact.id);
                            }}
                            disabled={deleteLoading === contact.id}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            title="Delete Contact"
                          >
                            {deleteLoading === contact.id ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="h-3 w-3 rounded-full border-2 border-red-600 border-t-transparent"
                              />
                            ) : (
                              <FaTrash className="h-3 w-3" />
                            )}
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="font-lora text-xs text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, filteredContacts.length)}{" "}
                  of {filteredContacts.length} results
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="font-lora rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`font-lora rounded-lg px-3 py-1 text-xs transition-colors ${
                          currentPage === page
                            ? "bg-purple-400 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="font-lora rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && selectedContact && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-2xl rounded-xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="font-lora spiffy-bg spiffy-text-dark flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold">
                      {getInitials(selectedContact.full_name)}
                    </div>
                    <div>
                      <h2 className="font-cinzel text-xl font-bold text-gray-900">
                        {selectedContact.full_name}
                      </h2>
                      <p className="font-lora text-xs text-gray-600">
                        Submitted {formatDate(selectedContact.created_at)} at{" "}
                        {formatTime(selectedContact.created_at)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] space-y-6 overflow-y-auto p-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="font-cinzel mb-4 text-sm font-semibold text-gray-900">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="font-lora text-lg font-medium text-gray-700">
                          Full Name
                        </label>
                        <p className="font-lora p-2 text-sm text-gray-900">
                          {selectedContact.full_name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="font-lora text-lg font-medium text-gray-700">
                          Email Address
                        </label>
                        <p className="font-lora p-2 text-sm text-gray-900">
                          {selectedContact.email}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="font-lora text-lg font-medium text-gray-700">
                          Phone Number
                        </label>
                        <p className="font-lora p-2 text-sm text-gray-900">
                          {selectedContact.phone || "Not provided"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="font-lora text-lg font-medium text-gray-700">
                          Country
                        </label>
                        <p className="font-lora p-2 text-sm text-gray-900">
                          {selectedContact.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <h3 className="font-cinzel mb-4 text-sm font-semibold text-gray-900">
                      Message
                    </h3>
                    <div className="rounded-lg bg-purple-200 p-4">
                      <p className="font-lora leading-relaxed whitespace-pre-wrap text-gray-900">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="font-lora rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDeleteContact(selectedContact.id)}
                    disabled={deleteLoading === selectedContact.id}
                    className="font-lora flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm text-white transition-colors hover:bg-red-800 disabled:opacity-50"
                  >
                    {deleteLoading === selectedContact.id ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                        />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FaTrash className="h-4 w-4" />
                        Delete Contact
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminContact;
