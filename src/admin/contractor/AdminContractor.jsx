import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUserPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDownload,
  FiArrowUp,
  FiArrowDown,
  FiPlus,
  FiExternalLink,
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch contractors
      const { data: contractorsData } = await supabase
        .from("contractors")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch job postings
      const { data: jobPostingsData } = await supabase
        .from("job_postings")
        .select("*")
        .order("created_at", { ascending: false });

      // Calculate statistics manually
      if (contractorsData) {
        const statsData = {
          total_applications: contractorsData.length,
          new_applications: contractorsData.filter(
            (c) => c.application_status === "new",
          ).length,
          total_interviews: contractorsData.filter(
            (c) => c.application_status === "interviewed",
          ).length,
          total_hired: contractorsData.filter(
            (c) => c.application_status === "hired",
          ).length,
          rejected: contractorsData.filter(
            (c) => c.application_status === "rejected",
          ).length,
          pending_review: contractorsData.filter(
            (c) => c.application_status === "pending",
          ).length,
          upcoming_interviews: contractorsData.filter(
            (c) => c.interview_date && new Date(c.interview_date) >= new Date(),
          ).length,
        };
        setStats(statsData);

        // Format contractors data for display
        const formattedContractors = contractorsData.map((contractor) => ({
          id: contractor.id,
          name: `${contractor.first_name} ${contractor.last_name}`,
          email: contractor.email,
          phone: contractor.phone,
          address: `${contractor.address}, ${contractor.city}, ${contractor.state} ${contractor.zip_code}`,
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
          services: contractor.services_offered,
          rawData: contractor, // Keep original for modal
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

  const formatStatus = (status) => {
    const statusMap = {
      new: "New",
      reviewed: "Reviewed",
      interviewed: "Interviewed",
      hired: "Hired",
      rejected: "Rejected",
      pending: "Pending",
    };
    return statusMap[status] || status;
  };

  // Updated stats data with real database values
  const statsData = [
    {
      label: "Total Applications",
      value: stats.total_applications.toLocaleString(),
      icon: FiUsers,
      color: "from-blue-500 to-blue-600",
      trend: "+12%",
    },
    {
      label: "Total Interviews",
      value: stats.total_interviews.toLocaleString(),
      icon: FiCalendar,
      color: "from-purple-500 to-purple-600",
      trend: "+5%",
    },
    {
      label: "Total Hired",
      value: stats.total_hired.toLocaleString(),
      icon: FiCheckCircle,
      color: "from-green-500 to-green-600",
      trend: "+8%",
    },
    {
      label: "New Applications",
      value: stats.new_applications.toLocaleString(),
      icon: FiUserPlus,
      color: "from-orange-500 to-orange-600",
      trend: "+23%",
    },
    {
      label: "Rejected",
      value: stats.rejected.toLocaleString(),
      icon: FiXCircle,
      color: "from-red-500 to-red-600",
      trend: "-4%",
    },
    {
      label: "Pending Review",
      value: stats.pending_review.toLocaleString(),
      icon: FiClock,
      color: "from-yellow-500 to-yellow-600",
      trend: "+15%",
    },
  ];

  // Generate chart data from real data
  const applicationStats = [
    { name: "Jan", applications: 45, hired: 12 },
    { name: "Feb", applications: 23, hired: 8 },
    { name: "Mar", applications: 34, hired: 15 },
    { name: "Apr", applications: 28, hired: 10 },
    { name: "May", applications: 19, hired: 7 },
    { name: "Jun", applications: 32, hired: 14 },
  ];

  const statusData = [
    { name: "Hired", value: stats.total_hired },
    { name: "Interviewed", value: stats.total_interviews },
    { name: "New", value: stats.new_applications },
    { name: "Rejected", value: stats.rejected },
    { name: "Pending", value: stats.pending_review },
  ];

  const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#8884D8"];

  // Filter contractors based on search
  const filteredContractors = contractors.filter(
    (contractor) =>
      contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.jobApplied.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get upcoming interviews from contractors
  const upcomingInterviews = contractors
    .filter((c) => c.interviewDate && new Date(c.interviewDate) >= new Date())
    .map((c) => ({
      id: c.id,
      name: c.name,
      job: c.jobApplied,
      date: c.interviewDate,
      time: c.interviewTime || "TBD",
      type: c.interviewType
        ? c.interviewType === "video_call"
          ? "Video Call"
          : c.interviewType === "phone"
            ? "Phone Call"
            : "In-person"
        : "In-person",
    }))
    .slice(0, 3); // Limit to 3 for display

  const handleRowClick = (applicant) => {
    setSelectedApplication(applicant);
    setSidebarOpen(true);
  };

  const handleStatusUpdate = async (contractorId, newStatus) => {
    const statusMap = {
      New: "new",
      Interviewed: "interviewed",
      Hired: "hired",
      Rejected: "rejected",
      Pending: "pending",
    };

    const { error } = await supabase
      .from("contractors")
      .update({
        application_status: statusMap[newStatus] || newStatus.toLowerCase(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", contractorId);

    if (!error) {
      fetchDashboardData(); // Refresh data
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      const { error } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", jobId);

      if (!error) {
        fetchDashboardData(); // Refresh data
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      New: "bg-blue-50 text-blue-700 border-blue-200",
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
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} at ${timeString || "TBD"}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
          <p className="font-quicksand mt-4 text-gray-600">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-cinzel mb-2 bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
              Contractor Management
            </h1>
            <p className="font-quicksand text-lg text-gray-600">
              Streamline your hiring process with powerful insights
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <div className="relative min-w-[200px] flex-1">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search applicants, jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="font-quicksand w-full rounded-xl border border-gray-300 bg-white py-3 pr-4 pl-10 shadow-sm focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 rounded-xl border border-gray-300 bg-white px-6 py-3 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md">
              <FiFilter className="text-gray-600" />
              <span className="font-quicksand font-medium">Filters</span>
            </button>
            <Link
              to="/admin/job-postings"
              className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 text-white shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <FiPlus className="text-lg" />
              <span className="font-quicksand font-medium">Manage Jobs</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="mb-8">
        <h2 className="font-cinzel mb-6 text-2xl font-semibold text-gray-800">
          Hiring Overview
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            const isPositive = !stat.trend.startsWith("-");
            return (
              <div
                key={index}
                className="transform rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`rounded-xl bg-gradient-to-r p-3 ${stat.color} shadow-md`}
                  >
                    <IconComponent className="text-lg text-white" />
                  </div>
                  <div
                    className={`flex items-center space-x-1 rounded-full px-2 py-1 text-xs font-medium ${
                      isPositive
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {isPositive ? (
                      <FiArrowUp className="text-xs" />
                    ) : (
                      <FiArrowDown className="text-xs" />
                    )}
                    <span>{stat.trend}</span>
                  </div>
                </div>
                <h3 className="font-cinzel mb-1 text-2xl font-bold text-gray-800">
                  {stat.value}
                </h3>
                <p className="font-quicksand text-sm text-gray-600">
                  {stat.label}
                </p>
                <Link
                  to="#"
                  className="font-quicksand mt-2 inline-block text-xs font-medium text-purple-600 hover:text-purple-700"
                >
                  View details →
                </Link>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
            <h3 className="font-cinzel mb-6 text-lg font-semibold text-gray-800">
              Applications Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={applicationStats}>
                <defs>
                  <linearGradient
                    id="colorApplications"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorApplications)"
                />
                <Area
                  type="monotone"
                  dataKey="hired"
                  stroke="#00C49F"
                  fillOpacity={1}
                  fill="url(#colorHired)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-cinzel mb-6 text-lg font-semibold text-gray-800">
              Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {statusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="font-quicksand text-xs text-gray-600">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-cinzel mb-4 text-xl font-semibold text-gray-800 sm:mb-0">
            Available Positions
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => (window.location.href = "/admin/job-postings/new")}
              className="font-quicksand transform cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-2 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              + Add New Job
            </button>
            <Link
              to="/admin/job-postings"
              className="flex items-center space-x-2 rounded-xl border border-gray-300 bg-white px-4 py-2 transition-all duration-200 hover:bg-gray-50"
            >
              <FiExternalLink className="text-gray-600" />
              <span className="font-quicksand text-sm">View All</span>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="font-quicksand px-6 py-4 text-left font-semibold text-gray-600">
                  Job Title
                </th>
                <th className="font-quicksand px-6 py-4 text-left font-semibold text-gray-600">
                  Applications
                </th>
                <th className="font-quicksand px-6 py-4 text-left font-semibold text-gray-600">
                  Available Until
                </th>
                <th className="font-quicksand px-6 py-4 text-left font-semibold text-gray-600">
                  Status
                </th>
                <th className="font-quicksand px-6 py-4 text-left font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {jobPostings.slice(0, 5).map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-gray-200 transition-colors duration-150 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <span className="font-quicksand font-semibold text-gray-800">
                      {job.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-quicksand font-medium text-gray-600">
                      {job.applications}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-quicksand text-gray-600">
                      {formatDate(job.dateAvailable)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-quicksand rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusColor(job.status)}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          (window.location.href = `/admin/job-postings/edit/${job.id}`)
                        }
                        className="rounded-lg p-2 text-blue-600 transition-colors duration-150 hover:bg-blue-50"
                      >
                        <FiEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="rounded-lg p-2 text-red-600 transition-colors duration-150 hover:bg-red-50"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Applicants Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-gray-200 p-6">
            <h2 className="font-cinzel text-xl font-semibold text-gray-800">
              Applicant Management ({contractors.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="font-quicksand px-6 py-4 text-left font-semibold text-gray-600">
                    Applicant
                  </th>
                  <th className="font-quicksand px-6 py-4 text-left font-semibold text-gray-600">
                    Job Applied
                  </th>
                  <th className="font-quicksand px-6 py-4 text-left font-semibold text-gray-600">
                    Applied Date
                  </th>
                  <th className="font-quicksand px-6 py-4 text-left font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="font-quicksand px-6 py-4 text-left font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContractors.map((applicant) => (
                  <tr
                    key={applicant.id}
                    className="group cursor-pointer border-b border-gray-200 transition-all duration-150 hover:bg-gray-50"
                    onClick={() => handleRowClick(applicant)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-sm transition-shadow group-hover:shadow-md">
                          <span className="font-quicksand text-sm font-semibold text-white">
                            {getInitials(applicant.name)}
                          </span>
                        </div>
                        <div>
                          <span className="font-quicksand block font-semibold text-gray-800">
                            {applicant.name}
                          </span>
                          <span className="font-quicksand text-sm text-gray-500">
                            {applicant.experience}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-quicksand text-gray-600">
                        {applicant.jobApplied}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-quicksand text-gray-600">
                        {formatDate(applicant.applicationDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-quicksand rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusColor(applicant.status)}`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="transform rounded-lg p-2 text-purple-600 transition-all duration-150 group-hover:scale-110 hover:bg-purple-50">
                        <FiEye className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="font-cinzel text-xl font-semibold text-gray-800">
              Upcoming Interviews ({upcomingInterviews.length})
            </h2>
          </div>
          <div className="p-6">
            {upcomingInterviews.length === 0 ? (
              <div className="py-8 text-center">
                <FiCalendar className="mx-auto text-3xl text-gray-400" />
                <p className="font-quicksand mt-2 text-gray-500">
                  No upcoming interviews scheduled
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="rounded-xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-4 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
                        <span className="font-quicksand text-sm font-semibold text-white">
                          {getInitials(interview.name)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-quicksand font-semibold text-gray-800">
                          {interview.name}
                        </h4>
                        <p className="font-quicksand mb-1 text-sm text-gray-600">
                          {interview.job}
                        </p>
                        <span
                          className={`font-quicksand rounded-full px-2 py-1 text-xs font-medium ${
                            interview.type === "Video Call"
                              ? "border border-blue-200 bg-blue-50 text-blue-700"
                              : interview.type === "Phone Call"
                                ? "border border-yellow-200 bg-yellow-50 text-yellow-700"
                                : "border border-purple-200 bg-purple-50 text-purple-700"
                          }`}
                        >
                          {interview.type}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
                      <div>
                        <p className="font-quicksand text-sm font-semibold text-gray-800">
                          {formatDate(interview.date)}
                        </p>
                        <p className="font-quicksand text-sm text-gray-600">
                          {interview.time}
                        </p>
                      </div>
                      <button className="font-quicksand rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-100">
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {sidebarOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="bg-opacity-50 absolute inset-0 bg-black backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative max-h-[90vh] w-full max-w-2xl scale-100 transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-purple-500 to-purple-600" />

            <div className="max-h-[90vh] overflow-y-auto p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-cinzel text-2xl font-semibold text-gray-800">
                  Application Details
                </h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-xl p-2 transition-colors duration-150 hover:bg-gray-100"
                >
                  <FiXCircle className="text-xl text-gray-600" />
                </button>
              </div>

              {/* Profile Section */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                  <span className="font-quicksand text-2xl font-bold text-white">
                    {getInitials(selectedApplication.name)}
                  </span>
                </div>
                <h4 className="font-cinzel mb-1 text-xl font-semibold text-gray-800">
                  {selectedApplication.name}
                </h4>
                <p className="font-quicksand mb-2 text-gray-600">
                  {selectedApplication.jobApplied}
                </p>
                <span
                  className={`font-quicksand rounded-full border px-3 py-1.5 text-sm font-medium ${getStatusColor(selectedApplication.status)}`}
                >
                  {selectedApplication.status}
                </span>
              </div>

              {/* Details Grid */}
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <h5 className="font-cinzel mb-3 font-semibold text-gray-800">
                      Contact Info
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <FiMail className="text-purple-500" />
                        <span className="font-quicksand text-gray-700">
                          {selectedApplication.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiPhone className="text-purple-500" />
                        <span className="font-quicksand text-gray-700">
                          {selectedApplication.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiMapPin className="text-purple-500" />
                        <span className="font-quicksand text-gray-700">
                          {selectedApplication.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <h5 className="font-cinzel mb-3 font-semibold text-gray-800">
                      Application Details
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-quicksand text-gray-600">
                          Applied:
                        </span>
                        <span className="font-quicksand font-medium text-gray-800">
                          {formatDate(selectedApplication.applicationDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-quicksand text-gray-600">
                          Experience:
                        </span>
                        <span className="font-quicksand font-medium text-gray-800">
                          {selectedApplication.experience}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-quicksand text-gray-600">
                          Expected Salary:
                        </span>
                        <span className="font-quicksand font-medium text-green-600">
                          {selectedApplication.salary}
                        </span>
                      </div>
                      {selectedApplication.rawData?.interview_date && (
                        <div className="flex justify-between">
                          <span className="font-quicksand text-gray-600">
                            Interview:
                          </span>
                          <span className="font-quicksand font-medium text-purple-600">
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
                <button className="font-quicksand flex flex-1 transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <FiCalendar className="text-lg" />
                  <span>Schedule Interview</span>
                </button>
                <button className="font-quicksand flex flex-1 items-center justify-center space-x-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50">
                  <FiDownload className="text-lg" />
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
