import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";

const SERIF = "'Cormorant Garamond', serif";
const BODY = "'Raleway', sans-serif";
const UI = "'DM Sans', sans-serif";

interface Professional {
  id: number;
  name: string;
  firstName: string;
  discipline: string;
  institution: string;
  badge: string;
  badgeType: "NMCZ" | "HPCZ" | "Certified";
  certNumber: string;
  certExpiry: string;
  rate: number;
  rating: number;
  bookings: number;
  location: string;
  available: boolean;
  bio: string;
  specializations: string[];
  qualifications: { qualification: string; institution: string; experience: string }[];
  reviews: { rating: number; quote: string; name: string; role: string; initials: string }[];
}

const PROFESSIONALS: Professional[] = [
  {
    id: 1,
    name: "Robert Ngoma",
    firstName: "Robert",
    discipline: "Registered Nurse",
    institution: "UTH Lusaka",
    badge: "NMCZ Verified",
    badgeType: "NMCZ",
    certNumber: "440078",
    certExpiry: "Dec 2026",
    rate: 450,
    rating: 4.9,
    bookings: 120,
    location: "Kabulonga",
    available: true,
    bio: "Robert is a highly experienced Registered Nurse with over 7 years at the University Teaching Hospital in Lusaka. Specialising in post-surgical care, wound management, and burns recovery, he brings clinical excellence and compassionate care directly to your home.",
    specializations: ["Post-surgical care", "Wound management", "Burns & Emergency", "Paediatrics", "Chronic disease"],
    qualifications: [
      { qualification: "Diploma in Nursing", institution: "Lusaka Apex Medical University", experience: "7+ years" },
      { qualification: "Advanced Wound Care", institution: "UTH Training Centre", experience: "5+ years" },
    ],
    reviews: [
      { rating: 5, quote: "Robert was professional, kind, and thorough. My father recovered so much faster with his daily wound care visits.", name: "Chanda M.", role: "Patient's daughter · Kabulonga", initials: "CM" },
      { rating: 5, quote: "Arrived on time, communicated everything clearly to our family. Highly recommend for post-surgical home care.", name: "Bwalya T.", role: "Patient · Woodlands", initials: "BT" },
      { rating: 5, quote: "Exceptional care and professionalism. We felt completely at ease knowing Robert was managing mum's recovery.", name: "Mutale N.", role: "Patient's son · Roma", initials: "MN" },
    ],
  },
  {
    id: 2,
    name: "Mutinta Banda",
    firstName: "Mutinta",
    discipline: "Midwife",
    institution: "Women & Child Hospital",
    badge: "NMCZ Verified",
    badgeType: "NMCZ",
    certNumber: "221045",
    certExpiry: "Jun 2026",
    rate: 380,
    rating: 4.8,
    bookings: 89,
    location: "Woodlands",
    available: true,
    bio: "Mutinta is a certified midwife with extensive experience in postnatal home care. She provides breastfeeding support, newborn checks, and maternal recovery guidance, helping new mothers and their babies thrive from the comfort of their homes.",
    specializations: ["Postnatal care", "Newborn assessment", "Breastfeeding support", "Maternal recovery", "Family planning"],
    qualifications: [
      { qualification: "Bachelor of Midwifery", institution: "Lusaka School of Nursing & Midwifery", experience: "6+ years" },
      { qualification: "Lactation Counselling", institution: "Women & Child Hospital", experience: "4+ years" },
    ],
    reviews: [
      { rating: 5, quote: "Mutinta was incredibly supportive during my first weeks as a new mother. Her knowledge and patience were invaluable.", name: "Namukolo S.", role: "New mother · Ibex Hill", initials: "NS" },
      { rating: 5, quote: "Professional and thorough with the newborn checks. Made us feel confident and prepared.", name: "David K.", role: "New father · Woodlands", initials: "DK" },
      { rating: 4, quote: "Great postnatal support. Mutinta helped me through the early breastfeeding challenges with such care.", name: "Grace M.", role: "New mother · Roma", initials: "GM" },
    ],
  },
  {
    id: 3,
    name: "Chanda Mwale",
    firstName: "Chanda",
    discipline: "Physiotherapist",
    institution: "HPCZ",
    badge: "HPCZ Certified",
    badgeType: "HPCZ",
    certNumber: "330192",
    certExpiry: "Mar 2027",
    rate: 500,
    rating: 4.7,
    bookings: 64,
    location: "Roma",
    available: false,
    bio: "Chanda is a HPCZ-certified physiotherapist specialising in neurological and orthopaedic rehabilitation. With a focus on stroke recovery and post-surgical mobility, she designs personalised exercise programmes that patients can follow at home.",
    specializations: ["Stroke rehabilitation", "Post-orthopaedic recovery", "Mobility training", "Pain management", "Home exercise programmes"],
    qualifications: [
      { qualification: "BSc Physiotherapy", institution: "University of Zambia", experience: "5+ years" },
      { qualification: "Neurological Rehab", institution: "HPCZ Continuing Education", experience: "3+ years" },
    ],
    reviews: [
      { rating: 5, quote: "Chanda's stroke rehabilitation programme for my father was exceptional. His mobility improved significantly within weeks.", name: "Esther N.", role: "Patient's daughter · Roma", initials: "EN" },
      { rating: 4, quote: "Professional, knowledgeable, and motivating. She made the exercises accessible and achievable.", name: "Joseph T.", role: "Patient · Chelston", initials: "JT" },
      { rating: 5, quote: "Outstanding physiotherapist. The personalised home programme made all the difference to my recovery.", name: "Alice C.", role: "Patient · Ibex Hill", initials: "AC" },
    ],
  },
  {
    id: 4,
    name: "Namukolo Phiri",
    firstName: "Namukolo",
    discipline: "Mental Health Counsellor",
    institution: "HPCZ",
    badge: "HPCZ Certified",
    badgeType: "HPCZ",
    certNumber: "410887",
    certExpiry: "Sep 2026",
    rate: 420,
    rating: 4.9,
    bookings: 45,
    location: "Ibex Hill",
    available: true,
    bio: "Namukolo is a compassionate and skilled mental health counsellor certified by HPCZ. She provides home-based therapy for individuals dealing with depression, anxiety, grief, and caregiver stress, creating a safe space for healing within your own environment.",
    specializations: ["Depression & anxiety", "Grief counselling", "Caregiver support", "Trauma therapy", "Family counselling"],
    qualifications: [
      { qualification: "BSc Clinical Psychology", institution: "University of Zambia", experience: "6+ years" },
      { qualification: "Trauma-Informed Care", institution: "HPCZ Advanced Training", experience: "4+ years" },
    ],
    reviews: [
      { rating: 5, quote: "Namukolo created such a safe, warm space for our family during an incredibly difficult time. Truly gifted.", name: "Peter M.", role: "Family member · Roma", initials: "PM" },
      { rating: 5, quote: "Her approach to grief counselling is thoughtful and evidence-based. I cannot recommend her highly enough.", name: "Grace N.", role: "Patient · Woodlands", initials: "GN" },
      { rating: 5, quote: "The home visits made such a difference. I felt comfortable opening up in my own space.", name: "Robert Z.", role: "Patient · Chelston", initials: "RZ" },
    ],
  },
  {
    id: 5,
    name: "Joseph Tembo",
    firstName: "Joseph",
    discipline: "Certified Caregiver",
    institution: "Certified",
    badge: "Certified",
    badgeType: "Certified",
    certNumber: "CG-10245",
    certExpiry: "Nov 2026",
    rate: 280,
    rating: 4.6,
    bookings: 156,
    location: "Rhodes Park",
    available: true,
    bio: "Joseph is a dedicated certified caregiver with extensive experience supporting elderly patients and individuals with long-term conditions. He provides compassionate daily living assistance, companionship, and personal care — giving families peace of mind.",
    specializations: ["Elderly care", "Daily living assistance", "Companion care", "Medication reminders", "Mobility support"],
    qualifications: [
      { qualification: "Certificate in Caregiving", institution: "Zambia Institute of Health Sciences", experience: "8+ years" },
      { qualification: "First Aid & CPR", institution: "Red Cross Zambia", experience: "8+ years" },
    ],
    reviews: [
      { rating: 5, quote: "Joseph has been caring for my grandmother for three months. The whole family has noticed what a difference he makes.", name: "Mutinta B.", role: "Family member · Woodlands", initials: "MB" },
      { rating: 4, quote: "Reliable, gentle, and genuinely caring. Grandpa has really taken to him.", name: "Chanda K.", role: "Family member · Rhodes Park", initials: "CK" },
      { rating: 5, quote: "Joseph treats our mother with complete dignity and kindness. We are so grateful to CareBridge for matching us.", name: "David Z.", role: "Family member · Kabulonga", initials: "DZ" },
    ],
  },
  {
    id: 6,
    name: "Grace Musonda",
    firstName: "Grace",
    discipline: "Registered Nurse",
    institution: "UTH",
    badge: "NMCZ Verified",
    badgeType: "NMCZ",
    certNumber: "440219",
    certExpiry: "Aug 2026",
    rate: 430,
    rating: 4.8,
    bookings: 98,
    location: "Chelston",
    available: false,
    bio: "Grace is an experienced Registered Nurse from UTH with a strong background in chronic disease management and palliative care. She brings structured, compassionate nursing care to patients in their homes across Lusaka.",
    specializations: ["Chronic disease management", "Palliative care", "Medication administration", "Wound dressing", "Patient education"],
    qualifications: [
      { qualification: "Diploma in Registered Nursing", institution: "University Teaching Hospital School of Nursing", experience: "6+ years" },
      { qualification: "Palliative Care Certificate", institution: "NMCZ Continuing Education", experience: "3+ years" },
    ],
    reviews: [
      { rating: 5, quote: "Grace managed my father's diabetes care at home with such expertise and warmth. Truly exceptional.", name: "Bwalya M.", role: "Patient's son · Chelston", initials: "BM" },
      { rating: 5, quote: "Professional and thorough. She explained everything clearly and made my mother feel at ease.", name: "Esther T.", role: "Patient's daughter · Woodlands", initials: "ET" },
      { rating: 4, quote: "Reliable and skilled. Grace's palliative care approach gave our whole family such comfort.", name: "Joseph N.", role: "Family member · Roma", initials: "JN" },
    ],
  },
  {
    id: 7,
    name: "David Zulu",
    firstName: "David",
    discipline: "Physiotherapist",
    institution: "HPCZ",
    badge: "HPCZ Certified",
    badgeType: "HPCZ",
    certNumber: "330341",
    certExpiry: "Jan 2027",
    rate: 480,
    rating: 4.7,
    bookings: 77,
    location: "Kabulonga",
    available: true,
    bio: "David is a certified physiotherapist with a strong focus on sports injury recovery and musculoskeletal rehabilitation. He designs evidence-based home exercise programmes to restore mobility, reduce pain, and rebuild strength.",
    specializations: ["Sports injury recovery", "Musculoskeletal rehab", "Back & neck pain", "Post-fracture recovery", "Strength training"],
    qualifications: [
      { qualification: "BSc Physiotherapy", institution: "Cavendish University Zambia", experience: "5+ years" },
      { qualification: "Sports Rehabilitation", institution: "HPCZ Advanced Training", experience: "3+ years" },
    ],
    reviews: [
      { rating: 5, quote: "David's rehab programme after my knee surgery was outstanding. I was walking unaided weeks ahead of schedule.", name: "Robert N.", role: "Patient · Kabulonga", initials: "RN" },
      { rating: 5, quote: "Very professional and motivating. His knowledge of post-fracture recovery made a huge difference.", name: "Namukolo P.", role: "Patient · Ibex Hill", initials: "NP" },
      { rating: 4, quote: "Excellent physiotherapist. David really understood my condition and tailored the exercises perfectly.", name: "Alice C.", role: "Patient · Chelston", initials: "AC" },
    ],
  },
  {
    id: 8,
    name: "Esther Nkole",
    firstName: "Esther",
    discipline: "Midwife",
    institution: "NMCZ",
    badge: "NMCZ Verified",
    badgeType: "NMCZ",
    certNumber: "221198",
    certExpiry: "Oct 2026",
    rate: 360,
    rating: 4.5,
    bookings: 52,
    location: "Woodlands",
    available: true,
    bio: "Esther is a dedicated NMCZ-registered midwife with a focus on safe, supportive postnatal care. She helps new mothers navigate the physical and emotional demands of early motherhood, providing expert guidance and reassurance at home.",
    specializations: ["Postnatal home visits", "Newborn checks", "Breastfeeding guidance", "Maternal wellbeing", "Cord care"],
    qualifications: [
      { qualification: "Diploma in Midwifery", institution: "Chainama College of Health Sciences", experience: "5+ years" },
      { qualification: "Neonatal Assessment", institution: "NMCZ Continuing Education", experience: "3+ years" },
    ],
    reviews: [
      { rating: 5, quote: "Esther was so calm and reassuring during my first week home with my newborn. I felt completely supported.", name: "Chanda M.", role: "New mother · Roma", initials: "CM" },
      { rating: 4, quote: "Professional and knowledgeable. Her breastfeeding support was exactly what I needed.", name: "Grace Z.", role: "New mother · Woodlands", initials: "GZ" },
      { rating: 4, quote: "Thorough newborn checks and very gentle. Would definitely book again.", name: "Peter T.", role: "New father · Chelston", initials: "PT" },
    ],
  },
  {
    id: 9,
    name: "Peter Mumba",
    firstName: "Peter",
    discipline: "Mental Health Counsellor",
    institution: "HPCZ",
    badge: "HPCZ Certified",
    badgeType: "HPCZ",
    certNumber: "411024",
    certExpiry: "Apr 2027",
    rate: 400,
    rating: 4.8,
    bookings: 38,
    location: "Roma",
    available: false,
    bio: "Peter is an empathetic and experienced mental health counsellor, specialising in anxiety, depression, and workplace stress. He offers a structured, evidence-based approach to therapy, providing sessions in the comfort and privacy of your home.",
    specializations: ["Anxiety & stress", "Depression", "Work-related burnout", "Relationships", "Cognitive Behavioural Therapy"],
    qualifications: [
      { qualification: "BSc Psychology", institution: "University of Zambia", experience: "5+ years" },
      { qualification: "Cognitive Behavioural Therapy", institution: "HPCZ Accredited Training", experience: "3+ years" },
    ],
    reviews: [
      { rating: 5, quote: "Peter's CBT approach helped me manage my anxiety in ways I never thought possible. Life-changing sessions.", name: "Alice N.", role: "Patient · Ibex Hill", initials: "AN" },
      { rating: 5, quote: "Thoughtful, professional, and genuinely caring. I always feel heard and supported after our sessions.", name: "Grace T.", role: "Patient · Kabulonga", initials: "GT" },
      { rating: 5, quote: "Having sessions at home made such a difference to how comfortable I felt opening up.", name: "Joseph Z.", role: "Patient · Rhodes Park", initials: "JZ" },
    ],
  },
  {
    id: 10,
    name: "Alice Chirwa",
    firstName: "Alice",
    discipline: "Certified Caregiver",
    institution: "Certified",
    badge: "Certified",
    badgeType: "Certified",
    certNumber: "CG-10389",
    certExpiry: "May 2027",
    rate: 260,
    rating: 4.9,
    bookings: 201,
    location: "Ibex Hill",
    available: true,
    bio: "Alice is one of CareBridge's most trusted and highly-rated caregivers. With over 6 years of experience in elderly care and long-term condition support, she brings warmth, professionalism, and dedication to every shift. Families consistently praise her reliability and genuine compassion.",
    specializations: ["Elderly care", "Dementia support", "Daily living assistance", "Companionship", "Personal hygiene care"],
    qualifications: [
      { qualification: "Certificate in Home-Based Caregiving", institution: "Zambia Institute of Health Sciences", experience: "6+ years" },
      { qualification: "Dementia Care Training", institution: "Alzheimer's Society Zambia", experience: "3+ years" },
    ],
    reviews: [
      { rating: 5, quote: "Alice has been caring for my grandmother for six months and the improvement in her wellbeing is remarkable.", name: "Mutinta B.", role: "Family member · Woodlands", initials: "MB" },
      { rating: 5, quote: "Warm, reliable, and endlessly patient. Our family trusts Alice completely with our father's care.", name: "Robert N.", role: "Family member · Kabulonga", initials: "RN" },
      { rating: 5, quote: "CareBridge matched us with Alice and we've never looked back. She goes above and beyond every single time.", name: "Chanda P.", role: "Family member · Roma", initials: "CP" },
    ],
  },
];

const PROFESSIONALS_MAP = Object.fromEntries(PROFESSIONALS.map((p) => [String(p.id), p]));

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: "#e8a820", fontSize: size }}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

export default function ProfessionalProfilePage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const id = params?.id ?? "";
  const pro = PROFESSIONALS_MAP[id];

  const [selectedShift, setSelectedShift] = useState<"8h" | "12h" | "24h">("8h");
  const [selectedDate, setSelectedDate] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const shiftMultiplier = { "8h": 1, "12h": 1.4, "24h": 2.2 };
  const shiftPrice = pro ? Math.round(pro.rate * shiftMultiplier[selectedShift]) : 0;

  // ── NAV (shared) ──
  const Nav = (
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
  );

  // ── 404 ──
  if (!pro) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cb-cream)", color: "var(--cb-ink)", fontFamily: BODY }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />
        {Nav}
        <div style={{ paddingTop: 64, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", textAlign: "center", padding: "120px 32px" }}>
          <div style={{ fontFamily: SERIF, fontSize: 80, fontWeight: 300, color: "var(--cb-border-strong)", lineHeight: 1, marginBottom: 16 }}>404</div>
          <h1 style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 300, color: "var(--cb-ink)", marginBottom: 12 }}>Professional not found</h1>
          <p style={{ fontSize: 15, color: "var(--cb-ink-light)", fontFamily: BODY, lineHeight: 1.75, maxWidth: 400, marginBottom: 32 }}>
            The professional you're looking for doesn't exist or may have been removed from the directory.
          </p>
          <Link href="/professionals">
            <a style={{ background: "var(--cb-sage)", color: "#fff", padding: "13px 28px", borderRadius: 2, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", fontFamily: UI, fontWeight: 600 }}>
              Browse all professionals →
            </a>
          </Link>
        </div>
        <style>{`
          @media (max-width: 768px) { .cb-nav-links-desktop { display: none !important; } }
          @media (min-width: 769px) { .cb-hamburger { display: none !important; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cb-cream)", color: "var(--cb-ink)", fontFamily: BODY }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {Nav}

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, background: "var(--cb-warm-white)", borderBottom: "1px solid var(--cb-border)", padding: "24px 32px", zIndex: 190, display: "flex", flexDirection: "column", gap: 16 }}>
          <Link href="/"><a onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cb-ink-light)", textDecoration: "none", fontFamily: UI }}>Home</a></Link>
          <a href="/#how" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cb-ink-light)", textDecoration: "none", fontFamily: UI }}>How it Works</a>
          <a href="/#pricing" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cb-ink-light)", textDecoration: "none", fontFamily: UI }}>Pricing</a>
          <Link href="/login"><a onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cb-ink-light)", textDecoration: "none", fontFamily: UI }}>Log in</a></Link>
          <Link href="/register"><a onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cb-sage)", textDecoration: "none", fontFamily: UI }}>Get started →</a></Link>
        </div>
      )}

      <div style={{ paddingTop: 64 }}>
        {/* ── BREADCRUMB ── */}
        <div style={{ background: "var(--cb-warm-white)", borderBottom: "1px solid var(--cb-border)", padding: "14px 32px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontFamily: UI, color: "var(--cb-ink-light)" }}>
            <Link href="/professionals">
              <a style={{ color: "var(--cb-sage)", textDecoration: "none", fontWeight: 500 }}>Professionals</a>
            </Link>
            <span style={{ opacity: 0.4 }}>/</span>
            <span style={{ color: "var(--cb-ink)", fontWeight: 500 }}>{pro.name}</span>
          </div>
        </div>

        {/* ── TWO COLUMN LAYOUT ── */}
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 32px 80px" }}>
          <div className="cb-profile-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "start" }}>

            {/* ════════════════════════
                LEFT COLUMN
            ════════════════════════ */}
            <div>
              {/* Profile photo */}
              <div style={{ borderRadius: 4, overflow: "hidden", aspectRatio: "3/2", marginBottom: 32 }}>
                <img
                  src={`https://i.pravatar.cc/600?u=${pro.id}`}
                  alt={pro.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>

              {/* Name + discipline */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cb-sage)", marginBottom: 8, fontFamily: UI }}>
                  {pro.discipline}
                </div>
                <h1 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4vw,52px)", fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.02em", color: "var(--cb-ink)", marginBottom: 6 }}>
                  {pro.name}
                </h1>
                <div style={{ fontSize: 14.5, color: "var(--cb-ink-light)", fontFamily: BODY, marginBottom: 16 }}>
                  {pro.institution}
                </div>

                {/* Verification badges */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--cb-sage-light)", border: "1px solid rgba(61,107,79,0.18)", borderRadius: 2, padding: "6px 12px" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cb-sage)" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cb-sage)", fontFamily: UI }}>{pro.badge}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--cb-cream)", border: "1px solid var(--cb-border-strong)", borderRadius: 2, padding: "6px 12px" }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--cb-ink-light)", fontFamily: UI }}>Cert. No. {pro.certNumber}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--cb-cream)", border: "1px solid var(--cb-border-strong)", borderRadius: 2, padding: "6px 12px" }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--cb-ink-light)", fontFamily: UI }}>Valid until {pro.certExpiry}</span>
                  </div>
                </div>

                {/* Rating + bookings */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <StarRating rating={pro.rating} size={16} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--cb-ink)", fontFamily: UI }}>{pro.rating}</span>
                  <span style={{ fontSize: 13, color: "var(--cb-ink-light)", fontFamily: BODY }}>· {pro.bookings} bookings</span>
                </div>

                {/* Available status */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: pro.available ? "rgba(34,197,94,0.1)" : "rgba(156,163,175,0.1)", border: `1px solid ${pro.available ? "rgba(34,197,94,0.25)" : "rgba(156,163,175,0.25)"}`, borderRadius: 20, padding: "6px 14px", marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: pro.available ? "#22c55e" : "#9ca3af" }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: pro.available ? "#1a6e38" : "var(--cb-ink-light)", fontFamily: UI, letterSpacing: "0.04em" }}>
                    {pro.available ? "Available now" : "Currently unavailable"}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "var(--cb-border)", marginBottom: 28 }} />

              {/* Bio */}
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: "var(--cb-ink)", marginBottom: 12 }}>About</h2>
                <p style={{ fontSize: 15, color: "var(--cb-ink-light)", lineHeight: 1.85, fontFamily: BODY }}>{pro.bio}</p>
              </div>

              {/* Specializations */}
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: "var(--cb-ink)", marginBottom: 16 }}>Specializations</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {pro.specializations.map((spec) => (
                    <span
                      key={spec}
                      style={{
                        background: "var(--cb-warm-white)",
                        border: "1px solid var(--cb-border-strong)",
                        borderRadius: 2,
                        padding: "6px 14px",
                        fontSize: 12.5,
                        color: "var(--cb-ink)",
                        fontFamily: UI,
                        fontWeight: 400,
                        letterSpacing: "0.03em",
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Qualifications table */}
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: "var(--cb-ink)", marginBottom: 16 }}>Qualifications</h2>
                <div style={{ border: "1px solid var(--cb-border)", borderRadius: 4, overflow: "hidden" }}>
                  {/* Table header */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "var(--cb-warm-white)", borderBottom: "1px solid var(--cb-border)", padding: "12px 20px" }}>
                    {["Qualification", "Institution", "Experience"].map((h) => (
                      <div key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cb-ink-light)", fontFamily: UI }}>{h}</div>
                    ))}
                  </div>
                  {pro.qualifications.map((q, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        padding: "16px 20px",
                        borderBottom: i < pro.qualifications.length - 1 ? "1px solid var(--cb-border)" : undefined,
                        background: i % 2 === 0 ? "transparent" : "rgba(61,107,79,0.02)",
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--cb-ink)", fontFamily: BODY }}>{q.qualification}</div>
                      <div style={{ fontSize: 13.5, color: "var(--cb-ink-light)", fontFamily: BODY }}>{q.institution}</div>
                      <div style={{ fontSize: 13.5, color: "var(--cb-sage)", fontWeight: 600, fontFamily: UI }}>{q.experience}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: "var(--cb-ink)" }}>Reviews</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <StarRating rating={pro.rating} size={15} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--cb-ink)", fontFamily: UI }}>{pro.rating}</span>
                    <span style={{ fontSize: 13, color: "var(--cb-ink-light)", fontFamily: BODY }}>({pro.bookings} reviews)</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {pro.reviews.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        background: "var(--cb-warm-white)",
                        border: "1px solid var(--cb-border)",
                        borderRadius: 4,
                        padding: "24px 24px 20px",
                        borderTop: "3px solid var(--cb-sage)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                        <StarRating rating={r.rating} size={13} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--cb-ink)", fontFamily: UI }}>{r.rating}.0</span>
                      </div>
                      <p style={{ fontSize: 14.5, color: "var(--cb-ink)", lineHeight: 1.8, fontFamily: BODY, marginBottom: 16, fontStyle: "italic" }}>
                        "{r.quote}"
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--cb-sage)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: UI, flexShrink: 0 }}>
                          {r.initials}
                        </div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--cb-ink)", fontFamily: BODY }}>{r.name}</div>
                          <div style={{ fontSize: 11.5, color: "var(--cb-ink-light)", fontFamily: UI, letterSpacing: "0.04em" }}>{r.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ════════════════════════
                RIGHT COLUMN — BOOKING CARD
            ════════════════════════ */}
            <div style={{ position: "sticky", top: 84 }}>
              <div style={{ background: "var(--cb-warm-white)", border: "1px solid var(--cb-border)", borderRadius: 4, overflow: "hidden", boxShadow: "0 4px 24px rgba(26,26,24,0.08)" }}>
                {/* Price header */}
                <div style={{ background: "var(--cb-sage)", padding: "24px 28px" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", fontFamily: UI, marginBottom: 8 }}>
                    Starting rate
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 600, color: "#fff", lineHeight: 1 }}>K{pro.rate}</span>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontFamily: BODY }}>/ shift</span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: BODY, marginTop: 6 }}>
                    8-hour base rate · longer shifts available
                  </div>
                </div>

                <div style={{ padding: "24px 28px" }}>
                  {/* Shift type selector */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 10, fontFamily: UI }}>
                      Shift length
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {(["8h", "12h", "24h"] as const).map((sh) => (
                        <button
                          key={sh}
                          onClick={() => setSelectedShift(sh)}
                          style={{
                            padding: "10px 8px",
                            borderRadius: 2,
                            border: selectedShift === sh ? "1.5px solid var(--cb-sage)" : "1px solid var(--cb-border-strong)",
                            background: selectedShift === sh ? "var(--cb-sage-light)" : "transparent",
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.15s",
                          }}
                        >
                          <div style={{ fontSize: 14, fontWeight: 700, color: selectedShift === sh ? "var(--cb-sage)" : "var(--cb-ink)", fontFamily: UI }}>{sh}</div>
                          <div style={{ fontSize: 11, color: selectedShift === sh ? "var(--cb-sage)" : "var(--cb-ink-light)", fontFamily: BODY, marginTop: 2 }}>
                            K{Math.round(pro.rate * shiftMultiplier[sh])}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date picker */}
                  <div style={{ marginBottom: 24 }}>
                    <label
                      htmlFor="shift-date"
                      style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cb-ink-light)", marginBottom: 8, fontFamily: UI }}
                    >
                      Preferred date
                    </label>
                    <input
                      id="shift-date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        fontSize: 14,
                        fontFamily: BODY,
                        color: "var(--cb-ink)",
                        background: "var(--cb-cream)",
                        border: "1px solid var(--cb-border-strong)",
                        borderRadius: 2,
                        outline: "none",
                        boxSizing: "border-box",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  {/* Price summary */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: "1px solid var(--cb-border)", borderBottom: "1px solid var(--cb-border)", marginBottom: 20 }}>
                    <span style={{ fontSize: 13.5, color: "var(--cb-ink-light)", fontFamily: BODY }}>{selectedShift} shift rate</span>
                    <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "var(--cb-ink)" }}>K{shiftPrice}</span>
                  </div>

                  {/* Book button */}
                  <button
                    onClick={() => setLocation(`/book/${pro.id}`)}
                    style={{
                      width: "100%",
                      padding: "14px 20px",
                      background: "var(--cb-sage)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 2,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontFamily: UI,
                      marginBottom: 10,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#2d6644"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--cb-sage)"; }}
                  >
                    Book {pro.firstName} — K{shiftPrice} / shift
                  </button>

                  {/* Urgent button */}
                  <button
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      background: "transparent",
                      color: "#a06500",
                      border: "1px solid rgba(255,180,0,0.45)",
                      borderRadius: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontFamily: UI,
                      marginBottom: 20,
                      background2: "rgba(255,180,0,0.06)",
                    } as React.CSSProperties}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,180,0,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    ⚡ Urgent request — 60 min match
                  </button>

                  {/* Trust badges */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { icon: "🔒", text: "Payment held until shift complete" },
                      { icon: "✓", text: `${pro.badge}`, color: "var(--cb-sage)" },
                      { icon: "🛡", text: "Professionally insured" },
                    ].map(({ icon, text, color }) => (
                      <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: color ?? "var(--cb-ink-light)", fontFamily: BODY }}>
                        <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location card */}
              <div style={{ marginTop: 16, background: "var(--cb-warm-white)", border: "1px solid var(--cb-border)", borderRadius: 4, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>📍</span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--cb-ink)", fontFamily: UI }}>{pro.location}, Lusaka</div>
                  <div style={{ fontSize: 12, color: "var(--cb-ink-light)", fontFamily: BODY, marginTop: 2 }}>Serves surrounding areas</div>
                </div>
              </div>
            </div>

          </div>
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
        @media (max-width: 900px) {
          .cb-profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .cb-nav-links-desktop {
            display: none !important;
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
