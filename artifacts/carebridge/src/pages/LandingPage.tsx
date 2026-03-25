import { useState, useEffect } from "react";
import robertPhoto from "/robert-ngoma.jpeg";

const BODY = "'Raleway', sans-serif";
const SERIF = "'Cormorant Garamond', serif";
const UI = "'DM Sans', sans-serif";

type Page = "home" | "how" | "professionals" | "why" | "pricing";

const PAGES: { id: Page; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "how", label: "How it Works" },
  { id: "professionals", label: "Professionals" },
  { id: "why", label: "Why Us" },
  { id: "pricing", label: "Pricing" },
];

export default function LandingPage() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  function navigate(p: Page) {
    if (p === page) return;
    setVisible(false);
    setTimeout(() => {
      setPage(p);
      setVisible(true);
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 220);
  }

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div
      className={dark ? "cb-dark" : ""}
      style={{ background: "var(--cb-cream)", color: "var(--cb-ink)", minHeight: "100vh", fontFamily: BODY }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ── NAV ── */}
      <nav className="cb-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--cb-nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--cb-border)", fontFamily: UI }}>
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
          <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, letterSpacing: "0.02em", color: "var(--cb-ink)" }}>Care<span style={{ color: "var(--cb-sage)" }}>Bridge</span></div>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cb-ink-light)", opacity: 0.6, marginTop: -2 }}>Zambia · Verified Home Healthcare</div>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className={`cb-nav-links${menuOpen ? " cb-open" : ""}`}>
            {PAGES.filter(p => p.id !== "home").map((p) => (
              <button key={p.id} onClick={() => navigate(p.id)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: page === p.id ? "var(--cb-sage)" : "var(--cb-ink-light)", borderBottom: page === p.id ? "1px solid var(--cb-sage)" : "1px solid transparent", paddingBottom: 2, transition: "color 0.2s", fontFamily: UI }}>
                {p.label}
              </button>
            ))}
            <button onClick={() => navigate("how")}
              style={{ background: "var(--cb-sage)", color: "#fff", padding: "10px 22px", borderRadius: 2, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: UI }}>
              Book Care
            </button>
          </div>

          <button onClick={() => setDark(!dark)} title="Toggle dark mode"
            style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(26,26,24,0.06)", border: "1px solid var(--cb-border-strong)", borderRadius: 20, padding: "6px 12px", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", color: "var(--cb-ink-light)", flexShrink: 0 }}>
            {dark ? "☀️" : "🌙"}
          </button>

          <button className="cb-hamburger" onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ display: "block", width: 22, height: 1.5, background: "var(--cb-ink)", transition: "0.2s", transform: menuOpen ? "rotate(45deg) translate(3px,3px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 1.5, background: "var(--cb-ink)", opacity: menuOpen ? 0 : 1, transition: "0.2s" }} />
            <span style={{ display: "block", width: 22, height: 1.5, background: "var(--cb-ink)", transition: "0.2s", transform: menuOpen ? "rotate(-45deg) translate(3px,-3px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* ── PAGE CONTENT ── */}
      <div style={{ paddingTop: 72, transition: "opacity 0.22s ease, transform 0.22s ease", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}>

        {page === "home" && <PageHome dark={dark} navigate={navigate} />}
        {page === "how" && <PageHow />}
        {page === "professionals" && <PageProfessionals navigate={navigate} />}
        {page === "why" && <PageWhy />}
        {page === "pricing" && <PagePricing navigate={navigate} />}

        {/* ── PAGE NAV BAR (bottom) ── */}
        <div style={{ background: "var(--cb-trust-bg)", padding: "16px 80px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {PAGES.map((p) => (
              <button key={p.id} onClick={() => navigate(p.id)}
                style={{ background: page === p.id ? "var(--cb-sage)" : "rgba(255,255,255,0.07)", border: "none", borderRadius: 2, padding: "7px 16px", fontSize: 11, fontWeight: page === p.id ? 600 : 400, letterSpacing: "0.08em", textTransform: "uppercase", color: page === p.id ? "#fff" : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: UI, transition: "background 0.2s, color 0.2s" }}>
                {p.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {page !== "home" && (
              <button onClick={() => navigate(PAGES[PAGES.findIndex(p => p.id === page) - 1]?.id || "home")}
                style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 2, padding: "7px 20px", fontSize: 11, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: UI, letterSpacing: "0.08em" }}>
                ← Prev
              </button>
            )}
            {page !== "pricing" && (
              <button onClick={() => navigate(PAGES[PAGES.findIndex(p => p.id === page) + 1]?.id || "pricing")}
                style={{ background: "var(--cb-sage)", border: "none", borderRadius: 2, padding: "7px 20px", fontSize: 11, color: "#fff", cursor: "pointer", fontFamily: UI, letterSpacing: "0.08em" }}>
                Next →
              </button>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="cb-footer" style={{ background: "var(--cb-footer-bg)", color: "rgba(255,255,255,0.6)" }}>
          <div className="cb-footer-grid" style={{ paddingBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "#fff" }}>Care<span style={{ color: "var(--cb-sage-mid)" }}>Bridge</span></div>
              <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: -2, marginBottom: 12, fontFamily: UI }}>Zambia · Verified Home Healthcare</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.75, maxWidth: 240, fontFamily: BODY }}>Connecting Zambian families with verified, licensed healthcare professionals — by the shift.</p>
            </div>
            {[
              { heading: "Families", links: ["How it works", "Browse professionals", "Pricing", "Family membership"] },
              { heading: "Professionals", links: ["Join CareBridge", "Verification process", "Professional subscription", "Support"] },
              { heading: "Company", links: ["About", "Contact", "Terms & Conditions", "Privacy Policy"] },
            ].map((col) => (
              <div key={col.heading}>
                <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 16, fontFamily: UI }}>{col.heading}</h4>
                {col.links.map((link) => (
                  <a key={link} href="#" style={{ display: "block", fontSize: 13.5, color: "rgba(255,255,255,0.55)", textDecoration: "none", marginBottom: 10, fontFamily: BODY }}>{link}</a>
                ))}
              </div>
            ))}
          </div>
          <div className="cb-footer-bottom" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: UI }}>
            <span style={{ opacity: 0.4 }}>© CareBridge 2025. Lusaka, Zambia. All rights reserved.</span>
            <span style={{ opacity: 0.4 }}>NMCZ & HPCZ Verified Platform</span>
          </div>
        </footer>
      </div>

      {/* ── WHATSAPP ── */}
      <a href="https://wa.me/260XXXXXXXXX?text=Hi%2C%20I%27d%20like%20to%20book%20a%20CareBridge%20professional" target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: 28, right: 28, zIndex: 200, width: 56, height: 56, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(37,211,102,0.45)", textDecoration: "none" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}

/* ════════════════════════════════════════
   PAGE: HOME
════════════════════════════════════════ */
function PageHome({ dark: _dark, navigate }: { dark: boolean; navigate: (p: Page) => void }) {
  return (
    <>
      <section className="cb-hero-grid" style={{ minHeight: "calc(100vh - 72px)", overflow: "hidden" }}>
        <div className="cb-hero-left" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 64px 64px 80px" }}>
          <div className="cb-fade-1" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 32, height: 1, background: "var(--cb-sage)" }} />
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cb-sage)", fontFamily: UI }}>Verified Home Healthcare · Zambia</span>
          </div>
          <h1 className="cb-fade-2" style={{ fontFamily: SERIF, fontSize: "clamp(48px,5.5vw,78px)", fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.02em", color: "var(--cb-ink)", marginBottom: 28 }}>
            Care your family<br />can <em style={{ color: "var(--cb-sage)" }}>trust,</em><br />at home.
          </h1>
          <p className="cb-fade-3" style={{ fontSize: 16, fontWeight: 400, color: "var(--cb-ink-light)", maxWidth: 400, lineHeight: 1.85, marginBottom: 48, fontFamily: BODY }}>
            Book NMCZ and HPCZ-verified nurses, physiotherapists, and caregivers for your recovering loved one — by the shift, on your schedule.
          </p>
          <div className="cb-fade-4 cb-hero-actions" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("how")} style={{ background: "var(--cb-sage)", color: "#fff", padding: "15px 32px", borderRadius: 2, fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: UI }}>Find a Professional</button>
            <button onClick={() => navigate("professionals")} style={{ color: "var(--cb-ink)", fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", background: "none", border: "none", borderBottom: "1px solid var(--cb-border-strong)", cursor: "pointer", padding: "15px 0", fontFamily: UI }}>
              I'm a Healthcare Professional →
            </button>
          </div>
          <div className="cb-fade-5 cb-stats-row" style={{ display: "flex", gap: 40, marginTop: 56, paddingTop: 40, borderTop: "1px solid var(--cb-border)" }}>
            {[["100%", "License Verified"], ["5", "Care Disciplines"], ["Lusaka", "Launching in"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 600, color: "var(--cb-ink)", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 11, color: "var(--cb-ink-light)", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 4, fontFamily: UI }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="cb-hero-right" style={{ position: "relative", overflow: "hidden", background: "var(--cb-sage)" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.55 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(61,107,79,0.85) 0%,rgba(26,26,24,0.7) 100%)", zIndex: 1 }} />
          <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 48 }}>
            <div style={{ background: "var(--cb-card-bg)", borderRadius: 4, padding: "24px 28px", maxWidth: 320 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 16, fontFamily: UI }}>Every professional verified by</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                {["NMCZ Verified", "HPCZ Certified"].map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--cb-sage-light)", borderRadius: 2, padding: "6px 10px", fontSize: 11, fontWeight: 500, color: "var(--cb-sage)", fontFamily: UI }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cb-sage)" }} />{b}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12.5, color: "var(--cb-ink-light)", lineHeight: 1.7, fontFamily: BODY }}>Nursing and Midwifery Council of Zambia &amp; Health Professions Council of Zambia — so you know exactly who is coming into your home.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Trust strip */}
      <div className="cb-trust-strip" style={{ background: "var(--cb-trust-bg)", color: "#fff", fontFamily: UI }}>
        {["Registered Nurses", "Midwives", "Physiotherapists", "Mental Health Counsellors", "Certified Caregivers"].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.85, whiteSpace: "nowrap" }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--cb-sage-mid)", flexShrink: 0 }} />{item}
          </div>
        ))}
      </div>
    </>
  );
}

/* ════════════════════════════════════════
   PAGE: HOW IT WORKS
════════════════════════════════════════ */
function PageHow() {
  return (
    <section className="cb-section" style={{ background: "var(--cb-warm-white)", minHeight: "calc(100vh - 72px)" }}>
      <SectionLabel>How it works</SectionLabel>
      <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4vw,56px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--cb-ink)", marginBottom: 8 }}>
        From request to <em style={{ color: "var(--cb-sage)" }}>bedside</em> — simply.
      </h2>
      <p style={{ fontSize: 15, fontWeight: 400, color: "var(--cb-ink-light)", lineHeight: 1.75, maxWidth: 480, marginBottom: 0, fontFamily: BODY }}>Four straightforward steps from booking to bedside care.</p>
      <div className="cb-two-col" style={{ marginTop: 48 }}>
        <div>
          {[
            { num: "01", title: "Post your care request", desc: "Describe the patient's condition, type of care needed, your location in Lusaka, and preferred shift times." },
            { num: "02", title: "Browse verified matches", desc: "See nearby licensed professionals matched to your needs — each with their NMCZ/HPCZ badge, ratings, experience, and hourly rate." },
            { num: "03", title: "Book a shift", desc: "Choose an 8-hour, 12-hour, or 24-hour shift. Pay securely via MTN Mobile Money, Airtel Money, or card." },
            { num: "04", title: "Care delivered at home", desc: "Your professional arrives. Payment is released only after the shift is completed. Both sides leave a review." },
          ].map((step, i) => (
            <div key={step.num} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 24, padding: "24px 0", borderBottom: "1px solid var(--cb-border)", borderTop: i === 0 ? "1px solid var(--cb-border)" : undefined }}>
              <div style={{ fontFamily: SERIF, fontSize: 13, color: "var(--cb-ink-light)", opacity: 0.5, paddingTop: 3, letterSpacing: "0.06em" }}>{step.num}</div>
              <div>
                <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 400, marginBottom: 8, color: "var(--cb-ink)" }}>{step.title}</h3>
                <p style={{ fontSize: 14.5, fontWeight: 400, color: "var(--cb-ink-light)", lineHeight: 1.75, fontFamily: BODY }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Robert Ngoma */}
        <div style={{ background: "var(--cb-sage)", borderRadius: 4, padding: 32, color: "#fff" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.6, marginBottom: 16, fontFamily: UI }}>Featured professional on CareBridge</div>
          <div style={{ background: "rgba(255,255,255,0.09)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.18)", overflow: "hidden" }}>
            <img src={robertPhoto} alt="Robert Ngoma" style={{ width: "100%", height: 220, objectFit: "cover", objectPosition: "top center", display: "block" }} />
            <div style={{ padding: "20px 22px" }}>
              <div style={{ fontSize: 19, fontWeight: 600, marginBottom: 2, fontFamily: BODY }}>Robert Ngoma</div>
              <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 14, fontFamily: BODY }}>Registered Nurse · UTH Lusaka</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                {[["✓ NMCZ Verified", true], ["RN23429", false], ["5+ yrs exp", false], ["Burns & Emergency", false]].map(([label, v]) => (
                  <span key={label as string} style={{ background: v ? "rgba(182,224,196,0.2)" : "rgba(255,255,255,0.15)", border: v ? "1px solid rgba(182,224,196,0.4)" : "1px solid rgba(255,255,255,0.25)", borderRadius: 2, padding: "4px 8px", fontSize: 10, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: v ? "#b6e0c4" : "#fff", fontFamily: UI }}>{label as string}</span>
                ))}
              </div>
              {[["Qualification", "Diploma in Nursing"], ["Institution", "Lusaka Apex Medical Univ."], ["Specialisations", "Emergency, Paediatrics"], ["Cert. No.", "440078 · Valid 2026"]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 9, opacity: 0.85, fontFamily: BODY }}>
                  <span>{l}</span><strong style={{ fontWeight: 600 }}>{v}</strong>
                </div>
              ))}
              <button style={{ display: "block", width: "100%", marginTop: 16, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: 11, textAlign: "center", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2, cursor: "pointer", fontFamily: UI }}>
                Book a shift with Robert →
              </button>
              <div style={{ fontSize: 10, opacity: 0.4, textAlign: "center", marginTop: 8, fontFamily: UI }}>NMCZ Practicing Certificate No. 440078 · Issued Dec 2025</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   PAGE: PROFESSIONALS
════════════════════════════════════════ */
function PageProfessionals({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <section className="cb-section" style={{ background: "var(--cb-cream)", minHeight: "calc(100vh - 72px)" }}>
      <SectionLabel>Who we verify</SectionLabel>
      <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4vw,56px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--cb-ink)", maxWidth: 640, marginBottom: 12 }}>
        Five disciplines. One <em style={{ color: "var(--cb-sage)" }}>trusted</em> platform.
      </h2>
      <p style={{ fontSize: 15, fontWeight: 400, color: "var(--cb-ink-light)", maxWidth: 520, lineHeight: 1.8, marginBottom: 0, fontFamily: BODY }}>
        Every professional on CareBridge is licensed, background-checked, and verified against official NMCZ and HPCZ databases before appearing in any search result.
      </p>
      <div className="cb-three-col" style={{ marginTop: 40 }}>
        {[
          { icon: "🩺", title: "Registered Nurses", desc: "Post-surgery care, medication administration, wound dressing, chronic disease management, and palliative care at home.", auth: "Verified by NMCZ" },
          { icon: "👶", title: "Midwives", desc: "Postnatal home visits, newborn checks, breastfeeding support, and maternal recovery care.", auth: "Verified by NMCZ" },
          { icon: "🦽", title: "Physiotherapists", desc: "Stroke rehabilitation, mobility recovery, post-orthopaedic care, and exercise therapy in the patient's home.", auth: "Verified by HPCZ" },
          { icon: "🧠", title: "Mental Health Counsellors", desc: "Home-based counselling for depression, anxiety, grief, and caregiver stress — for patients and families alike.", auth: "Verified by HPCZ" },
          { icon: "🤲", title: "Certified Caregivers", desc: "Daily living assistance, elderly care, companionship, and support for patients with long-term conditions.", auth: "Certified & background-checked" },
        ].map((card) => (
          <div key={card.title} style={{ background: "var(--cb-warm-white)", padding: "32px 28px", cursor: "default", transition: "background 0.2s, box-shadow 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cb-sage-light)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(61,107,79,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--cb-warm-white)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--cb-sage-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 19 }}>{card.icon}</div>
            <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 400, marginBottom: 8, color: "var(--cb-ink)" }}>{card.title}</h3>
            <p style={{ fontSize: 13.5, fontWeight: 400, color: "var(--cb-ink-light)", lineHeight: 1.75, marginBottom: 14, fontFamily: BODY }}>{card.desc}</p>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cb-sage)", fontFamily: UI }}>{card.auth}</div>
          </div>
        ))}
        <div style={{ background: "var(--cb-sage)", color: "#fff", padding: "32px 28px" }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 19 }}>＋</div>
          <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 400, marginBottom: 8, color: "#fff" }}>Are you a healthcare professional?</h3>
          <p style={{ fontSize: 13.5, fontWeight: 400, color: "rgba(255,255,255,0.8)", lineHeight: 1.75, marginBottom: 18, fontFamily: BODY }}>List your services, set your availability, and connect with Lusaka families who need your expertise.</p>
          <button onClick={() => navigate("how")} style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.06em", textTransform: "uppercase", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: 2, cursor: "pointer", fontFamily: UI }}>Apply to join →</button>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   PAGE: WHY US + TESTIMONIALS
════════════════════════════════════════ */
function PageWhy() {
  return (
    <>
      <section className="cb-section" style={{ background: "var(--cb-warm-white)" }}>
        <SectionLabel>Why CareBridge</SectionLabel>
        <div className="cb-two-col-center" style={{ marginTop: 32 }}>
          <div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4vw,52px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--cb-ink)", marginBottom: 20 }}>
              The trust problem in<br />home care — <em style={{ color: "var(--cb-sage)" }}>solved.</em>
            </h2>
            <p style={{ fontSize: 15, fontWeight: 400, color: "var(--cb-ink-light)", maxWidth: 480, lineHeight: 1.8, marginBottom: 36, fontFamily: BODY }}>
              Families in Zambia deserve to know exactly who is caring for their loved ones. CareBridge is the only platform that verifies every professional against official licensing databases.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { num: "01", title: "License verification at the source", desc: "We check directly with NMCZ and HPCZ — not just against self-reported certificates." },
                { num: "02", title: "Shift-based, not subscription-based", desc: "Pay for what you need. An 8-hour shift for one week of recovery, not a recurring monthly fee." },
                { num: "03", title: "Payment held until care is delivered", desc: "Funds are released to the professional only after the shift is completed." },
                { num: "04", title: "Built for Zambia", desc: "Mobile money payments, Lusaka-first coverage, and professionals who understand local context." },
              ].map((point) => (
                <div key={point.num} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 16, alignItems: "start" }}>
                  <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: "var(--cb-sage)", opacity: 0.7 }}>{point.num}</div>
                  <div>
                    <h4 style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 4, color: "var(--cb-ink)", fontFamily: BODY }}>{point.title}</h4>
                    <p style={{ fontSize: 13.5, fontWeight: 400, color: "var(--cb-ink-light)", lineHeight: 1.7, fontFamily: BODY }}>{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "var(--cb-sage)", borderRadius: 4, aspectRatio: "4/5", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=700&q=80')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.5 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(61,107,79,0.85) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 32, left: 32, right: 32, color: "#fff" }}>
              <h3 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 300, lineHeight: 1.2, marginBottom: 10 }}>"I needed someone I could trust with my mother."</h3>
              <p style={{ fontSize: 13.5, fontFamily: BODY, fontWeight: 400, opacity: 0.8, lineHeight: 1.7 }}>CareBridge families see the license number, qualifications, and past reviews before confirming a booking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="cb-section" style={{ background: "var(--cb-cream)" }}>
        <SectionLabel>What families say</SectionLabel>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4vw,52px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--cb-ink)", maxWidth: 640, marginBottom: 48 }}>
          Trusted care, <em style={{ color: "var(--cb-sage)" }}>real stories.</em>
        </h2>
        <div className="cb-three-col" style={{ marginTop: 0 }}>
          {[
            { quote: "After my father's stroke, we needed a physiotherapist who could come home every morning. CareBridge matched us with someone the same day — HPCZ-verified and incredibly professional.", name: "Chanda M.", role: "Daughter · Lusaka, Kabulonga", initials: "CM" },
            { quote: "I was nervous about having a stranger in our home after my surgery. Seeing the NMCZ license number and reading real reviews made all the difference. The nurse was exceptional.", name: "Mutale B.", role: "Patient · Lusaka, Woodlands", initials: "MB" },
            { quote: "We needed a midwife for postnatal visits at short notice. CareBridge had a verified midwife available the next morning. I can't recommend it enough to new mothers.", name: "Namukolo S.", role: "New mother · Lusaka, Ibex Hill", initials: "NS" },
          ].map((t) => (
            <div key={t.name} style={{ background: "var(--cb-warm-white)", padding: "32px 28px", borderRadius: 4, borderTop: "3px solid var(--cb-sage)", display: "flex", flexDirection: "column", gap: 20, transition: "box-shadow 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(61,107,79,0.12)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
              <div style={{ fontSize: 32, color: "var(--cb-sage)", opacity: 0.3, fontFamily: SERIF, lineHeight: 1 }}>"</div>
              <p style={{ fontSize: 14.5, fontWeight: 400, color: "var(--cb-ink)", lineHeight: 1.85, fontFamily: BODY, flex: 1 }}>{t.quote}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--cb-sage)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: BODY, flexShrink: 0 }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--cb-ink)", fontFamily: BODY }}>{t.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--cb-ink-light)", fontFamily: UI, letterSpacing: "0.04em" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ════════════════════════════════════════
   PAGE: PRICING + PAYMENT
════════════════════════════════════════ */
function PagePricing({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <>
      <section className="cb-section" style={{ background: "var(--cb-pricing-bg)", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cb-sage-mid)", marginBottom: 20, fontFamily: UI }}>
          <div style={{ width: 24, height: 1, background: "var(--cb-sage-mid)" }} />Pricing
        </div>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4vw,56px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", maxWidth: 640, marginBottom: 12 }}>
          Simple, transparent <em style={{ color: "var(--cb-sage-mid)" }}>fees.</em>
        </h2>
        <p style={{ fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.55)", maxWidth: 480, lineHeight: 1.8, fontFamily: BODY }}>No subscriptions required for families. Pay per shift — or choose a membership for regular care needs.</p>
        <div className="cb-three-col cb-pricing-grid-mobile" style={{ marginTop: 40 }}>
          {[
            { tag: "Per shift", amount: "20%", period: "platform fee per booking", features: ["No account required", "Search & browse professionals", "Shift booking & scheduling", "Mobile money payment", "Ratings & reviews"], cta: "Book a shift", featured: false },
            { tag: "Family membership", amount: "K250", period: "per month", features: ["Reduced platform fee", "Priority bookings", "Saved patient profiles", "Booking history & records", "Dedicated support"], cta: "Start membership", featured: true },
            { tag: "For professionals", amount: "K150", period: "per month", features: ["Verified badge on profile", "Appear in family searches", "Scheduling & availability tools", "Booking management", "Earnings dashboard"], cta: "Join as a professional", featured: false },
          ].map((card) => (
            <div key={card.tag} style={{ background: card.featured ? "var(--cb-sage)" : "rgba(255,255,255,0.05)", border: card.featured ? "1px solid var(--cb-sage)" : "1px solid rgba(255,255,255,0.1)", padding: "36px 32px" }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: card.featured ? "rgba(255,255,255,0.7)" : "var(--cb-sage-mid)", marginBottom: 20, display: "block", fontFamily: UI }}>{card.tag}</span>
              <div style={{ fontFamily: SERIF, fontSize: 48, fontWeight: 300, lineHeight: 1, marginBottom: 4 }}>{card.amount}</div>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 24, fontFamily: BODY }}>{card.period}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 11, marginBottom: 32 }}>
                {card.features.map((f) => (
                  <li key={f} style={{ fontSize: 13.5, fontWeight: 400, opacity: 0.85, display: "flex", alignItems: "center", gap: 10, fontFamily: BODY }}>
                    <span style={{ display: "block", width: 16, height: 1, background: card.featured ? "rgba(255,255,255,0.5)" : "var(--cb-sage-mid)", flexShrink: 0 }} />{f}
                  </li>
                ))}
              </ul>
              <a href="#" style={{ display: "block", textAlign: "center", padding: 12, border: card.featured ? "1px solid #fff" : "1px solid rgba(255,255,255,0.25)", background: card.featured ? "#fff" : "transparent", color: card.featured ? "var(--cb-sage)" : "#fff", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2, fontFamily: UI, fontWeight: 600 }}>{card.cta}</a>
            </div>
          ))}
        </div>
      </section>

      {/* Payment methods */}
      <section className="cb-section" style={{ background: "var(--cb-cream)" }}>
        <SectionLabel>Payments</SectionLabel>
        <div className="cb-two-col-center" style={{ marginTop: 32 }}>
          <div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4vw,52px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--cb-ink)", marginBottom: 20 }}>
              Pay the way<br />Zambia <em style={{ color: "var(--cb-sage)" }}>pays.</em>
            </h2>
            <p style={{ fontSize: 15, fontWeight: 400, color: "var(--cb-ink-light)", maxWidth: 380, lineHeight: 1.8, marginBottom: 32, fontFamily: BODY }}>Mobile money is how families transact. CareBridge supports all major Zambian payment methods — no bank account required.</p>
            <button onClick={() => navigate("how")} style={{ background: "var(--cb-sage)", color: "#fff", padding: "14px 28px", borderRadius: 2, fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: UI }}>Get started →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { color: "#FFC300", name: "MTN Mobile Money", sub: "Supported" },
              { color: "#E4003A", name: "Airtel Money", sub: "Supported" },
              { color: "#005E2F", name: "Zamtel Kwacha", sub: "Supported" },
              { color: "var(--cb-ink)", name: "Debit / Credit Card", sub: "Visa & Mastercard" },
            ].map((p) => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--cb-warm-white)", padding: "16px 22px", borderRadius: 2, border: "1px solid var(--cb-border)", fontSize: 14.5, color: "var(--cb-ink)", fontFamily: BODY, transition: "box-shadow 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(61,107,79,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                {p.name}
                <span style={{ fontSize: 12, color: "var(--cb-sage)", marginLeft: "auto", fontFamily: UI, fontWeight: 500 }}>{p.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cb-sage)", marginBottom: 20, fontFamily: UI }}>
      <div style={{ width: 24, height: 1, background: "var(--cb-sage)" }} />{children}
    </div>
  );
}
