import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../services/supabaseClient";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
  });
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch FAQs from Supabase
  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("faq")
        .select("*")
        .order("order", { ascending: true });

      console.log("FAQ Response:", { data, error }); // Add this

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update existing FAQ
        const { error } = await supabase
          .from("faq")
          .update({
            question: formData.question,
            answer: formData.answer,
            category: formData.category,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
      } else {
        // Create new FAQ
        const { error } = await supabase.from("faq").insert([
          {
            question: formData.question,
            answer: formData.answer,
            category: formData.category,
            order: faqs.length + 1,
          },
        ]);

        if (error) throw error;
      }

      await fetchFaqs();
      resetForm();
    } catch (error) {
      console.error("Error saving FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("faq").delete().eq("id", id);

      if (error) throw error;
      await fetchFaqs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    });
    setEditingId(faq.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({ question: "", answer: "", category: "general" });
    setEditingId(null);
    setIsAdding(false);
  };

  const categories = [
    {
      value: "general",
      label: "General",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      value: "services",
      label: "Services",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      value: "pricing",
      label: "Pricing",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      value: "support",
      label: "Support",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    {
      value: "technical",
      label: "Technical",
      color: "bg-red-100 text-red-800 border-red-200",
    },
  ];

  const getFaqsByCategory = () => {
    const categorized = {};
    const filteredFaqs =
      selectedCategory === "all"
        ? faqs
        : faqs.filter((faq) => faq.category === selectedCategory);

    filteredFaqs.forEach((faq) => {
      if (!categorized[faq.category]) {
        categorized[faq.category] = [];
      }
      categorized[faq.category].push(faq);
    });
    return categorized;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const accordionVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="font-cinzel mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            FAQ Management
          </h1>
          <p className="font-quicksand mx-auto max-w-2xl text-lg text-gray-600">
            Manage frequently asked questions for SpiffyFox with real-time
            updates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-3">
            {/* Add/Edit Form */}
            <AnimatePresence>
              {(isAdding || editingId) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-cinzel text-2xl font-bold text-gray-900">
                      {editingId ? "Edit FAQ" : "Add New FAQ"}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100"
                    >
                      <svg
                        className="h-5 w-5 text-gray-500"
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
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="font-quicksand mb-3 block font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className="font-quicksand w-full cursor-pointer rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-wrap items-end gap-2">
                        {categories.map((cat) => (
                          <div
                            key={cat.value}
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${cat.color} cursor-default transition-transform duration-200 hover:scale-105`}
                          >
                            {cat.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-quicksand mb-3 block font-medium text-gray-700">
                        Question
                      </label>
                      <input
                        type="text"
                        value={formData.question}
                        onChange={(e) =>
                          setFormData({ ...formData, question: e.target.value })
                        }
                        className="font-quicksand w-full rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter a clear and concise question..."
                        required
                      />
                    </div>

                    <div>
                      <label className="font-quicksand mb-3 block font-medium text-gray-700">
                        Answer
                      </label>
                      <textarea
                        value={formData.answer}
                        onChange={(e) =>
                          setFormData({ ...formData, answer: e.target.value })
                        }
                        rows={5}
                        className="font-quicksand w-full resize-none rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        placeholder="Provide a detailed and helpful answer..."
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="font-quicksand spiffy-bg-dark flex flex-1 transform cursor-pointer items-center justify-center space-x-2 rounded-xl px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-purple-500 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-purple-400"
                      >
                        {loading ? (
                          <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>
                              {editingId ? "Updating..." : "Adding..."}
                            </span>
                          </>
                        ) : (
                          <span>{editingId ? "Update FAQ" : "Add FAQ"}</span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="font-quicksand flex-1 cursor-pointer rounded-xl bg-gray-500 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-cinzel text-lg font-bold text-gray-900">
                  Filter FAQs
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      selectedCategory === "all"
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        selectedCategory === cat.value
                          ? `${cat.color.replace("bg-", "bg-").replace("text-", "text-")} border-transparent shadow-md`
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* FAQ List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {loading && faqs.length === 0 ? (
                // Skeleton Loading
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <div className="mb-4 h-6 w-3/4 rounded bg-gray-200"></div>
                      <div className="h-4 w-full rounded bg-gray-200"></div>
                    </div>
                  ))}
                </div>
              ) : Object.entries(getFaqsByCategory()).length > 0 ? (
                Object.entries(getFaqsByCategory()).map(
                  ([category, categoryFaqs]) => (
                    <motion.div
                      key={category}
                      variants={itemVariants}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-cinzel text-xl font-bold text-gray-900 capitalize">
                            {categories.find((cat) => cat.value === category)
                              ?.label || category}
                          </h3>
                          <span className="font-quicksand rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-500">
                            {categoryFaqs.length} question
                            {categoryFaqs.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      <div className="divide-y divide-gray-100">
                        {categoryFaqs.map((faq) => (
                          <motion.div
                            key={faq.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="transition-all duration-200 hover:bg-gray-50"
                          >
                            <div
                              onClick={() =>
                                setExpandedId(
                                  expandedId === faq.id ? null : faq.id,
                                )
                              }
                              className="flex w-full cursor-pointer items-start justify-between px-6 py-5 text-left transition-all duration-200 hover:bg-gray-50"
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setExpandedId(
                                    expandedId === faq.id ? null : faq.id,
                                  );
                                }
                              }}
                            >
                              <div className="flex-1 text-left">
                                <h4 className="font-quicksand mb-2 pr-8 text-lg font-semibold text-gray-900">
                                  {faq.question}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                      categories.find(
                                        (cat) => cat.value === faq.category,
                                      )?.color
                                    }`}
                                  >
                                    {
                                      categories.find(
                                        (cat) => cat.value === faq.category,
                                      )?.label
                                    }
                                  </span>
                                  <span className="font-quicksand text-xs text-gray-500">
                                    Updated{" "}
                                    {new Date(
                                      faq.updated_at || faq.created_at,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              <div className="ml-4 flex items-center space-x-3">
                                <div className="flex space-x-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(faq);
                                    }}
                                    className="cursor-pointer rounded-lg p-2 text-blue-600 transition-colors duration-200 hover:bg-blue-50"
                                    title="Edit FAQ"
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(faq.id);
                                    }}
                                    className="cursor-pointer rounded-lg p-2 text-red-600 transition-colors duration-200 hover:bg-red-50"
                                    title="Delete FAQ"
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <motion.div
                                  animate={{
                                    rotate: expandedId === faq.id ? 180 : 0,
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className="p-1"
                                >
                                  <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </motion.div>
                              </div>
                            </div>

                            <AnimatePresence>
                              {expandedId === faq.id && (
                                <motion.div
                                  variants={accordionVariants}
                                  initial="closed"
                                  animate="open"
                                  exit="closed"
                                  className="overflow-hidden"
                                >
                                  <div className="px-6 pb-5">
                                    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 shadow-inner">
                                      <p className="font-quicksand leading-relaxed whitespace-pre-wrap text-gray-700">
                                        {faq.answer}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ),
                )
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 text-center"
                >
                  <svg
                    className="mx-auto mb-4 h-20 w-20 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="font-cinzel mb-3 text-xl font-bold text-gray-500">
                    No FAQs Found
                  </h3>
                  <p className="font-quicksand mx-auto mb-6 max-w-md text-gray-400">
                    {selectedCategory === "all"
                      ? "Get started by adding your first frequently asked question."
                      : `No FAQs found in the ${categories.find((cat) => cat.value === selectedCategory)?.label} category.`}
                  </p>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="font-quicksand spiffy-bg transform cursor-pointer rounded-xl px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-purple-700"
                  >
                    Add New FAQ
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <h3 className="font-cinzel mb-6 text-xl font-bold text-gray-900">
                Quick Actions
              </h3>

              <button
                onClick={() => setIsAdding(true)}
                disabled={loading}
                className="font-quicksand spiffy-bg mb-6 flex w-full transform cursor-pointer items-center justify-center space-x-2 rounded-xl px-4 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-purple-700 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-purple-400"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add New FAQ</span>
              </button>

              <div className="mb-6 space-y-4">
                <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                  <h4 className="font-quicksand mb-2 font-bold text-blue-900">
                    Total FAQs
                  </h4>
                  <p className="font-cormorant text-2xl font-bold text-blue-600">
                    {faqs.length}
                  </p>
                </div>

                <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-green-100 p-4">
                  <h4 className="font-quicksand mb-2 font-bold text-green-900">
                    Categories
                  </h4>
                  <p className="font-cormorant text-2xl font-bold text-green-600">
                    {Object.keys(getFaqsByCategory()).length}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-4">
                <h4 className="font-quicksand mb-3 flex items-center font-bold text-purple-900">
                  <span className="mr-2">💡</span>
                  Pro Tips
                </h4>
                <ul className="font-quicksand space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="mt-1 text-purple-500">•</span>
                    <span>Keep questions clear and concise</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="mt-1 text-purple-500">•</span>
                    <span>Use categories to organize content</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="mt-1 text-purple-500">•</span>
                    <span>Update FAQs regularly</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="mt-1 text-purple-500">•</span>
                    <span>Use simple, accessible language</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
