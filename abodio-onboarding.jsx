import { useState, useEffect, useRef, useCallback } from "react";

/*  ═══════════════════════════════════════════════════════════════════════════
    ABODIO — Best-in-Class Onboarding Prototype
    Mobile-first · AI-led · Presentation-quality
    ═══════════════════════════════════════════════════════════════════════════ */

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const T = {
  sage:       "#1A7B7E",
  sageDark:   "#136062",
  sageDeep:   "#0D4547",
  sageSoft:   "#C2E0E1",
  sageGhost:  "#EBF5F5",
  cream:      "#F7F5F0",
  warmWhite:  "#FFFFFF",
  charcoal:   "#1A1A1A",
  text:       "#1A1A1A",
  textSoft:   "#4A4A4A",
  textMuted:  "#767676",
  border:     "#E2E0DB",
  borderSoft: "#EDEAE4",
  gold:       "#D4A853",
  goldSoft:   "#FDF7E6",
  coral:      "#D9654B",
  coralSoft:  "#FEF0EC",
  accent:     "#E8913A",
  font: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  fontDisplay: "'Fraunces', 'Georgia', serif",
  r12: 12, r16: 16, r20: 20, rFull: 999,
  shadow2: "0 4px 12px rgba(26,26,26,0.07), 0 1px 3px rgba(26,26,26,0.05)",
  shadowGlow: "0 0 0 4px rgba(26,123,126,0.12)",
};

// ─── PERSONAS ───────────────────────────────────────────────────────────────
const PERSONAS = {
  "new-homeowner": {
    id: "new-homeowner", label: "I just bought a home", icon: "🏡",
    subtitle: "Set up your new home right from day one",
    bodieIntro: "I'll help you set up your entire home in minutes. Let's start with the essentials that matter most.",
    firstWin: "12 maintenance tasks scheduled for your first year",
    spaces: ["Kitchen", "Primary Bedroom", "Living Room", "Garage", "Laundry Room"],
    assets: ["HVAC System", "Water Heater", "Refrigerator", "Washer/Dryer", "Smoke Detectors"],
    checklist: [
      { label: "Add your first space", icon: "🏠" },
      { label: "Upload a manual or receipt", icon: "📄" },
      { label: "Review your maintenance plan", icon: "🔧" },
      { label: "Ask Bodie to find your manuals", icon: "✨" },
    ],
    crm: ["new_homeowner", "high_intent"], bubble: { persona: "new_homeowner", stage: "activation" },
  },
  "get-organized": {
    id: "get-organized", label: "I want to get organized", icon: "📋",
    subtitle: "Finally have everything in one place",
    bodieIntro: "I'll help you catalog everything that matters — no more hunting through drawers for manuals.",
    firstWin: "8 appliance manuals auto-discovered",
    spaces: ["Kitchen", "Basement", "Utility Room", "Master Bath", "Attic"],
    assets: ["Furnace", "Roof", "Windows", "Dishwasher", "Electrical Panel"],
    checklist: [
      { label: "Create your first room", icon: "🏠" },
      { label: "Add an appliance", icon: "📱" },
      { label: "Upload a document", icon: "📄" },
      { label: "Let Bodie find your manuals", icon: "✨" },
    ],
    crm: ["organizer", "medium_intent"], bubble: { persona: "organizer", stage: "activation" },
  },
  "stay-maintained": {
    id: "stay-maintained", label: "Stay on top of maintenance", icon: "🔧",
    subtitle: "Never miss what matters for your home",
    bodieIntro: "I'll build a maintenance plan based on your home's specific systems and age. No more guessing what needs attention.",
    firstWin: "6 seasonal maintenance tasks auto-scheduled",
    spaces: ["Basement", "Garage", "Exterior", "Utility Room", "Attic"],
    assets: ["HVAC System", "Roof", "Gutters", "Water Heater", "Sump Pump"],
    checklist: [
      { label: "Add your home's key systems", icon: "🔧" },
      { label: "Review your maintenance plan", icon: "📋" },
      { label: "Set reminder preferences", icon: "🔔" },
      { label: "Ask Bodie about seasonal prep", icon: "✨" },
    ],
    crm: ["maintenance_focused", "high_intent"], bubble: { persona: "maintenance", stage: "activation" },
  },
  "protect-value": {
    id: "protect-value", label: "Protect my home's value", icon: "🛡️",
    subtitle: "Document everything for insurance & resale",
    bodieIntro: "I'll help you document everything — for insurance, resale, and peace of mind.",
    firstWin: "Home profile 35% complete — ahead of most homeowners",
    spaces: ["Kitchen", "Primary Bedroom", "Bathrooms", "Exterior", "Garage"],
    assets: ["Roof", "HVAC System", "Water Heater", "Windows", "Kitchen Appliances"],
    checklist: [
      { label: "Document a major system", icon: "🏠" },
      { label: "Upload insurance info", icon: "📋" },
      { label: "Log a past repair", icon: "🔧" },
      { label: "Ask Bodie about home value", icon: "✨" },
    ],
    crm: ["value_protector", "high_intent"], bubble: { persona: "value_protector", stage: "activation" },
  },
};

const HOME_TYPES = [
  { id: "single", label: "Single Family", icon: "🏠", desc: "Detached house" },
  { id: "condo", label: "Condo / Apt", icon: "🏢", desc: "Apartment or condo" },
  { id: "townhouse", label: "Townhouse", icon: "🏘️", desc: "Attached home" },
  { id: "multi", label: "Multi-Family", icon: "🏗️", desc: "2+ units" },
];

// ─── ANIMATION ──────────────────────────────────────────────────────────────
const Fade = ({ children, delay = 0, y = 20, duration = 600, style = {} }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      ...style,
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity ${duration}ms cubic-bezier(.2,.8,.3,1), transform ${duration}ms cubic-bezier(.2,.8,.3,1)`,
    }}>
      {children}
    </div>
  );
};

// ─── ICONS ──────────────────────────────────────────────────────────────────
const I = {
  Arrow: (p) => <svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Back: (p) => <svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Check: (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Sparkle: (p) => <svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.8"><path d="M12 2L14.2 8.6 21 10 14.2 12.8 12 22 9.8 12.8 3 10 9.8 8.6z" strokeLinejoin="round"/></svg>,
  Home: (p) => <svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill={p?.f||"none"} stroke={p?.c||"currentColor"} strokeWidth="1.8" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#D4A853" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Send: (p) => <svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Crown: (p) => <svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.8" strokeLinejoin="round"><path d="M2 20h20l-2-12-5 5-3-7-3 7-5-5z"/><rect x="2" y="20" width="20" height="2" rx="1"/></svg>,
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════
export default function AbodioPrototype() {
  const [screen, setScreen] = useState("splash");
  const [goal, setGoal] = useState(null);
  const [homeType, setHomeType] = useState(null);
  const [homeName, setHomeName] = useState("");
  const [homeYear, setHomeYear] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [magicPhase, setMagicPhase] = useState(0);
  const [checks, setChecks] = useState({});
  const [showBodie, setShowBodie] = useState(false);
  const [bodieMessages, setBodieMessages] = useState([]);
  const [bodieInput, setBodieInput] = useState("");
  const [bodieTyping, setBodieTyping] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [premiumSeen, setPremiumSeen] = useState(false);
  const scrollRef = useRef(null);
  const chatRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(typeof window !== "undefined" && window.innerWidth >= 768);

  const persona = goal ? PERSONAS[goal] : null;
  const homeLabel = HOME_TYPES.find(h => h.id === homeType)?.label || "home";

  const [simState, setSimState] = useState({ crm: [], brevo: [], bubble: {}, milestones: [] });
  const addMilestone = (m) => setSimState(p => ({ ...p, milestones: [...new Set([...p.milestones, m])] }));
  const addBrevo = (t) => setSimState(p => ({ ...p, brevo: [...new Set([...p.brevo, t])] }));

  const go = useCallback((s) => { setScreen(s); scrollRef.current?.scrollTo?.({ top: 0, behavior: "auto" }); }, []);

  useEffect(() => { if (screen === "splash") { const t = setTimeout(() => go("welcome"), 2200); return () => clearTimeout(t); } }, [screen, go]);

  useEffect(() => {
    if (screen !== "bodie-magic") return;
    setMagicPhase(0);
    const ts = [setTimeout(()=>setMagicPhase(1),600), setTimeout(()=>setMagicPhase(2),1800), setTimeout(()=>setMagicPhase(3),3200), setTimeout(()=>setMagicPhase(4),4500), setTimeout(()=>setMagicPhase(5),5800)];
    return () => ts.forEach(clearTimeout);
  }, [screen]);

  useEffect(() => {
    const done = Object.values(checks).filter(Boolean).length;
    if (done >= 2 && !premiumSeen) setTimeout(() => setShowPremium(true), 800);
  }, [checks, premiumSeen]);

  useEffect(() => { chatRef.current?.scrollTo?.({ top: chatRef.current.scrollHeight, behavior: "smooth" }); }, [bodieMessages, bodieTyping]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset home detail inputs when navigating back before step 3
  useEffect(() => {
    if (["splash", "welcome", "goal", "home-type"].includes(screen)) {
      setHomeName("");
      setHomeYear("");
    }
  }, [screen]);

  const completedCount = Object.values(checks).filter(Boolean).length;
  const totalChecks = persona?.checklist?.length || 4;
  const pct = Math.round((completedCount / totalChecks) * 100);

  const sendBodie = (text) => {
    const msg = text || bodieInput.trim();
    if (!msg) return;
    setBodieMessages(p => [...p, { role: "user", text: msg }]);
    setBodieInput(""); setBodieTyping(true);
    const lower = msg.toLowerCase();
    let response;
    if (lower.includes("set up") || lower.includes("setup") || lower.includes("start")) {
      response = `Done! I've pre-loaded your ${homeName || "home"} with ${persona?.spaces?.length || 5} spaces:\n\n${persona?.spaces?.slice(0,4).map(s=>`✓ ${s}`).join("\n")}\n\n…and found manuals for your ${persona?.assets?.slice(0,2).join(" and ")}.\n\nWant me to build your maintenance schedule next?`;
    } else if (lower.includes("maintenance") || lower.includes("schedule") || lower.includes("next")) {
      response = `Here's what needs attention for your ${homeYear ? homeYear+" " : ""}${homeLabel}:\n\n🔴  This week — Check smoke detector batteries\n🟡  This month — HVAC filter change\n🟢  This season — Gutter & exterior inspection\n\nI've added all 3 to your calendar with reminders.`;
    } else if (lower.includes("manual") || lower.includes("find")) {
      response = `Searching for manuals…\n\n✓  ${persona?.assets?.[0] || "HVAC"} — Owner's manual found\n✓  ${persona?.assets?.[1] || "Water Heater"} — Installation guide found\n✓  ${persona?.assets?.[2] || "Refrigerator"} — User manual found\n\nAll saved to your document vault.`;
    } else {
      response = `I can help with that! Here's what I can do:\n\n• Auto-setup rooms & assets\n• Find appliance manuals\n• Build a maintenance plan\n• Track service history\n\nWhat would you like to tackle first?`;
    }
    setTimeout(() => { setBodieTyping(false); setBodieMessages(p => [...p, { role: "bodie", text: response }]); addMilestone("bodie_chat"); addBrevo("bodie_engaged"); }, 2000);
  };

  // ── SHARED BUTTON STYLE ─────────────────────────────────────────────────
  const primaryBtn = {
    width:"100%", padding:"17px", borderRadius:T.r16, border:"none", cursor:"pointer",
    background:T.sage, color:"#fff", fontSize:16, fontWeight:600, fontFamily:T.font,
    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    boxShadow:`0 4px 16px ${T.sage}33`,
  };

  const optionBtn = (hover) => ({
    display:"flex", alignItems:"center", gap:14, width:"100%", padding:"16px 18px",
    borderRadius:T.r16, border:`1.5px solid ${T.border}`, background:T.warmWhite,
    cursor:"pointer", fontFamily:T.font, textAlign:"left", transition:"all .15s",
  });

  const inputStyle = {
    width:"100%", boxSizing:"border-box", padding:"15px 16px", borderRadius:T.r12,
    border:`1.5px solid ${T.border}`, fontSize:16, fontFamily:T.font, color:T.text,
    background:T.warmWhite, outline:"none", transition:"border .2s",
  };

  // ─── SCREENS ────────────────────────────────────────────────────────────

  const Splash = () => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", background:`linear-gradient(180deg, ${T.sageDeep} 0%, ${T.sageDark} 100%)`, padding: 32 }}>
      <Fade delay={200}><div style={{ width:64, height:64, borderRadius:20, background:"rgba(232,145,58,0.2)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}><I.Home s={32} c={T.accent} f={`${T.accent}55`} /></div></Fade>
      <Fade delay={500}><div style={{ fontFamily:T.fontDisplay, fontSize:28, fontWeight:600, color:"#fff", letterSpacing:"-0.5px" }}>abodio</div></Fade>
      <Fade delay={800}><div style={{ fontSize:14, color:"rgba(255,255,255,0.6)", marginTop:8 }}>Smart Home Management</div></Fade>
      <Fade delay={1200}><div style={{ width:32, height:3, borderRadius:2, background:"rgba(255,255,255,0.3)", marginTop:32, overflow:"hidden" }}><div style={{ width:"100%", height:"100%", borderRadius:2, background:"rgba(255,255,255,0.8)", animation:"loadBar 1.5s ease-in-out" }} /></div></Fade>
    </div>
  );

  const Welcome = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:T.cream }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 28px" }}>
        <Fade delay={100}>
          <div style={{ display:"flex", gap:2, marginBottom:24 }}>
            {[1,2,3,4,5].map(i => <span key={i}><I.Star /></span>)}
            <span style={{ fontSize:13, color:T.textMuted, marginLeft:6, lineHeight:"14px" }}>4.9 · 1,000+ homes</span>
          </div>
        </Fade>
        <Fade delay={200}><h1 style={{ fontFamily:T.fontDisplay, fontSize:34, fontWeight:600, lineHeight:1.12, color:T.charcoal, letterSpacing:"-0.8px", marginBottom:14 }}>Your home,<br/>finally under<br/>control.</h1></Fade>
        <Fade delay={400}><p style={{ fontSize:17, lineHeight:1.55, color:T.textSoft, maxWidth:320, marginBottom:36 }}>Track every system. Never miss maintenance. Let AI do the heavy lifting.</p></Fade>
        <Fade delay={550}>
          <div style={{ display:"flex", gap:20, marginBottom:44 }}>
            {[{ emoji:"📋", l:"Organize" }, { emoji:"🔧", l:"Maintain" }, { emoji:"✨", l:"AI-Powered" }].map((f, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:20 }}>{f.emoji}</span>
                <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{f.l}</span>
              </div>
            ))}
          </div>
        </Fade>
        <Fade delay={700}><button onClick={() => go("goal")} style={primaryBtn}>Get Started — Free <I.Arrow c="#fff" /></button></Fade>
        <Fade delay={850}><p style={{ textAlign:"center", fontSize:13, color:T.textMuted, marginTop:14 }}>Takes 2 minutes · No credit card required</p></Fade>
      </div>
    </div>
  );

  const Steps = ({ current, total = 4 }) => (
    <div style={{ display:"flex", gap:6, padding:"0 28px", marginBottom:4 }}>
      {Array.from({length:total}, (_,i) => (
        <div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=current?T.sage:T.borderSoft, opacity:i<=current?1:.5, transition:"all .4s" }} />
      ))}
    </div>
  );

  const GoalScreen = () => (
    <div style={{ padding:"20px 24px" }}>
      <Fade><p style={{ fontSize:12, fontWeight:700, color:T.sage, textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>Step 1 of 4</p></Fade>
      <Fade delay={80}><h2 style={{ fontFamily:T.fontDisplay, fontSize:26, fontWeight:600, lineHeight:1.2, color:T.charcoal, marginBottom:6 }}>What brings you to Abodio?</h2></Fade>
      <Fade delay={150}><p style={{ fontSize:15, color:T.textSoft, lineHeight:1.5, marginBottom:24 }}>We'll personalize everything based on your answer.</p></Fade>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {Object.values(PERSONAS).map((p, i) => (
          <Fade key={p.id} delay={200 + i * 70}>
            <button onClick={() => { setGoal(p.id); addBrevo(`goal_${p.id}`); addMilestone("goal_set"); setSimState(s => ({...s, crm: p.crm})); go("home-type"); }}
              style={optionBtn()}
              onMouseOver={e => { e.currentTarget.style.borderColor=T.sage; e.currentTarget.style.boxShadow=T.shadowGlow; }}
              onMouseOut={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.boxShadow="none"; }}>
              <span style={{ fontSize:28, width:40, textAlign:"center", flexShrink:0 }}>{p.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:16, fontWeight:600, color:T.text, marginBottom:2 }}>{p.label}</div>
                <div style={{ fontSize:13, color:T.textMuted }}>{p.subtitle}</div>
              </div>
              <I.Arrow s={18} c={T.textMuted} />
            </button>
          </Fade>
        ))}
      </div>
    </div>
  );

  const HomeTypeScreen = () => (
    <div style={{ padding:"20px 24px" }}>
      <Fade><p style={{ fontSize:12, fontWeight:700, color:T.sage, textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>Step 2 of 4</p></Fade>
      <Fade delay={80}><h2 style={{ fontFamily:T.fontDisplay, fontSize:26, fontWeight:600, lineHeight:1.2, color:T.charcoal, marginBottom:6 }}>What type of home?</h2></Fade>
      <Fade delay={150}><p style={{ fontSize:15, color:T.textSoft, lineHeight:1.5, marginBottom:24 }}>Spaces and maintenance adapt to your property.</p></Fade>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {HOME_TYPES.map((h, i) => (
          <Fade key={h.id} delay={200 + i * 70}>
            <button onClick={() => { setHomeType(h.id); addBrevo(`home_${h.id}`); go("home-details"); }}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"24px 14px", borderRadius:T.r16, border:`1.5px solid ${T.border}`, background:T.warmWhite, cursor:"pointer", fontFamily:T.font, transition:"all .15s", width:"100%" }}
              onMouseOver={e => { e.currentTarget.style.borderColor=T.sage; e.currentTarget.style.boxShadow=T.shadowGlow; }}
              onMouseOut={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.boxShadow="none"; }}>
              <span style={{ fontSize:36 }}>{h.icon}</span>
              <span style={{ fontSize:15, fontWeight:600, color:T.text }}>{h.label}</span>
              <span style={{ fontSize:12, color:T.textMuted }}>{h.desc}</span>
            </button>
          </Fade>
        ))}
      </div>
    </div>
  );

  const HomeDetailsScreen = () => (
    <div style={{ padding:"20px 24px" }}>
      <Fade><p style={{ fontSize:12, fontWeight:700, color:T.sage, textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>Step 3 of 4</p></Fade>
      <Fade delay={80}><h2 style={{ fontFamily:T.fontDisplay, fontSize:26, fontWeight:600, lineHeight:1.2, color:T.charcoal, marginBottom:6 }}>Quick details</h2></Fade>
      <Fade delay={150}><p style={{ fontSize:15, color:T.textSoft, lineHeight:1.5, marginBottom:28 }}>Helps Bodie build a smarter plan for you.</p></Fade>
      <Fade delay={200}>
        <label style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:8, display:"block" }}>Name your home</label>
        <input value={homeName} onChange={e => setHomeName(e.target.value)} placeholder="e.g., Maple Street House" style={{ ...inputStyle, marginBottom:20 }}
          onFocus={e => e.target.style.borderColor=T.sage} onBlur={e => e.target.style.borderColor=T.border} />
      </Fade>
      <Fade delay={300}>
        <label style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:8, display:"block" }}>Year built <span style={{ fontWeight:400, color:T.textMuted }}>(approximate)</span></label>
        <input value={homeYear} onChange={e => setHomeYear(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="e.g., 1998" inputMode="numeric" style={{ ...inputStyle, marginBottom:28 }}
          onFocus={e => e.target.style.borderColor=T.sage} onBlur={e => e.target.style.borderColor=T.border} />
      </Fade>
      <Fade delay={400}>
        <button onClick={() => { addBrevo("details_completed"); setSimState(s => ({...s, bubble:{...s.bubble, home_type:homeType, year:homeYear, name:homeName}})); go("challenge"); }} style={primaryBtn}>Continue <I.Arrow c="#fff" /></button>
        <button onClick={() => go("challenge")} style={{ width:"100%", padding:"14px", background:"none", border:"none", cursor:"pointer", fontFamily:T.font, fontSize:14, color:T.textMuted, marginTop:6 }}>Skip for now</button>
      </Fade>
    </div>
  );

  const challenges = [
    { id:"scattered", icon:"📂", label:"Everything is scattered", sub:"Manuals, receipts, contacts in 10 places" },
    { id:"forget", icon:"⏰", label:"I forget maintenance", sub:"Things break because I didn't keep up" },
    { id:"overwhelmed", icon:"😓", label:"Don't know where to start", sub:"Home management feels overwhelming" },
    { id:"records", icon:"📝", label:"Need better records", sub:"For insurance, resale, or family" },
  ];

  const ChallengeScreen = () => (
    <div style={{ padding:"20px 24px" }}>
      <Fade><p style={{ fontSize:12, fontWeight:700, color:T.sage, textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>Step 4 of 4</p></Fade>
      <Fade delay={80}><h2 style={{ fontFamily:T.fontDisplay, fontSize:26, fontWeight:600, lineHeight:1.2, color:T.charcoal, marginBottom:6 }}>Biggest pain point?</h2></Fade>
      <Fade delay={150}><p style={{ fontSize:15, color:T.textSoft, lineHeight:1.5, marginBottom:24 }}>We'll solve this one first.</p></Fade>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {challenges.map((c, i) => (
          <Fade key={c.id} delay={200 + i * 70}>
            <button onClick={() => { setChallenge(c.id); addBrevo(`pain_${c.id}`); addMilestone("profile_complete"); go("bodie-magic"); }}
              style={optionBtn()}
              onMouseOver={e => { e.currentTarget.style.borderColor=T.sage; e.currentTarget.style.boxShadow=T.shadowGlow; }}
              onMouseOut={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.boxShadow="none"; }}>
              <span style={{ fontSize:26, width:36, textAlign:"center", flexShrink:0 }}>{c.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:600, color:T.text, marginBottom:2 }}>{c.label}</div>
                <div style={{ fontSize:13, color:T.textMuted }}>{c.sub}</div>
              </div>
            </button>
          </Fade>
        ))}
      </div>
    </div>
  );

  // ── BODIE MAGIC ─────────────────────────────────────────────────────────
  const magicSteps = [
    { p:1, text:`Analyzing your ${homeLabel}…` },
    { p:2, text:`Creating ${persona?.spaces?.length || 5} spaces` },
    { p:3, text:`Finding manuals for ${persona?.assets?.slice(0,2).join(", ") || "appliances"}` },
    { p:4, text:"Building your maintenance plan" },
  ];

  const BodieMagic = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", padding:"28px 24px" }}>
      <Fade>
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:`linear-gradient(135deg, ${T.sageGhost}, ${T.sageSoft})`, borderRadius:T.r16, marginBottom:32 }}>
          <div style={{ width:44, height:44, borderRadius:14, background:`linear-gradient(135deg, ${T.sage}, ${T.sageDark})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 }}><I.Sparkle s={22} c="#fff" /></div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:T.charcoal }}>Bodie is building your home</div>
            <div style={{ fontSize:13, color:T.textSoft }}>This takes a moment…</div>
          </div>
        </div>
      </Fade>
      <div style={{ display:"flex", flexDirection:"column", gap:20, flex:1 }}>
        {magicSteps.map((s, i) => {
          const done = magicPhase > s.p, active = magicPhase === s.p, pending = magicPhase < s.p;
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, opacity:pending?.3:1, transition:"all .5s" }}>
              <div style={{ width:36, height:36, borderRadius:11, background:done?T.sage:active?T.sageSoft:T.borderSoft, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .4s" }}>
                {done ? <I.Check s={16} c="#fff" /> : active ? <div style={{ width:16, height:16, border:`2.5px solid ${T.sage}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite" }} /> : <div style={{ width:8, height:8, borderRadius:4, background:T.textMuted, opacity:.4 }} />}
              </div>
              <span style={{ fontSize:15, fontWeight:pending?400:600, color:pending?T.textMuted:T.text }}>{s.text}</span>
            </div>
          );
        })}
      </div>
      {magicPhase >= 5 && (
        <Fade delay={300}>
          <div style={{ background:T.warmWhite, borderRadius:T.r20, padding:20, border:`1.5px solid ${T.sageSoft}`, boxShadow:T.shadow2, marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <I.Sparkle s={18} c={T.sage} />
              <span style={{ fontSize:15, fontWeight:700, color:T.sage }}>Your home is ready</span>
            </div>
            <p style={{ fontSize:14, color:T.textSoft, lineHeight:1.6, marginBottom:14 }}>{persona?.firstWin}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {persona?.spaces?.slice(0,4).map((s,i) => (
                <span key={i} style={{ padding:"5px 12px", borderRadius:T.rFull, fontSize:12, fontWeight:600, background:T.sageGhost, color:T.sage, border:`1px solid ${T.sageSoft}` }}>✓ {s}</span>
              ))}
            </div>
          </div>
          <button onClick={() => { addMilestone("magic_seen"); go("signup"); }} style={primaryBtn}>Save This — Create Free Account <I.Arrow c="#fff" /></button>
          <p style={{ textAlign:"center", fontSize:12, color:T.textMuted, marginTop:10 }}>Everything Bodie built is saved to your account</p>
        </Fade>
      )}
    </div>
  );

  // ── SIGNUP ──────────────────────────────────────────────────────────────
  const SignupScreen = () => (
    <div style={{ padding:"28px 24px" }}>
      <Fade>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ width:52, height:52, borderRadius:16, background:"#FEF4EB", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", border:`1px solid ${T.accent}33` }}><I.Home s={24} c={T.accent} /></div>
          <h2 style={{ fontFamily:T.fontDisplay, fontSize:24, fontWeight:600, color:T.charcoal, marginBottom:4 }}>Save your home</h2>
          <p style={{ fontSize:15, color:T.textSoft }}>Free account · 30 seconds</p>
        </div>
      </Fade>
      <Fade delay={100}>
        <div style={{ background:T.goldSoft, border:`1px solid ${T.gold}22`, borderRadius:T.r12, padding:"12px 16px", display:"flex", alignItems:"flex-start", gap:10, marginBottom:24 }}>
          <span style={{ fontSize:18, marginTop:1 }}>✨</span>
          <p style={{ fontSize:13, color:T.text, lineHeight:1.5, margin:0 }}><strong>Bodie already created</strong> {persona?.spaces?.length} spaces, found {persona?.assets?.slice(0,3).length} manuals, and built your maintenance plan.</p>
        </div>
      </Fade>
      <Fade delay={200}>
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
          {["Full name", "Email address", "Create password"].map((ph, i) => (
            <input key={i} type={i===2?"password":i===1?"email":"text"} placeholder={ph} style={inputStyle}
              onFocus={e => e.target.style.borderColor=T.sage} onBlur={e => e.target.style.borderColor=T.border} />
          ))}
        </div>
      </Fade>
      <Fade delay={300}>
        <button onClick={() => { addMilestone("account_created"); addBrevo("signed_up"); setSimState(s=>({...s, bubble:{...s.bubble, ...persona?.bubble}})); go("dashboard"); }} style={{ ...primaryBtn, marginBottom:12 }}>Create Account <I.Arrow c="#fff" /></button>
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"14px 0" }}>
          <div style={{ flex:1, height:1, background:T.border }} /><span style={{ fontSize:12, color:T.textMuted }}>or</span><div style={{ flex:1, height:1, background:T.border }} />
        </div>
        <button onClick={() => { addMilestone("account_created"); addBrevo("signed_up"); go("dashboard"); }} style={{
          width:"100%", padding:"15px", borderRadius:T.r16, border:`1.5px solid ${T.border}`, background:T.warmWhite, color:T.text, fontSize:15, fontWeight:500, fontFamily:T.font, display:"flex", alignItems:"center", justifyContent:"center", gap:10, cursor:"pointer",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
      </Fade>
      <Fade delay={400}><p style={{ textAlign:"center", fontSize:12, color:T.textMuted, marginTop:16 }}>Free forever · No credit card</p></Fade>
    </div>
  );

  // ── DASHBOARD ───────────────────────────────────────────────────────────
  const Dashboard = () => (
    <div>
      <div style={{ padding:"16px 24px 0" }}>
        <Fade>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
            <div>
              <p style={{ fontSize:13, color:T.textMuted, marginBottom:2 }}>Welcome 👋</p>
              <h2 style={{ fontFamily:T.fontDisplay, fontSize:22, fontWeight:600, color:T.charcoal }}>{homeName || "My Home"}</h2>
            </div>
            <div style={{ padding:"6px 12px", borderRadius:T.rFull, background:T.sageGhost, border:`1px solid ${T.sageSoft}`, fontSize:12, fontWeight:600, color:T.sage }}>{pct}% set up</div>
          </div>
        </Fade>

        <Fade delay={100}>
          <div style={{ background:`linear-gradient(135deg, ${T.sageDeep}, ${T.sageDark})`, borderRadius:T.r20, padding:22, marginBottom:16, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}><I.Sparkle s={18} c="rgba(255,255,255,0.9)" /><span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.9)", textTransform:"uppercase", letterSpacing:"0.5px" }}>Bodie</span></div>
            <p style={{ fontSize:15, lineHeight:1.55, color:"rgba(255,255,255,0.88)", marginBottom:16 }}>{persona?.bodieIntro}</p>
            <button onClick={() => setShowBodie(true)} style={{ padding:"11px 20px", borderRadius:T.r12, border:"1.5px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.1)", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:T.font, display:"flex", alignItems:"center", gap:8 }}>💬 Chat with Bodie</button>
          </div>
        </Fade>

        <Fade delay={200}>
          <div style={{ background:T.warmWhite, borderRadius:T.r20, padding:20, border:`1px solid ${T.border}`, marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <span style={{ fontSize:15, fontWeight:700, color:T.charcoal }}>Setup Checklist</span>
              <span style={{ fontSize:13, fontWeight:600, color:T.sage }}>{completedCount}/{totalChecks}</span>
            </div>
            <div style={{ height:6, background:T.borderSoft, borderRadius:3, overflow:"hidden", marginBottom:18 }}>
              <div style={{ height:"100%", borderRadius:3, width:`${pct}%`, background:`linear-gradient(90deg, ${T.sage}, ${T.sageDark})`, transition:"width .6s cubic-bezier(.2,.8,.3,1)" }} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {persona?.checklist?.map((item, i) => (
                <button key={i} onClick={() => { setChecks(p => ({...p, [i]:!p[i]})); if (!checks[i]) { addMilestone("first_action"); addBrevo("action_completed"); } }} style={{
                  display:"flex", alignItems:"center", gap:12, padding:"13px 14px", borderRadius:T.r12,
                  background:checks[i]?T.sageGhost:T.cream, border:`1px solid ${checks[i]?T.sageSoft:T.borderSoft}`,
                  cursor:"pointer", fontFamily:T.font, textAlign:"left", width:"100%", transition:"all .2s",
                }}>
                  <div style={{ width:24, height:24, borderRadius:8, flexShrink:0, background:checks[i]?T.sage:T.warmWhite, border:`1.5px solid ${checks[i]?T.sage:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}>
                    {checks[i] && <I.Check s={14} c="#fff" />}
                  </div>
                  <span style={{ fontSize:14, fontWeight:500, color:checks[i]?T.textMuted:T.text, textDecoration:checks[i]?"line-through":"none" }}>{item.icon} {item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Fade>

        <Fade delay={300}>
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:15, fontWeight:700, color:T.charcoal }}>Your Spaces</span>
              <span style={{ fontSize:13, fontWeight:600, color:T.sage, cursor:"pointer" }}>+ Add</span>
            </div>
            <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:6, margin:"0 -24px", padding:"0 24px 6px" }}>
              {persona?.spaces?.map((s, i) => (
                <div key={i} style={{ minWidth:110, background:T.warmWhite, borderRadius:T.r16, padding:"18px 14px", textAlign:"center", border:`1px solid ${T.border}`, flexShrink:0 }}>
                  <div style={{ fontSize:26, marginBottom:8 }}>{["🍳","🛏️","🛋️","🚗","👕","🏠","🔧","🛁"][i]||"🏠"}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{s}</div>
                  <div style={{ fontSize:11, color:T.textMuted, marginTop:4 }}>{i<2?"2 assets":"Set up"}</div>
                </div>
              ))}
            </div>
          </div>
        </Fade>

        <Fade delay={400}>
          <div style={{ background:T.warmWhite, borderRadius:T.r20, padding:20, border:`1px solid ${T.border}`, marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:700, color:T.charcoal, marginBottom:14 }}>🔧 Upcoming Maintenance</div>
            {[
              { task:"Check smoke detectors", when:"This week", urgent:true },
              { task:"Replace HVAC filter", when:"Next month", urgent:false },
              { task:"Gutter inspection", when:"This season", urgent:false },
            ].map((m, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderTop:i?`1px solid ${T.borderSoft}`:"none" }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:500, color:T.text }}>{m.task}</div>
                  <div style={{ fontSize:12, color:m.urgent?T.coral:T.textMuted, fontWeight:m.urgent?600:400 }}>{m.when}</div>
                </div>
                {m.urgent && <span style={{ padding:"4px 10px", borderRadius:T.rFull, fontSize:11, fontWeight:600, background:T.coralSoft, color:T.coral }}>Due soon</span>}
              </div>
            ))}
          </div>
        </Fade>

        {showPremium && !premiumSeen && (
          <Fade>
            <div style={{ background:`linear-gradient(135deg, ${T.goldSoft}, #FFFBF0)`, borderRadius:T.r20, padding:22, border:`1.5px solid ${T.gold}30`, marginBottom:16, position:"relative" }}>
              <button onClick={() => setPremiumSeen(true)} style={{ position:"absolute", top:14, right:14, background:"none", border:"none", fontSize:18, color:T.textMuted, cursor:"pointer" }}>×</button>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}><I.Crown s={18} c={T.gold} /><span style={{ fontSize:13, fontWeight:700, color:T.gold, textTransform:"uppercase", letterSpacing:"0.5px" }}>Unlock Pro</span></div>
              <p style={{ fontSize:16, fontWeight:700, color:T.charcoal, marginBottom:4 }}>You're already seeing the value.</p>
              <p style={{ fontSize:14, color:T.textSoft, lineHeight:1.5, marginBottom:16 }}>Unlimited AI plans, auto manual finding, document vault, and priority support.</p>
              <button style={{ width:"100%", padding:"14px", borderRadius:T.r12, border:"none", cursor:"pointer", background:`linear-gradient(135deg, ${T.gold}, #D4A84A)`, color:"#fff", fontSize:15, fontWeight:600, fontFamily:T.font, boxShadow:`0 4px 16px ${T.gold}33` }}>Start Free Trial — $89/yr</button>
              <p style={{ textAlign:"center", fontSize:11, color:T.textMuted, marginTop:8 }}>30-day money-back guarantee</p>
            </div>
          </Fade>
        )}

        <Fade delay={500}>
          <details style={{ marginBottom:24 }}>
            <summary style={{ fontSize:11, color:T.textMuted, cursor:"pointer", padding:"8px 0", fontFamily:"monospace" }}>🔧 Simulated State (reviewers)</summary>
            <pre style={{ background:"#0f1410", color:"#8ec99e", padding:14, borderRadius:T.r12, fontSize:10, lineHeight:1.7, overflowX:"auto", marginTop:8 }}>
{JSON.stringify({ bubble: simState.bubble, brevo_tags: simState.brevo, milestones: simState.milestones, profile: { goal, homeType, homeYear, homeName, challenge } }, null, 2)}
            </pre>
          </details>
        </Fade>
      </div>

      {!showBodie && (
        <button onClick={() => setShowBodie(true)} style={{
          position:"fixed", bottom:24, right:24, width:56, height:56, borderRadius:18, border:"none", cursor:"pointer",
          background:`linear-gradient(135deg, ${T.sage}, ${T.sageDark})`, color:"#fff",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 6px 24px ${T.sage}44`, zIndex:20, animation:"pulse 2.5s infinite",
        }}><I.Sparkle s={22} c="#fff" /></button>
      )}

      {showBodie && (
        <div onClick={e => { if(e.target===e.currentTarget) setShowBodie(false); }} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:30, display:"flex", ...(isDesktop ? { alignItems:"center", justifyContent:"center" } : { flexDirection:"column", justifyContent:"flex-end" }) }}>
          <div style={{ background:T.cream, ...(isDesktop ? { borderRadius:24, width:"100%", maxWidth:480, maxHeight:"80vh", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" } : { borderRadius:"20px 20px 0 0", maxHeight:"72vh", boxShadow:"0 -4px 32px rgba(0,0,0,0.15)" }), display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"14px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:11, background:`linear-gradient(135deg, ${T.sage}, ${T.sageDark})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}><I.Sparkle s={18} c="#fff" /></div>
                <div><div style={{ fontSize:15, fontWeight:700, color:T.charcoal }}>Bodie</div><div style={{ fontSize:11, color:T.sage, fontWeight:500 }}>AI Home Assistant</div></div>
              </div>
              <button onClick={() => setShowBodie(false)} style={{ background:"none", border:"none", fontSize:22, color:T.textMuted, cursor:"pointer", padding:4 }}>×</button>
            </div>
            <div ref={chatRef} style={{ flex:1, overflowY:"auto", padding:"16px 20px", minHeight:180, maxHeight: isDesktop ? "55vh" : "48vh" }}>
              {bodieMessages.length === 0 && (
                <>
                  <div style={{ background:T.sageGhost, padding:"12px 16px", borderRadius:"4px 16px 16px 16px", maxWidth:"88%", marginBottom:14, fontSize:14, lineHeight:1.55, color:T.text }}>
                    👋 Hi! I'm Bodie. {persona?.bodieIntro}
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                    {["Set up my home", "Maintenance schedule", "Find my manuals"].map((a, i) => (
                      <button key={i} onClick={() => sendBodie(a)} style={{ padding:"8px 14px", borderRadius:T.rFull, fontSize:13, fontWeight:500, border:`1px solid ${T.sageSoft}`, background:T.warmWhite, color:T.sage, cursor:"pointer", fontFamily:T.font }}>{a}</button>
                    ))}
                  </div>
                </>
              )}
              {bodieMessages.map((m, i) => (
                <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:10 }}>
                  <div style={{ maxWidth:"88%", padding:"12px 16px", borderRadius:m.role==="user"?"16px 16px 4px 16px":"4px 16px 16px 16px", background:m.role==="user"?T.sage:T.sageGhost, color:m.role==="user"?"#fff":T.text, fontSize:14, lineHeight:1.55, whiteSpace:"pre-line" }}>{m.text}</div>
                </div>
              ))}
              {bodieTyping && (
                <div style={{ background:T.sageGhost, padding:"12px 16px", borderRadius:"4px 16px 16px 16px", maxWidth:70, display:"flex", gap:5, alignItems:"center" }}>
                  {[0,150,300].map(d => <div key={d} style={{ width:7, height:7, borderRadius:"50%", background:T.sageSoft, animation:`bounce 1s ${d}ms infinite` }} />)}
                </div>
              )}
            </div>
            <div style={{ padding:"12px 16px 28px", borderTop:`1px solid ${T.border}`, display:"flex", gap:8 }}>
              <input value={bodieInput} onChange={e => setBodieInput(e.target.value)} onKeyDown={e => e.key==="Enter" && sendBodie()} placeholder="Ask Bodie anything…"
                style={{ ...inputStyle, flex:1 }} onFocus={e => e.target.style.borderColor=T.sage} onBlur={e => e.target.style.borderColor=T.border} />
              <button onClick={() => sendBodie()} style={{ width:46, height:46, borderRadius:T.r12, border:"none", background:T.sage, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}><I.Send c="#fff" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // LAYOUT
  // ═══════════════════════════════════════════════════════════════════════════
  const screens = { splash: Splash, welcome: Welcome, goal: GoalScreen, "home-type": HomeTypeScreen, "home-details": HomeDetailsScreen, challenge: ChallengeScreen, "bodie-magic": BodieMagic, signup: SignupScreen, dashboard: Dashboard };
  const Screen = screens[screen] || Welcome;
  const showNav = !["splash","welcome"].includes(screen);
  const showSteps = ["goal","home-type","home-details","challenge"].includes(screen);
  const stepIdx = ["goal","home-type","home-details","challenge"].indexOf(screen);
  const flowOrder = ["splash","welcome","goal","home-type","home-details","challenge","bodie-magic","signup","dashboard"];

  const globalStyles = (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes pulse { 0%{box-shadow:0 6px 24px ${T.sage}44, 0 0 0 0 ${T.sage}33} 70%{box-shadow:0 6px 24px ${T.sage}44, 0 0 0 12px ${T.sage}00} 100%{box-shadow:0 6px 24px ${T.sage}44, 0 0 0 0 ${T.sage}00} }
        @keyframes loadBar { from{width:0%} to{width:100%} }
        * { margin:0; padding:0; box-sizing:border-box; }
        input::placeholder { color:${T.textMuted}; }
        ::-webkit-scrollbar { width:0; height:0; }
      `}</style>
    </>
  );

  // ── DESKTOP SIDEBAR ──────────────────────────────────────────────────────
  const DesktopSidebar = () => (
    <div style={{ width:420, flexShrink:0, background:`linear-gradient(180deg, ${T.sageDeep} 0%, ${T.sageDark} 100%)`, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"52px 48px", position:"sticky", top:0, height:"100vh", overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:40, height:40, borderRadius:12, background:"rgba(232,145,58,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <I.Home s={22} c={T.accent} f={`${T.accent}55`} />
        </div>
        <span style={{ fontFamily:T.fontDisplay, fontSize:22, fontWeight:600, color:"#fff", letterSpacing:"-0.3px" }}>abodio</span>
      </div>
      <div>
        <h1 style={{ fontFamily:T.fontDisplay, fontSize:40, fontWeight:600, lineHeight:1.12, color:"#fff", letterSpacing:"-1px", marginBottom:20 }}>Your home,<br/>finally under<br/>control.</h1>
        <p style={{ fontSize:16, lineHeight:1.65, color:"rgba(255,255,255,0.68)", marginBottom:44 }}>Track every system. Never miss maintenance. Let AI do the heavy lifting.</p>
        {[
          { icon:"📋", title:"Organize Everything", desc:"Spaces, assets & manuals in one place" },
          { icon:"🔧", title:"Stay on Schedule", desc:"AI-built maintenance plans for your home" },
          { icon:"✨", title:"Bodie AI Assistant", desc:"Your 24/7 intelligent home companion" },
        ].map((f, i) => (
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:22 }}>
            <div style={{ width:42, height:42, borderRadius:13, background:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, flexShrink:0 }}>{f.icon}</div>
            <div style={{ paddingTop:2 }}>
              <div style={{ fontSize:15, fontWeight:600, color:"#fff", marginBottom:3 }}>{f.title}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.58)", lineHeight:1.4 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ display:"flex", gap:3, marginBottom:8 }}>{[1,2,3,4,5].map(i => <I.Star key={i} />)}</div>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.6)" }}>4.9 · Trusted by 1,000+ homeowners</p>
      </div>
    </div>
  );

  // ── DESKTOP LAYOUT ───────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div style={{ width:"100%", minHeight:"100vh", display:"flex", fontFamily:T.font, WebkitFontSmoothing:"antialiased" }}>
        {globalStyles}
        <DesktopSidebar />
        <div style={{ flex:1, background:T.cream, display:"flex", flexDirection:"column", minHeight:"100vh" }}>
          {showNav && (
            <div style={{ padding:"16px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${T.border}`, background:T.cream, position:"sticky", top:0, zIndex:10 }}>
              {screen !== "dashboard" ? (
                <button onClick={() => { const i = flowOrder.indexOf(screen); if(i>0) go(flowOrder[i-1]); }} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontFamily:T.font, fontSize:14, fontWeight:600, color:T.sage }}>
                  <I.Back s={18} c={T.sage} /> Back
                </button>
              ) : <div />}
              <div style={{ fontSize:17, fontWeight:700, color:T.sage, letterSpacing:"-0.3px", display:"flex", alignItems:"center", gap:5 }}>
                <I.Home s={18} c={T.accent} f={T.accent} /> abodio
              </div>
              {screen === "dashboard" ? (
                <div style={{ width:36, height:36, borderRadius:11, background:T.sageGhost, border:`1px solid ${T.sageSoft}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:T.sage }}>{(homeName||"H")[0]}</div>
              ) : <div />}
            </div>
          )}
          {showSteps && (
            <div style={{ padding:"16px 48px 0", maxWidth:680, width:"100%" }}>
              <Steps current={stepIdx} />
            </div>
          )}
          <div ref={scrollRef} style={{ flex:1, overflowY:"auto", maxWidth:680, width:"100%", padding:"0 48px 48px" }}>
            {Screen()}
          </div>
        </div>
      </div>
    );
  }

  // ── MOBILE LAYOUT ────────────────────────────────────────────────────────
  return (
    <div style={{ width:"100%", minHeight:"100vh", background:"#D8D4CE", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:T.font, WebkitFontSmoothing:"antialiased" }}>
      {globalStyles}
      <div style={{
        width:"100%", maxWidth:400, height:"100dvh", maxHeight:870,
        background:T.cream, position:"relative", overflow:"hidden",
        display:"flex", flexDirection:"column",
        boxShadow:"0 0 0 1px rgba(0,0,0,0.06), 0 20px 60px rgba(0,0,0,0.15)",
        borderRadius: window.innerWidth > 420 ? 32 : 0,
      }}>
        {screen !== "splash" && (
          <div style={{ padding:"8px 20px 0", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12, fontWeight:600, color:T.text, flexShrink:0 }}>
            <span>9:41</span>
            <div style={{ display:"flex", gap:4, alignItems:"center" }}>
              <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="6" width="3" height="6" rx="1" fill={T.text}/><rect x="4.5" y="4" width="3" height="8" rx="1" fill={T.text}/><rect x="9" y="2" width="3" height="10" rx="1" fill={T.text}/><rect x="13" y="0" width="3" height="12" rx="1" fill={T.text}/></svg>
              <svg width="22" height="12" viewBox="0 0 22 12"><rect x="0" y="0" width="20" height="12" rx="2" stroke={T.text} strokeWidth="1" fill="none"/><rect x="2" y="2" width="14" height="8" rx="1" fill={T.sage}/><rect x="21" y="3.5" width="1.5" height="5" rx=".75" fill={T.text}/></svg>
            </div>
          </div>
        )}

        {showNav && (
          <div style={{ padding:"10px 20px 8px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            {screen !== "dashboard" ? (
              <button onClick={() => { const i = flowOrder.indexOf(screen); if(i>0) go(flowOrder[i-1]); }} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 0", display:"flex", alignItems:"center", gap:4, fontFamily:T.font, fontSize:14, fontWeight:600, color:T.sage }}>
                <I.Back s={18} c={T.sage} /> Back
              </button>
            ) : <div style={{ width:60 }} />}
            <div style={{ fontSize:17, fontWeight:700, color:T.sage, letterSpacing:"-0.3px", display:"flex", alignItems:"center", gap:5 }}>
              <I.Home s={18} c={T.accent} f={T.accent} /> abodio
            </div>
            {screen === "dashboard" ? (
              <div style={{ width:34, height:34, borderRadius:11, background:T.sageGhost, border:`1px solid ${T.sageSoft}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:T.sage }}>{(homeName||"H")[0]}</div>
            ) : <div style={{ width:60 }} />}
          </div>
        )}

        {showSteps && <Steps current={stepIdx} />}

        <div ref={scrollRef} style={{ flex:1, overflowY:"auto", overflowX:"hidden", WebkitOverflowScrolling:"touch" }}>
          {Screen()}
        </div>

        <div style={{ height:20, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <div style={{ width:134, height:5, borderRadius:3, background:T.charcoal, opacity:.15 }} />
        </div>
      </div>
    </div>
  );
}
