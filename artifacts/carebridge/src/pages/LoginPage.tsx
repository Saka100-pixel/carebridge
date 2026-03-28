import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

const SERIF = "'Cormorant Garamond', serif";
const BODY = "'Raleway', sans-serif";
const UI = "'DM Sans', sans-serif";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      // useAuth sets the user; read role from context after login resolves
      // We inspect auth state via a temporary approach: the login function
      // resolves after setting user, but we need role. Re-read from localStorage
      // is not reliable; instead re-use the pattern of fetching /api/auth/me
      // is already done inside AuthProvider. We rely on the redirect here by
      // reading the token and re-fetching the user role.
      const token = localStorage.getItem("cb_token");
      if (!token) {
        setError("Login failed. Please try again.");
        return;
      }
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError("Login failed. Please try again.");
        return;
      }
      const user = await res.json();
      if (user.role === "admin") {
        setLocation("/admin");
      } else if (user.role === "professional") {
        setLocation("/dashboard/professional");
      } else {
        setLocation("/dashboard/patient");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    fontSize: 14,
    fontFamily: BODY,
    color: "var(--cb-ink)",
    background: "var(--cb-cream)",
    border: "1px solid var(--cb-border-strong)",
    borderRadius: 2,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--cb-ink-light)",
    marginBottom: 6,
    fontFamily: UI,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cb-cream)", color: "var(--cb-ink)", fontFamily: BODY }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Raleway:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          height: 64,
          background: "var(--cb-nav-bg)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--cb-border)",
          fontFamily: UI,
        }}
      >
        <a
          href="/"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "var(--cb-ink)",
            }}
          >
            Care<span style={{ color: "var(--cb-sage)" }}>Bridge</span>
          </div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--cb-ink-light)",
              opacity: 0.6,
              marginTop: -2,
            }}
          >
            Zambia · Verified Home Healthcare
          </div>
        </a>

        <a
          href="/register"
          style={{
            background: "var(--cb-sage)",
            color: "#fff",
            padding: "10px 22px",
            borderRadius: 2,
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontFamily: UI,
            fontWeight: 500,
          }}
        >
          Register
        </a>
      </nav>

      {/* Two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "100vh",
          paddingTop: 64,
        }}
        className="cb-login-grid"
      >
        {/* Left: Branding panel */}
        <div
          style={{
            background: "var(--cb-sage)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 64px",
            position: "relative",
            overflow: "hidden",
          }}
          className="cb-login-panel"
        >
          {/* Background texture overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.12,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(160deg, rgba(61,107,79,0.95) 0%, rgba(38,78,54,0.98) 100%)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 48,
              }}
            >
              <div
                style={{ width: 24, height: 1, background: "rgba(255,255,255,0.4)" }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: UI,
                }}
              >
                Verified Home Healthcare
              </span>
            </div>

            <div
              style={{
                fontFamily: SERIF,
                fontSize: 36,
                fontWeight: 300,
                color: "#fff",
                lineHeight: 1.15,
                marginBottom: 32,
                letterSpacing: "-0.01em",
              }}
            >
              "Care that comes to you — verified, trusted, and licensed."
            </div>

            <p
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.8,
                fontFamily: BODY,
                marginBottom: 48,
                maxWidth: 360,
              }}
            >
              Connect with licensed nurses, physiotherapists, and caregivers in
              Lusaka. Every professional verified by NMCZ and HPCZ.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {[
                "100% license-verified professionals",
                "Pay per shift — no subscription",
                "Funds held until care is delivered",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 13.5,
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: BODY,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 1,
                        background: "#fff",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: -3,
                          width: 4,
                          height: 1,
                          background: "#fff",
                          transform: "rotate(45deg)",
                          transformOrigin: "right center",
                        }}
                      />
                    </div>
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 64,
                paddingTop: 32,
                borderTop: "1px solid rgba(255,255,255,0.15)",
                display: "flex",
                gap: 32,
              }}
            >
              {[
                ["100%", "License Verified"],
                ["5", "Care Disciplines"],
                ["K350+", "From per shift"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 28,
                      fontWeight: 600,
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.5)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginTop: 4,
                      fontFamily: UI,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Login form */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 64px",
            background: "var(--cb-warm-white)",
          }}
          className="cb-login-form-col"
        >
          <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 32,
              }}
            >
              <div
                style={{ width: 24, height: 1, background: "var(--cb-sage)" }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--cb-sage)",
                  fontFamily: UI,
                }}
              >
                Sign in
              </span>
            </div>

            <h1
              style={{
                fontFamily: SERIF,
                fontSize: 38,
                fontWeight: 300,
                color: "var(--cb-ink)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                marginBottom: 8,
              }}
            >
              Welcome back.
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "var(--cb-ink-light)",
                fontFamily: BODY,
                lineHeight: 1.7,
                marginBottom: 40,
              }}
            >
              Sign in to your CareBridge account to manage your care.
            </p>

            {error && (
              <div
                style={{
                  background: "rgba(180,40,40,0.07)",
                  border: "1px solid rgba(180,40,40,0.2)",
                  borderRadius: 2,
                  padding: "12px 16px",
                  marginBottom: 24,
                  fontSize: 13.5,
                  color: "#8b2020",
                  fontFamily: BODY,
                  lineHeight: 1.5,
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="email" style={labelStyle}>
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--cb-sage)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--cb-border-strong)";
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 32 }}>
                <label htmlFor="password" style={labelStyle}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Your password"
                    style={{ ...inputStyle, paddingRight: 48 }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--cb-sage)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--cb-border-strong)";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      color: "var(--cb-ink-light)",
                      fontFamily: UI,
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  background: loading ? "rgba(61,107,79,0.5)" : "var(--cb-sage)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 2,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: UI,
                  transition: "background 0.2s",
                  marginBottom: 24,
                }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div
              style={{
                textAlign: "center",
                fontSize: 13.5,
                color: "var(--cb-ink-light)",
                fontFamily: BODY,
              }}
            >
              Don't have an account?{" "}
              <a
                href="/register"
                style={{
                  color: "var(--cb-sage)",
                  textDecoration: "none",
                  fontWeight: 600,
                  borderBottom: "1px solid var(--cb-sage)",
                  paddingBottom: 1,
                }}
              >
                Register here
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive overrides via a style tag */}
      <style>{`
        @media (max-width: 768px) {
          .cb-login-grid {
            grid-template-columns: 1fr !important;
          }
          .cb-login-panel {
            display: none !important;
          }
          .cb-login-form-col {
            padding: 48px 24px !important;
            min-height: calc(100vh - 64px);
          }
        }
      `}</style>
    </div>
  );
}
