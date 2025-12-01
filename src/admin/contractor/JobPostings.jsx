import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiEye,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiClock,
  FiArrowLeft,
  FiCheckCircle,
  FiBriefcase,
  FiTrendingUp,
  FiMapPin,
  FiChevronUp,
  FiChevronDown,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { supabase } from "../../services/supabaseClient";
import JobStatusBadge from "../../admin/contractor/JobStatusBadge";

const JobPostings = () => {
  const navigate = useNavigate();
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    applications: 0,
    closingSoon: 0,
  });

  useEffect(() => {
    fetchJobPostings();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [jobPostings]);

  const fetchJobPostings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobPostings(data || []);
    } catch (error) {
      console.error("Error fetching job postings:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const activeJobs = jobPostings.filter((j) => j.status === "active").length;
    const totalApplications = jobPostings.reduce(
      (sum, job) => sum + (job.applications_count || 0),
      0,
    );
    const closingSoon = jobPostings.filter(
      (j) =>
        j.deadline &&
        new Date(j.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ).length;

    setStats({
      total: jobPostings.length,
      active: activeJobs,
      applications: totalApplications,
      closingSoon,
    });
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setJobPostings(jobPostings.filter((job) => job.id !== id));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting job posting:", error);
    }
  };

  const formatJobType = (jobType) => {
    const jobTypes = {
      residential_cleaning: "Residential Cleaning",
      commercial_cleaning: "Commercial Cleaning",
      deep_cleaning: "Deep Cleaning",
      organization: "Organization",
      powerwashing: "Power Washing",
      junk_removal: "Junk Removal",
      packing_unpacking: "Packing & Unpacking",
      personal_assistance: "Personal Assistance",
    };
    return jobTypes[jobType] || jobType.replace("_", " ").toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return "Expired";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getLocationBadge = (location) => {
    if (!location) return null;
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
        <FiMapPin className="h-3.5 w-3.5 text-gray-600" />
        <span className="font-quicksand text-xs font-medium text-gray-700">
          {location}
        </span>
      </div>
    );
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortedAndFilteredJobs = () => {
    let filtered = jobPostings.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" || job.status === filterStatus;

      return matchesSearch && matchesFilter;
    });

    // Sorting logic
    filtered.sort((a, b) => {
      const { key, direction } = sortConfig;
      let aValue = a[key];
      let bValue = b[key];

      // Handle special cases
      if (key === "applications_count") {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }

      if (key === "deadline") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  };

  const filteredJobs = getSortedAndFilteredJobs();

  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? (
      <FiChevronUp className="h-4 w-4" />
    ) : (
      <FiChevronDown className="h-4 w-4" />
    );
  };

  const ClearFilters = () => {
    if (searchTerm || filterStatus !== "all") {
      return (
        <button
          onClick={() => {
            setSearchTerm("");
            setFilterStatus("all");
          }}
          className="font-quicksand flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <FiX className="h-4 w-4" />
          Clear Filters
        </button>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 lg:p-6 xl:p-8">
        {/* Clean Loading Overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="text-center">
            {/* Modern spinner */}
            <div className="relative mx-auto mb-8">
              {/* Outer ring */}
              <div className="h-24 w-24">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                  />
                  {/* Animated arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    strokeDashoffset="75"
                    className="animate-spin"
                  />
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Centered icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-gradient-to-r from-purple-50 to-purple-100 p-3">
                    <FiBriefcase className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="space-y-3">
              <h3 className="font-cinzel text-2xl font-bold text-gray-800">
                Loading Opportunities
              </h3>
              <p className="font-quicksand mx-auto max-w-md text-gray-600">
                Gathering the latest job postings for your contractors
              </p>

              {/* Animated progress dots */}
              <div className="flex justify-center gap-2 pt-4">
                <div className="h-2 w-2 animate-pulse rounded-full bg-purple-400"></div>
                <div className="animation-delay-200 h-2 w-2 animate-pulse rounded-full bg-purple-500"></div>
                <div className="animation-delay-400 h-2 w-2 animate-pulse rounded-full bg-purple-600"></div>
              </div>
            </div>

            {/* Subtle decorative elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -left-10 h-20 w-20 rounded-full bg-purple-100/30"></div>
              <div className="absolute -right-10 -bottom-10 h-20 w-20 rounded-full bg-purple-100/30"></div>
            </div>
          </div>
        </div>

        {/* Add Tailwind animation delays */}
        <style jsx>{`
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 lg:p-6 xl:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Link
                to="/admin/contractors"
                className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
              >
                <FiArrowLeft className="text-lg text-gray-600 transition-transform group-hover:-translate-x-1" />
              </Link>
              <div>
                <h1 className="font-cinzel mb-2 bg-gradient-to-r from-gray-900 via-purple-700 to-purple-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                  Job Postings
                </h1>
                <p className="font-quicksand text-sm text-gray-600">
                  Create and manage job opportunities for contractors
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:min-w-[280px]">
              <FiSearch className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, locations, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="font-quicksand w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-12 text-sm shadow-sm transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <FiFilter className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="font-quicksand w-full rounded-xl border border-gray-200 bg-white py-3 pr-8 pl-10 text-sm shadow-sm transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none sm:w-auto"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <Link
                to="/admin/job-postings/new"
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-purple-200 sm:flex-none"
              >
                <FiPlus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                <span className="font-quicksand text-sm font-semibold">
                  New Job
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Jobs",
            value: stats.total,
            icon: FiBriefcase,
            color: "bg-gradient-to-r from-blue-500 to-blue-600",
            iconColor: "text-blue-600",
            borderColor: "border-blue-100",
          },
          {
            title: "Active Jobs",
            value: stats.active,
            icon: FiCheckCircle,
            color: "bg-gradient-to-r from-emerald-500 to-green-500",
            iconColor: "text-emerald-600",
            borderColor: "border-emerald-100",
          },
          {
            title: "Total Applications",
            value: stats.applications,
            icon: FiUsers,
            color: "bg-gradient-to-r from-purple-500 to-purple-600",
            iconColor: "text-purple-600",
            borderColor: "border-purple-100",
          },
          {
            title: "Closing Soon",
            value: stats.closingSoon,
            icon: FiClock,
            color: "bg-gradient-to-r from-amber-500 to-orange-500",
            iconColor: "text-amber-600",
            borderColor: "border-amber-100",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl border ${stat.borderColor} bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg`}
          >
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-xl ${stat.color} p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div
                  className={`h-10 w-10 rounded-full ${stat.color} opacity-10`}
                />
              </div>
              <p className="font-quicksand mb-1 text-sm font-medium text-gray-600">
                {stat.title}
              </p>
              <h3 className="font-cinzel text-2xl font-bold text-gray-800">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Jobs Table */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-cinzel text-xl font-semibold text-gray-800">
                All Job Postings
              </h2>
              <p className="font-quicksand mt-1 text-sm text-gray-600">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
                found
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ClearFilters />
              <div className="flex items-center gap-2">
                <span className="font-quicksand text-sm font-medium text-gray-600">
                  Sort by:
                </span>
                <select
                  value={sortConfig.key}
                  onChange={(e) => handleSort(e.target.value)}
                  className="font-quicksand rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                >
                  <option value="created_at">Newest First</option>
                  <option value="applications_count">Most Applications</option>
                  <option value="deadline">Closing Soon</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="font-quicksand px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-1 hover:text-purple-700"
                  >
                    Job Details
                    <SortIndicator columnKey="title" />
                  </button>
                </th>
                <th className="font-quicksand px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Type & Location
                </th>
                <th className="font-quicksand px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("applications_count")}
                    className="flex items-center gap-1 hover:text-purple-700"
                  >
                    Applications
                    <SortIndicator columnKey="applications_count" />
                  </button>
                </th>
                <th className="font-quicksand px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("deadline")}
                    className="flex items-center gap-1 hover:text-purple-700"
                  >
                    Deadline
                    <SortIndicator columnKey="deadline" />
                  </button>
                </th>
                <th className="font-quicksand px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="font-quicksand px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="mx-auto max-w-md">
                      <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-gray-100 p-4">
                          <FiBriefcase className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="font-cinzel mb-2 text-lg font-semibold text-gray-800">
                        No jobs found
                      </h3>
                      <p className="font-quicksand text-sm text-gray-600">
                        {searchTerm || filterStatus !== "all"
                          ? "Try adjusting your search or filter to find what you're looking for."
                          : "Create your first job posting to get started."}
                      </p>
                      {(searchTerm || filterStatus !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setFilterStatus("all");
                          }}
                          className="font-quicksand mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                        >
                          <FiX className="h-4 w-4" />
                          Clear Filters
                        </button>
                      )}
                      {!searchTerm && filterStatus === "all" && (
                        <Link
                          to="/admin/job-postings/new"
                          className="font-quicksand mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                        >
                          <FiPlus className="h-4 w-4" />
                          Create First Job
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="group border-b border-gray-100 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-white"
                  >
                    <td className="border-r border-gray-100 px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="hidden rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 p-3 sm:block">
                          <FiBriefcase className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-cinzel block text-sm font-semibold text-gray-800 group-hover:text-purple-700">
                            {job.title}
                          </span>
                          <span className="font-quicksand mt-1 line-clamp-2 text-sm text-gray-500">
                            {job.description || "No description provided"}
                          </span>
                          {job.salary && (
                            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1.5">
                              <FiDollarSign className="h-4 w-4 text-emerald-600" />
                              <span className="font-quicksand text-xs font-bold text-emerald-700">
                                {job.salary}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="border-r border-gray-100 px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span className="font-quicksand inline-block rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                          {formatJobType(job.job_type)}
                        </span>
                        {getLocationBadge(job.location)}
                      </div>
                    </td>
                    <td className="border-r border-gray-100 px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-50 to-purple-100">
                            <FiUsers className="h-5 w-5 text-purple-600" />
                          </div>
                          {job.applications_count > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-xs font-bold text-white shadow-sm">
                              {job.applications_count}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-cinzel block text-lg font-bold text-gray-800">
                            {job.applications_count || 0}
                          </span>
                          <span className="font-quicksand text-xs text-gray-500">
                            application{job.applications_count !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="border-r border-gray-100 px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-2">
                          <FiCalendar className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <span className="font-cinzel block text-sm font-bold text-gray-800">
                            {formatDate(job.deadline)}
                          </span>
                          {job.deadline && (
                            <span className="font-quicksand text-xs text-gray-500">
                              {new Date(job.deadline).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="border-r border-gray-100 px-6 py-4">
                      <JobStatusBadge status={job.status} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/admin/job-postings/edit/${job.id}`}
                          className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600"
                          title="Edit"
                        >
                          <FiEdit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setShowDeleteConfirm(job.id)}
                          className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/admin/job-postings/${job.id}`}
                          className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-600"
                          title="View Details"
                        >
                          <FiEye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/contractors?job=${job.id}`}
                          className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 hover:text-emerald-600"
                          title="View Applicants"
                        >
                          <FiUsers className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredJobs.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <span className="font-quicksand text-sm font-medium text-gray-600">
                  Status Filter:
                </span>
                <div className="flex flex-wrap gap-1">
                  {["all", "active", "draft", "closed", "cancelled"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`font-quicksand rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          filterStatus === status
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-quicksand text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-bold">{filteredJobs.length}</span> of{" "}
                  <span className="font-bold">{jobPostings.length}</span> jobs
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowDeleteConfirm(null)}
          />
          <div className="relative w-full max-w-md scale-100 transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300">
            <div className="p-8">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-gradient-to-r from-red-50 to-rose-100 p-4">
                  <FiTrash2 className="text-gradient-to-r h-8 w-8 from-red-600 to-rose-600" />
                </div>
              </div>
              <h3 className="font-cinzel mb-3 text-center text-2xl font-semibold text-gray-800">
                Delete Job Posting
              </h3>
              <p className="font-quicksand mb-8 text-center text-gray-600">
                Are you sure you want to delete this job posting? This action
                cannot be undone and will remove all associated applications.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="font-quicksand flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="font-quicksand flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:shadow-md"
                >
                  Delete Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostings;
