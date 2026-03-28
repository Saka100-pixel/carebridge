import { useState } from "react";
import { Link, useLocation } from "wouter";

const SERIF = "'Cormorant Garamond', serif";
const BODY = "'Raleway', sans-serif";
const UI = "'DM Sans', sans-serif";

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

const PROFESSIONALS: Professional[] = [
  { id: 1, name: "Robert Ngoma", discipline: "Registered Nurse", institution: "UTH Lusaka", badge: "NMCZ Verified", badgeType: "NMCZ", rate: "K450 / shift", rateNum: 450, rating: 4.9, bookings: 120, location: "Kabulonga", available: true, urgent: true, verificationStatus: "approved" },
  { id: 2, name: "Mutinta Banda", discipline: "Midwife", institution: "Women & Child Hospital", badge: "NMCZ Verified", badgeType: "NMCZ", rate: "K380 / shift", rateNum: 380, rating: 4.8, bookings: 89, location: "Woodlands", available: true, urgent: false, verificationStatus: "approved" },
  { id: 3, name: "Chanda Mwale", discipline: "Physiotherapist", institution: "HPCZ", badge: "HPCZ Certified", badgeType: "HPCZ", rate: "K500 / shift", rateNum: 500, rating: 4.7, bookings: 64, location: "Roma", available: false, urgent: false, verificationStatus: "approved" },
  { id: 4, name: "Namukolo Phiri", discipline: "Mental Health Counsellor", institution: "HPCZ", badge: "HPCZ Certified", badgeType: "HPCZ", rate: "K420 / shift", rateNum: 420, rating: 4.9, bookings: 45, location: "Ibex Hill", available: true, urgent: false, verificationStatus: "approved" },
  { id: 5, name: "Joseph Tembo", discipline: "Certified Caregiver", institution: "Certified", badge: "Certified", badgeType: "Certified", rate: "K280 / shift", rateNum: 280, rating: 4.6, bookings: 156, location: "Rhodes Park", available: true, urgent: true, verificationStatus: "approved" },
  { id: 6, name: "Grace Musonda", discipline: "Registered Nurse", institution: "UTH", badge: "NMCZ Verified", badgeType: "NMCZ", rate: "K430 / shift", rateNum: 430, rating: 4.8, bookings: 98, location: "Chelston", available: false, urgent: false, verificationStatus: "approved" },
  { id: 7, name: "David Zulu", discipline: "Physiotherapist", institution: "HPCZ", badge: "HPCZ Certified", badgeType: "HPCZ", rate: "K480 / shift", rateNum: 480, rating: 4.7, bookings: 77, location: "Kabulonga", available: true, urgent: true, verificationStatus: "approved" },
  { id: 8, name: "Esther Nkole", discipline: "Midwife", institution: "NMCZ", badge: "NMCZ Verified", badgeType: "NMCZ", rate: "K360 / shift", rateNum: 360, rating: 4.5, bookings: 52, location: "Woodlands", available: true, urgent: false, verificationStatus: "approved" },
  { id: 9, name: "Peter Mumba", discipline: "Mental Health Counsellor", institution: "HPCZ", badge: "HPCZ Certified", badgeType: "HPCZ", rate: "K400 / shift", rateNum: 400, rating: 4.8, bookings: 38, location: "Roma", available: false, urgent: false, verificationStatus: "approved" },
  { id: 10, name: "Alice Chirwa", discipline: "Certified Caregiver", institution: "Certified", badge: "Certified", badgeType: "Certified", rate: "K260 / shift", rateNum: 260, rating: 4.9, bookings: 201, location: "Ibex Hill", available: true, urgent: false, verificationStatus: "approved" },
];

const DISCIPLINES = ["All", "Registered Nurse", "Midwife", "Physiotherapist", "Mental Health Counsellor", "Certified Caregiver"];
const LOCATIONS = ["All Lusaka", "Kabulonga", "Woodlands", "Roma", "Ibex Hill", "Rhodes Park", "Chelston"];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#e8a820", fontSize: 13 }}>
      {"★".repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? "½" : ""}
    </span>
  );
}

function ProfessionalCard({ pro }: { pro: Professional }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--cb-warm-white)",
        border: "1px solid var(--cb-border)",
        borderRadius: 4,
        overflow: "hidden",
        transition: "box-shadow 0.2s, transform 0.2s",
        boxShadow: hovered ? "0 8px 32px rgba(61,107,79,0.13)" : "0 1px 4px rgba(26,26,24,0.06)",
        transform: hovered ? "translateY(-2px)" : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Photo */}
      <div style={{ position: "relative" }}>
        <img
          src={`https://i.pravatar.cc/300?u=${pro.id}`}
          alt={pro.name}
          style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
        />
        {/* Available badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 20,
            padding: "5px 10px",
            fontSize: 11,
            fontWeight: 600,
            fontFamily: UI,
            letterSpacing: "0.04em",
            color: pro.available ? "#1a6e38" : "var(--cb-ink-light)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: pro.available ? "#22c55e" : "#9ca3af", flexShrink: 0 }} />
          {pro.available ? "Available" : "Unavailable"}
        </div>
        {/* Urgent tag */}
        {pro.urgent && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(255,180,0,0.92)",
              borderRadius: 20,
              padding: "4px 10px",
              fontSize: 10,
              fontWeight: 700,
              fontFamily: UI,
              letterSpacing: "0.06em",
              color: "#7a4800",
              backdropFilter: "blur(4px)",
            }}
          >
            ⚡ Urgent
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Discipline label */}
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cb-sage)", marginBottom: 6, fontFamily: UI }}>
          {pro.discipline}
        </div>

        {/* Name */}
        <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 400, color: "var(--cb-ink)", marginBottom: 4, lineHeight: 1.15 }}>
          {pro.name}
        </h3>

        {/* Institution */}
        <div style={{ fontSize: 12.5, color: "var(--cb-ink-light)", marginBottom: 10, fontFamily: BODY }}>
          {pro.institution}
        </div>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <StarRating rating={pro.rating} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--cb-ink)", fontFamily: UI }}>{pro.rating}</span>
          <span style={{ fontSize: 12, color: "var(--cb-ink-light)", fontFamily: BODY }}>· {pro.bookings} bookings</span>
        </div>

        {/* Verification badge */}
        <div style={{ marginBottom: 10 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "var(--cb-sage-light)",
              border: "1px solid rgba(61,107,79,0.18)",
              borderRadius: 2,
              padding: "4px 9px",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--cb-sage)",
              fontFamily: UI,
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--cb-sage)" }} />
            {pro.badge}
          </span>
        </div>

        {/* Location */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "var(--cb-ink-light)", marginBottom: 16, fontFamily: BODY }}>
          <span style={{ fontSize: 13 }}>📍</span>
          {pro.location}, Lusaka
        </div>

        {/* Rate + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--cb-border)" }}>
          <div>
            <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "var(--cb-ink)" }}>{pro.rate.split(" /")[0]}</span>
            <span style={{ fontSize: 12, color: "var(--cb-ink-light)", fontFamily: BODY }}> / shift</span>
          </div>
          <Link href={`/professionals/${pro.id}`}>
            <a
              style={{
                display: "inline-block",
                background: "var(--cb-sage)",
                color: "#fff",
                padding: "9px 18px",
                borderRadius: 2,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontFamily: UI,
                transition: "background 0.2s",
              }}
            >
              View Profile →
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalsDirectoryPage() {
  const [, setLocation] = useLocation();
  const [discipline, setDiscipline] = useState("All");
  const [location, setLocation2] = useState("All Lusaka");
  const [availableNow, setAvailableNow] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = PROFESSIONALS.filter((p) => {
    if (discipline !== "All" && p.discipline !== discipline) return false;
    if (location !== "All Lusaka" && p.location !== location) return false;
    if (availableNow && !p.available) return false;
    if (urgentOnly && !p.urgent) return false;
    return true;
  });

  const selectStyle: React.CSSProperties = {
    padding: "9px 14px",
    fontSize: 13,
    fontFamily: UI,
    color: "var(--cb-ink)",
    background: "var(--cb-warm-white)",
    border: "1px solid var(--cb-border-strong)",
    borderRadius: 2,
    outline: "none",
    cursor: "pointer",
    letterSpacing: "0.02em",
    appearance: "none",
    WebkitAppearance: "none",
    paddingRight: 32,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
  };

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 16px",
    fontSize: 12.5,
    fontFamily: UI,
    fontWeight: active ? 600 : 400,
    color: active ? "#fff" : "var(--cb-ink)",
    background: active ? "var(--cb-sage)" : "var(--cb-warm-white)",
    border: `1px solid ${active ? "var(--cb-sage)" : "var(--cb-border-strong)"}`,
    borderRadius: 2,
    cursor: "pointer",
    letterSpacing: "0.04em",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--cb-cream)", color: "var(--cb-ink)", fontFamily: BODY }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Raleway:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* ── NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
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
        <Link href="/">
          <a style={{ textDecoration: "none" }}>
            <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, letterSpacing: "0.02em", color: "var(--cb-ink)" }}>
              Care<span style={{ color: "var(--cb-sage)" }}>Bridge</span>
            </div>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cb-ink-light)", opacity: 0.6, marginTop: -2 }}>
              Zambia · Verified Home Healthcare
            </div>
          </a>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Desktop nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }} className="cb-nav-links-desktop">
            <Link href="/"><a style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cb-ink-light)", textDecoration: "none", fontFamily: UI }}>Home</a></Link>
            <a href="/#how" style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cb-ink-light)", textDecoration: "none", fontFamily: UI }}>How it Works</a>
            <a href="/#pricing" style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cb-ink-light)", textDecoration: "none", fontFamily: UI }}>Pricing</a>
          </div>
          <Link href="/login">
            <a style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cb-ink-light)", textDecoration: "none", fontFamily: UI }}>Log in</a>
          </Link>
          <Link href="/register">
            <a style={{ background: "var(--cb-sage)", color: "#fff", padding: "10px 22px", borderRadius: 2, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", fontFamily: UI, fontWeight: 500 }}>
              Get started
            </a>
          </Link>

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

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            background: "var(--cb-warm-white)",
            borderBottom: "1px solid var(--cb-border)",
            padding: "24px 32px",
            zIndex: 190,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <Link href="/"><a onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cb-ink-light)", textDecoration: "none", fontFamily: UI }}>Home</a></Link>
          <a href="/#how" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cb-ink-light)", textDecoration: "none", fontFamily: UI }}>How it Works</a>
          <a href="/#pricing" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cb-ink-light)", textDecoration: "none", fontFamily: UI }}>Pricing</a>
          <Link href="/login"><a onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cb-ink-light)", textDecoration: "none", fontFamily: UI }}>Log in</a></Link>
          <Link href="/register"><a onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cb-sage)", textDecoration: "none", fontFamily: UI }}>Get started →</a></Link>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ paddingTop: 64 }}>

        {/* Page header */}
        <div style={{ background: "var(--cb-warm-white)", borderBottom: "1px solid var(--cb-border)", padding: "48px 32px 36px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cb-sage)", marginBottom: 16, fontFamily: UI }}>
              <div style={{ width: 24, height: 1, background: "var(--cb-sage)" }} />
              Professionals Directory
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4vw,54px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--cb-ink)", marginBottom: 12 }}>
              Find a <em style={{ color: "var(--cb-sage)" }}>verified</em> professional
            </h1>
            <p style={{ fontSize: 15, fontWeight: 400, color: "var(--cb-ink-light)", lineHeight: 1.75, fontFamily: BODY, maxWidth: 560 }}>
              Licensed nurses, midwives, physiotherapists and more — in Lusaka.
            </p>
          </div>
        </div>

        {/* ── URGENT BANNER ── */}
        <div style={{ background: "rgba(255,180,0,0.12)", borderBottom: "1px solid rgba(255,180,0,0.28)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 18 }}>⚡</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#a06500", fontFamily: UI, flex: 1 }}>
              Need care within 60 minutes? We match you fast.
            </span>
            <button
              onClick={() => { setUrgentOnly(true); setAvailableNow(true); }}
              style={{
                background: "#b07800",
                color: "#fff",
                border: "none",
                borderRadius: 2,
                padding: "9px 20px",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: UI,
                whiteSpace: "nowrap",
              }}
            >
              Find urgent care →
            </button>
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <div
          style={{
            position: "sticky",
            top: 64,
            zIndex: 100,
            background: "var(--cb-cream)",
            borderBottom: "1px solid var(--cb-border)",
          }}
        >
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {/* Discipline */}
            <div style={{ position: "relative" }}>
              <label style={{ display: "none" }}>Discipline</label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                style={selectStyle}
                aria-label="Filter by discipline"
              >
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div style={{ position: "relative" }}>
              <label style={{ display: "none" }}>Location</label>
              <select
                value={location}
                onChange={(e) => setLocation2(e.target.value)}
                style={selectStyle}
                aria-label="Filter by location"
              >
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 28, background: "var(--cb-border-strong)", opacity: 0.5 }} />

            {/* Available now toggle */}
            <button
              onClick={() => setAvailableNow(!availableNow)}
              style={toggleStyle(availableNow)}
            >
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: availableNow ? "#fff" : "#22c55e" }} />
              Available now
            </button>

            {/* Urgent toggle */}
            <button
              onClick={() => setUrgentOnly(!urgentOnly)}
              style={toggleStyle(urgentOnly)}
            >
              ⚡ Urgent (60 min)
            </button>

            {/* Reset */}
            {(discipline !== "All" || location !== "All Lusaka" || availableNow || urgentOnly) && (
              <button
                onClick={() => { setDiscipline("All"); setLocation2("All Lusaka"); setAvailableNow(false); setUrgentOnly(false); }}
                style={{ fontSize: 12, color: "var(--cb-ink-light)", background: "none", border: "none", cursor: "pointer", fontFamily: UI, letterSpacing: "0.04em", textDecoration: "underline", padding: "9px 4px" }}
              >
                Clear filters
              </button>
            )}

            {/* Results count */}
            <div style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--cb-ink-light)", fontFamily: BODY, whiteSpace: "nowrap" }}>
              <strong style={{ color: "var(--cb-ink)", fontFamily: UI }}>{filtered.length}</strong> professional{filtered.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>

        {/* ── RESULTS GRID ── */}
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 32px 80px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 32px", color: "var(--cb-ink-light)", fontFamily: BODY }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 300, color: "var(--cb-ink)", marginBottom: 8 }}>No professionals found</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.75 }}>Try adjusting your filters to see more results.</p>
              <button
                onClick={() => { setDiscipline("All"); setLocation2("All Lusaka"); setAvailableNow(false); setUrgentOnly(false); }}
                style={{ marginTop: 24, background: "var(--cb-sage)", color: "#fff", border: "none", borderRadius: 2, padding: "12px 24px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: UI, fontWeight: 600 }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 24,
              }}
              className="cb-professionals-grid"
            >
              {filtered.map((pro) => (
                <ProfessionalCard key={pro.id} pro={pro} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "var(--cb-trust-bg)", color: "rgba(255,255,255,0.6)", padding: "48px 32px 32px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "#fff" }}>Care<span style={{ color: "var(--cb-sage-mid)" }}>Bridge</span></div>
              <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: -2, fontFamily: UI }}>Zambia · Verified Home Healthcare</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["NMCZ Verified Platform", "HPCZ Certified"].map((b) => (
                <span key={b} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: UI, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 2, padding: "4px 10px" }}>{b}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: UI, flexWrap: "wrap", gap: 8 }}>
            <span style={{ opacity: 0.4 }}>© CareBridge 2025. Lusaka, Zambia. All rights reserved.</span>
            <span style={{ opacity: 0.4 }}>NMCZ &amp; HPCZ Verified Platform</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .cb-nav-links-desktop {
            display: none !important;
          }
          .cb-professionals-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) {
          .cb-hamburger {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
