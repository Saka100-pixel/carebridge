import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

const SERIF = "'Cormorant Garamond', serif";
const BODY = "'Raleway', sans-serif";
const UI = "'DM Sans', sans-serif";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Professional {
  id: number;
  name: string;
  discipline: string;
  institution: string;
  badge: string;
  badgeType: "NMCZ" | "HPCZ" | "Certified";
  rate: string;
  rateNum: number;
  rating: number;
  bookings: number;
  location: string;
  available: boolean;
  urgent: boolean;
  verificationStatus: "approved";
}

// ── Mock data (mirrors ProfessionalsDirectoryPage) ─────────────────────────────

const PROFESSIONALS: Professional[] = [
  { id: 1,  name: "Robert Ngoma",       discipline: "Registered Nurse",         institution: "UTH Lusaka",             badge: "NMCZ Verified",  badgeType: "NMCZ",      rate: "K450 / shift", rateNum: 450, rating: 4.9, bookings: 120, location: "Kabulonga",  available: true,  urgent: true,  verificationStatus: "approved" },
  { id: 2,  name: "Mutinta Banda",      discipline: "Midwife",                  institution: "Women & Child Hospital", badge: "NMCZ Verified",  badgeType: "NMCZ",      rate: "K380 / shift", rateNum: 380, rating: 4.8, bookings: 89,  location: "Woodlands",  available: true,  urgent: false, verificationStatus: "approved" },
  { id: 3,  name: "Chanda Mwale",       discipline: "Physiotherapist",          institution: "HPCZ",                   badge: "HPCZ Certified", badgeType: "HPCZ",      rate: "K500 / shift", rateNum: 500, rating: 4.7, bookings: 64,  location: "Roma",       available: false, urgent: false, verificationStatus: "approved" },
  { id: 4,  name: "Namukolo Phiri",     discipline: "Mental Health Counsellor", institution: "HPCZ",                   badge: "HPCZ Certified", badgeType: "HPCZ",      rate: "K420 / shift", rateNum: 420, rating: 4.9, bookings: 45,  location: "Ibex Hill",  available: true,  urgent: false, verificationStatus: "approved" },
  { id: 5,  name: "Joseph Tembo",       discipline: "Certified Caregiver",      institution: "Certified",              badge: "Certified",      badgeType: "Certified", rate: "K280 / shift", rateNum: 280, rating: 4.6, bookings: 156, location: "Rhodes Park", available: true,  urgent: true,  verificationStatus: "approved" },
  { id: 6,  name: "Grace Musonda",      discipline: "Registered Nurse",         institution: "UTH",                    badge: "NMCZ Verified",  badgeType: "NMCZ",      rate: "K430 / shift", rateNum: 430, rating: 4.8, bookings: 98,  location: "Chelston",   available: false, urgent: false, verificationStatus: "approved" },
  { id: 7,  name: "David Zulu",         discipline: "Physiotherapist",          institution: "HPCZ",                   badge: "HPCZ Certified", badgeType: "HPCZ",      rate: "K480 / shift", rateNum: 480, rating: 4.7, bookings: 77,  location: "Kabulonga",  available: true,  urgent: true,  verificationStatus: "approved" },
  { id: 8,  name: "Esther Nkole",       discipline: "Midwife",                  institution: "NMCZ",                   badge: "NMCZ Verified",  badgeType: "NMCZ",      rate: "K360 / shift", rateNum: 360, rating: 4.5, bookings: 52,  location: "Woodlands",  available: true,  urgent: false, verificationStatus: "approved" },
  { id: 9,  name: "Peter Mumba",        discipline: "Mental Health Counsellor", institution: "HPCZ",                   badge: "HPCZ Certified", badgeType: "HPCZ",      rate: "K400 / shift", rateNum: 400, rating: 4.8, bookings: 38,  location: "Roma",       available: false, urgent: false, verificationStatus: "approved" },
  { id: 10, name: "Alice Chirwa",       discipline: "Certified Caregiver",      institution: "Certified",              badge: "Certified",      badgeType: "Certified", rate: "K260 / shift", rateNum: 260, rating: 4.9, bookings: 201, location: "Ibex Hill",  available: true,  urgent: false, verificationStatus: "approved" },
];

const PRO_LOOKUP: Record<number, Professional> = Object.fromEntries(
  PROFESSIONALS.map((p) => [p.id, p])
);

const LOCATION_AREAS = ["Kabulonga", "Woodlands", "Roma", "Ibex Hill", "Rhodes Park", "Chelston", "Other"];

type ShiftKey = "8h" | "12h" | "24h";

const SHIFTS: { key: ShiftKey; label: string; multiplier: number; hours: string }[] = [
  { key: "8h",  label: "8-hour shift",  multiplier: 1,   hours: "8h"  },
  { key: "12h", label: "12-hour shift", multiplier: 1.5, hours: "12h" },
  { key: "24h", label: "24-hour shift", multiplier: 2.5, hours: "24h" },
];

type PaymentMethod = "mtn" | "airtel" | "zamtel" | "card" | null;

// ── Helper ─────────────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function genRef() {
  return "REF-" + Math.floor(100000 + Math.random() * 900000);
}

function badgeColors(badgeType: Professional["badgeType"]): { bg: string; color: string; dot: string } {
  if (badgeType === "NMCZ") return { bg: "rgba(61,107,79,0.10)", color: "var(--cb-sage)",   dot: "var(--cb-sage)" };
  if (badgeType === "HPCZ") return { bg: "rgba(61,107,79,0.10)", color: "var(--cb-sage)",   dot: "var(--cb-sage)" };
  return                           { bg: "rgba(100,100,200,0.08)", color: "#4b5bc8",           dot: "#4b5bc8" };
}

// ── Sub-components ──────────────────────────────────────────────────────────────

function Nav({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  const [, setLocation] = useLocation();
  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 200,
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
        {/* Logo */}
        <button
          onClick={() => setLocation("/")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
        >
          <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, letterSpacing: "0.02em", color: "var(--cb-ink)" }}>
            Care<span style={{ color: "var(--cb-sage)" }}>Bridge</span>
          </div>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cb-ink-light)", opacity: 0.6, marginTop: -2 }}>
            Zambia · Verified Home Healthcare
          </div>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div className="cb-nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button onClick={() => setLocation("/")}          style={navLinkStyle}>Home</button>
            <button onClick={() => setLocation("/professionals")} style={navLinkStyle}>Find Care</button>
            <button onClick={() => setLocation("/login")}     style={navLinkStyle}>Log in</button>
          </div>
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="cb-hamburger"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 5 }}
            aria-label="Toggle menu"
          >
            <span style={{ display: "block", width: 22, height: 1.5, background: "var(--cb-ink)", transition: "0.2s", transform: menuOpen ? "rotate(45deg) translate(3px,3px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 1.5, background: "var(--cb-ink)", opacity: menuOpen ? 0 : 1, transition: "0.2s" }} />
            <span style={{ display: "block", width: 22, height: 1.5, background: "var(--cb-ink)", transition: "0.2s", transform: menuOpen ? "rotate(-45deg) translate(3px,-3px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 64, left: 0, right: 0,
            background: "var(--cb-warm-white)",
            borderBottom: "1px solid var(--cb-border)",
            padding: "24px 32px",
            zIndex: 190,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {[
            { label: "Home",         href: "/"             },
            { label: "Find Care",    href: "/professionals" },
            { label: "Log in",       href: "/login"         },
          ].map(({ label, href }) => (
            <button
              key={href}
              onClick={() => { setMenuOpen(false); setLocation(href); }}
              style={{ ...navLinkStyle, background: "none", border: "none", textAlign: "left", padding: 0, cursor: "pointer" }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

const navLinkStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 400,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--cb-ink-light)",
  textDecoration: "none",
  fontFamily: UI,
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
};

// Step progress indicator
function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Care details" },
    { n: 2, label: "Payment"      },
    { n: 3, label: "Confirmed"    },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 40 }}>
      {steps.map((s, i) => {
        const done   = s.n < current;
        const active = s.n === current;
        return (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 32, height: 32,
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: UI,
                  background: done ? "var(--cb-sage)" : active ? "var(--cb-ink)" : "var(--cb-warm-white)",
                  color: done || active ? "#fff" : "var(--cb-ink-light)",
                  border: done || active ? "none" : "1.5px solid var(--cb-border-strong)",
                  transition: "all 0.25s",
                  flexShrink: 0,
                }}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : s.n}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: UI,
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--cb-ink)" : done ? "var(--cb-sage)" : "var(--cb-ink-light)",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1.5,
                  background: done ? "var(--cb-sage)" : "var(--cb-border)",
                  marginBottom: 22,
                  marginLeft: 8,
                  marginRight: 8,
                  transition: "background 0.25s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Professional summary card (sidebar)
function ProSummaryCard({ pro, shiftKey, rateNum }: { pro: Professional; shiftKey: ShiftKey; rateNum: number }) {
  const bc = badgeColors(pro.badgeType);
  const shiftMultiplier = SHIFTS.find((s) => s.key === shiftKey)?.multiplier ?? 1;
  const shiftLabel      = SHIFTS.find((s) => s.key === shiftKey)?.label ?? "8-hour shift";
  const total           = Math.round(rateNum * shiftMultiplier);

  return (
    <div
      style={{
        background: "var(--cb-warm-white)",
        border: "1px solid var(--cb-border)",
        borderRadius: 4,
        overflow: "hidden",
        position: "sticky",
        top: 88,
      }}
    >
      <img
        src={`https://i.pravatar.cc/400?u=${pro.id}`}
        alt={pro.name}
        style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
      />
      <div style={{ padding: "20px 22px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-sage)", marginBottom: 4, fontFamily: UI }}>
          {pro.discipline}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 400, color: "var(--cb-ink)", marginBottom: 6, lineHeight: 1.2 }}>
          {pro.name}
        </div>
        <div style={{ fontSize: 12, color: "var(--cb-ink-light)", marginBottom: 12, fontFamily: BODY }}>
          {pro.institution}
        </div>

        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: bc.bg,
            borderRadius: 2,
            padding: "4px 10px",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: bc.color,
            fontFamily: UI,
            marginBottom: 16,
          }}
        >
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: bc.dot }} />
          {pro.badge}
        </div>

        <div style={{ borderTop: "1px solid var(--cb-border)", paddingTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--cb-ink-light)", fontFamily: BODY }}>Base rate</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--cb-ink)", fontFamily: UI }}>K{rateNum}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--cb-ink-light)", fontFamily: BODY }}>Shift</span>
            <span style={{ fontSize: 13, color: "var(--cb-ink)", fontFamily: UI }}>{shiftLabel}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--cb-border)", marginTop: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: UI, color: "var(--cb-ink)" }}>Subtotal</span>
            <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: "var(--cb-ink)" }}>K{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 1: Care Details ────────────────────────────────────────────────────────

interface Step1Data {
  patientName: string;
  address: string;
  locationArea: string;
  shiftKey: ShiftKey;
  date: string;
  urgent: boolean;
  notes: string;
}

function Step1({
  pro,
  data,
  setData,
  onContinue,
}: {
  pro: Professional;
  data: Step1Data;
  setData: (d: Step1Data) => void;
  onContinue: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof Step1Data, string>>>({});

  function validate() {
    const e: typeof errors = {};
    if (!data.patientName.trim()) e.patientName = "Patient name is required.";
    if (!data.address.trim())     e.address     = "Address is required.";
    if (!data.date)               e.date        = "Please select a date.";
    return e;
  }

  function handleContinue() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onContinue();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    fontSize: 14,
    fontFamily: BODY,
    color: "var(--cb-ink)",
    background: "var(--cb-warm-white)",
    border: "1px solid var(--cb-border-strong)",
    borderRadius: 2,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--cb-ink)",
    fontFamily: UI,
    marginBottom: 8,
  };

  const fieldStyle: React.CSSProperties = { marginBottom: 22 };

  const errorStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#c0392b",
    fontFamily: BODY,
    marginTop: 4,
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none",
    WebkitAppearance: "none",
    paddingRight: 36,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "12px",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40, alignItems: "start" }} className="cb-booking-grid">
      {/* Form */}
      <div>
        <h2 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 300, color: "var(--cb-ink)", marginBottom: 6, lineHeight: 1.1 }}>
          Who needs care?
        </h2>
        <p style={{ fontSize: 14, color: "var(--cb-ink-light)", fontFamily: BODY, marginBottom: 32, lineHeight: 1.7 }}>
          Tell us about the person receiving care and your preferences.
        </p>

        {/* Patient name */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Patient name</label>
          <p style={{ fontSize: 12, color: "var(--cb-ink-light)", fontFamily: BODY, marginBottom: 8, marginTop: -4 }}>
            Who should the professional ask for?
          </p>
          <input
            type="text"
            value={data.patientName}
            onChange={(e) => { setData({ ...data, patientName: e.target.value }); setErrors({ ...errors, patientName: undefined }); }}
            placeholder="e.g. Florence Mwamba"
            style={{ ...inputStyle, borderColor: errors.patientName ? "#c0392b" : "var(--cb-border-strong)" }}
          />
          {errors.patientName && <div style={errorStyle}>{errors.patientName}</div>}
        </div>

        {/* Address */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Patient address</label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => { setData({ ...data, address: e.target.value }); setErrors({ ...errors, address: undefined }); }}
            placeholder="Full address in Lusaka"
            style={{ ...inputStyle, borderColor: errors.address ? "#c0392b" : "var(--cb-border-strong)" }}
          />
          {errors.address && <div style={errorStyle}>{errors.address}</div>}
        </div>

        {/* Location area */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Location area</label>
          <div style={{ position: "relative" }}>
            <select
              value={data.locationArea}
              onChange={(e) => setData({ ...data, locationArea: e.target.value })}
              style={selectStyle}
              aria-label="Location area"
            >
              {LOCATION_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Shift type */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Shift type</label>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {SHIFTS.map((s) => {
              const price = Math.round(pro.rateNum * s.multiplier);
              const selected = data.shiftKey === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setData({ ...data, shiftKey: s.key })}
                  style={{
                    flex: "1 1 120px",
                    padding: "14px 16px",
                    border: `2px solid ${selected ? "var(--cb-sage)" : "var(--cb-border-strong)"}`,
                    borderRadius: 4,
                    background: selected ? "var(--cb-sage-light)" : "var(--cb-warm-white)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: selected ? "var(--cb-sage)" : "var(--cb-ink-light)", fontFamily: UI, marginBottom: 4 }}>
                    {s.hours}
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: "var(--cb-ink)", lineHeight: 1 }}>
                    K{price}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--cb-ink-light)", fontFamily: BODY, marginTop: 2 }}>
                    {s.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred date */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Preferred date</label>
          <input
            type="date"
            value={data.date}
            min={todayStr()}
            onChange={(e) => { setData({ ...data, date: e.target.value }); setErrors({ ...errors, date: undefined }); }}
            style={{ ...inputStyle, borderColor: errors.date ? "#c0392b" : "var(--cb-border-strong)" }}
          />
          {errors.date && <div style={errorStyle}>{errors.date}</div>}
        </div>

        {/* Urgent */}
        <div style={{ ...fieldStyle, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <input
            id="urgent"
            type="checkbox"
            checked={data.urgent}
            onChange={(e) => setData({ ...data, urgent: e.target.checked })}
            style={{ width: 16, height: 16, marginTop: 2, accentColor: "var(--cb-sage)", cursor: "pointer" }}
          />
          <label htmlFor="urgent" style={{ cursor: "pointer" }}>
            <div style={{ fontSize: 13, fontWeight: 600, fontFamily: UI, color: "var(--cb-ink)", marginBottom: 2 }}>Is this urgent?</div>
            <div style={{ fontSize: 12, color: "var(--cb-ink-light)", fontFamily: BODY, lineHeight: 1.5 }}>
              We will prioritise your booking and aim to match you within 60 minutes.
            </div>
          </label>
        </div>

        {/* Notes */}
        <div style={fieldStyle}>
          <label style={labelStyle}>
            Special notes / instructions
            <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: "none", fontSize: 11, color: "var(--cb-ink-light)", marginLeft: 6 }}>(optional)</span>
          </label>
          <textarea
            value={data.notes}
            onChange={(e) => setData({ ...data, notes: e.target.value })}
            placeholder="e.g. gate code, patient has mobility limitations, prefer a female professional…"
            rows={4}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
          />
        </div>

        <button
          onClick={handleContinue}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "var(--cb-sage)",
            color: "#fff",
            border: "none",
            borderRadius: 2,
            padding: "14px 32px",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: UI,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--cb-sage-mid)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--cb-sage)"; }}
        >
          Continue
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7H11M7 3L11 7L7 11" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div>
        <ProSummaryCard pro={pro} shiftKey={data.shiftKey} rateNum={pro.rateNum} />
      </div>
    </div>
  );
}

// ── Step 2: Payment ──────────────────────────────────────────────────────────────

function Step2({
  pro,
  step1,
  onConfirm,
  onBack,
}: {
  pro: Professional;
  step1: Step1Data;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const [payMethod, setPayMethod] = useState<PaymentMethod>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [cardNumber, setCardNumber]     = useState("");
  const [cardExpiry, setCardExpiry]     = useState("");
  const [cardCvv, setCardCvv]           = useState("");
  const [cardName, setCardName]         = useState("");
  const [payError, setPayError]         = useState("");

  const shift        = SHIFTS.find((s) => s.key === step1.shiftKey)!;
  const baseAmount   = Math.round(pro.rateNum * shift.multiplier);
  const platformFee  = Math.round(baseAmount * 0.2);
  const total        = baseAmount + platformFee;

  const methods: {
    key: PaymentMethod;
    label: string;
    sub: string;
    accent: string;
    textColor: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "mtn",
      label: "MTN Mobile Money",
      sub: "Pay instantly with MTN MoMo",
      accent: "#FFC300",
      textColor: "#7a4800",
      icon: (
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFC300", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, fontFamily: UI, color: "#7a4800", flexShrink: 0 }}>M</div>
      ),
    },
    {
      key: "airtel",
      label: "Airtel Money",
      sub: "Pay instantly with Airtel Money",
      accent: "#E4003A",
      textColor: "#fff",
      icon: (
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E4003A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, fontFamily: UI, color: "#fff", flexShrink: 0 }}>A</div>
      ),
    },
    {
      key: "zamtel",
      label: "Zamtel Kwacha",
      sub: "Pay with Zamtel mobile wallet",
      accent: "#005E2F",
      textColor: "#fff",
      icon: (
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#005E2F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, fontFamily: UI, color: "#fff", flexShrink: 0 }}>Z</div>
      ),
    },
    {
      key: "card",
      label: "Debit / Credit Card",
      sub: "Visa, Mastercard accepted",
      accent: "#1a1a18",
      textColor: "#fff",
      icon: (
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1a1a18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <rect x="0.5" y="0.5" width="19" height="13" rx="1.5" stroke="rgba(255,255,255,0.4)" />
            <rect y="3" width="20" height="3" fill="rgba(255,255,255,0.15)" />
            <rect x="2" y="9" width="5" height="1.5" rx="0.75" fill="rgba(255,255,255,0.5)" />
          </svg>
        </div>
      ),
    },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    fontSize: 14,
    fontFamily: BODY,
    color: "var(--cb-ink)",
    background: "var(--cb-warm-white)",
    border: "1px solid var(--cb-border-strong)",
    borderRadius: 2,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--cb-ink)",
    fontFamily: UI,
    marginBottom: 8,
  };

  function handleConfirm() {
    if (!payMethod) { setPayError("Please select a payment method."); return; }
    if ((payMethod === "mtn" || payMethod === "airtel" || payMethod === "zamtel") && !mobileNumber.trim()) {
      setPayError("Please enter your mobile number."); return;
    }
    if (payMethod === "card") {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim() || !cardName.trim()) {
        setPayError("Please fill in all card details."); return;
      }
    }
    setPayError("");
    onConfirm();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40, alignItems: "start" }} className="cb-booking-grid">
      {/* Form */}
      <div>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: UI, color: "var(--cb-ink-light)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 24 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 7H3M7 11L3 7L7 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <h2 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 300, color: "var(--cb-ink)", marginBottom: 6, lineHeight: 1.1 }}>
          How would you like to pay?
        </h2>
        <p style={{ fontSize: 14, color: "var(--cb-ink-light)", fontFamily: BODY, marginBottom: 32, lineHeight: 1.7 }}>
          Choose your preferred payment method. Funds are held in escrow until your shift is completed.
        </p>

        {/* Order summary */}
        <div
          style={{
            background: "var(--cb-warm-white)",
            border: "1px solid var(--cb-border)",
            borderRadius: 4,
            padding: "20px 24px",
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-sage)", fontFamily: UI, marginBottom: 16 }}>
            Order summary
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ fontSize: 13.5, color: "var(--cb-ink)", fontFamily: BODY, paddingBottom: 10 }}>
                  {pro.name} — {shift.label}
                </td>
                <td style={{ fontSize: 13.5, fontWeight: 600, color: "var(--cb-ink)", fontFamily: UI, textAlign: "right", paddingBottom: 10 }}>
                  K{baseAmount}
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: 13, color: "var(--cb-ink-light)", fontFamily: BODY, paddingBottom: 10 }}>
                  Platform fee (20%)
                </td>
                <td style={{ fontSize: 13, color: "var(--cb-ink-light)", fontFamily: UI, textAlign: "right", paddingBottom: 10 }}>
                  K{platformFee}
                </td>
              </tr>
              <tr style={{ borderTop: "1px solid var(--cb-border)" }}>
                <td style={{ fontSize: 14, fontWeight: 700, color: "var(--cb-ink)", fontFamily: UI, paddingTop: 12 }}>
                  Total
                </td>
                <td style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "var(--cb-ink)", textAlign: "right", paddingTop: 10 }}>
                  K{total}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment method cards */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-ink)", fontFamily: UI, marginBottom: 14 }}>
          Payment method
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {methods.map((m) => {
            const selected = payMethod === m.key;
            return (
              <button
                key={m.key!}
                onClick={() => { setPayMethod(m.key); setPayError(""); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 18px",
                  background: selected ? "var(--cb-warm-white)" : "var(--cb-warm-white)",
                  border: `2px solid ${selected ? m.accent : "var(--cb-border)"}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.15s",
                  width: "100%",
                }}
              >
                {m.icon}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--cb-ink)", fontFamily: UI, marginBottom: 2 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--cb-ink-light)", fontFamily: BODY }}>
                    {m.sub}
                  </div>
                </div>
                <div
                  style={{
                    width: 18, height: 18,
                    borderRadius: "50%",
                    border: `2px solid ${selected ? m.accent : "var(--cb-border-strong)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }}
                >
                  {selected && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.accent }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Contextual input */}
        {(payMethod === "mtn" || payMethod === "airtel" || payMethod === "zamtel") && (
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>
              {payMethod === "mtn"    ? "MTN mobile number"    :
               payMethod === "airtel" ? "Airtel mobile number" :
               "Zamtel mobile number"}
            </label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => { setMobileNumber(e.target.value); setPayError(""); }}
              placeholder="+260 9X XXX XXXX"
              style={inputStyle}
            />
          </div>
        )}

        {payMethod === "card" && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Cardholder name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => { setCardName(e.target.value); setPayError(""); }}
                placeholder="As it appears on your card"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Card number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => { setCardNumber(e.target.value); setPayError(""); }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                style={inputStyle}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Expiry</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => { setCardExpiry(e.target.value); setPayError(""); }}
                  placeholder="MM / YY"
                  maxLength={7}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>CVV</label>
                <input
                  type="text"
                  value={cardCvv}
                  onChange={(e) => { setCardCvv(e.target.value); setPayError(""); }}
                  placeholder="•••"
                  maxLength={4}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {/* Trust note */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            background: "var(--cb-trust-bg)",
            borderRadius: 4,
            padding: "14px 18px",
            marginBottom: 28,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M9 1.5L2.25 4.5V9C2.25 12.4125 5.19 15.6075 9 16.5C12.81 15.6075 15.75 12.4125 15.75 9V4.5L9 1.5Z" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M6 9L8 11L12 7" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", fontFamily: BODY, lineHeight: 1.65, margin: 0 }}>
            <strong style={{ color: "#fff", fontFamily: UI }}>Funds held securely.</strong>{" "}
            Payment is held in escrow and released to the professional only after your shift is completed.
          </p>
        </div>

        {payError && (
          <div style={{ fontSize: 13, color: "#c0392b", fontFamily: BODY, marginBottom: 16 }}>{payError}</div>
        )}

        <button
          onClick={handleConfirm}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "var(--cb-sage)",
            color: "#fff",
            border: "none",
            borderRadius: 2,
            padding: "14px 32px",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: UI,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--cb-sage-mid)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--cb-sage)"; }}
        >
          Confirm &amp; Pay
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7H11M7 3L11 7L7 11" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div>
        <ProSummaryCard pro={pro} shiftKey={step1.shiftKey} rateNum={pro.rateNum} />
      </div>
    </div>
  );
}

// ── Step 3: Confirmation ────────────────────────────────────────────────────────

function Step3({
  pro,
  step1,
  bookingRef,
}: {
  pro: Professional;
  step1: Step1Data;
  bookingRef: string;
}) {
  const [, setLocation] = useLocation();

  const shift      = SHIFTS.find((s) => s.key === step1.shiftKey)!;
  const baseAmount = Math.round(pro.rateNum * shift.multiplier);
  const total      = Math.round(baseAmount * 1.2);

  const nextSteps = [
    { n: 1, text: "The professional is notified of your booking immediately." },
    { n: 2, text: "They confirm availability within 2 hours." },
    { n: 3, text: "Your payment is held securely until the shift is completed." },
    { n: 4, text: "Both you and the professional leave a review after the shift." },
  ];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", padding: "20px 0 60px" }}>
      {/* Checkmark */}
      <div style={{ marginBottom: 24 }}>
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="36" cy="36" r="36" fill="var(--cb-sage-light)" />
          <circle cx="36" cy="36" r="28" fill="var(--cb-sage)" />
          <path d="M22 36L31 45L50 27" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cb-sage)", fontFamily: UI, marginBottom: 10 }}>
        Booking confirmed
      </div>
      <h2 style={{ fontFamily: SERIF, fontSize: 38, fontWeight: 300, color: "var(--cb-ink)", marginBottom: 8, lineHeight: 1.1 }}>
        You're all set!
      </h2>
      <p style={{ fontSize: 14.5, color: "var(--cb-ink-light)", fontFamily: BODY, lineHeight: 1.75, marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
        Your booking with <strong style={{ color: "var(--cb-ink)", fontFamily: UI }}>{pro.name}</strong> has been submitted successfully.
      </p>

      {/* Booking ref badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "var(--cb-warm-white)",
          border: "1px solid var(--cb-border)",
          borderRadius: 4,
          padding: "14px 24px",
          marginBottom: 40,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="var(--cb-sage)" strokeWidth="1.5" />
          <path d="M5 5H11M5 8H11M5 11H8" stroke="var(--cb-sage)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cb-ink-light)", fontFamily: UI }}>
            Booking reference
          </div>
          <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 16, color: "var(--cb-ink)", letterSpacing: "0.04em" }}>
            {bookingRef}
          </div>
        </div>
      </div>

      {/* Booking summary */}
      <div
        style={{
          background: "var(--cb-warm-white)",
          border: "1px solid var(--cb-border)",
          borderRadius: 4,
          padding: "24px",
          marginBottom: 36,
          textAlign: "left",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-sage)", fontFamily: UI, marginBottom: 16 }}>
          Booking summary
        </div>
        {[
          { label: "Professional",   value: `${pro.name} · ${pro.discipline}` },
          { label: "Patient",        value: step1.patientName || "—"           },
          { label: "Address",        value: step1.address || "—"               },
          { label: "Area",           value: step1.locationArea                 },
          { label: "Shift",          value: shift.label                        },
          { label: "Date",           value: step1.date                         },
          { label: "Urgent",         value: step1.urgent ? "Yes" : "No"        },
          { label: "Total charged",  value: `K${total}`                        },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
              paddingBottom: 10,
              marginBottom: 10,
              borderBottom: "1px solid var(--cb-border)",
            }}
          >
            <span style={{ fontSize: 12.5, color: "var(--cb-ink-light)", fontFamily: BODY }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--cb-ink)", fontFamily: UI, textAlign: "right" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* What happens next */}
      <div
        style={{
          background: "var(--cb-warm-white)",
          border: "1px solid var(--cb-border)",
          borderRadius: 4,
          padding: "24px",
          marginBottom: 40,
          textAlign: "left",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-sage)", fontFamily: UI, marginBottom: 18 }}>
          What happens next
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {nextSteps.map((s) => (
            <div key={s.n} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  width: 26, height: 26,
                  borderRadius: "50%",
                  background: "var(--cb-sage-light)",
                  border: "1.5px solid rgba(61,107,79,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--cb-sage)",
                  fontFamily: UI,
                }}
              >
                {s.n}
              </div>
              <p style={{ fontSize: 13.5, color: "var(--cb-ink)", fontFamily: BODY, lineHeight: 1.6, margin: 0, paddingTop: 2 }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => setLocation("/dashboard/patient")}
          style={{
            background: "var(--cb-sage)",
            color: "#fff",
            border: "none",
            borderRadius: 2,
            padding: "14px 28px",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: UI,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--cb-sage-mid)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--cb-sage)"; }}
        >
          View my bookings
        </button>
        <button
          onClick={() => setLocation("/professionals")}
          style={{
            background: "var(--cb-warm-white)",
            color: "var(--cb-ink)",
            border: "1.5px solid var(--cb-border-strong)",
            borderRadius: 2,
            padding: "14px 28px",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: UI,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--cb-sage)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--cb-sage)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--cb-border-strong)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--cb-ink)"; }}
        >
          Book another professional
        </button>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep]         = useState<1 | 2 | 3>(1);
  const [bookingRef]            = useState(genRef);

  const proId = parseInt(id ?? "0", 10);
  const pro   = PRO_LOOKUP[proId] ?? null;

  const [step1Data, setStep1Data] = useState<Step1Data>({
    patientName:  "",
    address:      "",
    locationArea: "Kabulonga",
    shiftKey:     "8h",
    date:         "",
    urgent:       false,
    notes:        "",
  });

  // Loading skeleton
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cb-cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 13, color: "var(--cb-ink-light)", fontFamily: UI, letterSpacing: "0.06em" }}>Loading…</div>
      </div>
    );
  }

  // Not logged in — sign-in gate
  if (!user) {
    const redirectUrl = `/login?redirect=/book/${proId}`;
    return (
      <div style={{ minHeight: "100vh", background: "var(--cb-cream)", color: "var(--cb-ink)", fontFamily: BODY }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div style={{ paddingTop: 64, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)" }}>
          <div
            style={{
              background: "var(--cb-warm-white)",
              border: "1px solid var(--cb-border)",
              borderRadius: 4,
              padding: "52px 48px",
              maxWidth: 440,
              width: "100%",
              margin: "0 24px",
              textAlign: "center",
            }}
          >
            {/* Lock icon */}
            <div style={{ marginBottom: 22 }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="var(--cb-sage-light)" />
                <rect x="15" y="22" width="18" height="13" rx="2" stroke="var(--cb-sage)" strokeWidth="1.8" />
                <path d="M18 22V17C18 14.2 19.8 12 24 12C28.2 12 30 14.2 30 17V22" stroke="var(--cb-sage)" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="24" cy="29" r="2" fill="var(--cb-sage)" />
              </svg>
            </div>

            <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 300, color: "var(--cb-ink)", marginBottom: 10, lineHeight: 1.15 }}>
              Sign in to book
            </h2>
            <p style={{ fontSize: 14, color: "var(--cb-ink-light)", fontFamily: BODY, lineHeight: 1.75, marginBottom: 32 }}>
              You need to be signed in to book a healthcare professional. It only takes a moment.
            </p>

            {pro && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "var(--cb-cream)",
                  border: "1px solid var(--cb-border)",
                  borderRadius: 4,
                  padding: "14px 16px",
                  marginBottom: 28,
                  textAlign: "left",
                }}
              >
                <img
                  src={`https://i.pravatar.cc/80?u=${pro.id}`}
                  alt={pro.name}
                  style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--cb-ink)", fontFamily: UI }}>{pro.name}</div>
                  <div style={{ fontSize: 12, color: "var(--cb-ink-light)", fontFamily: BODY }}>{pro.discipline} · {pro.rate}</div>
                </div>
              </div>
            )}

            <button
              onClick={() => setLocation(redirectUrl)}
              style={{
                display: "block",
                width: "100%",
                background: "var(--cb-sage)",
                color: "#fff",
                border: "none",
                borderRadius: 2,
                padding: "14px 28px",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: UI,
                marginBottom: 12,
              }}
            >
              Sign in to continue
            </button>
            <button
              onClick={() => setLocation("/register")}
              style={{
                display: "block",
                width: "100%",
                background: "none",
                color: "var(--cb-ink-light)",
                border: "1.5px solid var(--cb-border-strong)",
                borderRadius: 2,
                padding: "13px 28px",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: UI,
              }}
            >
              Create an account
            </button>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) { .cb-nav-links-desktop { display: none !important; } }
          @media (min-width: 769px) { .cb-hamburger { display: none !important; } }
        `}</style>
      </div>
    );
  }

  // Professional not found
  if (!pro) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cb-cream)", color: "var(--cb-ink)", fontFamily: BODY }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div style={{ paddingTop: 64, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", textAlign: "center", padding: "80px 32px" }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 300, color: "var(--cb-ink)", marginBottom: 12 }}>Professional not found</div>
            <p style={{ fontSize: 14, color: "var(--cb-ink-light)", fontFamily: BODY, marginBottom: 28 }}>
              We couldn't find that professional. They may have been removed or the link is incorrect.
            </p>
            <button
              onClick={() => setLocation("/professionals")}
              style={{ background: "var(--cb-sage)", color: "#fff", border: "none", borderRadius: 2, padding: "12px 28px", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: UI }}
            >
              Browse professionals
            </button>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) { .cb-nav-links-desktop { display: none !important; } }
          @media (min-width: 769px) { .cb-hamburger { display: none !important; } }
        `}</style>
      </div>
    );
  }

  // ── Main booking flow ──
  return (
    <div style={{ minHeight: "100vh", background: "var(--cb-cream)", color: "var(--cb-ink)", fontFamily: BODY }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div style={{ paddingTop: 64 }}>
        {/* Page header (steps 1 & 2 only) */}
        {step < 3 && (
          <div style={{ background: "var(--cb-warm-white)", borderBottom: "1px solid var(--cb-border)", padding: "36px 32px 28px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              {/* Breadcrumb */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: UI, color: "var(--cb-ink-light)", marginBottom: 16 }}>
                <button onClick={() => setLocation("/professionals")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--cb-ink-light)", fontSize: 12, fontFamily: UI, textDecoration: "underline" }}>
                  Professionals
                </button>
                <span style={{ opacity: 0.4 }}>›</span>
                <button onClick={() => setLocation(`/professionals/${pro.id}`)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--cb-ink-light)", fontSize: 12, fontFamily: UI, textDecoration: "underline" }}>
                  {pro.name}
                </button>
                <span style={{ opacity: 0.4 }}>›</span>
                <span style={{ color: "var(--cb-ink)" }}>Book</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cb-sage)", marginBottom: 10, fontFamily: UI }}>
                <div style={{ width: 20, height: 1, background: "var(--cb-sage)" }} />
                New booking
              </div>
              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3vw,44px)", fontWeight: 300, color: "var(--cb-ink)", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                Book <em style={{ color: "var(--cb-sage)" }}>{pro.name}</em>
              </h1>
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: step === 3 ? "60px 32px 80px" : "48px 32px 80px" }}>
          {/* Step indicator */}
          <StepIndicator current={step} />

          {step === 1 && (
            <Step1
              pro={pro}
              data={step1Data}
              setData={setStep1Data}
              onContinue={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2
              pro={pro}
              step1={step1Data}
              onConfirm={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step3
              pro={pro}
              step1={step1Data}
              bookingRef={bookingRef}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "var(--cb-trust-bg)", color: "rgba(255,255,255,0.6)", padding: "48px 32px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24, paddingBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 22 }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: "#fff" }}>
                Care<span style={{ color: "var(--cb-sage-mid)" }}>Bridge</span>
              </div>
              <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: -2, fontFamily: UI }}>
                Zambia · Verified Home Healthcare
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["NMCZ Verified", "HPCZ Certified"].map((b) => (
                <span key={b} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: UI, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 2, padding: "4px 10px" }}>{b}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: UI, flexWrap: "wrap", gap: 8 }}>
            <span style={{ opacity: 0.4 }}>© CareBridge 2025. Lusaka, Zambia.</span>
            <span style={{ opacity: 0.4 }}>NMCZ &amp; HPCZ Verified Platform</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .cb-nav-links-desktop { display: none !important; }
          .cb-booking-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .cb-hamburger { display: none !important; }
        }
      `}</style>
    </div>
  );
}
