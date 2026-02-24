import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmail, signUpContractor } from "../../services/auth";
import { supabase } from "../../services/supabaseClient";
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiUserPlus,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
} from "react-icons/fi";

export default function ContractorLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // CHECK IF USER IS ALREADY LOGGED IN AS CONTRACTOR
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // Check if user is a contractor
          const userRole = await getUserRole(session.user.id);
          if (userRole === "contractor") {
            // Check if profile is complete
            const isComplete = await checkProfileComplete(session.user.id);
            if (isComplete) {
              navigate("/contractor");
            } else {
              navigate("/contractor");
            }
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && event === "SIGNED_IN") {
        // Check role after sign in
        try {
          const userRole = await getUserRole(session.user.id);
          if (userRole === "contractor") {
            // Check if profile is complete
            const isComplete = await checkProfileComplete(session.user.id);
            if (isComplete) {
              navigate("/contractor");
            } else {
              navigate("/contractor");
            }
          }
        } catch (error) {
          console.error("Error checking role:", error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Helper function to get user role from profiles table
  async function getUserRole(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error getting user role from profiles:", error);
        return null;
      }

      return data?.role || null;
    } catch (error) {
      console.error("Error in getUserRole:", error);
      return null;
    }
  }

  // Check if contractor profile is complete (has first_name)
  async function checkProfileComplete(userId) {
    try {
      const { data, error } = await supabase
        .from("contractors")
        .select("first_name")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error checking profile:", error);
        return false;
      }

      // Profile is complete if first_name is not null/empty
      return data?.first_name && data.first_name.trim() !== "";
    } catch (error) {
      console.error("Error in checkProfileComplete:", error);
      return false;
    }
  }

  // Password validation regex and rules
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const allowedCharactersRegex = /^[A-Za-z\d@$!%*?&]*$/;

  // Password requirement checks
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
    noSpaces: !/\s/.test(password),
    validCharacters: allowedCharactersRegex.test(password),
  };

  // Check if all requirements are met
  const isPasswordValid = passwordRegex.test(password);

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  // Handle email login/signup
  async function handleEmailAuth(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowConfirmationMessage(false);

    try {
      if (isLogin) {
        // SIGN IN
        await signInWithEmail(email, password);
        // Navigation will be handled by the auth state change listener
      } else {
        // SIGN UP - For contractors
        const result = await signUpContractor(email, password);
        console.log("Contractor sign-up result:", result);

        if (result?.user) {
          // Create contractor record in contractors table
          await createContractorRecord(result.user.id, email);

          // Auto-confirm email for testing (remove in production)
          // For testing, we'll just redirect to profile setup
          navigate("/contractor");
        } else {
          throw new Error("Sign-up failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Contractor auth error:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Function to create/update contractor record with all fields
  async function createContractorRecord(userId, email) {
    try {
      // First, check if a contractor with this email already exists
      const { data: existingContractor, error: checkError } = await supabase
        .from("contractors")
        .select("id, user_id, email, first_name")
        .eq("email", email)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing contractor:", checkError);
      }

      if (existingContractor) {
        // Contractor exists - update with user_id
        if (!existingContractor.user_id) {
          // Update existing record with user_id
          const { error: updateError } = await supabase
            .from("contractors")
            .update({
              user_id: userId,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingContractor.id);

          if (updateError) throw updateError;
          console.log("Updated existing contractor with user_id");
<<<<<<< Updated upstream

          // Check if profile is complete
          if (
            !existingContractor.first_name ||
            existingContractor.first_name.trim() === ""
          ) {
            return "incomplete";
          }

          return "complete";
        } else {
          // user_id already exists
          if (existingContractor.user_id !== userId) {
            console.warn("Email already linked to different user_id");
          }

          // Check if profile is complete
          if (
            !existingContractor.first_name ||
            existingContractor.first_name.trim() === ""
          ) {
            return "incomplete";
          }

          return "exists";
        }
      } else {
        // Create new contractor record
=======
        }
      } else {
        // Create new contractor record with basic fields
        const newContractor = {
          user_id: userId,
          email: email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          application_status: "pending",
          application_date: new Date().toISOString(),
          first_name: null,
          last_name: null,
          phone: null,
          address: null,
          city: null,
          state: null,
          zip_code: null,
          country: null,
          job_applied: null,
          experience_years: null,
          expected_salary: null,
          interview_date: null,
          interview_time: null,
          interview_type: null,
          interview_status: null,
          interview_notes: null,
          interview_scheduled_by: null,
          interview_location: null,
          services_offered: null,
          service_areas: null,
          availability: null,
          has_vehicle: null,
          vehicle_type: null,
          has_equipment: null,
          insurance_coverage: null,
          insurance_url: null,
          background_check_status: null,
          resume_url: null,
          profile_image_url: null,
          admin_notes: null,
          rating: null,
        };

>>>>>>> Stashed changes
        const { error: insertError } = await supabase
          .from("contractors")
          .insert([
            {
              user_id: userId,
              email: email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              application_status: "pending",
              // Required fields (set to null/empty)
              first_name: null,
              last_name: null,
              phone: null,
              address: null,
              city: null,
              state: null,
              zip_code: null,
              country: null,
              job_applied: null,
              application_date: new Date().toISOString(),
              experience_years: null,
              expected_salary: null,
              interview_date: null,
              interview_time: null,
              interview_type: null,
              interview_status: null,
              services_offered: null,
              service_areas: null,
              availability: null,
              has_vehicle: null,
              vehicle_type: null,
              has_equipment: null,
              insurance_coverage: null,
              background_check_status: null,
              resume_url: null,
              profile_image_url: null,
              admin_notes: null,
              rating: null,
            },
          ]);

<<<<<<< Updated upstream
        if (insertError) throw insertError;
        console.log("New contractor record created (incomplete)");
        return "incomplete";
=======
        if (insertError) {
          console.error("Error creating contractor record:", insertError);
          throw insertError;
        }

        console.log("New contractor record created");
>>>>>>> Stashed changes
      }
    } catch (error) {
      console.error("Error in createContractorRecord:", error);
    }
  }

  // Handle password input with validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (/\s/.test(value)) return;
    if (allowedCharactersRegex.test(value) || value === "") {
      setPassword(value);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setResetSent(true);
      setResetEmail("");
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // SHOW LOADING WHILE CHECKING AUTH
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="font-mono text-xl text-gray-600">loading ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-6 shadow-lg md:p-8">
          {/* Email Confirmation Success Message - HIDDEN FOR TESTING */}
          {showConfirmationMessage && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-start">
                <FiCheckCircle className="mt-0.5 mr-3 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">
                    Check Your Email!
                  </h3>
                  <p className="mt-1 text-sm text-green-700">
                    We've sent a confirmation email to{" "}
                    <span className="font-medium">{confirmationEmail}</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          {!isForgotPassword && (
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Contractor Portal
              </h1>
              <p className="text-gray-600">
                {isLogin
                  ? "Sign in to your contractor account"
                  : "Register as a contractor"}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && !showConfirmationMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-center text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Email Form */}
          {!isForgotPassword && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="email"
                    placeholder="contractor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full rounded-lg border py-3 pr-4 pl-10 transition outline-none focus:ring-2 focus:ring-blue-500 ${
                      email && !isEmailValid
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                </div>
                {email && !isEmailValid && (
                  <p className="text-xs text-red-500">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"
                  >
                    {showPassword ? (
                      <>
                        <FiEyeOff className="text-sm" />
                        Hide
                      </>
                    ) : (
                      <>
                        <FiEye className="text-sm" />
                        Show
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className={`w-full rounded-lg border py-3 pr-10 pl-10 transition outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isLogin && password && !isPasswordValid
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {/* Password Requirements (only show during signup) */}
                {!isLogin && (
                  <div className="space-y-1 pt-2">
                    <p className="text-xs font-medium text-gray-600">
                      Password must contain:
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            passwordRequirements.minLength
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            passwordRequirements.minLength
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            passwordRequirements.hasLowerCase
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            passwordRequirements.hasLowerCase
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          1 lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            passwordRequirements.hasUpperCase
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            passwordRequirements.hasUpperCase
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          1 uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            passwordRequirements.hasNumber
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            passwordRequirements.hasNumber
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          1 number (0-9)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            passwordRequirements.hasSpecialChar
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            passwordRequirements.hasSpecialChar
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          1 special character (@$!%*?&)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            passwordRequirements.noSpaces
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            passwordRequirements.noSpaces
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          No spaces
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            passwordRequirements.validCharacters
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            passwordRequirements.validCharacters
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          Only letters, numbers, and @$!%*?&
                        </span>
                      </div>
                    </div>

                    {password && (
                      <p
                        className={`pt-1 text-xs font-medium ${
                          isPasswordValid ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {isPasswordValid
                          ? "✓ Password meets all requirements"
                          : "✗ Please fix the requirements above"}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || (!isLogin && !isPasswordValid)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    {isLogin ? <FiLogIn /> : <FiUserPlus />}
                    {isLogin ? "Sign In" : "Register as Contractor"}
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle Login/Sign Up & Forgot Password */}
          <div className="mt-6 space-y-3 text-center text-sm text-gray-600">
            {isLogin && !isForgotPassword && (
              <button
                onClick={() => setIsForgotPassword(true)}
                className="block font-semibold text-blue-600 hover:underline"
              >
                Forgot your password?
              </button>
            )}

            {isForgotPassword ? (
              <button
                onClick={() => {
                  setIsForgotPassword(false);
                  setIsLogin(true);
                }}
                className="font-semibold text-blue-600 hover:underline"
              >
                Back to Sign In
              </button>
            ) : (
              <>
                {isLogin ? (
                  <>
                    New contractor?{" "}
                    <button
                      onClick={() => {
                        setIsLogin(false);
                        setShowConfirmationMessage(false);
                      }}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Register Here
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setIsLogin(true);
                        setShowConfirmationMessage(false);
                      }}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Forgot Password Form */}
          {isForgotPassword && (
            <div className="space-y-4">
              {resetSent ? (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start">
                    <FiCheckCircle className="mt-0.5 mr-3 flex-shrink-0 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800">
                        Check Your Email!
                      </h3>
                      <p className="mt-1 text-sm text-green-700">
                        We've sent a password reset link to your email.
                      </p>
                      <button
                        onClick={() => {
                          setIsForgotPassword(false);
                          setResetSent(false);
                        }}
                        className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-center">
                    <h2 className="text-xl font-bold text-gray-900">
                      Reset Password
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Enter your email to reset your contractor password.
                    </p>
                  </div>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="relative">
                        <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                        <input
                          type="email"
                          placeholder="contractor@example.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                          className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      ) : (
                        <>
                          <FiMail />
                          Send Reset Link
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
