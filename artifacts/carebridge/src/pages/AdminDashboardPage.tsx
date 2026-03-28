import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, Link } from "wouter";

const SERIF = "'Cormorant Garamond', serif";
const BODY = "'Raleway', sans-serif";
const UI = "'DM Sans', sans-serif";

// ─── Types ────────────────────────────────────────────────────────────────────

type VerificationStatus = "pending" | "approved" | "rejected";
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
type PaymentStatus = "held" | "released" | "pending";
type UserRole = "patient" | "professional" | "admin";
type TabId = "overview" | "verification" | "professionals" | "bookings" | "users";

interface VerificationEntry {
  id: number;
  name: string;
  discipline: string;
  license: string;
  body: string;
  institution: string;
  expiry: string;
  applied: string;
  status: VerificationStatus;
}

interface Professional {
  id: number;
  name: string;
  discipline: string;
  rating: number;
  bookings: number;
  location: string;
  status: "active" | "suspended";
}

interface Booking {
  ref: string;
  patient: string;
  professional: string;
  date: string;
  shift: string;
  amount: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  joined: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_VERIFICATION: VerificationEntry[] = [
  { id: 1, name: "Bwalya Mutale", discipline: "Registered Nurse", license: "RN28934", body: "NMCZ", institution: "UTH Lusaka", expiry: "Dec 2026", applied: "2026-03-25", status: "pending" },
  { id: 2, name: "Luyando Mwanza", discipline: "Physiotherapist", license: "PT4521", body: "HPCZ", institution: "UNZA", expiry: "Jun 2027", applied: "2026-03-24", status: "pending" },
  { id: 3, name: "Mwamba Chipimo", discipline: "Midwife", license: "MW3312", body: "NMCZ", institution: "Chainama Hills", expiry: "Mar 2026", applied: "2026-03-23", status: "pending" },
  { id: 4, name: "Sonta Kaunda", discipline: "Mental Health Counsellor", license: "MH1092", body: "HPCZ", institution: "UNZA", expiry: "Aug 2027", applied: "2026-03-22", status: "approved" },
  { id: 5, name: "Temwani Phiri", discipline: "Certified Caregiver", license: "CG8821", body: "Certified", institution: "Lusaka Nursing School", expiry: "Oct 2026", applied: "2026-03-21", status: "approved" },
  { id: 6, name: "Kasonde Bwalya", discipline: "Registered Nurse", license: "RN31290", body: "NMCZ", institution: "UTH", expiry: "Jan 2027", applied: "2026-03-20", status: "pending" },
  { id: 7, name: "Namfuko Sichone", discipline: "Physiotherapist", license: "PT5012", body: "HPCZ", institution: "Copperhead Hospital", expiry: "Nov 2026", applied: "2026-03-19", status: "rejected" },
];

const PROFESSIONALS: Professional[] = [
  { id: 1, name: "Robert Ngoma", discipline: "Registered Nurse", rating: 4.9, bookings: 48, location: "Lusaka", status: "active" },
  { id: 2, name: "Chanda Mutale", discipline: "Physiotherapist", rating: 4.8, bookings: 35, location: "Ndola", status: "active" },
  { id: 3, name: "Grace Tembo", discipline: "Midwife", rating: 4.7, bookings: 62, location: "Lusaka", status: "active" },
  { id: 4, name: "Joseph Mwale", discipline: "Mental Health Counsellor", rating: 4.6, bookings: 27, location: "Kitwe", status: "active" },
  { id: 5, name: "Natasha Banda", discipline: "Certified Caregiver", rating: 4.9, bookings: 54, location: "Livingstone", status: "active" },
  { id: 6, name: "Patrick Lungu", discipline: "Registered Nurse", rating: 4.5, bookings: 19, location: "Lusaka", status: "active" },
  { id: 7, name: "Esther Kapata", discipline: "Physiotherapist", rating: 4.8, bookings: 41, location: "Ndola", status: "active" },
  { id: 8, name: "Daniel Mulenga", discipline: "Home Care Aide", rating: 4.4, bookings: 23, location: "Kitwe", status: "active" },
  { id: 9, name: "Florence Nkonde", discipline: "Midwife", rating: 4.7, bookings: 38, location: "Lusaka", status: "active" },
  { id: 10, name: "Victor Sikazwe", discipline: "Certified Caregiver", rating: 4.6, bookings: 31, location: "Kabwe", status: "active" },
];

const BOOKINGS: Booking[] = [
  { ref: "CB-2026-0412", patient: "Mutinta Banda", professional: "Robert Ngoma", date: "2026-03-26", shift: "Morning (08:00–12:00)", amount: "K450", paymentStatus: "released", bookingStatus: "completed" },
  { ref: "CB-2026-0411", patient: "James Mwila", professional: "Grace Tembo", date: "2026-03-26", shift: "Full Day (08:00–18:00)", amount: "K900", paymentStatus: "released", bookingStatus: "completed" },
  { ref: "CB-2026-0410", patient: "Ruth Phiri", professional: "Chanda Mutale", date: "2026-03-27", shift: "Afternoon (12:00–18:00)", amount: "K450", paymentStatus: "held", bookingStatus: "confirmed" },
  { ref: "CB-2026-0409", patient: "Henry Banda", professional: "Natasha Banda", date: "2026-03-27", shift: "Evening (18:00–22:00)", amount: "K350", paymentStatus: "held", bookingStatus: "confirmed" },
  { ref: "CB-2026-0408", patient: "Clara Tembo", professional: "Joseph Mwale", date: "2026-03-28", shift: "Morning (08:00–12:00)", amount: "K450", paymentStatus: "pending", bookingStatus: "pending" },
  { ref: "CB-2026-0407", patient: "Samuel Zulu", professional: "Patrick Lungu", date: "2026-03-28", shift: "Full Day (08:00–18:00)", amount: "K900", paymentStatus: "pending", bookingStatus: "pending" },
  { ref: "CB-2026-0406", patient: "Monica Nkosi", professional: "Esther Kapata", date: "2026-03-25", shift: "Afternoon (12:00–18:00)", amount: "K450", paymentStatus: "released", bookingStatus: "completed" },
  { ref: "CB-2026-0405", patient: "David Mwansa", professional: "Florence Nkonde", date: "2026-03-24", shift: "Morning (08:00–12:00)", amount: "K450", paymentStatus: "pending", bookingStatus: "cancelled" },
];

const USERS: User[] = [
  { id: 1, name: "Mutinta Banda", email: "mutinta@example.com", role: "patient", phone: "+260 97 123 4567", joined: "2026-01-10" },
  { id: 2, name: "James Mwila", email: "james.mwila@example.com", role: "patient", phone: "+260 96 234 5678", joined: "2026-01-15" },
  { id: 3, name: "Ruth Phiri", email: "ruth.phiri@example.com", role: "patient", phone: "+260 97 345 6789", joined: "2026-01-22" },
  { id: 4, name: "Robert Ngoma", email: "robert.ngoma@example.com", role: "professional", phone: "+260 96 456 7890", joined: "2025-12-05" },
  { id: 5, name: "Grace Tembo", email: "grace.tembo@example.com", role: "professional", phone: "+260 97 567 8901", joined: "2025-12-10" },
  { id: 6, name: "Henry Banda", email: "henry.banda@example.com", role: "patient", phone: "+260 96 678 9012", joined: "2026-02-01" },
  { id: 7, name: "Clara Tembo", email: "clara.tembo@example.com", role: "patient", phone: "+260 97 789 0123", joined: "2026-02-14" },
  { id: 8, name: "Chanda Mutale", email: "chanda.m@example.com", role: "professional", phone: "+260 96 890 1234", joined: "2025-11-20" },
  { id: 9, name: "Admin User", email: "admin@carebridge.zm", role: "admin", phone: "+260 97 001 0001", joined: "2025-10-01" },
  { id: 10, name: "Samuel Zulu", email: "samuel.zulu@example.com", role: "patient", phone: "+260 96 901 2345", joined: "2026-03-01" },
];

const RECENT_ACTIVITY = [
  { text: "New registration: Mutinta Banda (Midwife)", time: "2 hours ago" },
  { text: "Booking completed: Robert Ngoma", time: "4 hours ago" },
  { text: "Verification approved: Sonta Kaunda", time: "6 hours ago" },
  { text: "New booking: Henry Banda → Natasha Banda", time: "8 hours ago" },
  { text: "Payment released: CB-2026-0406 · K450", time: "10 hours ago" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: VerificationStatus }) {
  const styles: Record<VerificationStatus, { bg: string; color: string; label: string }> = {
    pending: { bg: "#FEF3C7", color: "#92400E", label: "Pending" },
    approved: { bg: "#D1FAE5", color: "#065F46", label: "Approved" },
    rejected: { bg: "#FEE2E2", color: "#991B1B", label: "Rejected" },
  };
  const s = styles[status];
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      fontFamily: UI,
      background: s.bg,
      color: s.color,
      letterSpacing: "0.02em",
    }}>
      {s.label}
    </span>
  );
}

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, { bg: string; color: string }> = {
    pending:   { bg: "#FEF3C7", color: "#92400E" },
    confirmed: { bg: "#DBEAFE", color: "#1E40AF" },
    completed: { bg: "#D1FAE5", color: "#065F46" },
    cancelled: { bg: "#FEE2E2", color: "#991B1B" },
  };
  const s = map[status];
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: UI, background: s.bg, color: s.color }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { bg: string; color: string }> = {
    held:    { bg: "#FEF3C7", color: "#92400E" },
    released:{ bg: "#D1FAE5", color: "#065F46" },
    pending: { bg: "#F3F4F6", color: "#374151" },
  };
  const s = map[status];
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: UI, background: s.bg, color: s.color }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const map: Record<UserRole, { bg: string; color: string }> = {
    patient:      { bg: "#DBEAFE", color: "#1E40AF" },
    professional: { bg: "#D1FAE5", color: "#065F46" },
    admin:        { bg: "#EDE9FE", color: "#5B21B6" },
  };
  const s = map[role];
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: UI, background: s.bg, color: s.color }}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [verificationData, setVerificationData] = useState<VerificationEntry[]>(INITIAL_VERIFICATION);
  const [verificationFilter, setVerificationFilter] = useState<"all" | VerificationStatus>("all");
  const [bookingFilter, setBookingFilter] = useState<"all" | BookingStatus>("all");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | UserRole>("all");

  // Auth guard
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--cb-cream)", fontFamily: UI }}>
        <div style={{ width: 40, height: 40, border: "3px solid var(--cb-border)", borderTopColor: "var(--cb-sage)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  // Verification actions
  function handleApprove(id: number) {
    setVerificationData(prev => prev.map(e => e.id === id ? { ...e, status: "approved" } : e));
  }
  function handleReject(id: number) {
    setVerificationData(prev => prev.map(e => e.id === id ? { ...e, status: "rejected" } : e));
  }

  const pendingCount = verificationData.filter(e => e.status === "pending").length;

  // Filtered lists
  const filteredVerification = verificationFilter === "all"
    ? verificationData
    : verificationData.filter(e => e.status === verificationFilter);

  const filteredBookings = bookingFilter === "all"
    ? BOOKINGS
    : BOOKINGS.filter(b => b.bookingStatus === bookingFilter);

  const filteredUsers = userRoleFilter === "all"
    ? USERS
    : USERS.filter(u => u.role === userRoleFilter);

  // ─── Nav Items ─────────────────────────────────────────────────────────────
  const navItems: { id: TabId | "logout"; label: string; icon: string; disabled?: boolean }[] = [
    { id: "overview",      label: "Overview",            icon: "⊞" },
    { id: "verification",  label: "Verification Queue",  icon: "✔" },
    { id: "professionals", label: "All Professionals",   icon: "👤" },
    { id: "bookings",      label: "All Bookings",        icon: "📅" },
    { id: "users",         label: "Users",               icon: "👥" },
    { id: "logout" as TabId,       label: "Platform Settings",   icon: "⚙", disabled: true } as { id: TabId | "logout"; label: string; icon: string; disabled?: boolean },
  ];

  const tableHeaderStyle: React.CSSProperties = {
    padding: "10px 14px",
    textAlign: "left",
    fontFamily: UI,
    fontSize: 12,
    fontWeight: 600,
    color: "var(--cb-ink-light)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "1px solid var(--cb-border)",
    whiteSpace: "nowrap",
    background: "var(--cb-warm-white)",
  };

  const tableCellStyle: React.CSSProperties = {
    padding: "12px 14px",
    fontFamily: UI,
    fontSize: 13.5,
    color: "var(--cb-ink)",
    borderBottom: "1px solid var(--cb-border)",
    verticalAlign: "middle",
  };

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 16px",
    borderRadius: 20,
    border: active ? "1.5px solid var(--cb-sage)" : "1.5px solid var(--cb-border)",
    background: active ? "var(--cb-sage)" : "transparent",
    color: active ? "#fff" : "var(--cb-ink)",
    fontFamily: UI,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
  });

  // ─── Tab: Overview ─────────────────────────────────────────────────────────
  function TabOverview() {
    const stats = [
      { label: "Total Users",        value: "247",    icon: "👥", color: "#DBEAFE" },
      { label: "Professionals",      value: "89",     icon: "👤", color: "#D1FAE5" },
      { label: "Pending Verification", value: pendingCount.toString(), icon: "⏳", color: "#FEF3C7" },
      { label: "Total Bookings",     value: "412",    icon: "📅", color: "#EDE9FE" },
      { label: "Platform Revenue",   value: "K82,400", icon: "💰", color: "#FCE7F3" },
    ];

    return (
      <div>
        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: "#fff",
              border: "1px solid var(--cb-border)",
              borderRadius: 12,
              padding: "20px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {s.icon}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: "var(--cb-ink)", lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontFamily: UI, fontSize: 12.5, color: "var(--cb-ink-light)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Recent Activity */}
          <div style={{ background: "#fff", border: "1px solid var(--cb-border)", borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: "var(--cb-ink)", margin: "0 0 18px" }}>Recent Activity</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid var(--cb-border)" : "none",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--cb-sage)", marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: UI, fontSize: 13.5, color: "var(--cb-ink)" }}>{a.text}</div>
                    <div style={{ fontFamily: UI, fontSize: 12, color: "var(--cb-ink-light)", marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: "#fff", border: "1px solid var(--cb-border)", borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: "var(--cb-ink)", margin: "0 0 18px" }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => setActiveTab("verification")}
                style={{
                  padding: "14px 20px",
                  background: "var(--cb-sage)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: UI,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span>✔</span>
                Review Pending Verifications
                <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.3)", borderRadius: 12, padding: "2px 8px", fontSize: 12 }}>
                  {pendingCount}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                style={{
                  padding: "14px 20px",
                  background: "var(--cb-trust-bg)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: UI,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span>📅</span>
                View All Bookings
                <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "2px 8px", fontSize: 12 }}>
                  412
                </span>
              </button>
              <button
                onClick={() => setActiveTab("users")}
                style={{
                  padding: "14px 20px",
                  background: "transparent",
                  color: "var(--cb-ink)",
                  border: "1.5px solid var(--cb-border)",
                  borderRadius: 10,
                  fontFamily: UI,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span>👥</span>
                Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Tab: Verification Queue ────────────────────────────────────────────────
  function TabVerification() {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "var(--cb-ink)", margin: 0 }}>
            Professionals Awaiting Verification ({pendingCount})
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            {(["all", "pending", "approved", "rejected"] as const).map(f => (
              <button key={f} onClick={() => setVerificationFilter(f)} style={filterBtnStyle(verificationFilter === f)}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid var(--cb-border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Name", "Discipline", "License No.", "License Body", "Institution", "Cert Expiry", "Date Applied", "Status", "Actions"].map(h => (
                    <th key={h} style={tableHeaderStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredVerification.map(entry => (
                  <tr key={entry.id} style={{ background: "#fff" }}>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>{entry.name}</td>
                    <td style={tableCellStyle}>{entry.discipline}</td>
                    <td style={{ ...tableCellStyle, fontFamily: "monospace", fontSize: 13 }}>{entry.license}</td>
                    <td style={tableCellStyle}>{entry.body}</td>
                    <td style={tableCellStyle}>{entry.institution}</td>
                    <td style={tableCellStyle}>{entry.expiry}</td>
                    <td style={tableCellStyle}>{entry.applied}</td>
                    <td style={tableCellStyle}><StatusBadge status={entry.status} /></td>
                    <td style={tableCellStyle}>
                      {entry.status === "pending" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => handleApprove(entry.id)}
                            style={{
                              padding: "5px 12px",
                              background: "var(--cb-sage)",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              fontFamily: UI,
                              fontSize: 12.5,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(entry.id)}
                            style={{
                              padding: "5px 12px",
                              background: "transparent",
                              color: "#DC2626",
                              border: "1.5px solid #DC2626",
                              borderRadius: 6,
                              fontFamily: UI,
                              fontSize: 12.5,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {entry.status !== "pending" && (
                        <span style={{ fontFamily: UI, fontSize: 12.5, color: "var(--cb-ink-light)" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredVerification.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", fontFamily: UI, fontSize: 14, color: "var(--cb-ink-light)" }}>
              No entries match this filter.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Tab: All Professionals ────────────────────────────────────────────────
  function TabProfessionals() {
    return (
      <div>
        <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "var(--cb-ink)", margin: "0 0 20px" }}>
          All Professionals ({PROFESSIONALS.length})
        </h2>
        <div style={{ background: "#fff", border: "1px solid var(--cb-border)", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Name", "Discipline", "Rating", "Bookings", "Location", "Status", "Actions"].map(h => (
                  <th key={h} style={tableHeaderStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROFESSIONALS.map(p => (
                <tr key={p.id}>
                  <td style={{ ...tableCellStyle, fontWeight: 600 }}>{p.name}</td>
                  <td style={tableCellStyle}>{p.discipline}</td>
                  <td style={tableCellStyle}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: "#F59E0B" }}>★</span>
                      <span style={{ fontWeight: 600 }}>{p.rating}</span>
                    </span>
                  </td>
                  <td style={tableCellStyle}>{p.bookings}</td>
                  <td style={tableCellStyle}>{p.location}</td>
                  <td style={tableCellStyle}>
                    <span style={{
                      display: "inline-block",
                      padding: "2px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: UI,
                      background: p.status === "active" ? "#D1FAE5" : "#FEE2E2",
                      color: p.status === "active" ? "#065F46" : "#991B1B",
                    }}>
                      {p.status === "active" ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link href={`/professionals/${p.id}`}>
                        <a style={{
                          padding: "5px 12px",
                          background: "var(--cb-trust-bg)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          fontFamily: UI,
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "none",
                          display: "inline-block",
                        }}>
                          View Profile
                        </a>
                      </Link>
                      <button
                        disabled
                        style={{
                          padding: "5px 12px",
                          background: "transparent",
                          color: "#9CA3AF",
                          border: "1.5px solid #D1D5DB",
                          borderRadius: 6,
                          fontFamily: UI,
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: "not-allowed",
                        }}
                      >
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── Tab: All Bookings ─────────────────────────────────────────────────────
  function TabBookings() {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "var(--cb-ink)", margin: 0 }}>
            All Bookings ({BOOKINGS.length})
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map(f => (
              <button key={f} onClick={() => setBookingFilter(f)} style={filterBtnStyle(bookingFilter === f)}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--cb-border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Ref #", "Patient", "Professional", "Date", "Shift", "Amount", "Payment Status", "Booking Status"].map(h => (
                    <th key={h} style={tableHeaderStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(b => (
                  <tr key={b.ref}>
                    <td style={{ ...tableCellStyle, fontFamily: "monospace", fontSize: 12.5, color: "var(--cb-ink-light)" }}>{b.ref}</td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>{b.patient}</td>
                    <td style={tableCellStyle}>{b.professional}</td>
                    <td style={tableCellStyle}>{b.date}</td>
                    <td style={{ ...tableCellStyle, fontSize: 12.5 }}>{b.shift}</td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>{b.amount}</td>
                    <td style={tableCellStyle}><PaymentBadge status={b.paymentStatus} /></td>
                    <td style={tableCellStyle}><BookingStatusBadge status={b.bookingStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredBookings.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", fontFamily: UI, fontSize: 14, color: "var(--cb-ink-light)" }}>
              No bookings match this filter.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Tab: Users ────────────────────────────────────────────────────────────
  function TabUsers() {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "var(--cb-ink)", margin: 0 }}>
            All Users ({USERS.length})
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            {(["all", "patient", "professional", "admin"] as const).map(f => (
              <button key={f} onClick={() => setUserRoleFilter(f)} style={filterBtnStyle(userRoleFilter === f)}>
                {f === "all" ? "All" : f === "patient" ? "Patients" : f === "professional" ? "Professionals" : "Admins"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--cb-border)", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Name", "Email", "Role", "Phone", "Date Joined", "Actions"].map(h => (
                  <th key={h} style={tableHeaderStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id}>
                  <td style={{ ...tableCellStyle, fontWeight: 600 }}>{u.name}</td>
                  <td style={{ ...tableCellStyle, color: "var(--cb-ink-light)" }}>{u.email}</td>
                  <td style={tableCellStyle}><RoleBadge role={u.role} /></td>
                  <td style={tableCellStyle}>{u.phone}</td>
                  <td style={tableCellStyle}>{u.joined}</td>
                  <td style={tableCellStyle}>
                    <button
                      style={{
                        padding: "5px 14px",
                        background: "var(--cb-trust-bg)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        fontFamily: UI,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  const tabTitles: Record<TabId, string> = {
    overview:      "Overview",
    verification:  "Verification Queue",
    professionals: "All Professionals",
    bookings:      "All Bookings",
    users:         "Users",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--cb-cream)", fontFamily: UI }}>

      {/* Sidebar */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        background: "var(--cb-trust-bg)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "28px 24px 20px" }}>
          <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
            CareBridge
          </div>
          <div style={{ fontFamily: UI, fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Admin Console
          </div>
        </div>

        <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.1)", margin: "0 0 8px" }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.slice(0, 5).map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabId)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "none",
                  borderLeft: isActive ? "3px solid var(--cb-sage)" : "3px solid transparent",
                  background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                  fontFamily: UI,
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 16, width: 20, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.id === "verification" && pendingCount > 0 && (
                  <span style={{
                    marginLeft: "auto",
                    background: "#F59E0B",
                    color: "#fff",
                    borderRadius: 10,
                    padding: "1px 7px",
                    fontSize: 11,
                    fontWeight: 700,
                  }}>
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}

          {/* Platform Settings (coming soon) */}
          <button
            disabled
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              border: "3px solid transparent",
              background: "transparent",
              color: "rgba(255,255,255,0.3)",
              fontFamily: UI,
              fontSize: 14,
              fontWeight: 400,
              cursor: "not-allowed",
              textAlign: "left",
              width: "100%",
            }}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: "center", flexShrink: 0 }}>⚙</span>
            <span>Platform Settings</span>
            <span style={{ marginLeft: "auto", fontSize: 10, fontFamily: UI, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
              soon
            </span>
          </button>
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 12px 24px" }}>
          <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 12 }} />
          <button
            onClick={() => { logout(); navigate("/login"); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.6)",
              fontFamily: UI,
              fontSize: 14,
              fontWeight: 400,
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>⎋</span>
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Top Bar */}
        <header style={{
          background: "#fff",
          borderBottom: "1px solid var(--cb-border)",
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}>
          <h1 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "var(--cb-ink)", margin: 0 }}>
            {tabTitles[activeTab]}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--cb-sage-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: UI,
              fontSize: 14,
              fontWeight: 700,
              color: "var(--cb-sage)",
            }}>
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div>
              <div style={{ fontFamily: UI, fontSize: 13.5, fontWeight: 600, color: "var(--cb-ink)" }}>
                {user.firstName} {user.lastName}
              </div>
              <div style={{ fontFamily: UI, fontSize: 11.5, color: "var(--cb-ink-light)" }}>Administrator</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: "28px 32px" }}>
          {activeTab === "overview"      && <TabOverview />}
          {activeTab === "verification"  && <TabVerification />}
          {activeTab === "professionals" && <TabProfessionals />}
          {activeTab === "bookings"      && <TabBookings />}
          {activeTab === "users"         && <TabUsers />}
        </main>
      </div>
    </div>
  );
}
