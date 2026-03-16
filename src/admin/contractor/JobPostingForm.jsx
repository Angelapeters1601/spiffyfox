import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiBriefcase,
  FiCheck,
  FiX,
  FiPlus,
  FiTool,
  FiTruck,
  FiClock,
  FiShield,
} from "react-icons/fi";
import { supabase } from "../../services/supabaseClient";

const JobPostingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
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
  });

  const [errors, setErrors] = useState({});

  // Job type options
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

  // Requirement options
  const requirementOptions = [
    "Reliable transportation",
    "Cleaning experience",
    "Equipment knowledge",
    "Valid driver's license",
    "Background check required",
    "Physical stamina",
    "Attention to detail",
    "Good communication skills",
    "Professional references",
    "Insurance coverage",
  ];

  useEffect(() => {
    if (isEditing) {
      fetchJobPosting();
    }
  }, [id]);

  const fetchJobPosting = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          ...data,
          posted_date:
            data.posted_date?.split("T")[0] ||
            new Date().toISOString().split("T")[0],
          deadline: data.deadline?.split("T")[0] || "",
          requirements:
            data.requirements?.length > 0 ? data.requirements : [""],
        });
      }
    } catch (error) {
      console.error("Error fetching job posting:", error);
      navigate("/admin/job-postings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDescriptionChange = (e) => {
    setFormData((prev) => ({ ...prev, description: e.target.value }));
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

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

  const addQuickRequirement = (requirement) => {
    if (!formData.requirements.includes(requirement)) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirement],
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    }

    if (formData.deadline && new Date(formData.deadline) < new Date()) {
      newErrors.deadline = "Deadline must be in the future";
    }

    if (formData.salary_range && !formData.salary_range.includes("-")) {
      newErrors.salary_range = "Please use format: $XX,XXX - $XX,XXX";
    }

    if (
      formData.commission_percentage &&
      (isNaN(formData.commission_percentage) ||
        formData.commission_percentage < 0 ||
        formData.commission_percentage > 100)
    ) {
      newErrors.commission_percentage = "Must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // Prepare data for submission
      const submissionData = {
        ...formData,
        requirements: formData.requirements.filter((req) => req.trim() !== ""),
        applications_count: parseInt(formData.applications_count) || 0,
        commission_percentage: parseFloat(formData.commission_percentage) || 0,
        updated_at: new Date().toISOString(),
      };

      if (isEditing) {
        // Update existing job
        const { error } = await supabase
          .from("job_postings")
          .update(submissionData)
          .eq("id", id);

        if (error) throw error;
      } else {
        // Create new job
        const { error } = await supabase
          .from("job_postings")
          .insert([submissionData]);

        if (error) throw error;
      }

      navigate("/admin/job-postings");
    } catch (error) {
      console.error("Error saving job posting:", error);
      alert("Failed to save job posting. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      navigate("/admin/job-postings");
    } catch (error) {
      console.error("Error deleting job posting:", error);
      alert("Failed to delete job posting. Please try again.");
    }
  };

  const handleQuickStatusChange = async (status) => {
    try {
      const { error } = await supabase
        .from("job_postings")
        .update({
          status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      setFormData((prev) => ({ ...prev, status }));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getDaysLeft = () => {
    if (!formData.deadline) return "∞";
    const days = Math.ceil(
      (new Date(formData.deadline) - new Date()) / (1000 * 60 * 60 * 24),
    );
    return days > 0 ? days : 0;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
          <p className="font-quicksand mt-4 text-gray-600">
            Loading job posting...
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
            <div className="flex items-center space-x-3">
              <Link
                to="/admin/job-postings"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <FiArrowLeft className="text-xl" />
              </Link>
              <div>
                <h1 className="font-cinzel mb-2 bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-xl font-bold text-transparent lg:text-2xl">
                  {isEditing ? "Edit Job Posting" : "Create New Job Posting"}
                </h1>
                <p className="font-quicksand text-sm text-gray-600">
                  {isEditing
                    ? "Update job details and requirements"
                    : "Create a new job opportunity for contractors"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-3 lg:mt-0">
            {isEditing && (
              <>
                <div className="flex items-center space-x-2 rounded-xl border border-gray-200 bg-white px-4 py-2">
                  <span className="font-quicksand text-sm text-gray-600">
                    Status:
                  </span>
                  <span
                    className={`font-quicksand rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(formData.status)}`}
                  >
                    {formatStatus(formData.status)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleQuickStatusChange("draft")}
                    className={`font-quicksand rounded-xl px-4 py-2 font-medium transition-colors ${
                      formData.status === "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-white text-gray-700 hover:bg-yellow-50"
                    }`}
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickStatusChange("active")}
                    className={`font-quicksand rounded-xl px-4 py-2 font-medium transition-colors ${
                      formData.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90"
                    }`}
                  >
                    Publish
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center space-x-2">
                <div className="rounded-lg bg-purple-100 p-2">
                  <FiBriefcase className="text-purple-600" />
                </div>
                <h2 className="font-cinzel text-lg font-semibold text-gray-800">
                  Basic Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-quicksand mb-2 block font-medium text-gray-700">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Residential Cleaning Specialist"
                    className={`font-quicksand w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none ${
                      errors.title
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    }`}
                  />
                  {errors.title && (
                    <p className="font-quicksand mt-1 text-sm text-red-600">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-quicksand mb-2 block font-medium text-gray-700">
                    Job Type
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {jobTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${
                          formData.job_type === type.value
                            ? "border-purple-500 bg-purple-50"
                            : "hover:bg-purple-25 border-gray-200 hover:border-purple-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="job_type"
                          value={type.value}
                          checked={formData.job_type === type.value}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <span className="text-xl">{type.icon}</span>
                        <span className="font-quicksand mt-2 text-center text-sm font-medium">
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-quicksand mb-2 block font-medium text-gray-700">
                    Job Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    rows={6}
                    placeholder="Describe the job responsibilities, expectations, and benefits..."
                    className={`font-quicksand w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none ${
                      errors.description
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    }`}
                  />
                  {errors.description && (
                    <p className="font-quicksand mt-1 text-sm text-red-600">
                      {errors.description}
                    </p>
                  )}
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <span>Tip: Use bullet points for readability</span>
                    <span>{formData.description.length}/2000 characters</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <FiTool className="text-blue-600" />
                  </div>
                  <h2 className="font-cinzel text-lg font-semibold text-gray-800">
                    Requirements & Qualifications
                  </h2>
                </div>
              </div>

              <div className="mb-4">
                <label className="font-quicksand mb-2 block font-medium text-gray-700">
                  Quick Add Requirements
                </label>
                <div className="flex flex-wrap gap-2">
                  {requirementOptions.map((req, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addQuickRequirement(req)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      + {req}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-quicksand block font-medium text-gray-700">
                  Custom Requirements
                </label>
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) =>
                        handleRequirementChange(index, e.target.value)
                      }
                      placeholder="Add a requirement..."
                      className="font-quicksand flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="rounded-lg p-3 text-red-600 hover:bg-red-50"
                      disabled={formData.requirements.length <= 1}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="font-quicksand flex items-center space-x-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-gray-600 hover:bg-gray-100"
                >
                  <FiPlus />
                  <span>Add Another Requirement</span>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="font-quicksand mb-2 block font-medium text-gray-700">
                    Experience Required
                  </label>
                  <select
                    name="experience_required"
                    value={formData.experience_required}
                    onChange={handleChange}
                    className="font-quicksand w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="intermediate">
                      Intermediate (2-5 years)
                    </option>
                    <option value="experienced">Experienced (5+ years)</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="font-quicksand block font-medium text-gray-700">
                    Equipment Requirements
                  </label>
                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center space-x-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="equipment_required"
                          checked={formData.equipment_required}
                          onChange={handleChange}
                          className="peer hidden"
                        />
                        <div className="h-5 w-5 rounded border border-gray-300 peer-checked:border-purple-600 peer-checked:bg-purple-600"></div>
                        <FiCheck className="absolute top-1/2 left-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white peer-checked:block" />
                      </div>
                      <span className="font-quicksand text-gray-700">
                        Equipment Required
                      </span>
                      <FiTool className="text-gray-400" />
                    </label>
                    <label className="flex cursor-pointer items-center space-x-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="vehicle_required"
                          checked={formData.vehicle_required}
                          onChange={handleChange}
                          className="peer hidden"
                        />
                        <div className="h-5 w-5 rounded border border-gray-300 peer-checked:border-purple-600 peer-checked:bg-purple-600"></div>
                        <FiCheck className="absolute top-1/2 left-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white peer-checked:block" />
                      </div>
                      <span className="font-quicksand text-gray-700">
                        Vehicle Required
                      </span>
                      <FiTruck className="text-gray-400" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Compensation & Timeline Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center space-x-2">
                <div className="rounded-lg bg-green-100 p-2">
                  <FiDollarSign className="text-green-600" />
                </div>
                <h2 className="font-cinzel text-lg font-semibold text-gray-800">
                  Compensation & Timeline
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="font-quicksand mb-2 block font-medium text-gray-700">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      name="salary_range"
                      value={formData.salary_range}
                      onChange={handleChange}
                      placeholder="$40,000 - $55,000"
                      className={`font-quicksand w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none ${
                        errors.salary_range
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      }`}
                    />
                    {errors.salary_range && (
                      <p className="font-quicksand mt-1 text-sm text-red-600">
                        {errors.salary_range}
                      </p>
                    )}
                    <p className="font-quicksand mt-1 text-xs text-gray-500">
                      Format: $XX,XXX - $XX,XXX
                    </p>
                  </div>

                  <div>
                    <label className="font-quicksand mb-2 block font-medium text-gray-700">
                      Commission Percentage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="commission_percentage"
                        value={formData.commission_percentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.5"
                        className={`font-quicksand w-full rounded-xl border px-4 py-3 pr-12 focus:ring-2 focus:outline-none ${
                          errors.commission_percentage
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        }`}
                      />
                      <span className="font-quicksand absolute top-1/2 right-4 -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                    {errors.commission_percentage && (
                      <p className="font-quicksand mt-1 text-sm text-red-600">
                        {errors.commission_percentage}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="font-quicksand mb-2 block font-medium text-gray-700">
                      Availability Needed
                    </label>
                    <select
                      name="availability_needed"
                      value={formData.availability_needed}
                      onChange={handleChange}
                      className="font-quicksand w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                      <option value="flexible">Flexible Hours</option>
                      <option value="weekends">Weekends Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-quicksand mb-2 block font-medium text-gray-700">
                      Application Deadline
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className={`font-quicksand w-full rounded-xl border px-4 py-3 pl-10 focus:ring-2 focus:outline-none ${
                          errors.deadline
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        }`}
                      />
                    </div>
                    {errors.deadline && (
                      <p className="font-quicksand mt-1 text-sm text-red-600">
                        {errors.deadline}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <div className="flex gap-3">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center space-x-2 rounded-xl border border-red-300 bg-white px-6 py-3 text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 />
                    <span className="font-quicksand font-medium">Delete</span>
                  </button>
                )}
                <Link
                  to="/admin/job-postings"
                  className="flex items-center justify-center space-x-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50"
                >
                  <FiX />
                  <span className="font-quicksand font-medium">Cancel</span>
                </Link>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-3 text-white transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                      <span className="font-quicksand font-medium">
                        Saving...
                      </span>
                    </>
                  ) : (
                    <>
                      <FiSave />
                      <span className="font-quicksand font-medium">
                        {isEditing
                          ? "Update Job Posting"
                          : "Create Job Posting"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Preview Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-cinzel mb-4 text-sm font-semibold text-gray-800">
              Job Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <div>
                  <p className="font-quicksand text-sm text-gray-600">
                    Current Status
                  </p>
                  <span
                    className={`font-quicksand inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(formData.status)}`}
                  >
                    {formatStatus(formData.status)}
                  </span>
                </div>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="font-quicksand rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleQuickStatusChange("draft")}
                  className="font-quicksand w-full cursor-pointer rounded-lg bg-yellow-50 py-2.5 text-yellow-700 hover:bg-yellow-100"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStatusChange("active")}
                  className="font-quicksand w-full cursor-pointer rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-2.5 text-white hover:opacity-90"
                >
                  Publish Now
                </button>
              </div>
            </div>
          </div>

          {/* Job Details Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-cinzel mb-4 text-lg font-semibold text-gray-800">
              Job Details Preview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-quicksand text-gray-600">Job Type:</span>
                <span className="font-quicksand font-medium text-gray-800">
                  {jobTypes.find((t) => t.value === formData.job_type)?.label}
                </span>
              </div>
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
              {formData.salary_range && (
                <div className="flex items-center justify-between">
                  <span className="font-quicksand text-gray-600">Salary:</span>
                  <span className="font-quicksand font-medium text-green-600">
                    {formData.salary_range}
                  </span>
                </div>
              )}
              {formData.deadline && (
                <div className="flex items-center justify-between">
                  <span className="font-quicksand text-gray-600">
                    Deadline:
                  </span>
                  <span className="font-quicksand font-medium text-gray-800">
                    {new Date(formData.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-cinzel mb-4 text-lg font-semibold text-gray-800">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="rounded-lg bg-blue-100 p-1.5">
                    <FiTool className="text-sm text-blue-600" />
                  </div>
                  <span className="font-quicksand text-sm text-gray-600">
                    Requirements:
                  </span>
                </div>
                <span className="font-quicksand font-medium text-gray-800">
                  {formData.requirements.filter((r) => r.trim() !== "").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="rounded-lg bg-green-100 p-1.5">
                    <FiUsers className="text-sm text-green-600" />
                  </div>
                  <span className="font-quicksand text-sm text-gray-600">
                    Applications:
                  </span>
                </div>
                <span className="font-quicksand font-medium text-gray-800">
                  {formData.applications_count}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="rounded-lg bg-purple-100 p-1.5">
                    <FiClock className="text-sm text-purple-600" />
                  </div>
                  <span className="font-quicksand text-sm text-gray-600">
                    Days Left:
                  </span>
                </div>
                <span className="font-quicksand font-medium text-gray-800">
                  {getDaysLeft()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="bg-opacity-50 absolute inset-0 bg-black backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-md scale-100 transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-center">
                <div className="rounded-full bg-red-100 p-3">
                  <FiTrash2 className="text-2xl text-red-600" />
                </div>
              </div>
              <h3 className="font-cinzel mb-2 text-center text-xl font-semibold text-gray-800">
                Delete Job Posting
              </h3>
              <p className="font-quicksand mb-6 text-center text-gray-600">
                Are you sure you want to delete "{formData.title}"? This action
                cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="font-quicksand rounded-xl border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="font-quicksand rounded-xl bg-red-600 px-6 py-2 font-medium text-white transition-colors hover:bg-red-700"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostingForm;
