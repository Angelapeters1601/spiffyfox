import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUserPlus,
  FiTrash2,
  FiEye,
  FiSearch,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDownload,
  FiArrowUp,
  FiArrowDown,
  FiPlus,
  FiExternalLink,
  FiFilter,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { supabase } from "../../services/supabaseClient";
import ApplicantManagement from "./ApplicantManagement";

const AdminContractor = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [stats, setStats] = useState({
    total_applications: 0,
    new_applications: 0,
    total_interviews: 0,
    total_hired: 0,
    rejected: 0,
    pending_review: 0,
    upcoming_interviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    jobType: "all",
    state: "all",
    country: "all",
    service: "all",
    dateRange: "all",
  });
  const [chartData, setChartData] = useState({
    applicationTrend: [],
    statusDistribution: [],
    geoDistribution: [],
    serviceDistribution: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    states: [],
    countries: [],
    services: [],
    jobTypes: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const { data: contractorsData } = await supabase
        .from("contractors")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: jobPostingsData } = await supabase
        .from("job_postings")
        .select("*")
        .order("created_at", { ascending: false });

      if (contractorsData) {
        const statsData = calculateStats(contractorsData);
        setStats(statsData);

        const options = extractFilterOptions(contractorsData);
        setFilterOptions(options);

        const charts = generateChartData(contractorsData);
        setChartData(charts);

        const formattedContractors = contractorsData.map((contractor) => ({
          id: contractor.id,
          name: `${contractor.first_name} ${contractor.last_name}`,
          email: contractor.email,
          phone: contractor.phone,
          address: `${contractor.address}, ${contractor.city}, ${contractor.state} ${contractor.zip_code}`,
          state: contractor.state,
          country: contractor.country || "US",
          jobApplied: formatJobType(contractor.job_applied),
          status: formatStatus(contractor.application_status),
          applicationDate: contractor.application_date,
          experience: `${contractor.experience_years || 0} years`,
          salary: contractor.expected_salary
            ? `$${Number(contractor.expected_salary).toLocaleString()}`
            : "Not specified",
          interviewDate: contractor.interview_date,
          interviewTime: contractor.interview_time,
          interviewType: contractor.interview_type,
          services: contractor.services_offered || [],
          servicesOffered: Array.isArray(contractor.services_offered)
            ? contractor.services_offered
            : [],
          rawData: contractor,
        }));
        setContractors(formattedContractors);
      }

      if (jobPostingsData) {
        const formattedJobs = jobPostingsData.map((job) => ({
          id: job.id,
          title: job.title,
          applications: job.applications_count || 0,
          dateAvailable: job.deadline || job.posted_date,
          status:
            job.status === "active"
              ? "Active"
              : job.status === "closed"
                ? "Closed"
                : "Draft",
          description: job.description,
          jobType: job.job_type,
          rawData: job,
        }));
        setJobPostings(formattedJobs);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const now = new Date();
    const total = data.length;
    const newApps = data.filter((c) => c.application_status === "new").length;
    const interviewed = data.filter(
      (c) => c.application_status === "interviewed",
    ).length;
    const hired = data.filter((c) => c.application_status === "hired").length;
    const rejected = data.filter(
      (c) => c.application_status === "rejected",
    ).length;
    const pending = data.filter(
      (c) => c.application_status === "pending",
    ).length;

    const upcomingInterviews = data.filter(
      (c) => c.interview_date && new Date(c.interview_date) >= now,
    ).length;

    return {
      total_applications: total,
      new_applications: newApps,
      total_interviews: interviewed,
      total_hired: hired,
      rejected: rejected,
      pending_review: pending,
      upcoming_interviews: upcomingInterviews,
    };
  };

  const extractFilterOptions = (data) => {
    const states = [
      ...new Set(data.map((c) => c.state).filter(Boolean)),
    ].sort();
    const countries = [
      ...new Set(data.map((c) => c.country).filter(Boolean)),
    ].sort();

    const allServices = data.flatMap((c) =>
      Array.isArray(c.services_offered) ? c.services_offered : [],
    );
    const services = [...new Set(allServices)].filter(Boolean).sort();

    const jobTypes = [
      ...new Set(data.map((c) => c.job_applied).filter(Boolean)),
    ].sort();

    return { states, countries, services, jobTypes };
  };

  const generateChartData = (data) => {
    const trendData = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const count = data.filter((c) => {
        const appDate = new Date(c.application_date);
        return appDate.toISOString().split("T")[0] === dateStr;
      }).length;

      trendData.push({
        name: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        date: dateStr,
        applications: count,
      });
    }

    const statusCounts = {
      Hired: data.filter((c) => c.application_status === "hired").length,
      Interviewed: data.filter((c) => c.application_status === "interviewed")
        .length,
      New: data.filter((c) => c.application_status === "new").length,
      Rejected: data.filter((c) => c.application_status === "rejected").length,
      Pending: data.filter((c) => c.application_status === "pending").length,
    };

    const statusDistribution = Object.entries(statusCounts).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );

    const stateCounts = {};
    data.forEach((c) => {
      if (c.state) {
        stateCounts[c.state] = (stateCounts[c.state] || 0) + 1;
      }
    });

    const geoDistribution = Object.entries(stateCounts)
      .map(([state, count]) => ({ name: state, applicants: count }))
      .sort((a, b) => b.applicants - a.applicants)
      .slice(0, 8);

    const serviceCounts = {};
    data.forEach((c) => {
      if (Array.isArray(c.services_offered)) {
        c.services_offered.forEach((service) => {
          if (service) {
            serviceCounts[service] = (serviceCounts[service] || 0) + 1;
          }
        });
      }
    });

    const serviceDistribution = Object.entries(serviceCounts)
      .map(([service, count]) => ({
        name: formatJobType(service),
        applicants: count,
      }))
      .sort((a, b) => b.applicants - a.applicants)
      .slice(0, 8);

    return {
      applicationTrend: trendData,
      statusDistribution,
      geoDistribution,
      serviceDistribution,
    };
  };

  const filteredContractors = useMemo(() => {
    return contractors.filter((contractor) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        contractor.name.toLowerCase().includes(searchLower) ||
        contractor.email.toLowerCase().includes(searchLower) ||
        contractor.jobApplied.toLowerCase().includes(searchLower) ||
        contractor.status.toLowerCase().includes(searchLower);

      const matchesStatus =
        filters.status === "all" ||
        contractor.status.toLowerCase() === filters.status.toLowerCase();

      const matchesJobType =
        filters.jobType === "all" ||
        contractor.jobApplied
          .toLowerCase()
          .includes(filters.jobType.toLowerCase());

      const matchesState =
        filters.state === "all" || contractor.state === filters.state;

      const matchesCountry =
        filters.country === "all" || contractor.country === filters.country;

      const matchesService =
        filters.service === "all" ||
        (Array.isArray(contractor.servicesOffered) &&
          contractor.servicesOffered.includes(filters.service));

      const matchesDateRange =
        filters.dateRange === "all" ||
        (contractor.applicationDate &&
          filterByDateRange(contractor.applicationDate, filters.dateRange));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesJobType &&
        matchesState &&
        matchesCountry &&
        matchesService &&
        matchesDateRange
      );
    });
  }, [contractors, searchTerm, filters]);

  const filterByDateRange = (dateString, range) => {
    const date = new Date(dateString);
    const now = new Date();
    const daysAgo = new Date();

    switch (range) {
      case "today":
        return date.toDateString() === now.toDateString();
      case "week":
        daysAgo.setDate(now.getDate() - 7);
        return date >= daysAgo;
      case "month":
        daysAgo.setDate(now.getDate() - 30);
        return date >= daysAgo;
      case "quarter":
        daysAgo.setDate(now.getDate() - 90);
        return date >= daysAgo;
      default:
        return true;
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
    return (
      jobTypes[jobType] ||
      jobType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const formatStatus = (status) => {
    const statusMap = {
      new: "New",
      reviewed: "Reviewed",
      interviewed: "Interviewed",
      hired: "Hired",
      rejected: "Rejected",
      pending: "Pending",
    };
    return (
      statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
    );
  };

  const calculateTrend = (currentValue, previousValue) => {
    if (previousValue === 0) return currentValue > 0 ? "+100%" : "0%";
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return `${change >= 0 ? "+" : ""}${Math.round(change)}%`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return "Not scheduled";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      const dateFormatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (timeString) {
        return `${dateFormatted} at ${timeString}`;
      }
      return `${dateFormatted} (Time TBD)`;
    } catch (error) {
      console.error("Error formatting date/time:", error);
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      New: "bg-blue-50 text-blue-700 border-blue-200",
      Reviewed: "bg-indigo-50 text-indigo-700 border-indigo-200",
      Interviewed: "bg-purple-50 text-purple-700 border-purple-200",
      Hired: "bg-green-50 text-green-700 border-green-200",
      Rejected: "bg-red-50 text-red-700 border-red-200",
      Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      Active: "bg-green-50 text-green-700 border-green-200",
      Closed: "bg-gray-50 text-gray-700 border-gray-200",
      Draft: "bg-yellow-50 text-yellow-700 border-yellow-200",
      "Closing Soon": "bg-orange-50 text-orange-700 border-orange-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRowClick = (applicant) => {
    setSelectedApplication(applicant);
    setSidebarOpen(true);
  };

  const handleDeleteApplicant = async (applicantId) => {
    if (window.confirm("Are you sure you want to delete this applicant?")) {
      try {
        const { error } = await supabase
          .from("contractors")
          .delete()
          .eq("id", applicantId);

        if (!error) {
          fetchDashboardData();
        }
      } catch (error) {
        console.error("Error deleting applicant:", error);
      }
    }
  };

  const handleStatusUpdate = async (applicantId, newStatus) => {
    console.log("Update status:", applicantId, newStatus);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      const { error } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", jobId);

      if (!error) {
        fetchDashboardData();
      }
    }
  };

  const statsData = [
    {
      label: "Total Applications",
      value: stats.total_applications.toLocaleString(),
      icon: FiUsers,
      color: "from-blue-500 to-blue-600",
      trend: calculateTrend(
        stats.total_applications,
        Math.max(0, stats.total_applications - stats.new_applications),
      ),
    },
    {
      label: "Total Interviews",
      value: stats.total_interviews.toLocaleString(),
      icon: FiCalendar,
      color: "from-purple-500 to-purple-600",
      trend: calculateTrend(
        stats.total_interviews,
        Math.max(0, stats.total_interviews - stats.new_applications * 0.3),
      ),
    },
    {
      label: "Total Hired",
      value: stats.total_hired.toLocaleString(),
      icon: FiCheckCircle,
      color: "from-green-500 to-green-600",
      trend: calculateTrend(
        stats.total_hired,
        Math.max(0, stats.total_hired - stats.new_applications * 0.1),
      ),
    },
    {
      label: "New Applications",
      value: stats.new_applications.toLocaleString(),
      icon: FiUserPlus,
      color: "from-orange-500 to-orange-600",
      trend: calculateTrend(
        stats.new_applications,
        Math.max(0, stats.new_applications - 5),
      ),
    },
    {
      label: "Rejected",
      value: stats.rejected.toLocaleString(),
      icon: FiXCircle,
      color: "from-red-500 to-red-600",
      trend: calculateTrend(
        stats.rejected,
        Math.max(0, stats.rejected - stats.new_applications * 0.2),
      ),
    },
    {
      label: "Pending Review",
      value: stats.pending_review.toLocaleString(),
      icon: FiClock,
      color: "from-yellow-500 to-yellow-600",
      trend: calculateTrend(
        stats.pending_review,
        Math.max(0, stats.pending_review - stats.new_applications * 0.4),
      ),
    },
  ];

  const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#8884D8"];
  const AREA_COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
          <p className="font-quicksand mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-cinzel mb-1 text-xl font-bold text-gray-900 md:text-2xl">
              Contractor Management
            </h1>
            <p className="font-quicksand text-sm text-gray-600">
              Streamline your hiring process with powerful insights
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search applicants, jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="font-quicksand w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <Link
              to="/admin/job-postings"
              className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-purple-700"
            >
              <FiPlus className="text-base" />
              <span className="font-quicksand font-medium">Manage Jobs</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Collapsible Filter Bar */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex w-full items-center justify-between p-4 text-left"
        >
          <div className="flex items-center gap-2">
            <FiFilter className="text-purple-600" />
            <span className="font-quicksand font-medium text-gray-900">
              Filters
            </span>
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
              {Object.values(filters).filter((f) => f !== "all").length} active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {showFilters ? "Hide" : "Show"} filters
            </span>
            {showFilters ? (
              <FiChevronUp className="text-gray-500" />
            ) : (
              <FiChevronDown className="text-gray-500" />
            )}
          </div>
        </button>

        {showFilters && (
          <div className="border-t border-gray-200 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
              <div>
                <label className="font-quicksand mb-1.5 block text-xs font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="font-quicksand mb-1.5 block text-xs font-medium text-gray-700">
                  Job Type
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) =>
                    setFilters({ ...filters, jobType: e.target.value })
                  }
                  className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="all">All Types</option>
                  {filterOptions.jobTypes.map((jobType) => (
                    <option key={jobType} value={jobType}>
                      {formatJobType(jobType)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-quicksand mb-1.5 block text-xs font-medium text-gray-700">
                  State
                </label>
                <select
                  value={filters.state}
                  onChange={(e) =>
                    setFilters({ ...filters, state: e.target.value })
                  }
                  className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="all">All States</option>
                  {filterOptions.states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-quicksand mb-1.5 block text-xs font-medium text-gray-700">
                  Country
                </label>
                <select
                  value={filters.country}
                  onChange={(e) =>
                    setFilters({ ...filters, country: e.target.value })
                  }
                  className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="all">All Countries</option>
                  {filterOptions.countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-quicksand mb-1.5 block text-xs font-medium text-gray-700">
                  Service
                </label>
                <select
                  value={filters.service}
                  onChange={(e) =>
                    setFilters({ ...filters, service: e.target.value })
                  }
                  className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="all">All Services</option>
                  {filterOptions.services.map((service) => (
                    <option key={service} value={service}>
                      {formatJobType(service)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-quicksand mb-1.5 block text-xs font-medium text-gray-700">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) =>
                    setFilters({ ...filters, dateRange: e.target.value })
                  }
                  className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last 90 Days</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() =>
                  setFilters({
                    status: "all",
                    jobType: "all",
                    state: "all",
                    country: "all",
                    service: "all",
                    dateRange: "all",
                  })
                }
                className="font-quicksand rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
              >
                Clear All Filters
              </button>
              <div className="text-xs text-gray-500">
                Showing {filteredContractors.length} of {contractors.length}{" "}
                applicants
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Statistics Grid */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-cinzel text-lg font-semibold text-gray-900">
              Hiring Overview
            </h2>
            <div className="font-quicksand text-xs text-gray-500">
              Real-time statistics
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon;
              const isPositive = !stat.trend.startsWith("-");
              return (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className={`rounded-lg bg-gradient-to-r p-2 ${stat.color}`}
                    >
                      <IconComponent className="text-base text-white" />
                    </div>
                    <div
                      className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${
                        isPositive
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {isPositive ? (
                        <FiArrowUp className="text-[10px]" />
                      ) : (
                        <FiArrowDown className="text-[10px]" />
                      )}
                      <span className="text-xs">{stat.trend}</span>
                    </div>
                  </div>
                  <h3 className="font-cinzel mb-0.5 text-lg font-bold text-gray-900">
                    {stat.value}
                  </h3>
                  <p className="font-quicksand text-xs text-gray-600">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-cinzel text-lg font-semibold text-gray-900">
              Analytics
            </h2>
            <div className="font-quicksand text-xs text-gray-500">
              Last 30 days data
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Application Trend Chart */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-cinzel font-medium text-gray-800">
                  Applications Trend
                </h3>
                <span className="font-quicksand text-xs text-gray-500">
                  30 days
                </span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.applicationTrend}>
                    <defs>
                      <linearGradient
                        id="colorApplications"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={AREA_COLORS[0]}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={AREA_COLORS[0]}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "6px",
                        border: "1px solid #e5e7eb",
                        fontSize: "11px",
                        padding: "8px",
                      }}
                      formatter={(value) => [`${value}`, "Applications"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke={AREA_COLORS[0]}
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill="url(#colorApplications)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Distribution Chart */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-cinzel font-medium text-gray-800">
                  Status Distribution
                </h3>
                <span className="font-quicksand text-xs text-gray-500">
                  Total: {stats.total_applications}
                </span>
              </div>
              <div className="flex h-56">
                <div className="w-2/3">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={1}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {chartData.statusDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}`, "Applicants"]}
                        contentStyle={{
                          fontSize: "11px",
                          padding: "6px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/3 pl-4">
                  <div className="space-y-2 pt-2">
                    {chartData.statusDistribution.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-quicksand text-xs font-medium text-gray-700">
                              {entry.name}
                            </span>
                            <span className="font-quicksand text-xs text-gray-600">
                              {entry.value}
                            </span>
                          </div>
                          <div className="mt-0.5 h-1 w-full rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(entry.value / Math.max(...chartData.statusDistribution.map((d) => d.value))) * 100}%`,
                                backgroundColor: COLORS[index],
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Distribution Chart */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-cinzel font-medium text-gray-800">
                  Service Distribution
                </h3>
                <span className="font-quicksand text-xs text-gray-500">
                  Top 8 services
                </span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.serviceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={40}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value) => [`${value}`, "Applicants"]}
                      contentStyle={{
                        fontSize: "11px",
                        padding: "6px",
                      }}
                    />
                    <Bar
                      dataKey="applicants"
                      fill="#8884d8"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Geographic Distribution Chart */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-cinzel font-medium text-gray-800">
                  Geographic Distribution
                </h3>
                <span className="font-quicksand text-xs text-gray-500">
                  Top states
                </span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.geoDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value) => [`${value}`, "Applicants"]}
                      contentStyle={{
                        fontSize: "11px",
                        padding: "6px",
                      }}
                    />
                    <Bar
                      dataKey="applicants"
                      fill="#82ca9d"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div>
          <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="font-cinzel text-lg font-semibold text-gray-900">
              Available Positions
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  (window.location.href = "/admin/job-postings/new")
                }
                className="font-quicksand rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-purple-700"
              >
                + New Job
              </button>
              <Link
                to="/admin/job-postings"
                className="font-quicksand flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs hover:bg-gray-50"
              >
                <FiExternalLink className="text-gray-600" />
                <span>View All</span>
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="font-quicksand px-4 py-2.5 text-left text-xs font-semibold text-gray-700">
                      Job Title
                    </th>
                    <th className="font-quicksand px-4 py-2.5 text-left text-xs font-semibold text-gray-700">
                      Applications
                    </th>
                    <th className="font-quicksand px-4 py-2.5 text-left text-xs font-semibold text-gray-700">
                      Deadline
                    </th>
                    <th className="font-quicksand px-4 py-2.5 text-left text-xs font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="font-quicksand px-4 py-2.5 text-left text-xs font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobPostings.slice(0, 5).map((job) => (
                    <tr
                      key={job.id}
                      className="transition-colors duration-150 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2.5">
                        <span className="font-quicksand text-sm font-medium text-gray-900">
                          {job.title}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="font-quicksand text-sm text-gray-700">
                          {job.applications}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="font-quicksand text-sm text-gray-700">
                          {formatDate(job.dateAvailable)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`font-quicksand inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(job.status)}`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="rounded p-1 text-red-600 transition-colors duration-150 hover:bg-red-50"
                          title="Delete"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Applicant Management Component */}
        <div>
          <ApplicantManagement
            contractors={filteredContractors}
            jobPostings={jobPostings}
            stats={stats}
            loading={loading}
            onRowClick={handleRowClick}
            onDeleteApplicant={handleDeleteApplicant}
            onStatusUpdate={handleStatusUpdate}
            formatDate={formatDate}
            formatJobType={formatJobType}
            getStatusColor={getStatusColor}
            getInitials={getInitials}
          />
        </div>
      </div>

      {/* Application Details Modal */}
      {sidebarOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="bg-opacity-50 absolute inset-0 bg-black backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600" />

            <div className="max-h-[90vh] overflow-y-auto p-5">
              {/* Header */}
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-cinzel text-lg font-semibold text-gray-900">
                  Application Details
                </h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-1.5 transition-colors duration-150 hover:bg-gray-100"
                >
                  <FiX className="text-gray-600" />
                </button>
              </div>

              {/* Profile Section */}
              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
                  <span className="font-quicksand text-lg font-bold text-white">
                    {getInitials(selectedApplication.name)}
                  </span>
                </div>
                <h4 className="font-cinzel mb-1 text-base font-semibold text-gray-900">
                  {selectedApplication.name}
                </h4>
                <p className="font-quicksand mb-2 text-sm text-gray-600">
                  {selectedApplication.jobApplied}
                </p>
                <span
                  className={`font-quicksand inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(selectedApplication.status)}`}
                >
                  {selectedApplication.status}
                </span>
              </div>

              {/* Details Grid */}
              <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h5 className="font-cinzel mb-2 text-sm font-semibold text-gray-800">
                      Contact Info
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <FiMail className="text-purple-500" />
                        <span className="font-quicksand text-sm text-gray-700">
                          {selectedApplication.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiPhone className="text-purple-500" />
                        <span className="font-quicksand text-sm text-gray-700">
                          {selectedApplication.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiMapPin className="text-purple-500" />
                        <span className="font-quicksand text-sm text-gray-700">
                          {selectedApplication.address}
                        </span>
                      </div>
                      {selectedApplication.servicesOffered?.length > 0 && (
                        <div className="pt-2">
                          <h6 className="font-quicksand mb-1 text-xs font-semibold text-gray-700">
                            Services Offered:
                          </h6>
                          <div className="flex flex-wrap gap-1">
                            {selectedApplication.servicesOffered.map(
                              (service, index) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700"
                                >
                                  {formatJobType(service)}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h5 className="font-cinzel mb-2 text-sm font-semibold text-gray-800">
                      Application Details
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-quicksand text-xs text-gray-600">
                          Applied:
                        </span>
                        <span className="font-quicksand text-sm font-medium text-gray-800">
                          {formatDate(selectedApplication.applicationDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-quicksand text-xs text-gray-600">
                          Experience:
                        </span>
                        <span className="font-quicksand text-sm font-medium text-gray-800">
                          {selectedApplication.experience}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-quicksand text-xs text-gray-600">
                          Expected Salary:
                        </span>
                        <span className="font-quicksand text-sm font-medium text-green-600">
                          {selectedApplication.salary}
                        </span>
                      </div>
                      {selectedApplication.rawData?.interview_date && (
                        <div className="flex justify-between">
                          <span className="font-quicksand text-xs text-gray-600">
                            Interview:
                          </span>
                          <span className="font-quicksand text-sm font-medium text-purple-600">
                            {formatDateTime(
                              selectedApplication.rawData.interview_date,
                              selectedApplication.rawData.interview_time,
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row">
                <button className="font-quicksand flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-md">
                  <FiCalendar className="text-base" />
                  <span>Schedule Interview</span>
                </button>
                <button className="font-quicksand flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50">
                  <FiDownload className="text-base" />
                  <span>Download Resume</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContractor;
