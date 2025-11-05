import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import {
  FaHome,
  FaBuilding,
  FaBroom,
  FaBoxes,
  FaSprayCan,
  FaTrash,
  FaBoxOpen,
  FaHandsHelping,
  FaStar,
  FaShieldAlt,
  FaRecycle,
  FaClock,
  FaPlay,
  FaEye,
  FaRegClock,
} from "react-icons/fa";

// Import fallback images
import tip1 from "../assets/img1.jpg";
import tip2 from "../assets/img2.jpg";
import tip3 from "../assets/img3.jpg";
import tip4 from "../assets/img4.jpg";
import tip5 from "../assets/img5.jpg";
import tip6 from "../assets/img6.jpg";
import tip7 from "../assets/img7.jpg";
import tip8 from "../assets/img8.jpg";

const Tip = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const services = [
    {
      id: 1,
      title: "Residential Cleaning",
      icon: <FaHome className="text-3xl" />,
      description:
        "Transform your living space into a sanctuary of cleanliness and comfort with our expert residential cleaning services.",
      fallbackImage: tip1,
      color: "from-purple-500 to-purple-600",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      id: 2,
      title: "Commercial Cleaning",
      icon: <FaBuilding className="text-3xl" />,
      description:
        "Maintain a professional, hygienic workspace that boosts productivity and impresses clients.",
      fallbackImage: tip2,
      color: "from-blue-500 to-blue-600",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      id: 3,
      title: "Deep Cleaning",
      icon: <FaBroom className="text-3xl" />,
      description:
        "Go beyond surface cleaning with our intensive deep cleaning solutions for a truly pristine environment.",
      fallbackImage: tip3,
      color: "from-green-500 to-green-600",
      badgeColor: "bg-green-100 text-green-700 border-green-200",
    },
    {
      id: 4,
      title: "Organization",
      icon: <FaBoxes className="text-3xl" />,
      description:
        "Create harmonious, efficient spaces through strategic organization and systematic decluttering.",
      fallbackImage: tip4,
      color: "from-orange-500 to-orange-600",
      badgeColor: "bg-orange-100 text-orange-700 border-orange-200",
    },
    {
      id: 5,
      title: "Power Washing",
      icon: <FaSprayCan className="text-3xl" />,
      description:
        "Restore your property's exterior to its original glory with professional-grade power washing.",
      fallbackImage: tip5,
      color: "from-red-500 to-red-600",
      badgeColor: "bg-red-100 text-red-700 border-red-200",
    },
    {
      id: 6,
      title: "Junk Removal",
      icon: <FaTrash className="text-3xl" />,
      description:
        "Efficient, eco-friendly junk removal that clears your space while respecting the environment.",
      fallbackImage: tip6,
      color: "from-indigo-500 to-indigo-600",
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
    {
      id: 7,
      title: "Packing & Unpacking",
      icon: <FaBoxOpen className="text-3xl" />,
      description:
        "Stress-free relocation services with meticulous packing, secure transport, and organized unpacking.",
      fallbackImage: tip7,
      color: "from-pink-500 to-pink-600",
      badgeColor: "bg-pink-100 text-pink-700 border-pink-200",
    },
    {
      id: 8,
      title: "Personal Assistance",
      icon: <FaHandsHelping className="text-3xl" />,
      description:
        "Comprehensive personal assistance services designed to simplify your life and save you time.",
      fallbackImage: tip8,
      color: "from-teal-500 to-teal-600",
      badgeColor: "bg-teal-100 text-teal-700 border-teal-200",
    },
  ];

  // Fetch videos from Supabase
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("admin_tips")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        console.log("Fetched videos for frontend:", data);
        setVideos(data || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load training videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Utility functions
  const extractYouTubeId = (url) => {
    if (!url) return null;
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split(/[?&#]/)[0];
    }
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const formatViews = (count) => {
    if (!count || isNaN(count)) return "0 views";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  };

  // Get videos for a specific service
  const getServiceVideos = (serviceName) => {
    return videos.filter((video) => video.service === serviceName);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
      },
    },
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <h2 className="font-cinzel mb-4 text-2xl font-bold text-gray-800">
            Error Loading Content
          </h2>
          <p className="font-quicksand text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="font-cinzel spiffy-bg-light relative flex items-center justify-center p-16 text-5xl font-bold text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center">
            Expert Tips & Training
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mx-auto mt-4 h-1 rounded-full bg-white"
            />
          </div>
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 mx-auto max-w-4xl px-4 py-12 text-center"
        >
          <h2 className="font-cinzel mb-6 text-3xl font-bold text-gray-800">
            Professional Training & Mastery
          </h2>
          <p className="font-quicksand text-xl leading-relaxed text-gray-600">
            Access our comprehensive library of professional training videos.
            Learn expert techniques, proven methods, and industry secrets from
            SpiffyFox professionals.
          </p>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl px-4 py-16"
      >
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <FaStar />,
              text: "Expert Verified",
              color: "text-yellow-500",
            },
            {
              icon: <FaShieldAlt />,
              text: "Proven Methods",
              color: "text-green-500",
            },
            {
              icon: <FaRecycle />,
              text: "Eco-Friendly",
              color: "text-blue-500",
            },
            {
              icon: <FaClock />,
              text: "Time-Saving",
              color: "text-purple-500",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div
                className={`${feature.color} mb-4 flex justify-center text-3xl`}
              >
                {feature.icon}
              </div>
              <h3 className="font-cinzel text-lg font-semibold text-gray-800">
                {feature.text}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Services Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-20"
        >
          {services.map((service, index) => {
            const serviceVideos = getServiceVideos(service.title);
            const isLastService = index === services.length - 1;

            return (
              <div key={service.id}>
                <motion.section
                  variants={itemVariants}
                  className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-12`}
                >
                  {/* Image/Video Section */}
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    className="flex-1"
                  >
                    <div className="group relative">
                      {/* Dark Overlay Container */}
                      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                        <img
                          src={service.fallbackImage}
                          alt={service.title}
                          className="h-80 w-full transform object-cover transition-transform duration-500 group-hover:scale-105 lg:h-96"
                        />
                        {/* Permanent Dark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Content Overlay */}
                        <div className="absolute right-4 bottom-4 left-4 text-white">
                          <p className="font-quicksand text-sm font-medium">
                            {serviceVideos.length} Training Videos Available
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Content Section */}
                  <motion.div
                    variants={cardVariants}
                    className="flex-1 space-y-6"
                  >
                    {/* Service Header */}
                    <div className="mb-6 flex items-center space-x-4">
                      <div
                        className={`rounded-2xl bg-gradient-to-r p-4 ${service.color} text-white shadow-lg`}
                      >
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="font-cinzel text-3xl font-bold text-gray-800">
                          {service.title}
                        </h3>
                        <div
                          className={`h-1 w-20 bg-gradient-to-r ${service.color} mt-2 rounded-full`}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="font-quicksand text-lg leading-relaxed text-gray-600">
                      {service.description}
                    </p>

                    {/* Video Stats */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                      <h4 className="font-cinzel mb-4 text-xl font-semibold text-gray-800">
                        Training Library
                      </h4>

                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                        </div>
                      ) : serviceVideos.length > 0 ? (
                        <div className="space-y-4">
                          <p className="font-quicksand text-gray-600">
                            <strong>{serviceVideos.length}</strong> professional
                            training video
                            {serviceVideos.length !== 1 ? "s" : ""} available
                          </p>

                          {/* Featured Video Preview */}
                          <div className="group relative overflow-hidden rounded-xl border border-gray-200">
                            {/* Dark Overlay for Thumbnail */}
                            <div className="relative">
                              <img
                                src={
                                  serviceVideos[0].thumbnail_url ||
                                  `https://img.youtube.com/vi/${extractYouTubeId(serviceVideos[0].url)}/hqdefault.jpg`
                                }
                                alt={serviceVideos[0].title}
                                className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              {/* Permanent Dark Overlay */}
                              <div className="absolute inset-0 bg-black/30" />

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                              <div className="absolute top-4 left-4">
                                <span
                                  className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${service.badgeColor}`}
                                >
                                  Latest
                                </span>
                              </div>
                              <div className="absolute right-4 bottom-4 left-4 text-white">
                                <h5 className="font-quicksand line-clamp-1 font-semibold">
                                  {serviceVideos[0].title}
                                </h5>
                                <div className="mt-2 flex items-center space-x-4 text-sm opacity-90">
                                  <span className="flex items-center space-x-1">
                                    <FaRegClock className="text-xs" />
                                    <span>
                                      {formatDuration(
                                        serviceVideos[0].duration_seconds,
                                      )}
                                    </span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <FaEye className="text-xs" />
                                    <span>
                                      {formatViews(serviceVideos[0].views)}
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="rounded-full bg-white/20 p-4 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                                  <FaPlay className="text-2xl text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 text-center">
                          <FaPlay className="mx-auto mb-3 text-3xl text-gray-300" />
                          <p className="font-quicksand text-gray-500">
                            Training videos coming soon
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Call to Action */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block"
                    >
                      <a
                        href="#videos-section"
                        className={`font-quicksand bg-gradient-to-r px-6 py-3 ${service.color} flex items-center space-x-2 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
                      >
                        <FaPlay className="text-sm" />
                        <span>Watch Training Videos</span>
                      </a>
                    </motion.div>
                  </motion.div>
                </motion.section>

                {/* Horizontal Separator - Don't show after last service */}
                {!isLastService && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-20 flex justify-center"
                  >
                    <div className="h-px w-3/4 bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* All Videos Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          id="videos-section"
          className="mt-20"
        >
          <div className="mb-12 text-center">
            <h2 className="font-cinzel mb-4 text-4xl font-bold text-gray-800">
              Complete Training Library
            </h2>
            <p className="font-quicksand mx-auto max-w-2xl text-xl text-gray-600">
              Browse our entire collection of professional training videos
              across all service categories
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-white p-6 shadow-lg"
                >
                  <div className="mb-4 aspect-video rounded-xl bg-gray-200"></div>
                  <div className="mb-3 h-5 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video, index) => {
                const service = services.find((s) => s.title === video.service);
                const youtubeId = extractYouTubeId(video.url);

                return (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
                  >
                    <div className="relative">
                      {/* Dark Overlay for Thumbnail */}
                      <div className="relative overflow-hidden">
                        <img
                          src={
                            video.thumbnail_url ||
                            `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                          }
                          alt={video.title}
                          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Permanent Dark Overlay */}
                        <div className="absolute inset-0 bg-black/30" />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        <div className="absolute right-3 bottom-3 rounded-lg bg-black/80 px-2 py-1 text-xs text-white backdrop-blur-sm">
                          {formatDuration(video.duration_seconds)}
                        </div>
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-block rounded-full border px-2 py-1 text-xs font-medium ${service?.badgeColor || "border-gray-200 bg-gray-100 text-gray-700"}`}
                          >
                            {video.service}
                          </span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-full bg-white/20 p-4 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                            <FaPlay className="text-2xl text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-quicksand mb-3 line-clamp-2 text-lg leading-tight font-bold text-gray-800">
                        {video.title}
                      </h3>
                      <p className="font-quicksand mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
                        {video.description || "Professional training video"}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FaEye className="text-xs" />
                          <span>{formatViews(video.views)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaRegClock className="text-xs" />
                          <span>{formatDuration(video.duration_seconds)}</span>
                        </div>
                      </div>

                      <a
                        href={`https://youtu.be/${youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-quicksand mt-4 flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        <FaPlay className="text-sm" />
                        <span>Watch Video</span>
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-white/95 p-12 text-center shadow-lg backdrop-blur-sm">
              <FaPlay className="mx-auto mb-4 text-5xl text-gray-300" />
              <h3 className="font-cinzel mb-2 text-xl font-medium text-gray-700">
                No training videos available yet
              </h3>
              <p className="font-quicksand text-gray-500">
                Our training library is being prepared. Check back soon for
                professional content.
              </p>
            </div>
          )}
        </motion.section>
      </motion.div>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="spiffy-bg py-16 text-white"
      >
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-cinzel mb-6 text-4xl font-bold">
            Ready to Master Your Skills?
          </h2>
          <p className="font-quicksand mb-8 text-xl opacity-90">
            Access our complete training library and learn professional
            techniques from SpiffyFox experts.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-quicksand rounded-xl bg-white px-8 py-4 font-semibold text-purple-600 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <Link to="/contact">Get Professional Training</Link>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-quicksand rounded-xl border-2 border-white bg-transparent px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-purple-600"
            >
              <Link to="/services">Explore All Services</Link>
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Tip;
