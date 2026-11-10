
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// Protect pages that require authentication.
function ProtectedRoute() {
  const location = useLocation();

  // Store the current Supabase session.
  const [session, setSession] = useState<Session | null>(null);

  // Wait until authentication has been checked.
  const [loading, setLoading] = useState(true);

  // Store authentication errors.
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    // Listen for sign in and sign out changes.
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, newSession) => {
        if (!active) return;

        setSession(newSession);
        setLoading(false);
        setError("");
      });

    // Check for an existing login session.
    async function checkSession() {
      try {
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (!active) return;

        if (sessionError) {
          throw sessionError;
        }

        setSession(data.session);
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to check your session."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    checkSession();

    // Stop listening when the component unmounts.
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Show a loading screen while checking authentication.
  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          color: "#d1c9d2",
          fontFamily: "Inter, Segoe UI, sans-serif",
        }}
        role="status"
      >
        Checking your LYFE CHECK session...
      </main>
    );
  }

  // Show an error instead of exposing protected pages.
  if (error) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "24px",
          color: "#d1c9d2",
          textAlign: "center",
        }}
        role="alert"
      >
        <h2>Unable to verify your session</h2>
        <p>{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "12px",
            background: "linear-gradient(105deg, #d52278, #8952f5)",
            color: "#ffffff",
          }}
        >
          Try again
        </button>
      </main>
    );
  }

  // Redirect visitors who are not signed in.
  if (!session) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Display the requested page for signed-in users.
  return <Outlet />;
}

export default ProtectedRoute;
