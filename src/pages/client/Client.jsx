import { useEffect, useState } from "react";
import { signOut } from "../../services/auth";
import { supabase } from "../../services/supabaseClient";
import { supabase2 } from "../../services/supabaseClient";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiUserCheck,
  FiHome,
  FiHash,
  FiCheckCircle,
  FiClock,
  FiDatabase,
} from "react-icons/fi";
import {
  FaMale,
  FaFemale,
  FaTransgender,
  FaUserTie,
  FaRegUserCircle,
  FaDatabase,
} from "react-icons/fa";

const Client = () => {
  const [user, setUser] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(false);

  // Function to get gender icon with tooltip
  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return {
          icon: <FaMale className="text-blue-500" />,
          color: "bg-blue-100",
          textColor: "text-blue-700",
        };
      case "female":
        return {
          icon: <FaFemale className="text-pink-500" />,
          color: "bg-pink-100",
          textColor: "text-pink-700",
        };
      case "other":
      case "transgender":
        return {
          icon: <FaTransgender className="text-purple-500" />,
          color: "bg-purple-100",
          textColor: "text-purple-700",
        };
      default:
        return {
          icon: <FaRegUserCircle className="text-gray-400" />,
          color: "bg-gray-100",
          textColor: "text-gray-700",
        };
    }
  };

  // Format phone number
  const formatPhoneNumber = (phone) => {
    if (!phone) return "Not provided";
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user from primary Supabase (Authentication)
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          setAppLoading(true);

          // Fetch application details from SECOND database (supabase2)
          const { data: applicationData, error } = await supabase2
            .from("join_applications")
            .select("*")
            .eq("email", user.email) // Match by email
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (error) {
            console.log("No application found or error:", error.message);
          } else {
            setApplication(applicationData);
          }

          setAppLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          setAppLoading(true);
          try {
            // Fetch application from second DB when auth changes
            const { data: applicationData } = await supabase2
              .from("join_applications")
              .select("*")
              .eq("email", currentUser.email)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            setApplication(applicationData);
          } catch (error) {
            console.error("Error fetching application:", error);
          } finally {
            setAppLoading(false);
          }
        } else {
          setApplication(null);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error.message);
      alert("Error signing out. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-purple-50">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
            <div
              className="absolute inset-0 m-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-600 border-t-transparent"
              style={{ animationDirection: "reverse" }}
            ></div>
          </div>
          <p className="text-xl font-medium text-gray-700">
            Loading your dashboard
          </p>
          <p className="mt-2 text-gray-500">Fetching data from databases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-purple-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h1 className="mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
                Client Dashboard
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg">
                  <FaDatabase className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Dual Database System
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2">
                  <FiUserCheck className="text-purple-700" />
                  <span className="text-sm font-medium text-purple-700">
                    {application ? "Application Loaded" : "No Application"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <div className="text-right">
                  <p className="font-medium text-gray-800">{user.email}</p>
                  <p className="text-sm text-gray-500">Logged in</p>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Database Connection Status */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-3">
                  <FiDatabase className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Authentication DB</h3>
                  <p className="text-sm text-gray-500">
                    User credentials & session
                  </p>
                </div>
              </div>
              <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-3">
                  <FaDatabase className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Applications DB</h3>
                  <p className="text-sm text-gray-500">
                    Client applications & data
                  </p>
                </div>
              </div>
              <div
                className={`h-3 w-3 animate-pulse rounded-full ${application ? "bg-green-500" : "bg-yellow-500"}`}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* User Profile Card - From Supabase (Auth DB) */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-2xl border border-white bg-white/80 shadow-2xl backdrop-blur-sm">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                  <FiUser className="text-xl" />
                  User Profile
                </h2>
                <p className="mt-2 text-blue-100">Authentication Database</p>
              </div>

              <div className="p-6">
                {user ? (
                  <div className="space-y-6">
                    <div className="rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">
                          Account Info
                        </h3>
                        <div className="rounded-full bg-white p-2 shadow">
                          <FiUserCheck className="text-blue-600" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="mt-1 font-medium break-all text-gray-900">
                            {user.email}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">User ID</p>
                          <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 p-3">
                            <code className="font-mono text-sm text-gray-700">
                              {user.id.substring(0, 16)}...
                            </code>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(user.id)
                              }
                              className="rounded-lg bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
                            >
                              Copy
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Last Sign In</p>
                          <p className="mt-1 font-medium text-gray-900">
                            {user.last_sign_in_at
                              ? formatDate(user.last_sign_in_at)
                              : "Recently"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-inner">
                      <h3 className="mb-3 font-semibold text-gray-800">
                        Account Status
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email Confirmed</span>
                          <span
                            className={`font-medium ${user.email_confirmed_at ? "text-green-600" : "text-yellow-600"}`}
                          >
                            {user.email_confirmed_at ? "✓ Yes" : "Pending"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Created</span>
                          <span className="font-medium text-gray-900">
                            {formatDate(user.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                      <FiUser className="text-2xl text-gray-400" />
                    </div>
                    <p className="text-gray-600">No user data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Application Details Card - From Supabase2 (Applications DB) */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-white bg-white/80 shadow-2xl backdrop-blur-sm">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                  <FiCheckCircle className="text-xl" />
                  Application Details
                </h2>
                <p className="mt-2 text-purple-100">Applications Database</p>
              </div>

              <div className="p-6">
                {appLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-6">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
                      <div
                        className="absolute inset-0 m-auto h-6 w-6 animate-spin rounded-full border-4 border-pink-600 border-t-transparent"
                        style={{ animationDirection: "reverse" }}
                      ></div>
                    </div>
                    <p className="text-lg font-medium text-gray-700">
                      Fetching application data
                    </p>
                    <p className="mt-2 text-gray-500">
                      Querying applications database...
                    </p>
                  </div>
                ) : application ? (
                  <div className="space-y-6">
                    {/* Personal Information Row */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-xl bg-gradient-to-br from-blue-50 to-white p-5 shadow-lg">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="rounded-lg bg-blue-100 p-3">
                            <FiUser className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">
                              Full Name
                            </h3>
                            <p className="mt-1 text-2xl font-black text-gray-900">
                              {application.fullname || "Not Provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl bg-gradient-to-br from-pink-50 to-white p-5 shadow-lg">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="rounded-lg bg-pink-100 p-3">
                            {getGenderIcon(application.gender).icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">Gender</h3>
                            <div className="mt-2 inline-flex items-center gap-2">
                              <span
                                className={`rounded-full px-4 py-2 text-sm font-bold ${getGenderIcon(application.gender).textColor} ${getGenderIcon(application.gender).color}`}
                              >
                                {application.gender || "Not Specified"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information Row */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white p-5 shadow-lg">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="rounded-lg bg-emerald-100 p-3">
                            <FiMail className="text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">
                              Contact Email
                            </h3>
                            <p className="mt-1 font-medium break-all text-gray-900">
                              {application.email || user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white p-5 shadow-lg">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="rounded-lg bg-amber-100 p-3">
                            <FiPhone className="text-amber-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">
                              Phone Number
                            </h3>
                            <p className="mt-1 text-xl font-black text-gray-900">
                              {formatPhoneNumber(application.phone)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white p-6 shadow-lg">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-100 p-3">
                          <FiHome className="text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">
                            Address Information
                          </h3>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-gray-500">
                            Street Address
                          </p>
                          <p className="mt-1 font-medium text-gray-900">
                            {application.address || "Not Provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Zip Code</p>
                          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                            <FiHash className="text-gray-500" />
                            <span className="font-bold text-gray-800">
                              {application.zip_code || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Application Status Row */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-5 shadow-lg">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="rounded-lg bg-purple-100 p-3">
                            <FaUserTie className="text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">
                              Applied Role
                            </h3>
                            <div className="mt-2">
                              <span className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2 text-sm font-bold text-white">
                                {application.role || "Not Specified"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl bg-gradient-to-br from-rose-50 to-white p-5 shadow-lg">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="rounded-lg bg-rose-100 p-3">
                            <FiCalendar className="text-rose-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">
                              Application Date
                            </h3>
                            <p className="mt-1 text-2xl font-black text-gray-900">
                              {formatDate(application.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100">
                      <FiCheckCircle className="text-4xl text-purple-400" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-800">
                      No Application Found
                    </h3>
                    <p className="mx-auto max-w-md text-gray-600">
                      No application record found in the applications database
                      for your email address.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                      <button className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white shadow-lg hover:shadow-xl">
                        Apply Now
                      </button>
                      <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow hover:bg-gray-50">
                        Contact Support
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 rounded-2xl bg-white/50 p-6 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <p className="font-medium text-gray-800">
                SpiffyFox Client Portal
              </p>
              <p className="text-sm text-gray-500">
                Dual database architecture • Secure & Scalable
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Auth Database</p>
                <p className="font-medium text-gray-800">Connected</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Apps Database</p>
                <p className="font-medium text-gray-800">
                  {application ? "Connected" : "No Data"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;
