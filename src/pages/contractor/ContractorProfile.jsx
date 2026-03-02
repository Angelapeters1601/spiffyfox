import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiTool,
  FiTruck,
  FiShield,
  FiStar,
  FiFileText,
  FiImage,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiArrowLeft,
  FiLogOut,
  FiCamera,
  FiUpload,
  FiSave,
  FiRefreshCw,
} from "react-icons/fi";

const ContractorProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (!user) {
        navigate("/contractor-login");
        return;
      }

      const targetUserId = id || user.id;
      setIsOwnProfile(targetUserId === user.id);

      const { data, error } = await supabase
        .from("contractors")
        .select("*")
        .eq("user_id", targetUserId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setError("Profile not found");
          setProfile(null);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
        setEditedProfile(data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/contractor-login");
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Failed to sign out");
    }
  };

  const handleImageUpload = async (event) => {
    try {
      setUploading(true);
      setError("");

      const file = event.target.files[0];
      if (!file) return;

      console.log("Selected file:", file.name, file.type, file.size);

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Please upload an image file (JPEG, PNG, GIF, or WebP)",
        );
      }

      // Validate file size (max 5MB for better performance)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size should be less than 2MB");
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in");

      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      console.log("Uploading to path:", fileName);

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from("contractor-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        throw uploadError;
      }

      console.log("Upload successful:", data);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("contractor-images").getPublicUrl(fileName);

      console.log("Public URL:", publicUrl);

      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from("contractors")
        .update({
          profile_image_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }

      // Update local state
      setProfile({ ...profile, profile_image_url: publicUrl });
      setEditedProfile({ ...editedProfile, profile_image_url: publicUrl });
      setSuccess("Profile photo updated successfully");

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error uploading image:", error);

      // More specific error messages
      if (error.message.includes("duplicate")) {
        setError(
          "A file with this name already exists. Please try a different file.",
        );
      } else if (error.message.includes("permission")) {
        setError(
          "You don't have permission to upload. Please check storage settings.",
        );
      } else if (error.message.includes("bucket")) {
        setError("Storage bucket not found. Please check bucket name.");
      } else {
        setError(error.message || "Failed to upload image");
      }
    } finally {
      setUploading(false);
      // Clear the file input
      event.target.value = "";
    }
  };

  const handleInputChange = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updates = {
        first_name: editedProfile.first_name,
        last_name: editedProfile.last_name,
        phone: editedProfile.phone,
        address: editedProfile.address,
        city: editedProfile.city,
        state: editedProfile.state,
        zip_code: editedProfile.zip_code,
        country: editedProfile.country,
        availability: editedProfile.availability,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("contractors")
        .update(updates)
        .eq("user_id", currentUser.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, ...updates });
      setIsEditing(false);
      setSuccess("Profile updated successfully");

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "active":
        return "text-emerald-700 bg-emerald-50";
      case "pending":
      case "new":
        return "text-amber-700 bg-amber-50";
      case "rejected":
      case "inactive":
        return "text-rose-700 bg-rose-50";
      case "interview scheduled":
        return "text-blue-700 bg-blue-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiRefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <FiAlertCircle className="text-xl text-red-500" />
          </div>
          <h2 className="mb-1 text-lg font-medium text-gray-900">
            Unable to load profile
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            {error || "Please try again later"}
          </p>
          <button
            onClick={() => navigate("/contractor")}
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button
              onClick={() => navigate("/contractor")}
              className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              <FiArrowLeft className="text-base" />
              <span>Dashboard</span>
            </button>

            {isOwnProfile && (
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedProfile(profile);
                      }}
                      className="px-3 py-1.5 text-sm text-gray-600 transition-colors hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <FiRefreshCw className="animate-spin text-sm" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <FiSave className="text-sm" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowSignOutConfirm(true)}
                    className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    <FiLogOut className="text-sm" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <FiCheckCircle className="mt-0.5 text-sm text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <FiAlertCircle className="mt-0.5 text-sm text-red-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {/* Profile Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* Profile Image */}
              <div className="group relative">
                <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm">
                  {profile.profile_image_url ? (
                    <img
                      src={profile.profile_image_url}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-2xl font-medium text-gray-400">
                      {(
                        profile.first_name?.[0] ||
                        profile.email?.[0] ||
                        "C"
                      ).toUpperCase()}
                    </div>
                  )}
                </div>

                {isOwnProfile && !isEditing && (
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <FiCamera className="text-lg text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}

                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <FiRefreshCw className="animate-spin text-lg text-white" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-1 text-xl font-semibold text-gray-900">
                  {profile.first_name || "First Name"}{" "}
                  {profile.last_name || "Last Name"}
                </h1>
                <p className="mb-3 text-sm text-gray-500">{profile.email}</p>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(profile.application_status)}`}
                  >
                    {profile.application_status || "Pending"}
                  </span>

                  {profile.rating && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      <FiStar className="fill-amber-500 text-xs text-amber-500" />
                      {profile.rating}/5
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200 sm:grid-cols-4">
            <div className="p-4 text-center">
              <p className="text-lg font-semibold text-gray-900">
                {profile.experience_years || 0}
              </p>
              <p className="text-xs text-gray-500">Years Experience</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-lg font-semibold text-gray-900">
                {profile.services_offered?.length || 0}
              </p>
              <p className="text-xs text-gray-500">Services</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-lg font-semibold text-gray-900">
                {profile.availability || "N/A"}
              </p>
              <p className="text-xs text-gray-500">Availability</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(profile.application_date).split(",")[0]}
              </p>
              <p className="text-xs text-gray-500">Applied</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: "personal", label: "Personal", icon: FiUser },
                { id: "job", label: "Job Details", icon: FiBriefcase },
                { id: "services", label: "Services", icon: FiTool },
                { id: "interview", label: "Interview", icon: FiCalendar },
                { id: "documents", label: "Documents", icon: FiFileText },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } `}
                >
                  <tab.icon className="text-base" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Basic Information */}
                  <div>
                    <h3 className="mb-4 text-sm font-medium text-gray-900">
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500">
                          Full Name
                        </label>
                        {isEditing ? (
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editedProfile.first_name || ""}
                              onChange={(e) =>
                                handleInputChange("first_name", e.target.value)
                              }
                              placeholder="First name"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                            />
                            <input
                              type="text"
                              value={editedProfile.last_name || ""}
                              onChange={(e) =>
                                handleInputChange("last_name", e.target.value)
                              }
                              placeholder="Last name"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                            />
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            {profile.first_name || "Not provided"}{" "}
                            {profile.last_name || ""}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs text-gray-500">Email</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {profile.email}
                        </p>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500">Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedProfile.phone || ""}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            placeholder="Phone number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            {profile.phone || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs text-gray-500">Address</label>
                        {isEditing ? (
                          <div className="mt-1 space-y-2">
                            <input
                              type="text"
                              value={editedProfile.address || ""}
                              onChange={(e) =>
                                handleInputChange("address", e.target.value)
                              }
                              placeholder="Street address"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={editedProfile.city || ""}
                                onChange={(e) =>
                                  handleInputChange("city", e.target.value)
                                }
                                placeholder="City"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                              />
                              <input
                                type="text"
                                value={editedProfile.state || ""}
                                onChange={(e) =>
                                  handleInputChange("state", e.target.value)
                                }
                                placeholder="State"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={editedProfile.zip_code || ""}
                                onChange={(e) =>
                                  handleInputChange("zip_code", e.target.value)
                                }
                                placeholder="ZIP code"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                              />
                              <input
                                type="text"
                                value={editedProfile.country || ""}
                                onChange={(e) =>
                                  handleInputChange("country", e.target.value)
                                }
                                placeholder="Country"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            {[
                              profile.address,
                              profile.city,
                              profile.state,
                              profile.zip_code,
                              profile.country,
                            ]
                              .filter(Boolean)
                              .join(", ") || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Application Status */}
                  <div>
                    <h3 className="mb-4 text-sm font-medium text-gray-900">
                      Application Status
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500">
                          Applied On
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDate(profile.application_date)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Last Updated
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDate(profile.updated_at)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Background Check
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {profile.background_check_status || "Not started"}
                        </p>
                      </div>
                    </div>

                    {!isEditing && isOwnProfile && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="mt-6 inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <FiCamera className="text-sm" />
                        <span>Edit profile information</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Job Details Tab */}
            {activeTab === "job" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-sm font-medium text-gray-900">
                    Position Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500">
                        Applied Position
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {profile.job_applied || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">
                        Experience
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {profile.experience_years || 0} years
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">
                        Expected Salary
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatCurrency(profile.expected_salary)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">
                        Availability
                      </label>
                      {isEditing ? (
                        <select
                          value={editedProfile.availability || ""}
                          onChange={(e) =>
                            handleInputChange("availability", e.target.value)
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        >
                          <option value="">Select availability</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Weekends">Weekends</option>
                          <option value="Evenings">Evenings</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {profile.availability || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-medium text-gray-900">
                    Equipment & Transportation
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Has Vehicle</span>
                      <span
                        className={`text-sm font-medium ${profile.has_vehicle ? "text-gray-900" : "text-gray-500"}`}
                      >
                        {profile.has_vehicle ? "Yes" : "No"}
                      </span>
                    </div>
                    {profile.has_vehicle && profile.vehicle_type && (
                      <div>
                        <label className="text-xs text-gray-500">
                          Vehicle Type
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {profile.vehicle_type}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Has Equipment
                      </span>
                      <span
                        className={`text-sm font-medium ${profile.has_equipment ? "text-gray-900" : "text-gray-500"}`}
                      >
                        {profile.has_equipment ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Insurance Coverage
                      </span>
                      <span
                        className={`text-sm font-medium ${profile.insurance_coverage ? "text-gray-900" : "text-gray-500"}`}
                      >
                        {profile.insurance_coverage ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === "services" && (
              <div>
                <h3 className="mb-4 text-sm font-medium text-gray-900">
                  Services Offered
                </h3>
                {profile.services_offered?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {profile.services_offered.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-md bg-gray-50 p-3"
                      >
                        <FiCheckCircle className="text-sm text-green-500" />
                        <span className="text-sm text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No services selected</p>
                )}

                {profile.service_areas && (
                  <div className="mt-6">
                    <h4 className="mb-2 text-sm font-medium text-gray-900">
                      Service Areas
                    </h4>
                    <p className="text-sm text-gray-700">
                      {profile.service_areas}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Interview Tab */}
            {activeTab === "interview" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-sm font-medium text-gray-900">
                    Interview Details
                  </h3>
                  {profile.interview_date ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500">
                          Interview Date
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDate(profile.interview_date)}
                        </p>
                      </div>
                      {profile.interview_time && (
                        <div>
                          <label className="text-xs text-gray-500">
                            Interview Time
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {profile.interview_time}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-xs text-gray-500">
                          Interview Type
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {profile.interview_type || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Status</label>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(profile.interview_status)}`}
                          >
                            {profile.interview_status || "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No interview scheduled
                    </p>
                  )}
                </div>

                {profile.interview_notes && (
                  <div>
                    <h3 className="mb-4 text-sm font-medium text-gray-900">
                      Interview Notes
                    </h3>
                    <p className="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                      {profile.interview_notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-sm font-medium text-gray-900">
                    Documents
                  </h3>
                  <div className="space-y-3">
                    {profile.resume_url && (
                      <a
                        href={profile.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                      >
                        <FiFileText className="text-lg text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Resume
                          </p>
                          <p className="text-xs text-gray-500">Click to view</p>
                        </div>
                      </a>
                    )}

                    {profile.insurance_url && (
                      <a
                        href={profile.insurance_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                      >
                        <FiShield className="text-lg text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Insurance Document
                          </p>
                          <p className="text-xs text-gray-500">Click to view</p>
                        </div>
                      </a>
                    )}

                    {!profile.resume_url && !profile.insurance_url && (
                      <p className="text-sm text-gray-500">
                        No documents uploaded
                      </p>
                    )}
                  </div>
                </div>

                {profile.admin_notes && (
                  <div>
                    <h3 className="mb-4 text-sm font-medium text-gray-900">
                      Admin Notes
                    </h3>
                    <p className="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                      {profile.admin_notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Last Updated */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Last updated: {formatDate(profile.updated_at)}
        </p>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-base font-medium text-gray-900">
              Sign Out
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Are you sure you want to sign out?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorProfile;
