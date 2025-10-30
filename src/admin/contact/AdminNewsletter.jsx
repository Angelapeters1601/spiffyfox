import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaUser,
  FaCalendar,
  FaSearch,
  FaFilter,
  FaPaperPlane,
  FaTrash,
  FaDownload,
  FaSync,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
  FaNewspaper,
} from "react-icons/fa";
import { supabase } from "../../services/supabaseClient";

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [newsletterContent, setNewsletterContent] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    filterSubscribers();
  }, [searchTerm, subscribers, activeFilter]);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from("newsletter")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSubscribers = () => {
    let filtered = subscribers;

    if (searchTerm) {
      filtered = filtered.filter((sub) =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (activeFilter === "active") {
      filtered = filtered.filter((sub) => sub.is_active);
    } else if (activeFilter === "inactive") {
      filtered = filtered.filter((sub) => !sub.is_active);
    } else if (activeFilter === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(
        (sub) => new Date(sub.subscribed_at) > oneWeekAgo,
      );
    }

    setFilteredSubscribers(filtered);
  };

  const handleDeleteSubscriber = async (subscriberId) => {
    setDeleteLoading(subscriberId);
    try {
      const { error } = await supabase
        .from("newsletter")
        .delete()
        .eq("id", subscriberId);

      if (error) throw error;
      setSubscribers(subscribers.filter((sub) => sub.id !== subscriberId));
    } catch (error) {
      console.error("Error deleting subscriber:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEmailClick = (email) => {
    window.open(`mailto:${email}`, "_blank");
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(newsletterContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const exportSubscribers = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Email,Subscription Date,Status\n" +
      subscribers
        .map(
          (sub) =>
            `"${sub.email}","${formatDate(sub.subscribed_at)}","${sub.is_active ? "Active" : "Inactive"}"`,
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = {
    total: subscribers.length,
    active: subscribers.filter((sub) => sub.is_active).length,
    recent: subscribers.filter((sub) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(sub.subscribed_at) > oneWeekAgo;
    }).length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-3 h-8 w-8 rounded-full border-2 border-purple-600 border-t-transparent"
          />
          <p className="font-quicksand text-gray-600">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-4 flex items-center space-x-4">
            <div className="rounded-xl bg-purple-600 p-2 text-white">
              <FaNewspaper className="h-4 w-4" />
            </div>
            <div>
              <h1 className="font-cinzel text-xl font-bold text-gray-800">
                Newsletter Subscribers
              </h1>
              <p className="font-lora text-gray-600">
                Manage your newsletter subscribers
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <div className="rounded-lg bg-slate-100 p-4 shadow-sm">
            <p className="font-lora text-sm text-gray-600">Total</p>
            <p className="font-cinzel text-xl font-bold text-gray-800">
              {stats.total}
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-4 shadow-sm">
            <p className="font-lora text-sm text-gray-600">Active</p>
            <p className="font-cinzel text-xl font-bold text-gray-800">
              {stats.active}
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-4 shadow-sm">
            <p className="font-quicksand text-sm text-gray-600">Recent</p>
            <p className="font-cinzel text-xl font-bold text-gray-800">
              {stats.recent}
            </p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-lg bg-slate-50 p-4 shadow-sm"
        >
          <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="font-lora w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="font-lora rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="recent">Last 7 Days</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportSubscribers}
                className="flex items-center rounded-lg bg-gray-600 px-3 py-2 text-sm text-white transition-colors hover:bg-gray-700"
              >
                <FaDownload className="mr-2 h-3 w-3" />
                Export
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCompose(true)}
                className="flex items-center rounded-lg bg-purple-600 px-3 py-2 text-sm text-white transition-colors hover:bg-purple-700"
              >
                <FaPaperPlane className="mr-2 h-3 w-3" />
                Compose
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Subscribers Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="overflow-hidden rounded-lg border border-purple-200 bg-white shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="font-quicksand px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="font-quicksand px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Subscribed
                  </th>
                  <th className="font-quicksand px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="font-quicksand px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center text-gray-400">
                        <FaEnvelope className="mb-2 h-8 w-8" />
                        <p className="font-quicksand">No subscribers found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <motion.tr
                      key={subscriber.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEmailClick(subscriber.email)}
                          className="font-lora text-left text-sm text-gray-900 transition-colors hover:text-purple-600"
                        >
                          {subscriber.email}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <FaCalendar className="mr-2 h-3 w-3 text-gray-400" />
                          <span className="font-lora text-xs text-gray-600">
                            {formatDate(subscriber.subscribed_at)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-lora inline-flex items-center rounded-full px-2 py-1 text-xs ${
                            subscriber.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subscriber.is_active ? (
                            <>
                              <FaCheckCircle className="mr-1 h-3 w-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="mr-1 h-3 w-3" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEmailClick(subscriber.email)}
                            className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                          >
                            <FaPaperPlane className="h-3 w-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleDeleteSubscriber(subscriber.id)
                            }
                            disabled={deleteLoading === subscriber.id}
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                          >
                            {deleteLoading === subscriber.id ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="h-4 w-4 rounded-full border-2 border-red-600 border-t-transparent"
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
        </motion.div>

        {/* Compose Modal */}
        <AnimatePresence>
          {showCompose && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
              onClick={() => setShowCompose(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b p-4">
                  <h3 className="font-cinzel text-lg font-semibold text-gray-800">
                    Compose Newsletter
                  </h3>
                  <button
                    onClick={() => setShowCompose(false)}
                    className="rounded-lg p-1 transition-colors hover:bg-gray-100"
                  >
                    <FaTimesCircle className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-4">
                  <textarea
                    value={newsletterContent}
                    onChange={(e) => setNewsletterContent(e.target.value)}
                    placeholder="Type your newsletter content here... This text can be copied and used in your email campaign."
                    rows="12"
                    className="font-quicksand w-full resize-none rounded-lg border border-gray-300 p-3 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />

                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-quicksand text-sm text-gray-600">
                      {stats.active} active subscribers will receive this
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCopyContent}
                      disabled={!newsletterContent.trim()}
                      className="flex items-center rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                    >
                      <FaCopy className="mr-2 h-4 w-4" />
                      {copied ? "Copied!" : "Copy Content"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Newsletter;
