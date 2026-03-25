import robertPhoto from "/robert-ngoma.jpeg";

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Google Fonts */}
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
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
          padding: "20px 48px",
          background: "rgba(250,248,243,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(26,26,24,0.1)",
        }}
      >
        <a href="#" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, letterSpacing: "0.02em", color: "#1a1a18" }}>
            Care<span style={{ color: "#3d6b4f" }}>Bridge</span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4a4a42", opacity: 0.6, marginTop: -4 }}>
            Zambia · Verified Home Healthcare
          </div>
        </a>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <a href="#how" style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4a4a42", textDecoration: "none" }}>How it works</a>
          <a href="#professionals" style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4a4a42", textDecoration: "none" }}>Professionals</a>
          <a href="#pricing" style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4a4a42", textDecoration: "none" }}>Pricing</a>
          <a
            href="#"
            style={{
              background: "#3d6b4f",
              color: "#fff",
              padding: "10px 22px",
              borderRadius: 2,
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Book Care
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          paddingTop: 80,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 64px 80px 80px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div className="animate-fade-up-1" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 32, height: 1, background: "#3d6b4f" }} />
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3d6b4f" }}>
              Verified Home Healthcare · Zambia
            </span>
          </div>
          <h1
            className="animate-fade-up-2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(48px, 5.5vw, 78px)",
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#1a1a18",
              marginBottom: 28,
            }}
          >
            Care your family<br />can <em style={{ fontStyle: "italic", color: "#3d6b4f" }}>trust,</em><br />at home.
          </h1>
          <p
            className="animate-fade-up-3"
            style={{ fontSize: 16, fontWeight: 300, color: "#4a4a42", maxWidth: 400, lineHeight: 1.75, marginBottom: 48 }}
          >
            Book NMCZ and HPCZ-verified nurses, physiotherapists, and caregivers for your recovering loved one — by the shift, on your schedule.
          </p>
          <div className="animate-fade-up-4" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <a
              href="#how"
              style={{
                background: "#3d6b4f",
                color: "#fff",
                padding: "15px 32px",
                borderRadius: 2,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Find a Professional
            </a>
            <a
              href="#professionals"
              style={{
                color: "#1a1a18",
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "15px 0",
                borderBottom: "1px solid rgba(26,26,24,0.2)",
              }}
            >
              I'm a Healthcare Professional →
            </a>
          </div>
          <div
            className="animate-fade-up-5"
            style={{ display: "flex", gap: 40, marginTop: 60, paddingTop: 40, borderTop: "1px solid rgba(26,26,24,0.1)" }}
          >
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: "#1a1a18", lineHeight: 1 }}>100%</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: "#4a4a42", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 4 }}>License Verified</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: "#1a1a18", lineHeight: 1 }}>5</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: "#4a4a42", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 4 }}>Care Disciplines</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: "#1a1a18", lineHeight: 1 }}>Lusaka</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: "#4a4a42", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 4 }}>Launching in</div>
            </div>
          </div>
        </div>

        <div style={{ position: "relative", overflow: "hidden", background: "#3d6b4f" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.55,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(61,107,79,0.85) 0%, rgba(26,26,24,0.7) 100%)",
              zIndex: 1,
            }}
          />
          <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 48 }}>
            <div
              style={{
                background: "rgba(250,248,243,0.95)",
                borderRadius: 4,
                padding: "24px 28px",
                maxWidth: 320,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a4a42", marginBottom: 16 }}>Every professional verified by</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                {["NMCZ Verified", "HPCZ Certified"].map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 6, background: "#e8f0eb", borderRadius: 2, padding: "6px 10px", fontSize: 11, fontWeight: 500, color: "#3d6b4f" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3d6b4f" }} />
                    {b}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: "#4a4a42", lineHeight: 1.6 }}>
                Nursing and Midwifery Council of Zambia &amp; Health Professions Council of Zambia — so you know exactly who is coming into your home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div
        style={{
          background: "#1a1a18",
          color: "#fff",
          padding: "18px 80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          overflow: "hidden",
        }}
      >
        {["Registered Nurses", "Midwives", "Physiotherapists", "Mental Health Counsellors", "Certified Caregivers"].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.85, whiteSpace: "nowrap" }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#6a9b7a", flexShrink: 0 }} />
            {item}
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: "100px 80px", background: "#f5f3ed" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3d6b4f", marginBottom: 20 }}>
          <div style={{ width: 24, height: 1, background: "#3d6b4f" }} />
          How it works
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24 }}>
          From request to <em style={{ fontStyle: "italic", color: "#3d6b4f" }}>bedside</em> — simply.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginTop: 64, alignItems: "start" }}>
          {/* Steps */}
          <div>
            {[
              { num: "01", title: "Post your care request", desc: "Describe the patient's condition, type of care needed, your location in Lusaka, and preferred shift times." },
              { num: "02", title: "Browse verified matches", desc: "See nearby licensed professionals matched to your needs — each with their NMCZ/HPCZ badge, ratings, experience, and hourly rate." },
              { num: "03", title: "Book a shift", desc: "Choose an 8-hour, 12-hour, or 24-hour shift. Pay securely via MTN Mobile Money, Airtel Money, or card." },
              { num: "04", title: "Care delivered at home", desc: "Your professional arrives. Payment is released only after the shift is completed. Both sides leave a review." },
            ].map((step, i) => (
              <div
                key={step.num}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  gap: 24,
                  padding: "28px 0",
                  borderBottom: "1px solid rgba(26,26,24,0.1)",
                  borderTop: i === 0 ? "1px solid rgba(26,26,24,0.1)" : undefined,
                }}
              >
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontWeight: 400, color: "#4a4a42", opacity: 0.5, paddingTop: 3, letterSpacing: "0.06em" }}>{step.num}</div>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, marginBottom: 8, letterSpacing: "-0.01em" }}>{step.title}</h3>
                  <p style={{ fontSize: 14, fontWeight: 300, color: "#4a4a42", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Robert Ngoma Profile Card */}
          <div style={{ background: "#3d6b4f", borderRadius: 4, padding: 36, position: "sticky", top: 120, color: "#fff" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.6, marginBottom: 18 }}>
              Featured professional on CareBridge
            </div>
            <div style={{ background: "rgba(255,255,255,0.09)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.18)", overflow: "hidden" }}>
              <img
                src={robertPhoto}
                alt="Robert Ngoma, Registered Nurse"
                style={{ width: "100%", height: 240, objectFit: "cover", objectPosition: "top center", display: "block" }}
              />
              <div style={{ padding: "22px 24px" }}>
                <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 2 }}>Robert Ngoma</div>
                <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 16 }}>Registered Nurse · UTH Lusaka</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
                  {[
                    { label: "✓ NMCZ Verified", verified: true },
                    { label: "RN23429", verified: false },
                    { label: "5+ yrs exp", verified: false },
                    { label: "Burns & Emergency", verified: false },
                  ].map((badge) => (
                    <span
                      key={badge.label}
                      style={{
                        background: badge.verified ? "rgba(182,224,196,0.2)" : "rgba(255,255,255,0.15)",
                        border: badge.verified ? "1px solid rgba(182,224,196,0.4)" : "1px solid rgba(255,255,255,0.25)",
                        borderRadius: 2,
                        padding: "4px 8px",
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        color: badge.verified ? "#b6e0c4" : "#fff",
                      }}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
                {[
                  { label: "Qualification", value: "Diploma in Nursing" },
                  { label: "Institution", value: "Lusaka Apex Medical Univ." },
                  { label: "Specialisations", value: "Emergency, Paediatrics" },
                  { label: "Cert. No.", value: "440078 · Valid 2026" },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10, opacity: 0.8 }}>
                    <span>{row.label}</span>
                    <strong style={{ opacity: 1, fontWeight: 500 }}>{row.value}</strong>
                  </div>
                ))}
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 18,
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    padding: 12,
                    textAlign: "center",
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderRadius: 2,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Book a shift with Robert →
                </button>
                <div style={{ fontSize: 10, opacity: 0.45, textAlign: "center", marginTop: 10, letterSpacing: "0.06em" }}>
                  NMCZ Practicing Certificate No. 440078 · Issued Dec 2025
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFESSIONALS */}
      <section id="professionals" style={{ padding: "100px 80px", background: "#faf8f3" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3d6b4f", marginBottom: 20 }}>
          <div style={{ width: 24, height: 1, background: "#3d6b4f" }} />
          Who we verify
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 640, marginBottom: 24 }}>
          Five disciplines. One <em style={{ fontStyle: "italic", color: "#3d6b4f" }}>trusted</em> platform.
        </h2>
        <p style={{ fontSize: 16, fontWeight: 300, color: "#4a4a42", maxWidth: 480, lineHeight: 1.75, marginBottom: 0 }}>
          Every professional on CareBridge is licensed, background-checked, and verified against official NMCZ and HPCZ databases before appearing in any search result.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginTop: 64 }}>
          {[
            { icon: "🩺", title: "Registered Nurses", desc: "Post-surgery care, medication administration, wound dressing, chronic disease management, and palliative care at home.", auth: "Verified by NMCZ" },
            { icon: "👶", title: "Midwives", desc: "Postnatal home visits, newborn checks, breastfeeding support, and maternal recovery care.", auth: "Verified by NMCZ" },
            { icon: "🦽", title: "Physiotherapists", desc: "Stroke rehabilitation, mobility recovery, post-orthopaedic care, and exercise therapy in the patient's home.", auth: "Verified by HPCZ" },
            { icon: "🧠", title: "Mental Health Counsellors", desc: "Home-based counselling for depression, anxiety, grief, and caregiver stress — for patients and families alike.", auth: "Verified by HPCZ" },
            { icon: "🤲", title: "Certified Caregivers", desc: "Daily living assistance, elderly care, companionship, and support for patients with long-term conditions.", auth: "Certified & background-checked" },
          ].map((card) => (
            <div key={card.title} style={{ background: "#f5f3ed", padding: "36px 32px", cursor: "default", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#e8f0eb")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#f5f3ed")}
            >
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e8f0eb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 20 }}>{card.icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, marginBottom: 8 }}>{card.title}</h3>
              <p style={{ fontSize: 13, fontWeight: 300, color: "#4a4a42", lineHeight: 1.7, marginBottom: 16 }}>{card.desc}</p>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3d6b4f", opacity: 0.8 }}>{card.auth}</div>
            </div>
          ))}
          <div style={{ background: "#3d6b4f", color: "#fff", padding: "36px 32px" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 20 }}>＋</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, marginBottom: 8, color: "#fff" }}>Are you a healthcare professional?</h3>
            <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 16 }}>List your services, set your availability, and connect with Lusaka families who need your expertise.</p>
            <a href="#" style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.9)", letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: 2 }}>Apply to join →</a>
          </div>
        </div>
      </section>

      {/* WHY CAREBRIDGE */}
      <section style={{ padding: "100px 80px", background: "#f5f3ed" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3d6b4f", marginBottom: 20 }}>
          <div style={{ width: 24, height: 1, background: "#3d6b4f" }} />
          Why CareBridge
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 640, marginBottom: 24 }}>
              The trust problem in<br />home care — <em style={{ fontStyle: "italic", color: "#3d6b4f" }}>solved.</em>
            </h2>
            <p style={{ fontSize: 16, fontWeight: 300, color: "#4a4a42", maxWidth: 480, lineHeight: 1.75, marginBottom: 48 }}>
              Families in Zambia deserve to know exactly who is caring for their loved ones. CareBridge is the only platform that verifies every professional against official licensing databases before they appear in any search result.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                { num: "01", title: "License verification at the source", desc: "We check directly with NMCZ and HPCZ — not just against self-reported certificates." },
                { num: "02", title: "Shift-based, not subscription-based", desc: "Pay for what you need. An 8-hour shift for one week of recovery, not a recurring monthly fee." },
                { num: "03", title: "Payment held until care is delivered", desc: "Funds are released to the professional only after the shift is completed — protecting both sides." },
                { num: "04", title: "Built for Zambia", desc: "Mobile money payments, Lusaka-first coverage, and professionals who understand local healthcare context." },
              ].map((point) => (
                <div key={point.num} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 20, alignItems: "start" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "#3d6b4f", opacity: 0.7 }}>{point.num}</div>
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{point.title}</h4>
                    <p style={{ fontSize: 14, fontWeight: 300, color: "#4a4a42", lineHeight: 1.7 }}>{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "#3d6b4f", borderRadius: 4, aspectRatio: "4/5", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=700&q=80')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.5 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(61,107,79,0.85) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 36, left: 36, right: 36, color: "#fff" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, lineHeight: 1.2, marginBottom: 10 }}>"I needed someone I could trust with my mother."</h3>
              <p style={{ fontSize: 13, opacity: 0.75, lineHeight: 1.6 }}>CareBridge families see the license number, qualifications, and past reviews of every professional before confirming a booking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "100px 80px", background: "#1a1a18", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6a9b7a", marginBottom: 20 }}>
          <div style={{ width: 24, height: 1, background: "#6a9b7a" }} />
          Pricing
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", maxWidth: 640, marginBottom: 24 }}>
          Simple, transparent <em style={{ fontStyle: "italic", color: "#6a9b7a" }}>fees.</em>
        </h2>
        <p style={{ fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.55)", maxWidth: 480, lineHeight: 1.75 }}>
          No subscriptions required for families. Pay per shift — or choose a membership for regular care needs.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginTop: 64 }}>
          {[
            {
              tag: "Per shift",
              amount: "20%",
              period: "platform fee per booking",
              features: ["No account required", "Search & browse professionals", "Shift booking & scheduling", "Mobile money payment", "Ratings & reviews"],
              cta: "Book a shift",
              featured: false,
            },
            {
              tag: "Family membership",
              amount: "K250",
              period: "per month",
              features: ["Reduced platform fee", "Priority bookings", "Saved patient profiles", "Booking history & records", "Dedicated support"],
              cta: "Start membership",
              featured: true,
            },
            {
              tag: "For professionals",
              amount: "K150",
              period: "per month",
              features: ["Verified badge on profile", "Appear in family searches", "Scheduling & availability tools", "Booking management", "Earnings dashboard"],
              cta: "Join as a professional",
              featured: false,
            },
          ].map((card) => (
            <div
              key={card.tag}
              style={{
                background: card.featured ? "#3d6b4f" : "rgba(255,255,255,0.05)",
                border: card.featured ? "1px solid #3d6b4f" : "1px solid rgba(255,255,255,0.1)",
                padding: "40px 36px",
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: card.featured ? "rgba(255,255,255,0.7)" : "#6a9b7a", marginBottom: 24, display: "block" }}>{card.tag}</span>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, lineHeight: 1, marginBottom: 4 }}>{card.amount}</div>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 28 }}>{card.period}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
                {card.features.map((f) => (
                  <li key={f} style={{ fontSize: 13, fontWeight: 300, opacity: 0.8, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ display: "block", width: 16, height: 1, background: card.featured ? "rgba(255,255,255,0.5)" : "#6a9b7a", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: 13,
                  border: card.featured ? "1px solid #fff" : "1px solid rgba(255,255,255,0.25)",
                  background: card.featured ? "#fff" : "transparent",
                  color: card.featured ? "#3d6b4f" : "#fff",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: 2,
                }}
              >
                {card.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* PAYMENT */}
      <section style={{ padding: "100px 80px", background: "#faf8f3" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3d6b4f", marginBottom: 20 }}>
          <div style={{ width: 24, height: 1, background: "#3d6b4f" }} />
          Payments
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 640, marginBottom: 24 }}>
              Pay the way<br />Zambia <em style={{ fontStyle: "italic", color: "#3d6b4f" }}>pays.</em>
            </h2>
            <p style={{ fontSize: 16, fontWeight: 300, color: "#4a4a42", maxWidth: 480, lineHeight: 1.75 }}>
              Mobile money is how families transact. CareBridge supports all major Zambian payment methods — no bank account required.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { color: "#FFC300", name: "MTN Mobile Money" },
              { color: "#E4003A", name: "Airtel Money" },
              { color: "#005E2F", name: "Zamtel Kwacha" },
              { color: "#1a1a18", name: "Debit / Credit Card", sub: "Visa & Mastercard" },
            ].map((provider) => (
              <div key={provider.name} style={{ display: "flex", alignItems: "center", gap: 16, background: "#f5f3ed", padding: "18px 24px", borderRadius: 2, border: "1px solid rgba(26,26,24,0.1)", fontSize: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: provider.color, flexShrink: 0 }} />
                {provider.name}
                <span style={{ fontSize: 12, color: "#4a4a42", marginLeft: "auto" }}>{provider.sub || "Supported"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#3d6b4f", color: "#fff", padding: "100px 80px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>
          <span style={{ borderLeft: "1px solid rgba(255,255,255,0.4)", paddingLeft: 12 }}>Get started today</span>
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", maxWidth: 700, margin: "0 auto 16px" }}>
          Your loved one deserves<br />care you can <em style={{ fontStyle: "italic" }}>trust.</em>
        </h2>
        <p style={{ fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.7)", maxWidth: 480, lineHeight: 1.75, margin: "0 auto 48px", textAlign: "center" }}>
          CareBridge connects Zambian families with verified, licensed healthcare professionals — by the shift, in the comfort of home.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#how" style={{ background: "#fff", color: "#3d6b4f", padding: "16px 36px", borderRadius: 2, fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>Find a Caregiver</a>
          <a href="#" style={{ border: "1px solid rgba(255,255,255,0.4)", color: "#fff", padding: "16px 36px", borderRadius: 2, fontSize: 13, fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>List your services</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#1a1a18", color: "rgba(255,255,255,0.6)", padding: "60px 80px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, paddingBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 32 }}>
          <div>
            <a href="#" style={{ textDecoration: "none" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, letterSpacing: "0.02em", color: "#fff" }}>
                Care<span style={{ color: "#6a9b7a" }}>Bridge</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: -2, marginBottom: 12 }}>
                Zambia · Verified Home Healthcare
              </div>
            </a>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 240 }}>Connecting Zambian families with verified, licensed healthcare professionals for trusted home care — by the shift.</p>
          </div>
          {[
            { heading: "Families", links: ["How it works", "Browse professionals", "Pricing", "Family membership"] },
            { heading: "Professionals", links: ["Join CareBridge", "Verification process", "Professional subscription", "Support"] },
            { heading: "Company", links: ["About", "Contact", "Terms & Conditions", "Privacy Policy"] },
          ].map((col) => (
            <div key={col.heading}>
              <h4 style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>{col.heading}</h4>
              {col.links.map((link) => (
                <a key={link} href="#" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", marginBottom: 10 }}>{link}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
          <span style={{ opacity: 0.4 }}>© CareBridge 2025. Lusaka, Zambia. All rights reserved.</span>
          <span style={{ opacity: 0.4 }}>NMCZ & HPCZ Verified Platform</span>
        </div>
      </footer>
    </div>
  );
}
