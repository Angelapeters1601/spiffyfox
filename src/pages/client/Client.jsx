import { useEffect, useState } from "react";
import { signOut } from "../../services/auth";
import { supabase } from "../../services/supabaseClient";

const Client = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    // Check current user on mount
    const getUserAndProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        // Fetch profile from profiles table if user exists
        if (user) {
          setProfileLoading(true);
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error && error.code !== "PGRST116") {
            // PGRST116 = no rows returned
            console.error("Error fetching profile:", error);
          } else {
            setProfile(profileData);
          }
          setProfileLoading(false);
        }
      } catch (error) {
        console.error("Error in getUserAndProfile:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserAndProfile();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        // Fetch profile when auth state changes
        if (currentUser) {
          setProfileLoading(true);
          try {
            const { data: profileData, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", currentUser.id)
              .single();

            if (error && error.code !== "PGRST116") {
              console.error("Error fetching profile:", error);
            } else {
              setProfile(profileData);
            }
          } catch (error) {
            console.error("Error fetching profile on auth change:", error);
          }
          setProfileLoading(false);
        } else {
          setProfile(null); // Clear profile when user signs out
        }

        setLoading(false);
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-xl text-gray-600">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="text-center">
        <h1 className="mb-6 text-7xl font-black text-gray-900 md:text-9xl">
          CLIENT
        </h1>
        <p className="mb-4 text-3xl font-bold text-purple-600 md:text-5xl">
          Welcome to SpiffyFox
        </p>

        {user && (
          <div className="mb-4">
            <p className="mb-2 text-xl text-gray-700 md:text-2xl">
              👋 Hello, {user.email || profile?.email || "User"}!
            </p>

            {profileLoading ? (
              <p className="text-sm text-gray-500">
                Loading profile details...
              </p>
            ) : (
              profile && (
                <div className="rounded-lg bg-white/50 p-4 backdrop-blur-sm">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    Profile Information
                  </h3>
                  <div className="space-y-2 text-left">
                    <div>
                      <span className="font-medium text-gray-700">
                        Client ID:
                      </span>
                      <span className="ml-2 font-mono text-gray-900">
                        {profile.id}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="ml-2 text-gray-900">
                        {profile.email || user.email}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Role:</span>
                      <span className="ml-2 text-gray-900">
                        {profile.role || "client"}
                      </span>
                    </div>
                    {profile.created_at && (
                      <div>
                        <span className="font-medium text-gray-700">
                          Member Since:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <p className="mb-8 text-xl text-gray-600 md:text-2xl">
          Client Dashboard - Coming Soon
        </p>

        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white/50 p-6 backdrop-blur-sm">
          <div className="mb-4">
            {user ? (
              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  You're signed in! Full dashboard with username will be
                  implemented here.
                </p>
                <button
                  onClick={handleSignOut}
                  className="rounded-lg bg-red-500 px-6 py-3 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-red-600 hover:shadow-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  You're not signed in. Please sign in to access the dashboard.
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-purple-700 hover:shadow-lg"
                >
                  Go to Sign In
                </button>
              </div>
            )}
          </div>

          {/* Simplified user info display */}
          {user && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Auth Email:</span> {user.email}
              </p>
              {profile && (
                <p className="mt-1 text-sm text-gray-500">
                  <span className="font-medium">Profile Email:</span>{" "}
                  {profile.email || "Not set"}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Client;
