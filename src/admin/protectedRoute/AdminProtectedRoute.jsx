import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate, Outlet } from "react-router-dom";
import LoadingFallback from "../../ui/LoadingFallback";

export default function AdminProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkAuthAndRole = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          if (mounted) {
            setIsAuthorized(false);
            setLoading(false);
            navigate("/admin"); // Redirect to login page at /admin
          }
          return;
        }

        // Check if user has admin role in profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError || !profile || profile.role !== "admin") {
          console.log("User not authorized as admin");
          if (mounted) {
            setIsAuthorized(false);
            setLoading(false);
            navigate("/unauthorized");
          }
          return;
        }

        // User is authenticated AND authorized as admin
        if (mounted) {
          setIsAuthorized(true);
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          setIsAuthorized(false);
          setLoading(false);
          navigate("/unauthorized");
        }
      }
    };

    checkAuthAndRole();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        if (mounted) {
          setIsAuthorized(false);
          navigate("/admin"); // Redirect to login page at /admin
        }
      } else if (event === "SIGNED_IN") {
        // Re-check authorization when user signs in
        if (mounted) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (profile && profile.role === "admin") {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            navigate("/unauthorized");
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return <LoadingFallback />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <Outlet />;
}
