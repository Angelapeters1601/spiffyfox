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
  FiMapPin,
  FiChevronUp,
  FiChevronDown,
  FiFilter,
  FiX,
  FiSave,
  FiType,
  FiFileText,
  FiTool,
  FiCheck,
  FiPercent,
  FiAlertCircle,
  FiExternalLink,
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
  const [showCRUDModal, setShowCRUDModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);

  // Job type options for form
  const jobTypes = [
    {
      value: "residential_cleaning",
      label: "Residential Cleaning",
      icon: "🏠",
    },
    { value: "commercial_cleaning", label: "Commercial Cleaning", icon: "🏢" },
    { value: "deep_cleaning", label: "Deep Cleaning", icon: "✨" },
    { value: "organization", label: "Organization", icon: "📦" },
    { value: "powerwashing", label: "Power Washing", icon: "💦" },
    { value: "junk_removal", label: "Junk Removal", icon: "🗑️" },
    { value: "packing_unpacking", label: "Packing & Unpacking", icon: "📦" },
    { value: "personal_assistance", label: "Personal Assistance", icon: "👤" },
  ];

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
        new Date(j.deadline) <=
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
        new Date(j.deadline) >= new Date(),
    ).length;

    setStats({
      total: jobPostings.length,
      active: activeJobs,
      applications: totalApplications,
      closingSoon,
    });
  };

  // Handle row click
  const handleRowClick = (job) => {
    setSelectedJob(job);
    setIsEditing(false);
    setFormData({
      ...job,
      requirements: job.requirements?.length > 0 ? job.requirements : [""],
    });
    setShowCRUDModal(true);
  };

  // Handle new job
  const handleNewJob = () => {
    setSelectedJob(null);
    setIsEditing(true);
    setFormData({
      title: "",
      description: "",
      job_type: "residential_cleaning",
      requirements: [""],
      experience_required: "intermediate",
      equipment_required: false,
      vehicle_required: false,
      availability_needed: "full_time",
      salary_range: "",
      commission_percentage: "15",
      applications_count: 0,
      posted_date: new Date().toISOString().split("T")[0],
      deadline: "",
      status: "draft",
      location: "",
    });
    setShowCRUDModal(true);
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle requirement changes
  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData((prev) => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter(
        (_, i) => i !== index,
      );
      setFormData((prev) => ({ ...prev, requirements: newRequirements }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const submissionData = {
        ...formData,
        requirements: formData.requirements.filter((req) => req.trim() !== ""),
        applications_count: parseInt(formData.applications_count) || 0,
        commission_percentage: parseFloat(formData.commission_percentage) || 0,
        updated_at: new Date().toISOString(),
      };

      if (isEditing && selectedJob?.id) {
        // Update existing job
        const { error } = await supabase
          .from("job_postings")
          .update(submissionData)
          .eq("id", selectedJob.id);

        if (error) throw error;
      } else {
        // Create new job
        const { error } = await supabase
          .from("job_postings")
          .insert([submissionData]);

        if (error) throw error;
      }

      await fetchJobPostings(); // Refresh data
      setShowCRUDModal(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Error saving job posting:", error);
      alert("Failed to save job posting. Please try again.");
    } finally {
      setSaving(false);
    }
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
      setShowCRUDModal(false);
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

  // Loading component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 lg:p-6 xl:p-8">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="relative mx-auto mb-8">
              <div className="h-24 w-24">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                  />
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-gradient-to-r from-purple-50 to-purple-100 p-3">
                    <FiBriefcase className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-cinzel text-2xl font-bold text-gray-800">
                Loading Opportunities
              </h3>
              <p className="font-quicksand mx-auto max-w-md text-gray-600">
                Gathering the latest job postings for your contractors
              </p>
              <div className="flex justify-center gap-2 pt-4">
                <div className="h-2 w-2 animate-pulse rounded-full bg-purple-400"></div>
                <div className="animation-delay-200 h-2 w-2 animate-pulse rounded-full bg-purple-500"></div>
                <div className="animation-delay-400 h-2 w-2 animate-pulse rounded-full bg-purple-600"></div>
              </div>
            </div>
          </div>
        </div>
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
                to="/admin/contractor"
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

              <button
                // onClick={handleNewJob}
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-purple-200 sm:flex-none"
              >
                <FiPlus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                <span className="font-quicksand cursor-pointer text-sm font-semibold">
                  <Link to="/admin/job-postings/new"> New Job </Link>
                </span>
              </button>
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
                        <button
                          onClick={handleNewJob}
                          className="font-quicksand mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                        >
                          <FiPlus className="h-4 w-4" />
                          Create First Job
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => handleRowClick(job)}
                    className="group cursor-pointer border-b border-gray-100 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-white"
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
                          {job.salary_range && (
                            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1.5">
                              <FiDollarSign className="h-4 w-4 text-emerald-600" />
                              <span className="font-quicksand text-xs font-bold text-emerald-700">
                                {job.salary_range}
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
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setIsEditing(true);
                            setFormData({
                              ...job,
                              requirements:
                                job.requirements?.length > 0
                                  ? job.requirements
                                  : [""],
                            });
                            setShowCRUDModal(true);
                          }}
                          className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600"
                          title="Edit"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(job.id)}
                          className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setIsEditing(false);
                            setFormData({
                              ...job,
                              requirements:
                                job.requirements?.length > 0
                                  ? job.requirements
                                  : [""],
                            });
                            setShowCRUDModal(true);
                          }}
                          className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-600"
                          title="View Details"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
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

      {/* CRUD Modal */}
      {showCRUDModal && formData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setShowCRUDModal(false);
              setSelectedJob(null);
            }}
          />
          <div className="relative max-h-[90vh] w-full max-w-6xl scale-100 transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 p-6">
              <div>
                <h2 className="font-cinzel text-2xl font-bold text-gray-800">
                  {isEditing ? "Edit Job Posting" : "Job Details"}
                </h2>
                <p className="font-quicksand mt-1 text-sm text-gray-600">
                  {isEditing
                    ? "Update job information and requirements"
                    : "View job posting details"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`font-quicksand rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    isEditing
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700"
                      : "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700"
                  }`}
                >
                  {isEditing ? "Preview" : "Edit"}
                </button>
                <button
                  onClick={() => {
                    setShowCRUDModal(false);
                    setSelectedJob(null);
                  }}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div
              className="overflow-y-auto p-6"
              style={{ maxHeight: "calc(90vh - 120px)" }}
            >
              {isEditing ? (
                // Edit Form
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                          <FiType className="h-5 w-5 text-purple-600" />
                          <h3 className="font-cinzel text-lg font-semibold text-gray-800">
                            Basic Information
                          </h3>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                              Job Title *
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleFormChange}
                              className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                              Job Type
                            </label>
                            <select
                              name="job_type"
                              value={formData.job_type}
                              onChange={handleFormChange}
                              className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                            >
                              {jobTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.icon} {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                              Description *
                            </label>
                            <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleFormChange}
                              rows={4}
                              className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                          <FiTool className="h-5 w-5 text-blue-600" />
                          <h3 className="font-cinzel text-lg font-semibold text-gray-800">
                            Requirements
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {formData.requirements.map((req, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="text"
                                value={req}
                                onChange={(e) =>
                                  handleRequirementChange(index, e.target.value)
                                }
                                placeholder="Add a requirement..."
                                className="font-quicksand flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => removeRequirement(index)}
                                className="rounded-lg p-2.5 text-red-600 hover:bg-red-50"
                                disabled={formData.requirements.length <= 1}
                              >
                                <FiX className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addRequirement}
                            className="font-quicksand flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 py-2.5 text-sm text-gray-600 hover:bg-gray-100"
                          >
                            <FiPlus className="h-4 w-4" />
                            Add Requirement
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Details */}
                      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                          <FiFileText className="h-5 w-5 text-emerald-600" />
                          <h3 className="font-cinzel text-lg font-semibold text-gray-800">
                            Job Details
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                              Experience Required
                            </label>
                            <select
                              name="experience_required"
                              value={formData.experience_required}
                              onChange={handleFormChange}
                              className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                            >
                              <option value="entry">
                                Entry Level (0-2 years)
                              </option>
                              <option value="intermediate">
                                Intermediate (2-5 years)
                              </option>
                              <option value="experienced">
                                Experienced (5+ years)
                              </option>
                            </select>
                          </div>
                          <div>
                            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                              Availability Needed
                            </label>
                            <select
                              name="availability_needed"
                              value={formData.availability_needed}
                              onChange={handleFormChange}
                              className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                            >
                              <option value="full_time">Full Time</option>
                              <option value="part_time">Part Time</option>
                              <option value="flexible">Flexible Hours</option>
                              <option value="weekends">Weekends Only</option>
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="font-quicksand block text-sm font-medium text-gray-700">
                              Equipment Requirements
                            </label>
                            <div className="space-y-2">
                              <label className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  name="equipment_required"
                                  checked={formData.equipment_required}
                                  onChange={handleFormChange}
                                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="font-quicksand text-sm text-gray-700">
                                  Equipment Required
                                </span>
                              </label>
                              <label className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  name="vehicle_required"
                                  checked={formData.vehicle_required}
                                  onChange={handleFormChange}
                                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="font-quicksand text-sm text-gray-700">
                                  Vehicle Required
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Compensation */}
                      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                          <FiDollarSign className="h-5 w-5 text-yellow-600" />
                          <h3 className="font-cinzel text-lg font-semibold text-gray-800">
                            Compensation & Timeline
                          </h3>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                              Salary Range
                            </label>
                            <input
                              type="text"
                              name="salary_range"
                              value={formData.salary_range}
                              onChange={handleFormChange}
                              placeholder="$40,000 - $55,000"
                              className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                              Commission Percentage
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                name="commission_percentage"
                                value={formData.commission_percentage}
                                onChange={handleFormChange}
                                min="0"
                                max="100"
                                step="0.5"
                                className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                              />
                              <FiPercent className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                              Application Deadline
                            </label>
                            <div className="relative">
                              <FiCalendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                              <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleFormChange}
                                min={new Date().toISOString().split("T")[0]}
                                className="font-quicksand w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                              Status
                            </label>
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleFormChange}
                              className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                            >
                              <option value="draft">Draft</option>
                              <option value="active">Active</option>
                              <option value="closed">Closed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowCRUDModal(false)}
                        className="font-quicksand rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedJob) {
                            handleDelete(selectedJob.id);
                          }
                        }}
                        className="font-quicksand rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
                      >
                        Delete Job
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, status: "draft" }));
                          handleSubmit({ preventDefault: () => {} });
                        }}
                        className="font-quicksand rounded-lg border border-yellow-300 bg-yellow-50 px-5 py-2.5 text-sm font-medium text-yellow-700 transition-all hover:bg-yellow-100"
                      >
                        Save as Draft
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="font-quicksand flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                // Preview Mode
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Left Column - Job Info */}
                  <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="mb-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h2 className="font-cinzel text-2xl font-bold text-gray-800">
                            {formData.title}
                          </h2>
                          <JobStatusBadge status={formData.status} />
                        </div>
                        <div className="mb-4 flex items-center gap-2">
                          <div className="rounded-lg bg-purple-100 p-2">
                            <FiBriefcase className="h-5 w-5 text-purple-600" />
                          </div>
                          <span className="font-quicksand font-medium text-gray-700">
                            {
                              jobTypes.find(
                                (t) => t.value === formData.job_type,
                              )?.label
                            }
                          </span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="font-cinzel mb-3 text-lg font-semibold text-gray-800">
                          Description
                        </h3>
                        <p className="font-quicksand text-gray-600">
                          {formData.description || "No description provided"}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-quicksand text-gray-600">
                            Experience:
                          </span>
                          <span className="font-quicksand font-medium text-gray-800">
                            {formData.experience_required === "entry"
                              ? "Entry Level"
                              : formData.experience_required === "intermediate"
                                ? "Intermediate"
                                : "Experienced"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-quicksand text-gray-600">
                            Availability:
                          </span>
                          <span className="font-quicksand font-medium text-gray-800">
                            {formData.availability_needed === "full_time"
                              ? "Full Time"
                              : formData.availability_needed === "part_time"
                                ? "Part Time"
                                : formData.availability_needed === "flexible"
                                  ? "Flexible"
                                  : "Weekends"}
                          </span>
                        </div>
                        {formData.equipment_required && (
                          <div className="flex items-center justify-between">
                            <span className="font-quicksand text-gray-600">
                              Equipment:
                            </span>
                            <span className="font-quicksand font-medium text-gray-800">
                              {formData.equipment_required
                                ? "Required"
                                : "Not Required"}
                            </span>
                          </div>
                        )}
                        {formData.vehicle_required && (
                          <div className="flex items-center justify-between">
                            <span className="font-quicksand text-gray-600">
                              Vehicle:
                            </span>
                            <span className="font-quicksand font-medium text-gray-800">
                              {formData.vehicle_required
                                ? "Required"
                                : "Not Required"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Requirements Preview */}
                    {formData.requirements?.filter((r) => r.trim() !== "")
                      .length > 0 && (
                      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="font-cinzel mb-4 text-lg font-semibold text-gray-800">
                          Requirements
                        </h3>
                        <ul className="space-y-2">
                          {formData.requirements
                            .filter((r) => r.trim() !== "")
                            .map((req, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <FiCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                <span className="font-quicksand text-gray-600">
                                  {req}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Details & Actions */}
                  <div className="space-y-6">
                    {/* Compensation */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h3 className="font-cinzel mb-4 text-lg font-semibold text-gray-800">
                        Compensation & Timeline
                      </h3>
                      <div className="space-y-4">
                        {formData.salary_range && (
                          <div className="flex items-center justify-between">
                            <span className="font-quicksand text-gray-600">
                              Salary Range:
                            </span>
                            <span className="font-quicksand font-bold text-emerald-600">
                              {formData.salary_range}
                            </span>
                          </div>
                        )}
                        {formData.commission_percentage &&
                          formData.commission_percentage > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="font-quicksand text-gray-600">
                                Commission:
                              </span>
                              <span className="font-quicksand font-bold text-purple-600">
                                {formData.commission_percentage}%
                              </span>
                            </div>
                          )}
                        {formData.deadline && (
                          <div className="flex items-center justify-between">
                            <span className="font-quicksand text-gray-600">
                              Deadline:
                            </span>
                            <div className="text-right">
                              <span className="font-quicksand block font-bold text-gray-800">
                                {new Date(formData.deadline).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                              <span className="font-quicksand text-sm text-gray-500">
                                {formatDate(formData.deadline)}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-quicksand text-gray-600">
                            Posted:
                          </span>
                          <span className="font-quicksand font-medium text-gray-800">
                            {new Date(formData.posted_date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-quicksand text-gray-600">
                            Applications:
                          </span>
                          <div className="flex items-center gap-2">
                            <FiUsers className="h-4 w-4 text-purple-600" />
                            <span className="font-quicksand font-bold text-gray-800">
                              {formData.applications_count || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h3 className="font-cinzel mb-4 text-lg font-semibold text-gray-800">
                        Quick Actions
                      </h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="font-quicksand flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg"
                        >
                          <FiEdit className="h-4 w-4" />
                          Edit Job Details
                        </button>
                        <Link
                          to={`/admin/contractors?job=${selectedJob?.id}`}
                          className="font-quicksand flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                        >
                          <FiUsers className="h-4 w-4" />
                          View Applicants (
                          {selectedJob?.applications_count || 0})
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                  onClick={() => {
                    handleDelete(showDeleteConfirm);
                    setShowDeleteConfirm(null);
                  }}
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
