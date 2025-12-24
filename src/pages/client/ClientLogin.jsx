import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmail, signUpWithEmail } from "../../services/auth";
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiUserPlus,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Toggle login/signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    try {
      if (isLogin) {
        // SIGN IN
        await signInWithEmail(email, password);
        navigate("/client");
      } else {
        // SIGN UP
        await signUpWithEmail(email, password);
        // Auto-login after signup
        await new Promise((resolve) => setTimeout(resolve, 300));
        navigate("/client");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  // Handle password input with validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;

    // Prevent spaces
    if (/\s/.test(value)) {
      return;
    }

    // Only allow specific characters
    if (allowedCharactersRegex.test(value) || value === "") {
      setPassword(value);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-6 shadow-lg md:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-600">
              {isLogin ? "Sign in to your account" : "Sign up to get started"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-center text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full rounded-lg border py-3 pr-4 pl-10 transition outline-none focus:ring-2 focus:ring-purple-500 ${
                    email && !isEmailValid
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-purple-500"
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
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600"
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
                  className={`w-full rounded-lg border py-3 pr-10 pl-10 transition outline-none focus:ring-2 focus:ring-purple-500 ${
                    !isLogin && password && !isPasswordValid
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-purple-500"
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
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  {isLogin ? <FiLogIn /> : <FiUserPlus />}
                  {isLogin ? "Sign In" : "Sign Up"}
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Sign Up */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="font-semibold text-purple-600 hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="font-semibold text-purple-600 hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
