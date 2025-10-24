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
  FaMapMarkerAlt,
  FaRegCommentDots,
  FaFilter,
  FaDownload,
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

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    let filtered = contacts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.message?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply category filter
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
  }, [searchTerm, contacts, activeFilter]);

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity },
            }}
            className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-purple-600 border-t-transparent"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-cinzel text-xl text-gray-700"
          >
            Loading Contacts...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-2xl bg-purple-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-6 inline-flex h-15 w-15 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
            <FaEnvelope className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-cinzel spiffy-bg spiffy-text-dark mb-4 bg-clip-text text-3xl font-bold md:text-3xl">
            Contact Management
          </h1>
          <p className="font-quicksand mx-auto max-w-2xl text-sm text-gray-600">
            Manage and review all contact form submissions with beautiful
            insights
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
              <div className="relative max-w-2xl flex-1">
                <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts by name, email, country, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="font-quicksand w-full rounded-xl border border-gray-200 py-3 pr-4 pl-12 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <FaFilter className="h-4 w-4 text-gray-500" />
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="font-quicksand rounded-xl border border-gray-200 px-4 py-2 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Contacts</option>
                  <option value="with-phone">With Phone</option>
                  <option value="recent">Last 7 Days</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              label: "Total Contacts",
              value: contacts.length,
              color: "from-purple-500 to-purple-600",
              icon: FaUser,
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
              color: "from-blue-500 to-blue-600",
              icon: FaCalendar,
            },
            {
              label: "With Phone",
              value: contacts.filter((contact) => contact.phone).length,
              color: "from-green-500 to-green-600",
              icon: FaPhone,
            },
            {
              label: "Countries",
              value: new Set(contacts.map((contact) => contact.country)).size,
              color: "from-orange-500 to-orange-600",
              icon: FaGlobe,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={statsVariants}
              className="transform rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-quicksand mb-1 text-sm text-gray-600">
                    {stat.label}
                  </p>
                  <p className="font-cinzel text-3xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`rounded-xl bg-gradient-to-r p-3 ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all duration-1000`}
                    style={{
                      width: `${(stat.value / Math.max(...contacts.map((s) => s.value), 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contacts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-xl font-semibold text-gray-800">
                Contact Submissions
              </h3>
              <span className="font-quicksand text-sm text-gray-500">
                {filteredContacts.length} of {contacts.length} contacts
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <motion.table
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50">
                <tr>
                  <th className="font-quicksand px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Contact Details
                  </th>
                  <th className="font-quicksand px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Message
                  </th>
                  <th className="font-quicksand px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Location & Time
                  </th>
                  <th className="font-quicksand px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center text-gray-400"
                      >
                        <FaRegCommentDots className="mb-4 h-16 w-16" />
                        <p className="font-cinzel mb-2 text-xl text-gray-500">
                          No contacts found
                        </p>
                        <p className="font-quicksand max-w-md text-gray-500">
                          {searchTerm
                            ? "No contacts match your search criteria. Try adjusting your search terms."
                            : "Contact form submissions will appear here once users start reaching out."}
                        </p>
                      </motion.div>
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <motion.tr
                      key={contact.id}
                      variants={rowVariants}
                      className="group transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 shadow-sm transition-shadow duration-200 group-hover:shadow-md">
                            <FaUser className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="font-cinzel text-lg font-semibold text-gray-900">
                              {contact.full_name}
                            </div>
                            <div className="font-quicksand mt-1 flex items-center text-sm text-gray-500">
                              <FaEnvelope className="mr-2 h-3 w-3" />
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="font-quicksand mt-1 flex items-center text-sm text-gray-500">
                                <FaPhone className="mr-2 h-3 w-3" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-quicksand line-clamp-2 text-gray-900">
                            {contact.message}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <FaGlobe className="mr-2 h-4 w-4 text-purple-500" />
                            <span className="font-quicksand text-sm text-gray-900">
                              {contact.country}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FaCalendar className="mr-2 h-4 w-4 text-blue-500" />
                            <div>
                              <span className="font-quicksand block text-sm text-gray-900">
                                {formatDate(contact.created_at)}
                              </span>
                              <span className="font-quicksand text-xs text-gray-500">
                                {getTimeAgo(contact.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewContact(contact)}
                            className="flex items-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white shadow-sm transition-all duration-200 hover:shadow-lg"
                          >
                            <FaEye className="mr-2 h-4 w-4" />
                            View
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteContact(contact.id)}
                            disabled={deleteLoading === contact.id}
                            className="flex items-center rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-white shadow-sm transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                          >
                            {deleteLoading === contact.id ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                              />
                            ) : (
                              <>
                                <FaTrash className="mr-2 h-4 w-4" />
                                Delete
                              </>
                            )}
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </motion.table>
          </div>
        </motion.div>

        {/* Contact Detail Modal */}
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
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-cinzel mb-2 text-3xl font-bold">
                        Contact Details
                      </h2>
                      <p className="font-quicksand opacity-90">
                        Submitted {getTimeAgo(selectedContact.created_at)} •{" "}
                        {formatDate(selectedContact.created_at)}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowModal(false)}
                      className="hover:bg-opacity-20 rounded-xl p-2 transition-all duration-200 hover:bg-white"
                    >
                      <FaTimes className="h-6 w-6" />
                    </motion.button>
                  </div>
                  <div className="bg-opacity-20 absolute right-8 bottom-0 left-8 h-1 rounded-full bg-white" />
                </div>

                {/* Modal Content */}
                <div className="max-h-[60vh] space-y-8 overflow-y-auto p-8">
                  {/* Personal Information Grid */}
                  <div>
                    <h3 className="font-cinzel mb-6 flex items-center text-2xl font-semibold text-gray-800">
                      <div className="mr-4 h-8 w-1 rounded-full bg-purple-500" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {[
                        {
                          icon: FaUser,
                          label: "Full Name",
                          value: selectedContact.full_name,
                          color: "purple",
                        },
                        {
                          icon: FaEnvelope,
                          label: "Email Address",
                          value: selectedContact.email,
                          color: "blue",
                        },
                        {
                          icon: FaPhone,
                          label: "Phone Number",
                          value: selectedContact.phone || "Not provided",
                          color: "green",
                        },
                        {
                          icon: FaGlobe,
                          label: "Country",
                          value: selectedContact.country,
                          color: "orange",
                        },
                      ].map((item) => (
                        <motion.div
                          key={item.label}
                          whileHover={{ scale: 1.02 }}
                          className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm"
                        >
                          <div className="mb-4 flex items-center">
                            <div
                              className={`rounded-xl p-3 bg-${item.color}-100 mr-4`}
                            >
                              <item.icon
                                className={`h-6 w-6 text-${item.color}-600`}
                              />
                            </div>
                            <span className="font-quicksand text-lg font-semibold text-gray-700">
                              {item.label}
                            </span>
                          </div>
                          <p className="font-cinzel text-xl text-gray-900">
                            {item.value}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Message Section */}
                  <div>
                    <h3 className="font-cinzel mb-6 flex items-center text-2xl font-semibold text-gray-800">
                      <div className="mr-4 h-8 w-1 rounded-full bg-blue-500" />
                      Message Content
                    </h3>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6"
                    >
                      <div className="mb-4 flex items-center">
                        <FaRegCommentDots className="mr-3 h-6 w-6 text-blue-600" />
                        <span className="font-quicksand text-lg font-semibold text-blue-700">
                          User's Message
                        </span>
                      </div>
                      <p className="font-quicksand text-lg leading-relaxed whitespace-pre-wrap text-gray-800">
                        {selectedContact.message}
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4 border-t border-gray-200 bg-gray-50 p-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(false)}
                    className="font-quicksand rounded-xl border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50"
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteContact(selectedContact.id)}
                    disabled={deleteLoading === selectedContact.id}
                    className="font-quicksand flex items-center rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-white shadow-sm transition-all duration-200 hover:shadow-lg disabled:opacity-50"
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
                          className="mr-2 h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                        />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FaTrash className="mr-2 h-5 w-5" />
                        Delete Contact
                      </>
                    )}
                  </motion.button>
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
