
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Login.css";

type AuthMode = "signin" | "signup";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isSignUp = mode === "signup";

  // Switch between Sign In and Sign Up
  function switchMode() {
    setMode(isSignUp ? "signin" : "signup");
    setPassword("");
    setError("");
    setMessage("");
    setShowPassword(false);
  }

  // Email/password sign in and sign up
  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Your password must have at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              emailRedirectTo:
                `${window.location.origin}/login`,
            },
          });

        if (signUpError) {
          throw signUpError;
        }

        if (data.session) {
          navigate("/", { replace: true });
        } else {
          setMessage(
            "Check your email for a confirmation link. " +
            "Once confirmed, return here to sign in."
          );
          setPassword("");
        }
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (signInError) {
          throw signInError;
        }

        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Google Sign-In through Supabase OAuth
  async function handleGoogleSignIn() {
    setError("");
    setMessage("");
    setGoogleLoading(true);

    try {
      const { error: googleError } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
          },
        });

      if (googleError) {
        throw googleError;
      }

      // Browser redirects to Google automatically
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to Google."
      );

      setGoogleLoading(false);
    }
  }

  // Request a password reset email
  async function handlePasswordReset() {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError(
        "Enter your email address first, then click Forgot password."
      );
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo:
              `${window.location.origin}/reset-password`,
          }
        );

      if (resetError) {
        throw resetError;
      }

      setMessage(
        "If an account exists for this email, " +
        "you'll receive password reset instructions."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send password reset email."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-container">

        {/* LEFT SIDE: LYFE CHECK BRANDING */}
        <section className="login-branding">

          {/* Corrected logo path */}
          <img
            src="/images/lyfe-check-logo.png"
            alt="LYFE CHECK"
            className="login-logo"
          />

          <div className="login-tagline">
            <span className="tagline-dot" />
            YOUR DAY, IN FOCUS
          </div>

          <h1>
            Make space for what
            <br />
            matters <span>most.</span>
          </h1>

          <p className="login-description">
            Bring your plans, habits, moods, and reflections
            together in one calm place built to help you
            move through each day with intention.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <span className="feature-number">01</span>
              <strong>Plan</strong>
              <p>your time</p>
            </div>

            <div className="login-feature">
              <span className="feature-number">02</span>
              <strong>Check in</strong>
              <p>with yourself</p>
            </div>

            <div className="login-feature">
              <span className="feature-number">03</span>
              <strong>Reflect</strong>
              <p>on progress</p>
            </div>

          </div>
        </section>

        {/* RIGHT SIDE: AUTHENTICATION CARD */}
        <section className="login-card">

          <div className="login-security-icon">
            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <p className="login-eyebrow">
            WELCOME TO LYFECHECK
          </p>

          <h2>
            {isSignUp
              ? "Create your space"
              : "Sign in to your space"}
          </h2>

          <p className="login-card-description">
            {isSignUp
              ? "Start tracking your routines, reflections, and daily progress."
              : "Keep your routines, reflections, and daily progress together."}
          </p>

          {/* Error messages */}
          {error && (
            <div
              className="auth-alert auth-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Success messages */}
          {message && (
            <div
              className="auth-alert auth-success"
              role="status"
            >
              {message}
            </div>
          )}

          {/* Email authentication form */}
          <form
            className="login-form"
            onSubmit={handleEmailAuth}
          >

            <label htmlFor="login-email">
              Email address
            </label>

            <div className="login-input-wrapper">
              <span
                className="input-icon"
                aria-hidden="true"
              >
                ✉
              </span>

              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            <div className="password-label-row">
              <label htmlFor="login-password">
                Password
              </label>

              <span>6+ characters</span>
            </div>

            <div className="login-input-wrapper">

              <span
                className="input-icon"
                aria-hidden="true"
              >
                ♙
              </span>

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete={
                  isSignUp
                    ? "new-password"
                    : "current-password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                minLength={6}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

            {!isSignUp && (
              <button
                type="button"
                className="forgot-password"
                onClick={handlePasswordReset}
                disabled={loading || googleLoading}
              >
                Forgot password?
              </button>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading || googleLoading}
            >
              {loading
                ? "Please wait..."
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
            </button>

          </form>

          {/* Divider */}
          <div className="login-divider">
            <span>OR CONTINUE WITH</span>
          </div>

          {/* Google authentication */}
          <button
            type="button"
            className="google-login"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.8 7.18l7.73 6C44.38 38.03 46.98 31.89 46.98 24.55Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>

            {googleLoading
              ? "Connecting to Google..."
              : "Continue with Google"}
          </button>

          {/* Sign in / Sign up switch */}
          <div className="login-switch">

            {isSignUp
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              onClick={switchMode}
              disabled={loading || googleLoading}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>

          </div>

          {/* Security notice */}
          <div className="login-info">
            <span aria-hidden="true">ⓘ</span>

            <p>
              Your account is secured through Supabase
              Authentication. Your personal information
              is protected by account-based access controls.
            </p>
          </div>

          <p className="login-footer">
            A personal space to plan, check in, and reflect.
          </p>

        </section>
      </div>
    </main>
  );
}

export default Login;
