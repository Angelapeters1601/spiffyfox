import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronRight,
  FiSearch,
  FiHelpCircle,
  FiX,
  FiStar,
  FiHash,
  FiGlobe,
  FiCreditCard,
  FiTool,
  FiShield,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  // Category configuration with icons and subtle colors
  const categoryConfig = {
    general: {
      icon: <FiGlobe className="text-blue-500" />,
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
    },
    pricing: {
      icon: <FiCreditCard className="text-emerald-500" />,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
    },
    services: {
      icon: <FiTool className="text-purple-500" />,
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
    },
    support: {
      icon: <FiCalendar className="text-amber-500" />,
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
    },
    technical: {
      icon: <FiShield className="text-rose-500" />,
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-700",
    },
  };

  // Fetch FAQs from Supabase
  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("faq")
        .select("*")
        .order("order", { ascending: true });

      if (error) throw error;

      setFaqs(data || []);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(data?.map((item) => item.category) || []),
      ];
      setCategories(["all", ...uniqueCategories]);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      setError("Failed to load FAQs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <div className="border-t-spiffy-text h-8 w-8 animate-spin rounded-full border-2 border-gray-300"></div>
          </div>
          <p className="font-quicksand text-gray-600">
            Loading knowledge base...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="max-w-md p-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <FiHelpCircle className="text-2xl text-gray-400" />
          </div>
          <h3 className="font-cinzel mb-2 text-xl font-semibold text-gray-900">
            Unable to load FAQ
          </h3>
          <p className="font-quicksand mb-4 text-gray-600">{error}</p>
          <button
            onClick={fetchFaqs}
            className="font-quicksand rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="mb-2 flex items-center gap-2">
              <div className="bg-spiffy-bg-light flex h-8 w-8 items-center justify-center rounded">
                <FiHash className="spiffy-text text-sm" />
              </div>
              <span className="font-quicksand text-sm font-medium text-gray-500">
                Knowledge Base
              </span>
            </div>
            <h1 className="font-cinzel text-2xl font-bold text-gray-900 md:text-3xl">
              Frequently Asked Questions
            </h1>
            <p className="font-lora mt-2 text-gray-600">
              Find answers to common questions about our services
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="font-quicksand outline:none spiffy-border w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm focus:border focus:ring-1 focus:ring-purple-200 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="text-sm" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-cinzel text-sm font-semibold tracking-wide text-gray-900 uppercase">
                    Categories
                  </h3>
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="font-quicksand text-xs text-gray-500 hover:text-gray-700"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`font-quicksand flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      selectedCategory === "all"
                        ? "spiffy-bg-light spiffy-text"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-xs">
                      <FiHelpCircle className="text-gray-900" />
                      All Questions
                    </span>
                    <span className="text-xs text-gray-400">{faqs.length}</span>
                  </button>

                  {categories
                    .filter((cat) => cat !== "all")
                    .map((category) => {
                      const config =
                        categoryConfig[category] || categoryConfig.general;
                      const count = faqs.filter(
                        (f) => f.category === category,
                      ).length;

                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`font-quicksand flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                            selectedCategory === category
                              ? `${config.bg} ${config.text} border ${config.border}`
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {config.icon}
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </span>
                          <span className="text-xs text-gray-400">{count}</span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Stats */}
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-cinzel mb-3 text-sm font-semibold tracking-wide text-gray-900 uppercase">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-quicksand text-sm text-gray-600">
                      Total Questions
                    </span>
                    <span className="font-quicksand font-medium text-gray-900">
                      {faqs.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-quicksand text-sm text-gray-600">
                      Categories
                    </span>
                    <span className="font-quicksand font-medium text-gray-900">
                      {categories.length - 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-quicksand text-sm text-gray-600">
                      Updated
                    </span>
                    <span className="font-quicksand text-sm text-gray-500">
                      Recently
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-cinzel text-xl font-bold text-gray-900">
                    {selectedCategory === "all"
                      ? "All Questions"
                      : categoryConfig[selectedCategory]?.icon && (
                          <span className="flex items-center gap-2">
                            {categoryConfig[selectedCategory].icon}
                            {selectedCategory.charAt(0).toUpperCase() +
                              selectedCategory.slice(1)}{" "}
                            Questions
                          </span>
                        )}
                  </h2>
                  <p className="font-quicksand mt-1 text-xs text-gray-600">
                    {filteredFaqs.length} of {faqs.length} questions shown
                  </p>
                </div>

                {(searchQuery || selectedCategory !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="font-quicksand flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FiX className="text-sm" />
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* FAQ List */}
            {filteredFaqs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center"
              >
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <FiHelpCircle className="text-2xl text-gray-400" />
                </div>
                <h3 className="font-cinzel mb-2 text-xl font-semibold text-gray-900">
                  No results found
                </h3>
                <p className="font-quicksand mx-auto mb-6 max-w-sm text-gray-600">
                  {searchQuery
                    ? `No questions match "${searchQuery}". Try different keywords.`
                    : "No questions in this category yet."}
                </p>
                <button
                  onClick={clearFilters}
                  className="font-quicksand rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  View all questions
                </button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-gray-300"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="flex w-full items-start justify-between p-6 text-left hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <span
                              className={`font-quicksand inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                categoryConfig[faq.category]?.bg ||
                                "bg-gray-100"
                              } ${
                                categoryConfig[faq.category]?.text ||
                                "text-gray-700"
                              }`}
                            >
                              {categoryConfig[faq.category]?.icon}
                              {faq.category.charAt(0).toUpperCase() +
                                faq.category.slice(1)}
                            </span>
                            <span className="font-quicksand text-xs text-gray-500">
                              #
                              {(faq.order || index + 1)
                                .toString()
                                .padStart(2, "0")}
                            </span>
                          </div>
                          <h3 className="font-cinzel text-sm font-semibold text-gray-900">
                            {faq.question}
                          </h3>
                        </div>
                        <div className="ml-4 flex items-center">
                          {expandedId === faq.id ? (
                            <FiChevronDown className="text-gray-400" />
                          ) : (
                            <FiChevronRight className="text-gray-400" />
                          )}
                        </div>
                      </button>

                      {/* Answer */}
                      <AnimatePresence>
                        {expandedId === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-gray-100"
                          >
                            <div className="bg-gray-50 p-6">
                              <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                  <div className="spiffy-bg-light flex h-6 w-6 items-center justify-center rounded-full">
                                    <FiHelpCircle className="spiffy-text text-sm" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="font-quicksand text-xs leading-relaxed text-gray-700">
                                    {faq.answer}
                                  </p>
                                  <div className="mt-4 border-t border-gray-200 pt-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <div className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                        <FiStar className="text-xs text-yellow-500" />
                                        <span className="font-quicksand">
                                          Helpful? Let us know
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Results Footer */}
            {filteredFaqs.length > 0 && (
              <div className="mt-8 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <div className="font-quicksand text-sm text-gray-600">
                  Showing {filteredFaqs.length} of {faqs.length} questions
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={clearFilters}
                    className="font-quicksand cursor:pointer text-sm text-gray-700 hover:text-gray-900"
                  >
                    Clear all filters
                  </button>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <button className="font-quicksand text-spiffy-text text-sm hover:underline">
                    <Link to="/contact"> Need more help?</Link>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
