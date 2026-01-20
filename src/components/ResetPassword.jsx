import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { FiLock, FiCheckCircle } from "react-icons/fi";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="8"
                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="8"
                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
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
