import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { getUserRole } from "../services/userRole";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        // Not logged in
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const role = await getUserRole(session.user.id);

        if (allowedRoles.includes(role)) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        console.error("Error fetching role:", err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [allowedRoles]);

  if (loading) return <p>Loading...</p>;

  if (!authorized) return <Navigate to="/unauthorized" replace />;

  return children;
}
