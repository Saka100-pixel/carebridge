import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";

const SERIF = "'Cormorant Garamond', serif";
const BODY = "'Raleway', sans-serif";
const UI = "'DM Sans', sans-serif";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

interface IncomingBooking {
  id: number;
  patient: string;
  date: string;
  shiftType: string;
  amount: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  location: string;
}

const MOCK_INCOMING: IncomingBooking[] = [
  { id: 101, patient: "Susan Tembo",    date: "2026-04-08", shiftType: "8h",  amount: "K540",   status: "pending",     location: "Kabulonga, Lusaka" },
  { id: 102, patient: "Joseph Mwansa",  date: "2026-04-05", shiftType: "12h", amount: "K684",   status: "confirmed",   location: "Roma, Lusaka" },
  { id: 103, patient: "Patricia Daka",  date: "2026-03-30", shiftType: "8h",  amount: "K540",   status: "in_progress", location: "Woodlands, Lusaka" },
  { id: 104, patient: "Emmanuel Lungu", date: "2026-03-28", shiftType: "24h", amount: "K1032",  status: "pending",     location: "Chelston, Lusaka" },
  { id: 105, patient: "Esther Mulenga", date: "2026-03-20", shiftType: "8h",  amount: "K540",   status: "completed",   location: "Ibex Hill, Lusaka" },
  { id: 106, patient: "David Siame",    date: "2026-03-15", shiftType: "8h",  amount: "K540",   status: "completed",   location: "Northmead, Lusaka" },
];

const MOCK_PAYOUTS = [
  { date: "2026-03-20", amount: "K1,080", method: "MTN MoMo", ref: "TXN-38291" },
  { date: "2026-03-01", amount: "K2,160", method: "MTN MoMo", ref: "TXN-37104" },
  { date: "2026-02-15", amount: "K540",   method: "Airtel Money", ref: "TXN-36874" },
];

// Weekly earnings mock data (last 7 days, Mon–Sun)
const WEEKLY_EARNINGS = [540, 0, 684, 540, 0, 1032, 540];
const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusColor(status: IncomingBooking["status"]): { bg: string; text: string; border: string } {
  switch (status) {
    case "pending":     return { bg: "rgba(217,119,6,0.1)",   text: "#92400e", border: "rgba(217,119,6,0.3)" };
    case "confirmed":   return { bg: "rgba(37,99,235,0.08)",  text: "#1e3a8a", border: "rgba(37,99,235,0.25)" };
    case "in_progress": return { bg: "rgba(124,58,237,0.08)", text: "#4c1d95", border: "rgba(124,58,237,0.25)" };
    case "completed":   return { bg: "rgba(22,163,74,0.08)",  text: "#14532d", border: "rgba(22,163,74,0.25)" };
    case "cancelled":   return { bg: "rgba(220,38,38,0.08)",  text: "#7f1d1d", border: "rgba(220,38,38,0.25)" };
  }
}

function statusLabel(status: IncomingBooking["status"]) {
  return status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1);
}

function StatusBadge({ status }: { status: IncomingBooking["status"] }) {
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
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
    }}>
      {statusLabel(status)}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ bookings }: { bookings: IncomingBooking[] }) {
  const { user } = useAuth();
  const verificationStatus = "pending"; // mock

  const stats = [
    { label: "Total bookings", value: "48" },
    { label: "This month",     value: "6" },
    { label: "Average rating", value: "4.9 ★" },
    { label: "Total earned",   value: "K18,400" },
  ];

  const upcoming = bookings.filter((b) => b.status === "confirmed" || b.status === "pending" || b.status === "in_progress").slice(0, 3);

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 300, color: "var(--cb-ink)", margin: 0, letterSpacing: "-0.01em" }}>
          Good morning, {user?.firstName}.
        </h1>
        <p style={{ fontFamily: BODY, fontSize: 14, color: "var(--cb-ink-light)", marginTop: 6, marginBottom: 0 }}>
          Here's an overview of your professional activity.
        </p>
      </div>

      {/* Verification banner */}
      {verificationStatus === "pending" && (
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          padding: "14px 18px",
          background: "rgba(217,119,6,0.08)",
          border: "1px solid rgba(217,119,6,0.3)",
          borderLeft: "4px solid #d97706",
          borderRadius: 3,
          marginBottom: 28,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>⏳</span>
          <div>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: "#92400e", marginBottom: 3 }}>
              Profile under review
            </div>
            <div style={{ fontFamily: BODY, fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>
              Your profile is under review. We check with NMCZ/HPCZ and will notify you within 48 hours.
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }} className="cb-pro-stat-grid">
        {stats.map((s) => (
          <div key={s.label} style={{
            background: "var(--cb-warm-white)",
            border: "1px solid var(--cb-border)",
            borderRadius: 4,
            padding: "22px 24px",
          }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 600, color: "var(--cb-ink)", lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Upcoming bookings */}
      <div>
        <h2 style={{ fontFamily: UI, fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 16, marginTop: 0 }}>
          Upcoming bookings
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {upcoming.length === 0 && (
            <div style={{ fontFamily: BODY, fontSize: 14, color: "var(--cb-ink-light)", padding: "20px 0" }}>No upcoming bookings.</div>
          )}
          {upcoming.map((b) => (
            <div key={b.id} style={{
              background: "var(--cb-warm-white)",
              border: "1px solid var(--cb-border)",
              borderRadius: 4,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "var(--cb-sage-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: SERIF, fontSize: 18, color: "var(--cb-sage)", flexShrink: 0,
              }}>{b.patient.charAt(0)}</div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontFamily: BODY, fontSize: 14, fontWeight: 600, color: "var(--cb-ink)" }}>{b.patient}</div>
                <div style={{ fontFamily: UI, fontSize: 12, color: "var(--cb-ink-light)", marginTop: 2 }}>{b.location}</div>
              </div>
              <div style={{ fontFamily: UI, fontSize: 13, color: "var(--cb-ink-light)" }}>{formatDate(b.date)}</div>
              <div style={{ fontFamily: UI, fontSize: 12, color: "var(--cb-ink-light)" }}>{b.shiftType}</div>
              <StatusBadge status={b.status} />
              <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: "var(--cb-ink)" }}>{b.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── My Bookings Tab ──────────────────────────────────────────────────────────

function MyBookingsTab() {
  const [bookings, setBookings] = useState<IncomingBooking[]>(MOCK_INCOMING);

  function transition(id: number, newStatus: IncomingBooking["status"]) {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: newStatus } : b));
  }

  const btnBase: React.CSSProperties = {
    padding: "7px 14px",
    border: "none",
    borderRadius: 2,
    fontFamily: UI,
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.06em",
    whiteSpace: "nowrap",
  };

  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: "var(--cb-ink)", margin: "0 0 28px", letterSpacing: "-0.01em" }}>
        Incoming Bookings
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {bookings.map((b) => (
          <div key={b.id} style={{
            background: "var(--cb-warm-white)",
            border: "1px solid var(--cb-border)",
            borderRadius: 4,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "var(--cb-sage-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: SERIF, fontSize: 18, color: "var(--cb-sage)", flexShrink: 0,
            }}>{b.patient.charAt(0)}</div>

            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontFamily: BODY, fontSize: 14, fontWeight: 600, color: "var(--cb-ink)" }}>{b.patient}</div>
              <div style={{ fontFamily: UI, fontSize: 12, color: "var(--cb-ink-light)", marginTop: 2 }}>{b.location}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, minWidth: 80 }}>
              <span style={{ fontFamily: UI, fontSize: 12, color: "var(--cb-ink-light)" }}>{formatDate(b.date)}</span>
              <span style={{ fontFamily: UI, fontSize: 11, color: "var(--cb-ink-light)" }}>{b.shiftType} shift</span>
            </div>

            <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: "var(--cb-ink)", minWidth: 56, textAlign: "right" }}>{b.amount}</div>

            <StatusBadge status={b.status} />

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {b.status === "pending" && (
                <>
                  <button onClick={() => transition(b.id, "confirmed")} style={{ ...btnBase, background: "var(--cb-sage)", color: "#fff" }}>
                    Accept
                  </button>
                  <button onClick={() => transition(b.id, "cancelled")} style={{ ...btnBase, background: "rgba(220,38,38,0.08)", color: "#7f1d1d", border: "1px solid rgba(220,38,38,0.25)" }}>
                    Decline
                  </button>
                </>
              )}
              {b.status === "confirmed" && (
                <button onClick={() => transition(b.id, "in_progress")} style={{ ...btnBase, background: "rgba(124,58,237,0.1)", color: "#4c1d95", border: "1px solid rgba(124,58,237,0.25)" }}>
                  Mark as in progress
                </button>
              )}
              {b.status === "in_progress" && (
                <button onClick={() => transition(b.id, "completed")} style={{ ...btnBase, background: "rgba(22,163,74,0.1)", color: "#14532d", border: "1px solid rgba(22,163,74,0.3)" }}>
                  Mark as complete
                </button>
              )}
              {(b.status === "completed" || b.status === "cancelled") && (
                <span style={{ fontFamily: UI, fontSize: 11, color: "var(--cb-ink-light)", padding: "7px 0" }}>
                  {b.status === "completed" ? "Done" : "Declined"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Availability Tab ─────────────────────────────────────────────────────────

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

interface DayAvailability {
  enabled: boolean;
  start: string;
  end: string;
}

const defaultAvailability: Record<DayKey, DayAvailability> = {
  mon: { enabled: true,  start: "08:00", end: "17:00" },
  tue: { enabled: true,  start: "08:00", end: "17:00" },
  wed: { enabled: true,  start: "08:00", end: "17:00" },
  thu: { enabled: true,  start: "08:00", end: "17:00" },
  fri: { enabled: true,  start: "08:00", end: "17:00" },
  sat: { enabled: false, start: "09:00", end: "13:00" },
  sun: { enabled: false, start: "09:00", end: "13:00" },
};

function AvailabilityTab() {
  const [avail, setAvail] = useState<Record<DayKey, DayAvailability>>(defaultAvailability);
  const [saved, setSaved] = useState(false);

  function toggle(day: DayKey) {
    setAvail((prev) => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));
  }

  function setTime(day: DayKey, field: "start" | "end", value: string) {
    setAvail((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  }

  function setAllUnavailable() {
    const updated = { ...avail };
    (Object.keys(updated) as DayKey[]).forEach((k) => { updated[k] = { ...updated[k], enabled: false }; });
    setAvail(updated);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const timeInputStyle: React.CSSProperties = {
    padding: "7px 10px",
    fontFamily: UI,
    fontSize: 13,
    color: "var(--cb-ink)",
    background: "var(--cb-cream)",
    border: "1px solid var(--cb-border-strong)",
    borderRadius: 2,
    outline: "none",
    width: 96,
    boxSizing: "border-box",
  };

  return (
    <div style={{ maxWidth: 620 }}>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: "var(--cb-ink)", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
        Weekly Availability
      </h1>
      <p style={{ fontFamily: BODY, fontSize: 14, color: "var(--cb-ink-light)", marginBottom: 28 }}>
        Set the days and hours you are available to accept bookings.
      </p>

      {saved && (
        <div style={{ padding: "12px 16px", background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: 2, fontFamily: UI, fontSize: 13, color: "#14532d", marginBottom: 20 }}>
          Availability saved successfully.
        </div>
      )}

      <div style={{ background: "var(--cb-warm-white)", border: "1px solid var(--cb-border)", borderRadius: 4, overflow: "hidden", marginBottom: 20 }}>
        {DAYS.map((d, i) => (
          <div key={d.key} style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 20px",
            borderBottom: i < DAYS.length - 1 ? "1px solid var(--cb-border)" : "none",
            flexWrap: "wrap",
            background: avail[d.key].enabled ? "transparent" : "rgba(0,0,0,0.018)",
          }}>
            {/* Toggle */}
            <button
              onClick={() => toggle(d.key)}
              aria-label={`Toggle ${d.label}`}
              style={{
                width: 38,
                height: 22,
                borderRadius: 11,
                border: "none",
                background: avail[d.key].enabled ? "var(--cb-sage)" : "var(--cb-border-strong)",
                cursor: "pointer",
                position: "relative",
                flexShrink: 0,
                transition: "background 0.2s",
                padding: 0,
              }}
            >
              <div style={{
                position: "absolute",
                top: 3,
                left: avail[d.key].enabled ? 19 : 3,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
              }} />
            </button>

            {/* Day label */}
            <span style={{
              fontFamily: UI,
              fontSize: 14,
              fontWeight: 500,
              color: avail[d.key].enabled ? "var(--cb-ink)" : "var(--cb-ink-light)",
              minWidth: 100,
            }}>
              {d.label}
            </span>

            {/* Time inputs */}
            {avail[d.key].enabled ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="time"
                  value={avail[d.key].start}
                  onChange={(e) => setTime(d.key, "start", e.target.value)}
                  style={timeInputStyle}
                />
                <span style={{ fontFamily: UI, fontSize: 12, color: "var(--cb-ink-light)" }}>to</span>
                <input
                  type="time"
                  value={avail[d.key].end}
                  onChange={(e) => setTime(d.key, "end", e.target.value)}
                  style={timeInputStyle}
                />
              </div>
            ) : (
              <span style={{ fontFamily: UI, fontSize: 12, color: "var(--cb-ink-light)", fontStyle: "italic" }}>Unavailable</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
          Save availability
        </button>
        <button
          onClick={setAllUnavailable}
          style={{
            padding: "11px 24px",
            background: "transparent",
            color: "var(--cb-ink-light)",
            border: "1px solid var(--cb-border-strong)",
            borderRadius: 2,
            fontFamily: UI,
            fontSize: 13,
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          Set all unavailable
        </button>
      </div>
    </div>
  );
}

// ─── Earnings Tab ─────────────────────────────────────────────────────────────

function EarningsTab() {
  const maxEarning = Math.max(...WEEKLY_EARNINGS, 1);

  const earningsSummary = [
    { label: "This week",  value: "K1,572" },
    { label: "This month", value: "K4,896" },
    { label: "All time",   value: "K18,400" },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: "var(--cb-ink)", margin: "0 0 28px", letterSpacing: "-0.01em" }}>
        Earnings
      </h1>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 }} className="cb-earn-grid">
        {earningsSummary.map((s) => (
          <div key={s.label} style={{
            background: "var(--cb-warm-white)",
            border: "1px solid var(--cb-border)",
            borderRadius: 4,
            padding: "22px 24px",
          }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 600, color: "var(--cb-ink)", lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{
        background: "var(--cb-warm-white)",
        border: "1px solid var(--cb-border)",
        borderRadius: 4,
        padding: "28px 28px",
        marginBottom: 36,
      }}>
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 24 }}>
          This week — daily earnings (ZMW)
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
          {WEEKLY_EARNINGS.map((val, i) => {
            const pct = val / maxEarning;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                {val > 0 && (
                  <span style={{ fontFamily: UI, fontSize: 10, color: "var(--cb-ink-light)" }}>
                    {val >= 1000 ? `K${(val / 1000).toFixed(1)}k` : `K${val}`}
                  </span>
                )}
                <div style={{
                  width: "100%",
                  height: val > 0 ? `${Math.max(pct * 80, 4)}px` : 4,
                  background: val > 0 ? "var(--cb-sage)" : "var(--cb-border)",
                  borderRadius: "2px 2px 0 0",
                  transition: "height 0.3s",
                  opacity: val > 0 ? 1 : 0.4,
                }} />
                <span style={{ fontFamily: UI, fontSize: 11, color: "var(--cb-ink-light)", fontWeight: 500 }}>{WEEK_LABELS[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent payouts table */}
      <div>
        <h2 style={{ fontFamily: UI, fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 14, marginTop: 0 }}>
          Recent payouts
        </h2>
        <div style={{ background: "var(--cb-warm-white)", border: "1px solid var(--cb-border)", borderRadius: 4, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--cb-border)" }}>
                {["Date", "Amount", "Method", "Reference"].map((h) => (
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
              {MOCK_PAYOUTS.map((p, i) => (
                <tr key={p.ref} style={{ borderBottom: i < MOCK_PAYOUTS.length - 1 ? "1px solid var(--cb-border)" : "none" }}>
                  <td style={{ padding: "13px 16px", fontFamily: UI, fontSize: 13, color: "var(--cb-ink-light)" }}>{formatDate(p.date)}</td>
                  <td style={{ padding: "13px 16px", fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: "var(--cb-ink)" }}>{p.amount}</td>
                  <td style={{ padding: "13px 16px", fontFamily: BODY, fontSize: 13, color: "var(--cb-ink-light)" }}>{p.method}</td>
                  <td style={{ padding: "13px 16px", fontFamily: UI, fontSize: 12, color: "var(--cb-ink-light)", opacity: 0.7 }}>{p.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [bio, setBio] = useState("Experienced Registered Nurse with over 8 years in home healthcare across Lusaka. Specialising in post-operative care, wound management, and elderly support.");
  const [specialisations, setSpecialisations] = useState("Post-operative care, Wound management, Elderly support, IV therapy");
  const [location, setLocation] = useState("Lusaka, Zambia");
  const [shiftRate, setShiftRate] = useState("K540");
  const [hourlyRate, setHourlyRate] = useState("K68");

  function handleSave() {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  }

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

  const readFieldStyle: React.CSSProperties = {
    fontFamily: BODY,
    fontSize: 14,
    color: "var(--cb-ink)",
    padding: "10px 0",
    borderBottom: "1px solid var(--cb-border)",
    lineHeight: 1.6,
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: "var(--cb-ink)", margin: 0, letterSpacing: "-0.01em" }}>
          Professional Profile
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
        <div style={{ padding: "12px 16px", background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: 2, fontFamily: UI, fontSize: 13, color: "#14532d", marginBottom: 20 }}>
          Profile updated successfully.
        </div>
      )}

      {/* Avatar block */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32, padding: "20px 24px", background: "var(--cb-warm-white)", border: "1px solid var(--cb-border)", borderRadius: 4 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "var(--cb-sage-light)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: SERIF, fontSize: 28, color: "var(--cb-sage)", flexShrink: 0,
        }}>
          {(user?.firstName ?? "P").charAt(0)}
        </div>
        <div>
          <div style={{ fontFamily: BODY, fontSize: 18, fontWeight: 600, color: "var(--cb-ink)" }}>
            {user?.firstName} {user?.lastName}
          </div>
          <div style={{ fontFamily: UI, fontSize: 12, color: "var(--cb-ink-light)", marginTop: 3 }}>Registered Nurse</div>
        </div>
      </div>

      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={labelStyle}>Bio</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <div>
            <label style={labelStyle}>Specialisations (comma-separated)</label>
            <input value={specialisations} onChange={(e) => setSpecialisations(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Shift rate</label>
              <input value={shiftRate} onChange={(e) => setShiftRate(e.target.value)} style={inputStyle} placeholder="e.g. K540" />
            </div>
            <div>
              <label style={labelStyle}>Hourly rate</label>
              <input value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} style={inputStyle} placeholder="e.g. K68" />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
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
        <>
          {[
            { label: "Bio", value: bio },
            { label: "Specialisations", value: specialisations },
            { label: "Location", value: location },
            { label: "Shift rate", value: shiftRate },
            { label: "Hourly rate", value: hourlyRate },
          ].map((f) => (
            <div key={f.label}>
              <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginTop: 18, marginBottom: 4 }}>
                {f.label}
              </div>
              <div style={readFieldStyle}>{f.value}</div>
            </div>
          ))}
        </>
      )}

      {/* Verification documents section */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontFamily: UI, fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 16, marginTop: 0 }}>
          Verification documents
        </h2>
        <div style={{
          background: "var(--cb-warm-white)",
          border: "1px solid var(--cb-border)",
          borderRadius: 4,
          overflow: "hidden",
        }}>
          {[
            { label: "License number",  value: "NMCZ/RN/2019/04821" },
            { label: "License body",    value: "Nursing and Midwifery Council of Zambia (NMCZ)" },
            { label: "Cert expiry",     value: "31 Dec 2026" },
          ].map((d, i, arr) => (
            <div key={d.label} style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "14px 20px",
              borderBottom: i < arr.length - 1 ? "1px solid var(--cb-border)" : "none",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 3 }}>{d.label}</div>
                <div style={{ fontFamily: BODY, fontSize: 14, color: "var(--cb-ink)" }}>{d.value}</div>
              </div>
              <span style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                fontFamily: UI,
                letterSpacing: "0.07em",
                background: "rgba(22,163,74,0.08)",
                color: "#14532d",
                border: "1px solid rgba(22,163,74,0.25)",
              }}>
                Verified
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

type ProTab = "overview" | "bookings" | "availability" | "earnings" | "profile";

const PRO_NAV: { key: ProTab; label: string; icon: string }[] = [
  { key: "overview",     label: "Overview",     icon: "⊞" },
  { key: "bookings",     label: "My Bookings",  icon: "📋" },
  { key: "availability", label: "Availability", icon: "📅" },
  { key: "earnings",     label: "Earnings",     icon: "◈" },
  { key: "profile",      label: "Profile",      icon: "◎" },
];

function Sidebar({ activeTab, onTabChange, onLogout, mobileOpen, onClose }: {
  activeTab: ProTab;
  onTabChange: (t: ProTab) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {mobileOpen && (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 199 }} />
      )}
      <aside style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 240,
        height: "100vh",
        background: "var(--cb-warm-white)",
        borderRight: "1px solid var(--cb-border)",
        display: "flex",
        flexDirection: "column",
        zIndex: 200,
        transition: "transform 0.25s",
      }} className={`cb-pro-sidebar${mobileOpen ? " cb-pro-sidebar--open" : ""}`}>
        {/* Logo */}
        <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid var(--cb-border)" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, letterSpacing: "0.02em", color: "var(--cb-ink)" }}>
              Care<span style={{ color: "var(--cb-sage)" }}>Bridge</span>
            </div>
            <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cb-ink-light)", opacity: 0.6, marginTop: 2 }}>
              Professional Portal
            </div>
          </Link>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {PRO_NAV.map((item) => (
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

export default function ProfessionalDashboardPage() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<ProTab>("overview");
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

      <div style={{ marginLeft: 240 }} className="cb-pro-main">
        {/* Mobile top bar */}
        <div className="cb-pro-topbar" style={{ display: "none", alignItems: "center", gap: 14, padding: "0 20px", height: 56, background: "var(--cb-warm-white)", borderBottom: "1px solid var(--cb-border)", position: "sticky", top: 0, zIndex: 100 }}>
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

        <main style={{ padding: "48px 48px", maxWidth: 900, margin: "0 auto" }} className="cb-pro-content">
          {activeTab === "overview"     && <OverviewTab bookings={MOCK_INCOMING} />}
          {activeTab === "bookings"     && <MyBookingsTab />}
          {activeTab === "availability" && <AvailabilityTab />}
          {activeTab === "earnings"     && <EarningsTab />}
          {activeTab === "profile"      && <ProfileTab />}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cb-pro-main { margin-left: 0 !important; }
          .cb-pro-topbar { display: flex !important; }
          .cb-pro-content { padding: 28px 20px !important; }
          .cb-pro-sidebar { transform: translateX(-100%); }
          .cb-pro-sidebar--open { transform: translateX(0) !important; }
          .cb-pro-stat-grid { grid-template-columns: 1fr 1fr !important; }
          .cb-earn-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .cb-pro-sidebar { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
