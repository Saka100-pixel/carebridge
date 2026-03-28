import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

const SERIF = "'Cormorant Garamond', serif";
const BODY = "'Raleway', sans-serif";
const UI = "'DM Sans', sans-serif";

type Role = "patient" | "professional";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleRoleSelect(r: Role) {
    setRole(r);
    setStep(2);
  }

  function handleChange(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!role) {
      setError("Please select a role.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        role,
      });
      if (role === "professional") {
        setLocation("/dashboard/professional");
      } else {
        setLocation("/dashboard/patient");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
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
    <div
      style={{
        minHeight: "100vh",
        background: "var(--cb-cream)",
        color: "var(--cb-ink)",
        fontFamily: BODY,
      }}
    >
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
        <a href="/" style={{ textDecoration: "none" }}>
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
          href="/login"
          style={{
            color: "var(--cb-ink-light)",
            fontSize: 13,
            fontFamily: UI,
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}
        >
          Already have an account?{" "}
          <span
            style={{
              color: "var(--cb-sage)",
              fontWeight: 600,
              borderBottom: "1px solid var(--cb-sage)",
              paddingBottom: 1,
            }}
          >
            Sign in
          </span>
        </a>
      </nav>

      {/* Main content */}
      <div
        style={{
          paddingTop: 64,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 24px 64px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", maxWidth: 640 }}>
          {/* Progress indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
              marginBottom: 48,
            }}
          >
            {/* Step 1 */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: step >= 1 ? "var(--cb-sage)" : "var(--cb-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: step >= 1 ? "#fff" : "var(--cb-ink-light)",
                  fontFamily: UI,
                  transition: "background 0.3s",
                  flexShrink: 0,
                }}
              >
                {step > 1 ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  "1"
                )}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: step === 1 ? 600 : 400,
                  color: step === 1 ? "var(--cb-ink)" : "var(--cb-ink-light)",
                  fontFamily: UI,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Choose role
              </span>
            </div>

            {/* Connector */}
            <div
              style={{
                width: 48,
                height: 1,
                background:
                  step > 1 ? "var(--cb-sage)" : "var(--cb-border-strong)",
                margin: "0 12px",
                transition: "background 0.3s",
                flexShrink: 0,
              }}
            />

            {/* Step 2 */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: step >= 2 ? "var(--cb-sage)" : "var(--cb-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: step >= 2 ? "#fff" : "var(--cb-ink-light)",
                  fontFamily: UI,
                  transition: "background 0.3s",
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: step === 2 ? 600 : 400,
                  color: step === 2 ? "var(--cb-ink)" : "var(--cb-ink-light)",
                  fontFamily: UI,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Account details
              </span>
            </div>
          </div>

          {/* Step 1: Role selection */}
          {step === 1 && (
            <div>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 40,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 1,
                      background: "var(--cb-sage)",
                    }}
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
                    Create account
                  </span>
                  <div
                    style={{
                      width: 24,
                      height: 1,
                      background: "var(--cb-sage)",
                    }}
                  />
                </div>
                <h1
                  style={{
                    fontFamily: SERIF,
                    fontSize: 42,
                    fontWeight: 300,
                    color: "var(--cb-ink)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.01em",
                    marginBottom: 12,
                  }}
                >
                  How will you use Care
                  <span style={{ color: "var(--cb-sage)" }}>Bridge</span>?
                </h1>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--cb-ink-light)",
                    fontFamily: BODY,
                    lineHeight: 1.7,
                  }}
                >
                  Choose the option that best describes you to get started.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
                className="cb-role-grid"
              >
                {/* Patient card */}
                <button
                  onClick={() => handleRoleSelect("patient")}
                  style={{
                    background: "var(--cb-warm-white)",
                    border: "1px solid var(--cb-border-strong)",
                    borderRadius: 4,
                    padding: "36px 28px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--cb-sage)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 24px rgba(61,107,79,0.1)";
                    e.currentTarget.style.background = "var(--cb-sage-light)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--cb-border-strong)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "var(--cb-warm-white)";
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "var(--cb-sage-light)",
                      border: "1px solid var(--cb-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                        stroke="var(--cb-sage)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="9"
                        cy="7"
                        r="4"
                        stroke="var(--cb-sage)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M23 21v-2a4 4 0 0 0-3-3.87"
                        stroke="var(--cb-sage)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 3.13a4 4 0 0 1 0 7.75"
                        stroke="var(--cb-sage)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <h3
                    style={{
                      fontFamily: SERIF,
                      fontSize: 22,
                      fontWeight: 400,
                      color: "var(--cb-ink)",
                      marginBottom: 10,
                      lineHeight: 1.2,
                    }}
                  >
                    I need care for my family
                  </h3>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: "var(--cb-ink-light)",
                      fontFamily: BODY,
                      lineHeight: 1.75,
                      marginBottom: 20,
                    }}
                  >
                    Find and book verified nurses, physiotherapists, and caregivers
                    for a loved one at home in Lusaka.
                  </p>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--cb-sage)",
                      fontFamily: UI,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    Register as a family
                    <span style={{ fontSize: 14 }}>&#8594;</span>
                  </div>
                </button>

                {/* Professional card */}
                <button
                  onClick={() => handleRoleSelect("professional")}
                  style={{
                    background: "var(--cb-warm-white)",
                    border: "1px solid var(--cb-border-strong)",
                    borderRadius: 4,
                    padding: "36px 28px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--cb-sage)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 24px rgba(61,107,79,0.1)";
                    e.currentTarget.style.background = "var(--cb-sage-light)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--cb-border-strong)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "var(--cb-warm-white)";
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "var(--cb-sage-light)",
                      border: "1px solid var(--cb-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 12h-4l-3 9L9 3l-3 9H2"
                        stroke="var(--cb-sage)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <h3
                    style={{
                      fontFamily: SERIF,
                      fontSize: 22,
                      fontWeight: 400,
                      color: "var(--cb-ink)",
                      marginBottom: 10,
                      lineHeight: 1.2,
                    }}
                  >
                    I am a healthcare professional
                  </h3>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: "var(--cb-ink-light)",
                      fontFamily: BODY,
                      lineHeight: 1.75,
                      marginBottom: 20,
                    }}
                  >
                    List your verified credentials, set your availability, and
                    connect with Lusaka families who need your expertise.
                  </p>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--cb-sage)",
                      fontFamily: UI,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    Register as a professional
                    <span style={{ fontSize: 14 }}>&#8594;</span>
                  </div>
                </button>
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginTop: 32,
                  fontSize: 13.5,
                  color: "var(--cb-ink-light)",
                  fontFamily: BODY,
                }}
              >
                Already have an account?{" "}
                <a
                  href="/login"
                  style={{
                    color: "var(--cb-sage)",
                    textDecoration: "none",
                    fontWeight: 600,
                    borderBottom: "1px solid var(--cb-sage)",
                    paddingBottom: 1,
                  }}
                >
                  Sign in
                </a>
              </div>
            </div>
          )}

          {/* Step 2: Account details */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 40 }}>
                <button
                  onClick={() => {
                    setStep(1);
                    setError(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--cb-ink-light)",
                    fontFamily: UI,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: 0,
                    marginBottom: 32,
                  }}
                >
                  <span>&#8592;</span> Back
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 1,
                      background: "var(--cb-sage)",
                    }}
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
                    {role === "professional" ? "Professional account" : "Family account"}
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
                  Account details.
                </h1>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--cb-ink-light)",
                    fontFamily: BODY,
                    lineHeight: 1.7,
                  }}
                >
                  Fill in your information to create your CareBridge account.
                </p>
              </div>

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
                {/* Name row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 20,
                  }}
                  className="cb-name-grid"
                >
                  <div>
                    <label htmlFor="firstName" style={labelStyle}>
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={handleChange("firstName")}
                      required
                      placeholder="Chanda"
                      style={inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--cb-sage)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--cb-border-strong)";
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" style={labelStyle}>
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={handleChange("lastName")}
                      required
                      placeholder="Mwale"
                      style={inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--cb-sage)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--cb-border-strong)";
                      }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="email" style={labelStyle}>
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                    placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--cb-sage)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--cb-border-strong)";
                    }}
                  />
                </div>

                {/* Phone */}
                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="phone" style={labelStyle}>
                    Phone number{" "}
                    <span
                      style={{
                        fontWeight: 400,
                        opacity: 0.6,
                        textTransform: "none",
                        letterSpacing: 0,
                      }}
                    >
                      (optional)
                    </span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="+260 9X XXX XXXX"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--cb-sage)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--cb-border-strong)";
                    }}
                  />
                </div>

                {/* Password */}
                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="password" style={labelStyle}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={handleChange("password")}
                      required
                      placeholder="Minimum 8 characters"
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

                {/* Confirm password */}
                <div style={{ marginBottom: 32 }}>
                  <label htmlFor="confirmPassword" style={labelStyle}>
                    Confirm password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={handleChange("confirmPassword")}
                      required
                      placeholder="Repeat your password"
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
                      onClick={() => setShowConfirm(!showConfirm)}
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
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? "Hide" : "Show"}
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
                    background: loading
                      ? "rgba(61,107,79,0.5)"
                      : "var(--cb-sage)",
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
                  {loading ? "Creating account..." : "Create account"}
                </button>

                <div
                  style={{
                    textAlign: "center",
                    fontSize: 13.5,
                    color: "var(--cb-ink-light)",
                    fontFamily: BODY,
                  }}
                >
                  Already have an account?{" "}
                  <a
                    href="/login"
                    style={{
                      color: "var(--cb-sage)",
                      textDecoration: "none",
                      fontWeight: 600,
                      borderBottom: "1px solid var(--cb-sage)",
                      paddingBottom: 1,
                    }}
                  >
                    Sign in
                  </a>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 600px) {
          .cb-role-grid {
            grid-template-columns: 1fr !important;
          }
          .cb-name-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
