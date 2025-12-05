import { useState, useEffect } from "react";
import {
  FiEye,
  FiTrash2,
  FiCalendar,
  FiUsers,
  FiBriefcase,
  FiChevronUp,
  FiChevronDown,
  FiSearch,
  FiX,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDownload,
  FiClock,
  FiVideo,
  FiPhoneCall,
  FiUser,
  FiDollarSign,
} from "react-icons/fi";
import { supabase } from "../../services/supabaseClient";

const ApplicantManagement = ({
  contractors = [],
  onDataRefresh,
  loading = false,
}) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJobType, setFilterJobType] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "application_date",
    direction: "desc",
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [interviewSchedule, setInterviewSchedule] = useState({
    date: "",
    time: "",
    type: "video_call",
    notes: "",
    location: "",
  });

  // Job type options for filter
  const jobTypeOptions = [
    { value: "all", label: "All Job Types" },
    { value: "residential_cleaning", label: "Residential Cleaning" },
    { value: "commercial_cleaning", label: "Commercial Cleaning" },
    { value: "deep_cleaning", label: "Deep Cleaning" },
    { value: "organization", label: "Organization" },
    { value: "powerwashing", label: "Power Washing" },
    { value: "junk_removal", label: "Junk Removal" },
    { value: "packing_unpacking", label: "Packing & Unpacking" },
    { value: "personal_assistance", label: "Personal Assistance" },
  ];

  // Status options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "new", label: "New", color: "bg-blue-100 text-blue-800" },
    {
      value: "reviewed",
      label: "Reviewed",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "interviewed",
      label: "Interviewed",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      value: "hired",
      label: "Hired",
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      value: "rejected",
      label: "Rejected",
      color: "bg-rose-100 text-rose-800",
    },
    {
      value: "pending",
      label: "Pending",
      color: "bg-amber-100 text-amber-800",
    },
  ];

  // Format job type for display
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

  // Format status for display
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

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      New: "bg-blue-50 text-blue-700 border-blue-200",
      Reviewed: "bg-purple-50 text-purple-700 border-purple-200",
      Interviewed: "bg-indigo-50 text-indigo-700 border-indigo-200",
      Hired: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Rejected: "bg-rose-50 text-rose-700 border-rose-200",
      Pending: "bg-amber-50 text-amber-700 border-amber-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Format time (NYC/EST)
  const formatTime = (timeString) => {
    if (!timeString) return "TBD";
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return (
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "America/New_York",
        }) + " EST"
      );
    } catch {
      return timeString;
    }
  };

  // Handle row click
  const handleRowClick = (applicant) => {
    setSelectedApplication(applicant);
    setIsEditing(false);
    setSidebarOpen(true);

    // Pre-fill interview schedule if exists
    if (applicant.interviewDate) {
      setInterviewSchedule({
        date: applicant.interviewDate,
        time: applicant.interviewTime || "",
        type: applicant.interviewType || "video_call",
        notes: applicant.interviewNotes || "",
        location: applicant.interviewLocation || "",
      });
    }
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    if (!selectedApplication) return;

    try {
      const updateData = {
        application_status: newStatus.toLowerCase(),
        updated_at: new Date().toISOString(),
      };

      // If changing to interviewed and scheduling needed, open modal
      if (newStatus === "interviewed" && !selectedApplication.interviewDate) {
        setShowScheduleModal(true);
        return;
      }

      const { error } = await supabase
        .from("contractors")
        .update(updateData)
        .eq("id", selectedApplication.id);

      if (!error) {
        // Update local state
        setSelectedApplication((prev) => ({
          ...prev,
          status: formatStatus(newStatus.toLowerCase()),
        }));

        // Refresh parent data
        onDataRefresh?.();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Handle schedule interview
  const handleScheduleInterview = async () => {
    if (!selectedApplication) return;

    try {
      const updateData = {
        application_status: "interviewed",
        interview_date: interviewSchedule.date,
        interview_time: interviewSchedule.time,
        interview_type: interviewSchedule.type,
        interview_notes: interviewSchedule.notes,
        interview_location: interviewSchedule.location,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("contractors")
        .update(updateData)
        .eq("id", selectedApplication.id);

      if (!error) {
        // Update local state
        setSelectedApplication((prev) => ({
          ...prev,
          status: "Interviewed",
          interviewDate: interviewSchedule.date,
          interviewTime: interviewSchedule.time,
          interviewType: interviewSchedule.type,
          interviewNotes: interviewSchedule.notes,
          interviewLocation: interviewSchedule.location,
        }));

        setShowScheduleModal(false);
        onDataRefresh?.();

        // Reset schedule form
        setInterviewSchedule({
          date: "",
          time: "",
          type: "video_call",
          notes: "",
          location: "",
        });
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  // Handle delete applicant
  const handleDeleteApplicant = async (applicantId) => {
    try {
      const { error } = await supabase
        .from("contractors")
        .delete()
        .eq("id", applicantId);

      if (!error) {
        setShowDeleteConfirm(null);
        if (selectedApplication?.id === applicantId) {
          setSidebarOpen(false);
        }
        onDataRefresh?.();
      }
    } catch (error) {
      console.error("Error deleting applicant:", error);
    }
  };

  // Handle resume download
  const handleDownloadResume = async (applicant) => {
    if (!applicant.resumeUrl) {
      alert("Resume not available for this applicant");
      return;
    }

    try {
      // Create a temporary link to trigger download
      const link = document.createElement("a");
      link.href = applicant.resumeUrl;
      link.download = `resume-${applicant.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("Failed to download resume");
    }
  };

  // Sort and filter applicants
  const getFilteredAndSortedApplicants = () => {
    let filtered = contractors.filter((applicant) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.jobApplied
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        applicant.rawData?.city
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        applicant.rawData?.state
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        filterStatus === "all" ||
        applicant.status?.toLowerCase() === filterStatus.toLowerCase();

      // Job type filter
      const matchesJobType =
        filterJobType === "all" ||
        applicant.rawData?.job_applied === filterJobType;

      return matchesSearch && matchesStatus && matchesJobType;
    });

    // Sorting
    filtered.sort((a, b) => {
      const { key, direction } = sortConfig;
      let aValue = a[key];
      let bValue = b[key];

      // Handle special cases
      if (key === "applicationDate") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
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

  const filteredApplicants = getFilteredAndSortedApplicants();

  // Get upcoming interviews
  const upcomingInterviews = contractors
    .filter((c) => c.interviewDate && new Date(c.interviewDate) >= new Date())
    .map((c) => ({
      id: c.id,
      name: c.name,
      job: c.jobApplied,
      date: c.interviewDate,
      time: c.interviewTime,
      type:
        c.interviewType === "video_call"
          ? "Video Call"
          : c.interviewType === "phone"
            ? "Phone Call"
            : "In-person",
      location: c.interviewLocation,
    }))
    .slice(0, 4); // Limit to 4 for display

  // Sort handler
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? (
      <FiChevronUp className="ml-1 h-3 w-3" />
    ) : (
      <FiChevronDown className="ml-1 h-3 w-3" />
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterJobType("all");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
          <p className="font-quicksand mt-4 text-gray-600">
            Loading applicants...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
      {/* Applicants Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-2">
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-cinzel text-xl font-semibold text-gray-800">
                Applicant Management
              </h2>
              <p className="font-quicksand mt-1 text-sm text-gray-600">
                {filteredApplicants.length} applicant
                {filteredApplicants.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:min-w-[200px]">
                <FiSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="font-quicksand w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="font-quicksand rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <select
                  value={filterJobType}
                  onChange={(e) => setFilterJobType(e.target.value)}
                  className="font-quicksand rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                >
                  {jobTypeOptions.map((job) => (
                    <option key={job.value} value={job.value}>
                      {job.label}
                    </option>
                  ))}
                </select>
                {(searchTerm ||
                  filterStatus !== "all" ||
                  filterJobType !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="font-quicksand flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <FiX className="h-4 w-4" />
                    Clear
                  </button>
                )}
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
                    onClick={() => handleSort("name")}
                    className="flex items-center hover:text-purple-700"
                  >
                    Applicant
                    <SortIndicator columnKey="name" />
                  </button>
                </th>
                <th className="font-quicksand px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Job Applied
                </th>
                <th className="font-quicksand px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("applicationDate")}
                    className="flex items-center hover:text-purple-700"
                  >
                    Applied Date
                    <SortIndicator columnKey="applicationDate" />
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
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="mx-auto max-w-md">
                      <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-gray-100 p-4">
                          <FiUsers className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="font-cinzel mb-2 text-lg font-semibold text-gray-800">
                        No applicants found
                      </h3>
                      <p className="font-quicksand text-sm text-gray-600">
                        {searchTerm ||
                        filterStatus !== "all" ||
                        filterJobType !== "all"
                          ? "Try adjusting your search or filters"
                          : "No applicants have applied yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((applicant) => (
                  <tr
                    key={applicant.id}
                    onClick={() => handleRowClick(applicant)}
                    className="group cursor-pointer border-b border-gray-100 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-white"
                  >
                    <td className="border-r border-gray-100 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-sm transition-shadow group-hover:shadow-md">
                          <span className="font-quicksand text-sm font-semibold text-white">
                            {getInitials(applicant.name)}
                          </span>
                        </div>
                        <div>
                          <span className="font-cinzel block text-sm font-semibold text-gray-800 group-hover:text-purple-700">
                            {applicant.name}
                          </span>
                          <span className="font-quicksand text-xs text-gray-500">
                            {applicant.rawData?.city},{" "}
                            {applicant.rawData?.state}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="border-r border-gray-100 px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiBriefcase className="h-4 w-4 text-gray-400" />
                        <span className="font-quicksand text-sm text-gray-600">
                          {applicant.jobApplied}
                        </span>
                      </div>
                    </td>
                    <td className="border-r border-gray-100 px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="h-4 w-4 text-gray-400" />
                        <span className="font-quicksand text-sm text-gray-600">
                          {formatDate(applicant.applicationDate)}
                        </span>
                      </div>
                    </td>
                    <td className="border-r border-gray-100 px-6 py-4">
                      <span
                        className={`font-quicksand inline-block rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusColor(applicant.status)}`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleRowClick(applicant)}
                          className="rounded-lg p-2 text-purple-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-600"
                          title="View Details"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(applicant.id)}
                          className="rounded-lg p-2 text-red-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-rose-50 hover:to-rose-100 hover:text-rose-600"
                          title="Delete"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Interviews */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-cinzel text-xl font-semibold text-gray-800">
              Upcoming Interviews
            </h2>
            <span className="font-quicksand rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              {upcomingInterviews.length} scheduled
            </span>
          </div>
        </div>
        <div className="p-6">
          {upcomingInterviews.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-gray-100 to-gray-200">
                <FiCalendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-cinzel mb-2 text-lg font-semibold text-gray-800">
                No Interviews Scheduled
              </h3>
              <p className="font-quicksand text-sm text-gray-600">
                Schedule interviews to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="rounded-xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-4 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 shadow-sm">
                      <span className="font-quicksand text-sm font-semibold text-white">
                        {getInitials(interview.name)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-cinzel text-sm font-semibold text-gray-800">
                        {interview.name}
                      </h4>
                      <p className="font-quicksand mb-1 text-xs text-gray-600">
                        {interview.job}
                      </p>
                      <span
                        className={`font-quicksand inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          interview.type === "Video Call"
                            ? "border border-blue-200 bg-blue-50 text-blue-700"
                            : interview.type === "Phone Call"
                              ? "border border-amber-200 bg-amber-50 text-amber-700"
                              : "border border-purple-200 bg-purple-50 text-purple-700"
                        }`}
                      >
                        {interview.type}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
                    <div>
                      <p className="font-cinzel text-sm font-semibold text-gray-800">
                        {formatDate(interview.date)}
                      </p>
                      <p className="font-quicksand text-xs text-gray-600">
                        {formatTime(interview.time)}
                      </p>
                      {interview.location && (
                        <p className="font-quicksand mt-1 text-xs text-gray-500">
                          📍 {interview.location}
                        </p>
                      )}
                    </div>
                    <button className="font-quicksand rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:from-emerald-100 hover:to-green-100">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {sidebarOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setSidebarOpen(false);
              setIsEditing(false);
            }}
          />
          <div className="relative max-h-[90vh] w-full max-w-4xl scale-100 transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 p-6">
              <div>
                <h2 className="font-cinzel text-2xl font-bold text-gray-800">
                  Application Details
                </h2>
                <p className="font-quicksand mt-1 text-sm text-gray-600">
                  Manage applicant information and status
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
                  {isEditing ? "Cancel Edit" : "Edit"}
                </button>
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    setIsEditing(false);
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
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column - Profile & Contact */}
                <div className="space-y-6 lg:col-span-2">
                  {/* Profile Card */}
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                        <span className="font-cinzel text-2xl font-bold text-white">
                          {getInitials(selectedApplication.name)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-cinzel text-2xl font-bold text-gray-800">
                          {selectedApplication.name}
                        </h3>
                        <p className="font-quicksand text-gray-600">
                          {selectedApplication.jobApplied}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`font-quicksand rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(selectedApplication.status)}`}
                          >
                            {selectedApplication.status}
                          </span>
                          <span className="font-quicksand text-xs text-gray-500">
                            Applied{" "}
                            {formatDate(selectedApplication.applicationDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="mb-6">
                      <h4 className="font-cinzel mb-3 text-lg font-semibold text-gray-800">
                        Update Status
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {statusOptions.slice(1).map((status) => (
                          <button
                            key={status.value}
                            onClick={() => handleStatusUpdate(status.label)}
                            className={`font-quicksand rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                              selectedApplication.status === status.label
                                ? `${status.color} border`
                                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {status.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FiMail className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-quicksand text-xs text-gray-500">
                              Email
                            </p>
                            <p className="font-quicksand font-medium text-gray-800">
                              {selectedApplication.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FiPhone className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-quicksand text-xs text-gray-500">
                              Phone
                            </p>
                            <p className="font-quicksand font-medium text-gray-800">
                              {selectedApplication.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FiMapPin className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-quicksand text-xs text-gray-500">
                              Location
                            </p>
                            <p className="font-quicksand font-medium text-gray-800">
                              {selectedApplication.rawData?.city},{" "}
                              {selectedApplication.rawData?.state}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FiDollarSign className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-quicksand text-xs text-gray-500">
                              Expected Salary
                            </p>
                            <p className="font-quicksand font-medium text-emerald-600">
                              {selectedApplication.salary}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services Offered */}
                  {selectedApplication.rawData?.services_offered?.length >
                    0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h4 className="font-cinzel mb-4 text-lg font-semibold text-gray-800">
                        Services Offered
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.rawData.services_offered.map(
                          (service, index) => (
                            <span
                              key={index}
                              className="font-quicksand rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                            >
                              {formatJobType(service)}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Actions & Interview */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h4 className="font-cinzel mb-4 text-lg font-semibold text-gray-800">
                      Quick Actions
                    </h4>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowScheduleModal(true)}
                        className="font-quicksand flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 py-3 text-sm font-medium text-white transition-all hover:shadow-lg"
                      >
                        <FiCalendar className="h-4 w-4" />
                        Schedule Interview
                      </button>
                      <button
                        onClick={() =>
                          handleDownloadResume(selectedApplication)
                        }
                        className="font-quicksand flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                      >
                        <FiDownload className="h-4 w-4" />
                        Download Resume
                      </button>
                      <button
                        onClick={() =>
                          setShowDeleteConfirm(selectedApplication.id)
                        }
                        className="font-quicksand flex w-full items-center justify-center gap-2 rounded-lg border border-rose-300 bg-rose-50 py-3 text-sm font-medium text-rose-700 transition-all hover:bg-rose-100"
                      >
                        <FiTrash2 className="h-4 w-4" />
                        Delete Applicant
                      </button>
                    </div>
                  </div>

                  {/* Interview Details */}
                  {selectedApplication.interviewDate && (
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h4 className="font-cinzel mb-4 text-lg font-semibold text-gray-800">
                        Interview Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-quicksand text-gray-600">
                            Date
                          </span>
                          <span className="font-quicksand font-medium text-gray-800">
                            {formatDate(selectedApplication.interviewDate)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-quicksand text-gray-600">
                            Time
                          </span>
                          <span className="font-quicksand font-medium text-gray-800">
                            {formatTime(selectedApplication.interviewTime)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-quicksand text-gray-600">
                            Type
                          </span>
                          <span
                            className={`font-quicksand rounded-full px-2 py-1 text-xs font-medium ${
                              selectedApplication.interviewType === "video_call"
                                ? "bg-blue-100 text-blue-800"
                                : selectedApplication.interviewType === "phone"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {selectedApplication.interviewType === "video_call"
                              ? "Video Call"
                              : selectedApplication.interviewType === "phone"
                                ? "Phone Call"
                                : "In-person"}
                          </span>
                        </div>
                        {selectedApplication.interviewLocation && (
                          <div className="flex items-center justify-between">
                            <span className="font-quicksand text-gray-600">
                              Location
                            </span>
                            <span className="font-quicksand font-medium text-gray-800">
                              {selectedApplication.interviewLocation}
                            </span>
                          </div>
                        )}
                        {selectedApplication.interviewNotes && (
                          <div>
                            <span className="font-quicksand text-gray-600">
                              Notes
                            </span>
                            <p className="font-quicksand mt-1 text-sm text-gray-700">
                              {selectedApplication.interviewNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowScheduleModal(false)}
          />
          <div className="relative mx-4 w-full max-w-md scale-100 transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 sm:mx-6">
            <div className="max-h-[85vh] overflow-y-auto">
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-cinzel text-xl font-bold text-gray-800 sm:text-2xl">
                    Schedule Interview
                  </h3>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleScheduleInterview();
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                      Interview Date
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={interviewSchedule.date}
                        onChange={(e) =>
                          setInterviewSchedule((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="font-quicksand w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                      Interview Time (EST)
                    </label>
                    <div className="relative">
                      <FiClock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        type="time"
                        value={interviewSchedule.time}
                        onChange={(e) =>
                          setInterviewSchedule((prev) => ({
                            ...prev,
                            time: e.target.value,
                          }))
                        }
                        className="font-quicksand w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                        required
                      />
                    </div>
                    <p className="font-quicksand mt-1 text-xs text-gray-500">
                      Eastern Standard Time (New York)
                    </p>
                  </div>

                  <div>
                    <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                      Interview Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setInterviewSchedule((prev) => ({
                            ...prev,
                            type: "video_call",
                          }))
                        }
                        className={`flex flex-col items-center justify-center rounded-lg border py-3 transition-all ${
                          interviewSchedule.type === "video_call"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <FiVideo className="mb-1 h-5 w-5" />
                        <span className="text-xs font-medium">Video Call</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setInterviewSchedule((prev) => ({
                            ...prev,
                            type: "phone",
                          }))
                        }
                        className={`flex flex-col items-center justify-center rounded-lg border py-3 transition-all ${
                          interviewSchedule.type === "phone"
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <FiPhoneCall className="mb-1 h-5 w-5" />
                        <span className="text-xs font-medium">Phone Call</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setInterviewSchedule((prev) => ({
                            ...prev,
                            type: "in_person",
                          }))
                        }
                        className={`flex flex-col items-center justify-center rounded-lg border py-3 transition-all ${
                          interviewSchedule.type === "in_person"
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <FiUser className="mb-1 h-5 w-5" />
                        <span className="text-xs font-medium">In-person</span>
                      </button>
                    </div>
                  </div>

                  {interviewSchedule.type === "in_person" && (
                    <div>
                      <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        value={interviewSchedule.location}
                        onChange={(e) =>
                          setInterviewSchedule((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="Enter interview location"
                        className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={interviewSchedule.notes}
                      onChange={(e) =>
                        setInterviewSchedule((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={3}
                      className="font-quicksand w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                      placeholder="Add any additional notes for the interview..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowScheduleModal(false)}
                      className="font-quicksand flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="font-quicksand flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 text-sm font-medium text-white transition-all hover:shadow-lg"
                    >
                      Schedule Interview
                    </button>
                  </div>
                </form>
              </div>
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
                Delete Applicant
              </h3>
              <p className="font-quicksand mb-8 text-center text-gray-600">
                Are you sure you want to delete this applicant? This action
                cannot be undone.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="font-quicksand flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteApplicant(showDeleteConfirm)}
                  className="font-quicksand flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:shadow-md"
                >
                  Delete Applicant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantManagement;
