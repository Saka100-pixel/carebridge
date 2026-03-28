import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";

const SERIF = "'Cormorant Garamond', serif";
const BODY = "'Raleway', sans-serif";
const UI = "'DM Sans', sans-serif";

// ─── Mock Data ───────────────────────────────────────────────────────────────

interface Booking {
  id: number;
  professional: string;
  discipline: string;
  date: string;
  shiftType: string;
  amount: string;
  status: "confirmed" | "completed" | "cancelled" | "pending";
}

const MOCK_BOOKINGS: Booking[] = [
  { id: 1, professional: "Robert Ngoma", discipline: "Registered Nurse", date: "2026-04-05", shiftType: "8h", amount: "K540", status: "confirmed" },
  { id: 2, professional: "Mutinta Banda", discipline: "Midwife", date: "2026-03-28", shiftType: "12h", amount: "K684", status: "completed" },
  { id: 3, professional: "Chanda Mwale", discipline: "Physiotherapist", date: "2026-03-20", shiftType: "8h", amount: "K600", status: "completed" },
  { id: 4, professional: "Grace Musonda", discipline: "Registered Nurse", date: "2026-03-10", shiftType: "24h", amount: "K1032", status: "cancelled" },
  { id: 5, professional: "Alice Chirwa", discipline: "Certified Caregiver", date: "2026-02-28", shiftType: "8h", amount: "K312", status: "completed" },
  { id: 6, professional: "Namukolo Phiri", discipline: "Mental Health Counsellor", date: "2026-02-15", shiftType: "8h", amount: "K504", status: "completed" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusColor(status: Booking["status"]): { bg: string; text: string; border: string } {
  switch (status) {
    case "pending":    return { bg: "rgba(217,119,6,0.1)",   text: "#92400e", border: "rgba(217,119,6,0.3)" };
    case "confirmed":  return { bg: "rgba(37,99,235,0.08)",  text: "#1e3a8a", border: "rgba(37,99,235,0.25)" };
    case "completed":  return { bg: "rgba(22,163,74,0.08)",  text: "#14532d", border: "rgba(22,163,74,0.25)" };
    case "cancelled":  return { bg: "rgba(220,38,38,0.08)",  text: "#7f1d1d", border: "rgba(220,38,38,0.25)" };
  }
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const c = statusColor(status);
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      fontFamily: UI,
      letterSpacing: "0.07em",
      textTransform: "capitalize",
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
    }}>
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 22,
            color: n <= (hover || value) ? "#f59e0b" : "var(--cb-border-strong)",
            padding: "0 1px",
            lineHeight: 1,
          }}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = "overview" | "bookings" | "profile";

function OverviewTab({ bookings }: { bookings: Booking[] }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const statCards = [
    { label: "Total bookings", value: "3" },
    { label: "Upcoming shifts", value: "1" },
    { label: "Completed", value: "2" },
  ];

  const recentThree = bookings.slice(0, 3);

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 300, color: "var(--cb-ink)", margin: 0, letterSpacing: "-0.01em" }}>
          Good morning, {user?.firstName}.
        </h1>
        <p style={{ fontFamily: BODY, fontSize: 14, color: "var(--cb-ink-light)", marginTop: 6, marginBottom: 0 }}>
          Here's a summary of your care activity.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }} className="cb-stat-grid">
        {statCards.map((s) => (
          <div key={s.label} style={{
            background: "var(--cb-warm-white)",
            border: "1px solid var(--cb-border)",
            borderRadius: 4,
            padding: "24px 28px",
          }}>
            <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 600, color: "var(--cb-ink)", lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontFamily: UI, fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 16, marginTop: 0 }}>
          Quick actions
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => setLocation("/professionals")}
            style={{
              padding: "12px 24px",
              background: "var(--cb-sage)",
              color: "#fff",
              border: "none",
              borderRadius: 2,
              fontFamily: UI,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
          >
            Find a professional
          </button>
          <button
            onClick={() => setLocation("/professionals?urgent=true")}
            style={{
              padding: "12px 24px",
              background: "var(--cb-warm-white)",
              color: "var(--cb-ink)",
              border: "1px solid var(--cb-border-strong)",
              borderRadius: 2,
              fontFamily: UI,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
          >
            Book urgent care ⚡
          </button>
        </div>
      </div>

      {/* Recent bookings */}
      <div>
        <h2 style={{ fontFamily: UI, fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 16, marginTop: 0 }}>
          Recent bookings
        </h2>
        <div style={{ background: "var(--cb-warm-white)", border: "1px solid var(--cb-border)", borderRadius: 4, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--cb-border)" }}>
                {["Professional", "Discipline", "Date", "Status"].map((h) => (
                  <th key={h} style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontFamily: UI,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--cb-ink-light)",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentThree.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: i < recentThree.length - 1 ? "1px solid var(--cb-border)" : "none" }}>
                  <td style={{ padding: "14px 16px", fontFamily: BODY, fontSize: 14, color: "var(--cb-ink)", fontWeight: 500 }}>{b.professional}</td>
                  <td style={{ padding: "14px 16px", fontFamily: BODY, fontSize: 13, color: "var(--cb-ink-light)" }}>{b.discipline}</td>
                  <td style={{ padding: "14px 16px", fontFamily: UI, fontSize: 13, color: "var(--cb-ink-light)" }}>{formatDate(b.date)}</td>
                  <td style={{ padding: "14px 16px" }}><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type BookingFilter = "all" | "upcoming" | "completed" | "cancelled";

function BookingsTab({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [reviewOpen, setReviewOpen] = useState<number | null>(null);
  const [reviewStars, setReviewStars] = useState<Record<number, number>>({});
  const [reviewComment, setReviewComment] = useState<Record<number, string>>({});
  const [reviewSubmitted, setReviewSubmitted] = useState<Record<number, boolean>>({});

  const filterTabs: { key: BookingFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const filtered = bookings.filter((b) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return b.status === "confirmed" || b.status === "pending";
    if (filter === "completed") return b.status === "completed";
    if (filter === "cancelled") return b.status === "cancelled";
    return true;
  });

  function submitReview(id: number) {
    setReviewSubmitted((prev) => ({ ...prev, [id]: true }));
    setReviewOpen(null);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    fontFamily: BODY,
    fontSize: 13,
    color: "var(--cb-ink)",
    background: "var(--cb-cream)",
    border: "1px solid var(--cb-border-strong)",
    borderRadius: 2,
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
  };

  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: "var(--cb-ink)", margin: "0 0 24px", letterSpacing: "-0.01em" }}>
        My Bookings
      </h1>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "var(--cb-cream)", padding: 4, borderRadius: 4, width: "fit-content", border: "1px solid var(--cb-border)" }}>
        {filterTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            style={{
              padding: "8px 18px",
              borderRadius: 3,
              border: "none",
              background: filter === t.key ? "var(--cb-sage)" : "transparent",
              color: filter === t.key ? "#fff" : "var(--cb-ink-light)",
              fontFamily: UI,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--cb-ink-light)", fontFamily: BODY, fontSize: 14 }}>
            No bookings found.
          </div>
        )}
        {filtered.map((b) => (
          <div key={b.id} style={{
            background: "var(--cb-warm-white)",
            border: "1px solid var(--cb-border)",
            borderRadius: 4,
            overflow: "hidden",
          }}>
            {/* Card header */}
            <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              {/* Avatar initial */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--cb-sage-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: SERIF,
                fontSize: 18,
                color: "var(--cb-sage)",
                flexShrink: 0,
              }}>
                {b.professional.charAt(0)}
              </div>

              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontFamily: BODY, fontSize: 15, fontWeight: 600, color: "var(--cb-ink)", marginBottom: 2 }}>{b.professional}</div>
                <div style={{ fontFamily: UI, fontSize: 12, color: "var(--cb-ink-light)" }}>{b.discipline}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <StatusBadge status={b.status} />
                <span style={{ fontFamily: UI, fontSize: 12, color: "var(--cb-ink-light)" }}>{formatDate(b.date)}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, minWidth: 64 }}>
                <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: "var(--cb-ink)" }}>{b.amount}</span>
                <span style={{ fontFamily: UI, fontSize: 11, color: "var(--cb-ink-light)", letterSpacing: "0.06em" }}>{b.shiftType} shift</span>
              </div>

              <button
                onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                style={{
                  background: "none",
                  border: "1px solid var(--cb-border)",
                  borderRadius: 2,
                  padding: "6px 14px",
                  fontFamily: UI,
                  fontSize: 12,
                  color: "var(--cb-ink-light)",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {expanded === b.id ? "Hide details ▲" : "View details ▼"}
              </button>
            </div>

            {/* Expandable details */}
            {expanded === b.id && (
              <div style={{ borderTop: "1px solid var(--cb-border)", padding: "18px 20px", background: "var(--cb-cream)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }} className="cb-details-grid">
                  {[
                    { label: "Booking ID", value: `#CB-${String(b.id).padStart(4, "0")}` },
                    { label: "Shift type", value: b.shiftType },
                    { label: "Total amount", value: b.amount },
                  ].map((item) => (
                    <div key={item.label}>
                      <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontFamily: BODY, fontSize: 14, color: "var(--cb-ink)" }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Leave a review (completed only) */}
                {b.status === "completed" && (
                  <div style={{ marginTop: 8 }}>
                    {reviewSubmitted[b.id] ? (
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 16px",
                        background: "rgba(22,163,74,0.08)",
                        border: "1px solid rgba(22,163,74,0.25)",
                        borderRadius: 2,
                        fontFamily: UI,
                        fontSize: 12,
                        color: "#14532d",
                        fontWeight: 500,
                      }}>
                        ✓ Review submitted — thank you!
                      </div>
                    ) : reviewOpen === b.id ? (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 10 }}>
                          Rate your experience
                        </div>
                        <StarRating
                          value={reviewStars[b.id] ?? 0}
                          onChange={(v) => setReviewStars((prev) => ({ ...prev, [b.id]: v }))}
                        />
                        <textarea
                          placeholder="Share your experience (optional)..."
                          rows={3}
                          value={reviewComment[b.id] ?? ""}
                          onChange={(e) => setReviewComment((prev) => ({ ...prev, [b.id]: e.target.value }))}
                          style={{ ...inputStyle, marginTop: 12, display: "block" }}
                        />
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <button
                            onClick={() => submitReview(b.id)}
                            disabled={!reviewStars[b.id]}
                            style={{
                              padding: "9px 20px",
                              background: reviewStars[b.id] ? "var(--cb-sage)" : "rgba(61,107,79,0.3)",
                              color: "#fff",
                              border: "none",
                              borderRadius: 2,
                              fontFamily: UI,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: reviewStars[b.id] ? "pointer" : "not-allowed",
                              letterSpacing: "0.08em",
                            }}
                          >
                            Submit review
                          </button>
                          <button
                            onClick={() => setReviewOpen(null)}
                            style={{
                              padding: "9px 20px",
                              background: "transparent",
                              color: "var(--cb-ink-light)",
                              border: "1px solid var(--cb-border)",
                              borderRadius: 2,
                              fontFamily: UI,
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReviewOpen(b.id)}
                        style={{
                          padding: "9px 20px",
                          background: "transparent",
                          color: "var(--cb-sage)",
                          border: "1px solid var(--cb-sage)",
                          borderRadius: 2,
                          fontFamily: UI,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          letterSpacing: "0.06em",
                        }}
                      >
                        ★ Leave a review
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  }

  const fieldStyle: React.CSSProperties = {
    fontFamily: BODY,
    fontSize: 15,
    color: "var(--cb-ink)",
    padding: "10px 0",
    borderBottom: "1px solid var(--cb-border)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    fontFamily: BODY,
    fontSize: 14,
    color: "var(--cb-ink)",
    background: "var(--cb-cream)",
    border: "1px solid var(--cb-border-strong)",
    borderRadius: 2,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: UI,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--cb-ink-light)",
    display: "block",
    marginBottom: 6,
  };

  return (
    <div style={{ maxWidth: 540 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: "var(--cb-ink)", margin: 0, letterSpacing: "-0.01em" }}>
          Profile
        </h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            style={{
              padding: "9px 20px",
              background: "transparent",
              color: "var(--cb-ink)",
              border: "1px solid var(--cb-border-strong)",
              borderRadius: 2,
              fontFamily: UI,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              letterSpacing: "0.06em",
            }}
          >
            Edit
          </button>
        )}
      </div>

      {saved && (
        <div style={{
          padding: "12px 16px",
          background: "rgba(22,163,74,0.08)",
          border: "1px solid rgba(22,163,74,0.25)",
          borderRadius: 2,
          fontFamily: UI,
          fontSize: 13,
          color: "#14532d",
          marginBottom: 20,
        }}>
          Changes saved successfully.
        </div>
      )}

      {/* Avatar block */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36, padding: "20px 24px", background: "var(--cb-warm-white)", border: "1px solid var(--cb-border)", borderRadius: 4 }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--cb-sage-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SERIF,
          fontSize: 28,
          color: "var(--cb-sage)",
          flexShrink: 0,
        }}>
          {(user?.firstName ?? "U").charAt(0)}
        </div>
        <div>
          <div style={{ fontFamily: BODY, fontSize: 18, fontWeight: 600, color: "var(--cb-ink)" }}>
            {user?.firstName} {user?.lastName}
          </div>
          <div style={{ fontFamily: UI, fontSize: 12, color: "var(--cb-ink-light)", marginTop: 3, textTransform: "capitalize" }}>
            {user?.role ?? "Patient"}
          </div>
        </div>
      </div>

      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={labelStyle}>First name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Last name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} placeholder="+260..." />
          </div>
          <div>
            <label style={labelStyle}>Email (read-only)</label>
            <input value={user?.email ?? ""} readOnly style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed", background: "var(--cb-warm-white)" }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button
              onClick={handleSave}
              style={{
                padding: "11px 28px",
                background: "var(--cb-sage)",
                color: "#fff",
                border: "none",
                borderRadius: 2,
                fontFamily: UI,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.08em",
              }}
            >
              Save changes
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{
                padding: "11px 28px",
                background: "transparent",
                color: "var(--cb-ink-light)",
                border: "1px solid var(--cb-border)",
                borderRadius: 2,
                fontFamily: UI,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { label: "First name", value: firstName || user?.firstName },
            { label: "Last name", value: lastName || user?.lastName },
            { label: "Phone", value: phone || user?.phone || "—" },
            { label: "Email", value: user?.email },
          ].map((f) => (
            <div key={f.label} style={{ paddingBottom: 2 }}>
              <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginTop: 16, marginBottom: 4 }}>
                {f.label}
              </div>
              <div style={fieldStyle}>{f.value || "—"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS: { key: Tab; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "⊞" },
  { key: "bookings", label: "My Bookings", icon: "📋" },
  { key: "profile", label: "Profile", icon: "◎" },
];

function Sidebar({ activeTab, onTabChange, onLogout, mobileOpen, onClose }: {
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 199 }}
        />
      )}
      <aside style={{
        position: "fixed",
        top: 0,
        left: mobileOpen ? 0 : undefined,
        width: 240,
        height: "100vh",
        background: "var(--cb-warm-white)",
        borderRight: "1px solid var(--cb-border)",
        display: "flex",
        flexDirection: "column",
        zIndex: 200,
        transition: "transform 0.25s",
      }} className={`cb-sidebar${mobileOpen ? " cb-sidebar--open" : ""}`}>
        {/* Logo */}
        <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid var(--cb-border)" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, letterSpacing: "0.02em", color: "var(--cb-ink)" }}>
              Care<span style={{ color: "var(--cb-sage)" }}>Bridge</span>
            </div>
            <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cb-ink-light)", opacity: 0.6, marginTop: 2 }}>
              Patient Portal
            </div>
          </Link>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => { onTabChange(item.key); onClose(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "11px 14px",
                borderRadius: 3,
                border: "none",
                background: activeTab === item.key ? "var(--cb-sage-light)" : "transparent",
                color: activeTab === item.key ? "var(--cb-sage)" : "var(--cb-ink-light)",
                fontFamily: UI,
                fontSize: 14,
                fontWeight: activeTab === item.key ? 600 : 400,
                cursor: "pointer",
                textAlign: "left",
                marginBottom: 2,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          <Link href="/professionals" style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: 3,
              color: "var(--cb-ink-light)",
              fontFamily: UI,
              fontSize: 14,
              marginBottom: 2,
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>🔍</span>
              Find Care
            </div>
          </Link>
        </nav>

        {/* Logout */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid var(--cb-border)" }}>
          <button
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "11px 14px",
              borderRadius: 3,
              border: "none",
              background: "transparent",
              color: "var(--cb-ink-light)",
              fontFamily: UI,
              fontSize: 14,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>↩</span>
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PatientDashboardPage() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Auth guard
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cb-cream)" }}>
        <div style={{ fontFamily: UI, fontSize: 14, color: "var(--cb-ink-light)" }}>Loading…</div>
      </div>
    );
  }
  if (!user) {
    setLocation("/login");
    return null;
  }

  function handleLogout() {
    logout();
    setLocation("/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cb-cream)", fontFamily: BODY }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Raleway:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main layout: offset for sidebar */}
      <div style={{ marginLeft: 240 }} className="cb-dash-main">
        {/* Top bar (mobile) */}
        <div className="cb-mobile-topbar" style={{ display: "none", alignItems: "center", gap: 14, padding: "0 20px", height: 56, background: "var(--cb-warm-white)", borderBottom: "1px solid var(--cb-border)", position: "sticky", top: 0, zIndex: 100 }}>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--cb-ink)", padding: 4 }}
            aria-label="Open menu"
          >
            ☰
          </button>
          <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: "var(--cb-ink)" }}>
            Care<span style={{ color: "var(--cb-sage)" }}>Bridge</span>
          </span>
        </div>

        {/* Content */}
        <main style={{ padding: "48px 48px", maxWidth: 880, margin: "0 auto" }} className="cb-dash-content">
          {activeTab === "overview" && <OverviewTab bookings={MOCK_BOOKINGS} />}
          {activeTab === "bookings" && <BookingsTab bookings={MOCK_BOOKINGS} />}
          {activeTab === "profile" && <ProfileTab />}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cb-dash-main { margin-left: 0 !important; }
          .cb-mobile-topbar { display: flex !important; }
          .cb-dash-content { padding: 28px 20px !important; }
          .cb-sidebar { transform: translateX(-100%); }
          .cb-sidebar--open { transform: translateX(0) !important; }
          .cb-stat-grid { grid-template-columns: 1fr !important; }
          .cb-details-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 769px) {
          .cb-sidebar { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
