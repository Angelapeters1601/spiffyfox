import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { FiLock, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password validation regex and rules (same as clientLogin.jsx)
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

  // Handle password input with validation (same as clientLogin.jsx)
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

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Password validation checks
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isPasswordValid) {
      setError(
        "Password requirements not met. Please check the requirements below.",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Reset Password
            </h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          {success ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-start">
                <FiCheckCircle className="mt-0.5 mr-3 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">
                    Password Updated!
                  </h3>
                  <p className="mt-1 text-sm text-green-700">
                    Your password has been successfully reset. Redirecting to
                    login...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-center text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                      password && !isPasswordValid
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-purple-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600"
                    >
                      {showConfirmPassword ? (
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
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={`w-full rounded-lg border py-3 pr-10 pl-10 transition outline-none focus:ring-2 focus:ring-purple-500 ${
                        confirmPassword && password !== confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-purple-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500">
                      ✗ Passwords do not match
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
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
              </div>

              <button
                type="submit"
                disabled={
                  loading || !isPasswordValid || password !== confirmPassword
                }
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
