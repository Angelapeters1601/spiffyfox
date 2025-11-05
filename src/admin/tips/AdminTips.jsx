import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../services/supabaseClient";
import { getYouTubeVideoDetails } from "../../services/youtubeAPI";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiYoutube,
  FiUpload,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
  FiMoreVertical,
} from "react-icons/fi";

const AdminTips = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [selectedService, setSelectedService] = useState(
    "Residential Cleaning",
  );
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openActionsId, setOpenActionsId] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Service categories
  const serviceCategories = [
    { id: "all", name: "All Services" },
    { name: "Residential Cleaning", color: "purple" },
    { name: "Commercial Cleaning", color: "blue" },
    { name: "Deep Cleaning", color: "green" },
    { name: "Organization", color: "orange" },
    { name: "Power Washing", color: "red" },
    { name: "Junk Removal", color: "indigo" },
    { name: "Packing & Unpacking", color: "pink" },
    { name: "Personal Assistance", color: "teal" },
  ];

  // Utility functions
  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Extract YouTube ID from URL
  const extractYouTubeId = (url) => {
    if (!url) return null;

    // youtube links
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split(/[?&#]/)[0];
    }

    // YouTube URLs
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // fetchVideos function
  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("admin_tips")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const processedVideos = data.map((video) => {
        const youtubeId = extractYouTubeId(video.url);
        const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

        return {
          ...video,
          youtubeId,
          thumbnail_url: video.thumbnail_url || thumbnailUrl,
          formattedDuration: formatDuration(video.duration_seconds || 0),
          formattedViews: formatViews(video.views || 0),
          formattedDate: new Date(video.created_at).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            },
          ),
        };
      });

      setVideos(processedVideos);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  // format views
  const formatViews = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  };

  // handleUpload function
  const handleUpload = async () => {
    if (!youtubeUrl || !title) {
      setUploadError("YouTube URL and Title are required");
      return;
    }

    console.log("🚀 Starting upload process...");
    setIsUploading(true);
    setUploadError(null);

    try {
      console.log("🔍 Step 1: Extracting YouTube ID");
      const youtubeId = extractYouTubeId(youtubeUrl);
      if (!youtubeId) throw new Error("Invalid YouTube URL");
      console.log("✅ YouTube ID:", youtubeId);

      console.log("🔍 Step 2: Getting YouTube details");
      let youtubeDetails = { duration: 0, views: 0 };
      try {
        youtubeDetails = await getYouTubeVideoDetails(youtubeId);
        console.log("✅ YouTube details:", youtubeDetails);
      } catch (error) {
        console.warn("⚠️ YouTube API failed, using defaults:", error);
      }

      console.log("🔍 Step 3: Preparing video data");
      const videoData = {
        url: youtubeUrl,
        title: title.trim(),
        service: selectedService,
        description: description.trim(),
        thumbnail_url: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        duration_seconds: youtubeDetails.duration || 0,
        views: youtubeDetails.views || 0,
        created_at: new Date().toISOString(),
      };
      console.log("📦 Video data prepared:", videoData);

      console.log("🔍 Step 4: Starting database operation");
      let result;

      if (editingVideo) {
        console.log("✏️ Updating existing video:", editingVideo.id);
        result = await supabase
          .from("admin_tips")
          .update(videoData)
          .eq("id", editingVideo.id)
          .select();
      } else {
        console.log("➕ Inserting new video");
        result = await supabase.from("admin_tips").insert([videoData]).select();
      }

      console.log("🔍 Step 5: Database response received");
      console.log("🗄️ Full Supabase response:", result);

      const { data, error } = result;

      if (error) {
        console.error("❌ Supabase error:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      if (!data || data.length === 0) {
        console.error("❌ No data returned");
        throw new Error("No data returned from database operation");
      }

      console.log("✅ Database operation successful:", data);

      console.log("🔍 Step 6: Refreshing video list");
      await fetchVideos();

      console.log("🔍 Step 7: Showing success and resetting");
      setUploadSuccess(true);
      resetForm();

      setTimeout(() => {
        setShowUploadForm(false);
        setUploadSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("❌ Upload error:", error);
      setUploadError(error.message || "Failed to upload video");
    } finally {
      console.log("🔍 Step 8: Final cleanup");
      setIsUploading(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setYoutubeUrl("");
    setTitle("");
    setDescription("");
    setSelectedService("Residential Cleaning");
    setEditingVideo(null);
    setUploadError(null);
  };

  // Handle edit video
  const handleEdit = (video) => {
    setEditingVideo(video);
    setYoutubeUrl(video.url);
    setTitle(video.title);
    setSelectedService(video.service);
    setDescription(video.description || "");
    setShowUploadForm(true);
    setOpenActionsId(null);
    setUploadError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete video
  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("admin_tips")
        .delete()
        .eq("id", videoId);

      if (error) throw error;

      await fetchVideos();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete video: " + error.message);
    } finally {
      setIsDeleting(false);
      setOpenActionsId(null);
    }
  };

  // Handle cancel operation
  const handleCancel = () => {
    setShowUploadForm(false);
    resetForm();
    setIsUploading(false);
  };

  // Filter videos based on search and category
  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.description &&
        video.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Now comparing service names directly
    const matchesCategory = activeTab === "all" || video.service === activeTab;

    return matchesSearch && matchesCategory;
  });

  // Toggle actions dropdown
  const toggleActions = (id) => {
    setOpenActionsId(openActionsId === id ? null : id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".actions-dropdown")) {
        setOpenActionsId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Get service color class
  const getServiceColorClass = (serviceName) => {
    const service = serviceCategories.find((s) => s.name === serviceName);
    if (!service) return "bg-gray-100 text-gray-700 border-gray-200";

    const colorMap = {
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      green: "bg-green-100 text-green-700 border-green-200",
      orange: "bg-orange-100 text-orange-700 border-orange-200",
      red: "bg-red-100 text-red-700 border-red-200",
      indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
      pink: "bg-pink-100 text-pink-700 border-pink-200",
      teal: "bg-teal-100 text-teal-700 border-teal-200",
    };

    return (
      colorMap[service.color] || "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/320x180/EDF2F7/374151?text=No+Thumbnail";
  };

  return (
    <div className="font-quicksand min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            <h1 className="spiffy-text-dark font-cormorant mb-2 text-3xl font-bold md:text-4xl">
              Expert Tips & Training
            </h1>
            <p className="font-quicksand text-lg text-gray-600">
              Curate professional training content for your team
            </p>
          </div>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(177, 156, 217, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowUploadForm(!showUploadForm);
              if (showUploadForm) {
                handleCancel();
              }
            }}
            className="spiffy-bg font-quicksand mt-4 flex items-center rounded-xl px-6 py-3 font-medium text-white transition-all duration-300 outline-none hover:shadow-lg focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 focus:outline-none md:mt-0"
          >
            <FiUpload className="mr-2" />
            {showUploadForm ? "Cancel" : "Add Training Video"}
          </motion.button>
        </div>

        {/* Upload Form */}
        <AnimatePresence>
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="spiffy-border mb-8 overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-lg backdrop-blur-sm"
            >
              <h2 className="spiffy-text-dark font-cormorant mb-6 flex items-center text-2xl font-bold">
                <FiYoutube className="mr-3 text-purple-500" />
                {editingVideo ? "Edit Training Video" : "Add Training Video"}
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                      YouTube URL *
                    </label>
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="font-quicksand w-full rounded-xl border-2 border-gray-200 p-3 transition-all duration-300 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-300"
                    />
                  </div>

                  <div>
                    <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Professional training video"
                      className="font-quicksand w-full rounded-xl border-2 border-gray-200 p-3 transition-all duration-300 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                      Service Category *
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="font-quicksand w-full rounded-xl border-2 border-gray-200 p-3 transition-all duration-300 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-300"
                    >
                      {serviceCategories
                        .filter((c) => c.id !== "all")
                        .map((category) => (
                          <option key={category.name} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-quicksand mb-2 block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Add key learning points and objectives..."
                      className="font-quicksand w-full resize-none rounded-xl border-2 border-gray-200 p-3 transition-all duration-300 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={handleCancel}
                    disabled={isUploading}
                    className="font-quicksand rounded-xl border-2 border-gray-300 px-6 py-3 font-medium text-gray-700 transition-all duration-300 outline-none hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={`font-quicksand flex items-center rounded-xl px-6 py-3 font-medium text-white transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                      isUploading
                        ? "spiffy-bg-dark cursor-not-allowed focus:ring-purple-300"
                        : "spiffy-bg hover:scale-105 hover:shadow-lg focus:ring-purple-300"
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <svg
                          className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {editingVideo ? "Updating..." : "Uploading..."}
                      </>
                    ) : (
                      <>
                        <FiPlus className="mr-2" />
                        {editingVideo ? "Update Video" : "Add Video"}
                      </>
                    )}
                  </button>
                </div>

                {uploadError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-start rounded-xl border-2 border-red-200 bg-red-50 p-4 text-red-700"
                  >
                    <FiXCircle className="mt-0.5 mr-3 flex-shrink-0 text-red-500" />
                    <div>
                      <p className="font-quicksand font-medium">
                        {editingVideo ? "Update failed" : "Upload failed"}
                      </p>
                      <p className="font-quicksand text-sm">{uploadError}</p>
                    </div>
                  </motion.div>
                )}

                {uploadSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-start rounded-xl border-2 border-green-200 bg-green-50 p-4 text-green-700"
                  >
                    <FiCheckCircle className="mt-0.5 mr-3 flex-shrink-0 text-green-500" />
                    <div>
                      <p className="font-quicksand font-medium">
                        {editingVideo
                          ? "Update successful!"
                          : "Upload successful!"}
                      </p>
                      <p className="font-quicksand text-sm">
                        {editingVideo
                          ? "Video has been updated."
                          : "Video added to your training library."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters  */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col gap-6">
            {/* Search Input - Full width */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search training videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="font-quicksand w-full rounded-xl border-2 border-gray-200 p-4 pl-12 transition-all duration-300 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Service Filters - responsive grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9">
              {serviceCategories.map((category) => (
                <button
                  key={category.id || category.name}
                  onClick={() => setActiveTab(category.id || category.name)}
                  className={`font-quicksand rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300 outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 sm:text-sm ${
                    activeTab === (category.id || category.name)
                      ? "spiffy-bg text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Video Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-white p-6 shadow-lg"
              >
                <div className="aspect-w-16 aspect-h-9 mb-4 rounded-xl bg-gray-200"></div>
                <div className="mb-3 h-5 w-3/4 rounded bg-gray-200"></div>
                <div className="mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
                <div className="flex justify-between">
                  <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                  <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                whileHover={{ y: -8, scale: 1.02 }}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                <div className="group relative">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div className="bg-opacity-80 absolute right-3 bottom-3 rounded-lg bg-black px-2 py-1 text-xs text-white backdrop-blur-sm">
                    {video.formattedDuration}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-quicksand line-clamp-2 text-lg leading-tight font-bold text-gray-800">
                      {video.title}
                    </h3>
                    <div className="actions-dropdown relative ml-2">
                      <button
                        onClick={() => toggleActions(video.id)}
                        className="rounded-xl p-2 text-gray-400 transition-colors duration-200 outline-none hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                      >
                        <FiMoreVertical />
                      </button>

                      <AnimatePresence>
                        {openActionsId === video.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            className="ring-opacity-5 absolute right-0 z-10 mt-2 w-48 origin-top-right overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black focus:outline-none"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleEdit(video)}
                                className="font-quicksand flex w-full items-center px-4 py-3 text-left text-sm text-gray-700 transition-colors duration-200 outline-none hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                              >
                                <FiEdit2 className="mr-3 text-blue-500" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(video.id)}
                                disabled={isDeleting}
                                className="font-quicksand flex w-full items-center px-4 py-3 text-left text-sm text-gray-700 transition-colors duration-200 outline-none hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:opacity-50"
                              >
                                {isDeleting ? (
                                  <>
                                    <svg
                                      className="mr-2 -ml-1 h-4 w-4 animate-spin text-red-500"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Deleting...
                                  </>
                                ) : (
                                  <>
                                    <FiTrash2 className="mr-3 text-red-500" />
                                    Delete
                                  </>
                                )}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <p className="font-quicksand mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
                    {video.description || "No description available"}
                  </p>

                  <div className="font-quicksand mb-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiEye className="mr-2" />
                      <span>{video.formattedViews}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-2" />
                      <span>{video.formattedDate}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span
                      className={`font-quicksand inline-block rounded-full border px-3 py-1 text-xs font-medium ${getServiceColorClass(video.service)}`}
                    >
                      {video.service}
                    </span>
                  </div>

                  <a
                    href={`https://youtu.be/${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="spiffy-bg font-quicksand block w-full rounded-xl py-3 text-center font-medium text-white transition-all duration-300 outline-none hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 focus:outline-none"
                  >
                    Watch Training Video
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white/95 p-12 text-center shadow-lg backdrop-blur-sm">
            <FiYoutube className="mx-auto mb-4 text-5xl text-gray-300" />
            <h3 className="font-cormorant mb-2 text-xl font-medium text-gray-700">
              No training videos found
            </h3>
            <p className="font-quicksand text-gray-500">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Add your first training video to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTips;
