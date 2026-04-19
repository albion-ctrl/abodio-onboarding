import { useState, useEffect, useRef, useCallback } from "react";

/*  ═══════════════════════════════════════════════════════════════════════════
    ABODIO — Best-in-Class Onboarding Prototype
    Mobile-first · AI-led · Presentation-quality
    ═══════════════════════════════════════════════════════════════════════════ */

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const T = {
  sage:       "#388096",
  sageDark:   "#2C6678",
  sageDeep:   "#0F2D38",
  sageSoft:   "#A7CDD5",
  sageGhost:  "#D2F4F9",
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
  shadowGlow: "0 0 0 4px rgba(56,128,150,0.12)",
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

// ─── MAINTENANCE TASKS ──────────────────────────────────────────────────────
const MAINTENANCE_TASKS = {
  "HVAC System":      [{ period:"Monthly",        task:"Replace air filter",                       icon:"🔄", urgency:"high"   },
                       { period:"Annually",        task:"Professional HVAC tune-up",               icon:"🔧", urgency:"medium" },
                       { period:"Every 10-15 yrs", task:"Plan for HVAC replacement",               icon:"⚠️", urgency:"low"    }],
  "Water Heater":     [{ period:"Every 6 months",  task:"Flush sediment from tank",                icon:"💧", urgency:"medium" },
                       { period:"Annually",        task:"Test pressure relief valve",              icon:"🔍", urgency:"high"   },
                       { period:"Every 8-12 yrs",  task:"Replace water heater",                   icon:"⚠️", urgency:"low"    }],
  "Roof":             [{ period:"Annually",        task:"Inspect for damaged shingles",            icon:"🔍", urgency:"high"   },
                       { period:"Every 20-30 yrs", task:"Plan for full roof replacement",          icon:"🏠", urgency:"low"    }],
  "Gutters":          [{ period:"Spring & fall",   task:"Clean and inspect gutters",               icon:"🍂", urgency:"high"   }],
  "Electrical Panel": [{ period:"Every 3-5 yrs",   task:"Professional electrical inspection",      icon:"⚡", urgency:"high"   },
                       { period:"Annually",        task:"Test all GFCI outlets",                  icon:"🔌", urgency:"medium" }],
  "Smoke Detectors":  [{ period:"Monthly",         task:"Test smoke detector batteries",           icon:"🔋", urgency:"high"   },
                       { period:"Every 10 yrs",    task:"Replace smoke detectors",                icon:"🚨", urgency:"medium" }],
  "Windows":          [{ period:"Every spring",    task:"Re-caulk window seals",                  icon:"🪟", urgency:"medium" }],
  "Sump Pump":        [{ period:"Every 6 months",  task:"Test sump pump operation",               icon:"💧", urgency:"high"   },
                       { period:"Every 7-10 yrs",  task:"Replace sump pump",                     icon:"⚠️", urgency:"low"    }],
  "Plumbing":         [{ period:"Annually",        task:"Inspect pipes for leaks & corrosion",    icon:"🚿", urgency:"medium" }],
  "Pool":             [{ period:"Weekly (season)", task:"Check water chemistry & clean filter",   icon:"🏊", urgency:"high"   },
                       { period:"Annually",        task:"Professional pool inspection",            icon:"🔍", urgency:"medium" }],
  "Fireplace":        [{ period:"Annually",        task:"Chimney sweep & inspection",             icon:"🔥", urgency:"high"   }],
  "Solar Panels":     [{ period:"Every 6 months",  task:"Clean solar panels",                    icon:"☀️", urgency:"medium" }],
  "Garage Door":      [{ period:"Every 6 months",  task:"Lubricate hinges, test safety reverse", icon:"🚪", urgency:"medium" }],
  "Exterior/Siding":  [{ period:"Annually",        task:"Inspect siding for damage & rot",       icon:"🏠", urgency:"medium" }],
};

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

// ─── GOOGLE PLACES AUTOCOMPLETE ─────────────────────────────────────────────
const GMAP_ID = "gmap-places-script";

function loadGooglePlaces(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) { resolve(); return; }
    const existing = document.getElementById(GMAP_ID);
    if (existing) { existing.addEventListener("load", resolve); existing.addEventListener("error", reject); return; }
    const s = document.createElement("script");
    s.id = GMAP_ID;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    s.async = true; s.defer = true;
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

const GooglePlacesInput = ({ onChange, onAddressSelect }) => {
  const [query, setQuery]           = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [apiReady, setApiReady]     = useState(false);
  const [apiError, setApiError]     = useState(false);
  const [activeIdx, setActiveIdx]   = useState(-1);
  const [focused, setFocused]       = useState(false);
  const debounceRef   = useRef(null);
  const sessionRef    = useRef(null);
  const acRef         = useRef(null);
  const psRef         = useRef(null);
  const containerRef  = useRef(null);

  const C = { border:"#C5DCE3", focus:"#388096", ph:"#8E9A93", text:"#1A1A1A", bg:"#FFFFFF", teal:"#388096", gray:"#6B7280", hover:"#E4F3F7" };

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    if (!key) { setApiError(true); return; }
    loadGooglePlaces(key)
      .then(() => {
        acRef.current = new window.google.maps.places.AutocompleteService();
        psRef.current = new window.google.maps.places.PlacesService(document.createElement("div"));
        setApiReady(true);
      })
      .catch(() => setApiError(true));
    return () => {
      acRef.current = null; psRef.current = null;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 2 || !apiReady) { setSuggestions([]); setShowDropdown(false); return; }
    debounceRef.current = setTimeout(() => {
      if (!sessionRef.current) sessionRef.current = new window.google.maps.places.AutocompleteSessionToken();
      setIsLoading(true);
      acRef.current.getPlacePredictions(
        { input: query, types: ["address"], sessionToken: sessionRef.current },
        (preds, status) => {
          setIsLoading(false);
          const ok = window.google.maps.places.PlacesServiceStatus.OK;
          setSuggestions(preds?.length && status === ok ? preds : []);
          setShowDropdown(true);
        }
      );
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, apiReady]);

  useEffect(() => {
    const hide = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener("mousedown", hide);
    return () => document.removeEventListener("mousedown", hide);
  }, []);

  const handleSelect = (pred) => {
    setQuery(pred.description); setSuggestions([]); setShowDropdown(false); setActiveIdx(-1);
    if (onChange) onChange(pred.description);
    if (!psRef.current) return;
    psRef.current.getDetails(
      { placeId: pred.place_id, fields: ["address_components", "formatted_address", "place_id"], sessionToken: sessionRef.current },
      (place) => {
        sessionRef.current = null;
        const get = (types) => { const c = (place?.address_components || []).find(c => types.some(t => c.types.includes(t))); return c ? c.long_name : ""; };
        const sn = get(["street_number"]), rt = get(["route"]);
        if (onAddressSelect) onAddressSelect({
          fullAddress: place?.formatted_address || pred.description,
          placeId: place?.place_id || pred.place_id,
          street: [sn, rt].filter(Boolean).join(" "),
          city: get(["locality", "postal_town", "administrative_area_level_2"]),
          state: get(["administrative_area_level_1"]),
          zipCode: get(["postal_code"]),
          country: get(["country"]),
        });
      }
    );
  };

  const highlight = (pred) => {
    const sf = pred.structured_formatting;
    const main = sf?.main_text || ""; const sec = sf?.secondary_text || "";
    const matches = sf?.main_text_matched_substrings || [];
    let last = 0; const parts = [];
    matches.forEach(({ offset, length }) => {
      if (offset > last) parts.push(<span key={`n${last}`}>{main.slice(last, offset)}</span>);
      parts.push(<span key={`m${offset}`} style={{ fontWeight:700, color:C.teal }}>{main.slice(offset, offset + length)}</span>);
      last = offset + length;
    });
    if (last < main.length) parts.push(<span key={`e${last}`}>{main.slice(last)}</span>);
    return { mainParts: parts.length ? parts : [main], sec };
  };

  const inputBase = {
    width:"100%", boxSizing:"border-box", height:52,
    paddingLeft:40, paddingRight: isLoading ? 44 : 16,
    borderRadius:12, border:`1.5px solid ${focused ? C.focus : C.border}`,
    fontSize:16, fontFamily:T.font, color:C.text, background:C.bg,
    outline:"none", transition:"border .2s", WebkitAppearance:"none",
  };

  const pinIcon = (
    <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:16, pointerEvents:"none", zIndex:1 }}>📍</span>
  );

  if (apiError) {
    return (
      <div style={{ position:"relative" }}>
        {pinIcon}
        <input value={query} className="gp-input"
          onChange={e => { setQuery(e.target.value); if (onChange) onChange(e.target.value); }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="e.g., 123 Main St, New York, NY" style={inputBase} autoComplete="off" />
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ position:"relative", width:"100%" }}>
      <div style={{ position:"relative" }}>
        {pinIcon}
        <input className="gp-input" value={query}
          onChange={e => { setQuery(e.target.value); if (onChange) onChange(e.target.value); setActiveIdx(-1); }}
          onFocus={() => { setFocused(true); if (query.length >= 2 && suggestions.length > 0) setShowDropdown(true); }}
          onBlur={() => { setFocused(false); setTimeout(() => setShowDropdown(false), 150); }}
          onKeyDown={e => {
            if (!showDropdown || !suggestions.length) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
            else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); handleSelect(suggestions[activeIdx]); }
            else if (e.key === "Escape") setShowDropdown(false);
          }}
          placeholder="e.g., 123 Main St, New York, NY" style={inputBase} autoComplete="off" />
        {isLoading && (
          <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", width:18, height:18, border:`2px solid ${C.border}`, borderTopColor:C.teal, borderRadius:"50%", animation:"spin .7s linear infinite", pointerEvents:"none" }} />
        )}
      </div>
      {showDropdown && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:C.bg, borderRadius:12, boxShadow:"0 4px 20px rgba(0,0,0,0.12)", zIndex:1000, overflow:"hidden", animation:"fadeInDropdown .15s ease-out" }}>
          {suggestions.length === 0 ? (
            <div style={{ padding:16, fontSize:14, color:C.gray, textAlign:"center", fontFamily:T.font }}>No addresses found</div>
          ) : suggestions.map((pred, i) => {
            const { mainParts, sec } = highlight(pred);
            const active = i === activeIdx;
            return (
              <div key={pred.place_id}
                onMouseDown={e => { e.preventDefault(); handleSelect(pred); }}
                onTouchEnd={e => { e.preventDefault(); handleSelect(pred); }}
                onMouseEnter={() => setActiveIdx(i)}
                style={{ padding:"12px 16px", minHeight:48, cursor:"pointer", background:active ? C.hover : C.bg, borderBottom:i < suggestions.length - 1 ? "1px solid #F3F4F6" : "none", display:"flex", flexDirection:"column", justifyContent:"center", transition:"background .1s", touchAction:"manipulation" }}>
                <div style={{ fontSize:15, fontWeight:600, color:C.text, lineHeight:1.3, fontFamily:T.font }}>{mainParts}</div>
                {sec && <div style={{ fontSize:13, color:C.gray, fontWeight:400, marginTop:2, lineHeight:1.3, fontFamily:T.font }}>{sec}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
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
  const emptyAddr = { fullAddress:"", placeId:"", street:"", city:"", state:"", zipCode:"", country:"" };
  const [homeAddressData, setHomeAddressData] = useState(emptyAddr);
  const [videoState, setVideoState]     = useState("idle"); // idle | processing | done
  const [videoFileName, setVideoFileName] = useState("");
  const [videoProcStep, setVideoProcStep] = useState(0);
  const [signupName, setSignupName]     = useState("");
  const [signupEmail, setSignupEmail]   = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const videoFileRef = useRef(null);
  const videoTimersRef = useRef([]);
  // stay-maintained: asset input
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [customAsset, setCustomAsset] = useState("");
  // stay-maintained: ai insight CTA loading
  const [insightPhase, setInsightPhase] = useState(0);
  const [insightLoadStep, setInsightLoadStep] = useState(0);
  // protect-value: doc upload
  const [docUploadState, setDocUploadState] = useState("idle");
  const [docUploadFileNames, setDocUploadFileNames] = useState([]);
  const [docUploadProcStep, setDocUploadProcStep] = useState(0);
  const docUploadFileRef = useRef(null);
  const docUploadTimersRef = useRef([]);
  // protect-value: value report CTA loading
  const [valueReportPhase, setValueReportPhase] = useState(0);
  const [valueReportLoadStep, setValueReportLoadStep] = useState(0);
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

  const go = useCallback((s) => {
    if (screen === "home-details") {
      setHomeName("");
      setHomeYear("");
      setHomeAddressData({ fullAddress:"", placeId:"", street:"", city:"", state:"", zipCode:"", country:"" });
    }
    if (screen === "video-upload") {
      videoTimersRef.current.forEach(clearTimeout);
      setVideoState("idle");
      setVideoFileName("");
      setVideoProcStep(0);
    }
    if (screen === "asset-input") {
      setSelectedAssets([]);
      setCustomAsset("");
    }
    if (screen === "ai-insight-cta") {
      setInsightPhase(0);
      setInsightLoadStep(0);
    }
    if (screen === "doc-upload") {
      docUploadTimersRef.current.forEach(clearTimeout);
      setDocUploadState("idle");
      setDocUploadFileNames([]);
      setDocUploadProcStep(0);
    }
    if (screen === "value-report-cta") {
      setValueReportPhase(0);
      setValueReportLoadStep(0);
    }
    if (screen === "signup") {
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
    }
    if (screen === "dashboard") {
      setBodieInput("");
      setShowBodie(false);
    }
    setScreen(s);
    scrollRef.current?.scrollTo?.({ top: 0, behavior: "auto" });
  }, [screen]);

  useEffect(() => { if (screen === "splash") { const t = setTimeout(() => go("welcome"), 2200); return () => clearTimeout(t); } }, [screen, go]);

  useEffect(() => {
    if (screen !== "bodie-magic") return;
    setMagicPhase(0);
    const ts = [setTimeout(()=>setMagicPhase(1),600), setTimeout(()=>setMagicPhase(2),1800), setTimeout(()=>setMagicPhase(3),3200), setTimeout(()=>setMagicPhase(4),4500), setTimeout(()=>setMagicPhase(5),5800)];
    return () => ts.forEach(clearTimeout);
  }, [screen]);

  useEffect(() => {
    if (videoState !== "processing") return;
    setVideoProcStep(0);
    const ts = [
      setTimeout(() => setVideoProcStep(1), 500),
      setTimeout(() => setVideoProcStep(2), 1400),
      setTimeout(() => setVideoProcStep(3), 2400),
      setTimeout(() => setVideoState("done"), 3600),
    ];
    videoTimersRef.current = ts;
    return () => ts.forEach(clearTimeout);
  }, [videoState]);

  useEffect(() => {
    if (docUploadState !== "processing") return;
    setDocUploadProcStep(0);
    const ts = [
      setTimeout(() => setDocUploadProcStep(1), 500),
      setTimeout(() => setDocUploadProcStep(2), 1400),
      setTimeout(() => setDocUploadProcStep(3), 2400),
      setTimeout(() => setDocUploadState("done"), 3600),
    ];
    docUploadTimersRef.current = ts;
    return () => ts.forEach(clearTimeout);
  }, [docUploadState]);

  useEffect(() => {
    if (screen !== "ai-insight-cta" || insightPhase !== 1) return;
    setInsightLoadStep(0);
    const ts = [
      setTimeout(() => setInsightLoadStep(1), 800),
      setTimeout(() => setInsightLoadStep(2), 1800),
      setTimeout(() => { addBrevo("ai_insight_generated"); addMilestone("maintenance_plan_generated"); go("ai-maintenance-plan"); }, 3200),
    ];
    return () => ts.forEach(clearTimeout);
  }, [screen, insightPhase, go]);

  useEffect(() => {
    if (screen !== "value-report-cta" || valueReportPhase !== 1) return;
    setValueReportLoadStep(0);
    const ts = [
      setTimeout(() => setValueReportLoadStep(1), 800),
      setTimeout(() => setValueReportLoadStep(2), 1800),
      setTimeout(() => { addBrevo("value_report_generated"); addMilestone("value_report_created"); go("value-report"); }, 3200),
    ];
    return () => ts.forEach(clearTimeout);
  }, [screen, valueReportPhase, go]);

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
      <Fade delay={400}><img src="https://eab40cc435b9ef914dc08d4e17748808.cdn.bubble.io/f1743768597669x211028645903217360/Abodio+logo+without+icons+%281%29.png" alt="Abodio" style={{ height:44, width:"auto", filter:"brightness(0) invert(1)", marginBottom:4 }} /></Fade>
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
      <Fade delay={270}>
        <label style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:8, display:"block" }}>
          Home address <span style={{ fontWeight:400, color:T.textMuted }}>(optional)</span>
        </label>
        <div style={{ marginBottom:20 }}>
          <GooglePlacesInput
            onChange={(text) => setHomeAddressData(d => ({ ...d, fullAddress: text }))}
            onAddressSelect={(data) => setHomeAddressData(data)}
          />
        </div>
      </Fade>
      <Fade delay={340}>
        <label style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:8, display:"block" }}>Year built <span style={{ fontWeight:400, color:T.textMuted }}>(approximate)</span></label>
        <input value={homeYear} onChange={e => setHomeYear(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="e.g., 1998" inputMode="numeric" style={{ ...inputStyle, marginBottom:28 }}
          onFocus={e => e.target.style.borderColor=T.sage} onBlur={e => e.target.style.borderColor=T.border} />
      </Fade>
      <Fade delay={410}>
        <button onClick={() => { addBrevo("details_completed"); setSimState(s => ({...s, bubble:{...s.bubble, home_type:homeType, year:homeYear, name:homeName, address:homeAddressData.fullAddress, city:homeAddressData.city, country:homeAddressData.country}})); go(goal === "get-organized" || goal === "stay-maintained" ? "video-upload" : goal === "protect-value" ? "doc-upload" : "challenge"); }} style={primaryBtn}>Continue <I.Arrow c="#fff" /></button>
        <button onClick={() => go("challenge")} style={{ width:"100%", padding:"14px", background:"none", border:"none", cursor:"pointer", fontFamily:T.font, fontSize:14, color:T.textMuted, marginTop:6 }}>Skip for now</button>
      </Fade>
    </div>
  );

  const VideoUploadScreen = () => {
    const handleFile = (file) => {
      if (!file || !file.type.startsWith("video/")) return;
      setVideoFileName(file.name);
      setVideoState("processing");
    };

    const procSteps = [
      "Video received",
      "Scanning rooms & spaces…",
      "Identifying appliances…",
      "Building your home profile…",
    ];

    const previewSpaces  = persona?.spaces?.slice(0, 3)  || ["Kitchen", "Living Room", "Bedroom"];
    const previewAssets  = persona?.assets?.slice(0, 3)  || ["Refrigerator", "Dishwasher", "Furnace"];
    const previewItems   = [...previewSpaces, ...previewAssets].slice(0, 5);

    return (
      <div style={{ padding:"20px 24px" }}>
        <Fade>
          <p style={{ fontSize:12, fontWeight:700, color:T.sage, textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>Just for you</p>
        </Fade>
        <Fade delay={80}>
          <h2 style={{ fontFamily:T.fontDisplay, fontSize:26, fontWeight:600, lineHeight:1.2, color:T.charcoal, marginBottom:6 }}>Show us your space</h2>
        </Fade>
        <Fade delay={150}>
          <p style={{ fontSize:15, color:T.textSoft, lineHeight:1.5, marginBottom:28 }}>
            Upload a quick home tour and Bodie will organize your rooms, appliances, and documents automatically.
          </p>
        </Fade>

        {videoState === "idle" && (
          <Fade delay={200}>
            <input ref={videoFileRef} type="file" accept="video/*" style={{ display:"none" }}
              onChange={e => handleFile(e.target.files?.[0])} />
            <div
              onClick={() => videoFileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
              onMouseOver={e => { e.currentTarget.style.borderColor=T.sage; e.currentTarget.style.background="#D5ECF2"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor=T.sageSoft; e.currentTarget.style.background=T.sageGhost; }}
              style={{ border:`2px dashed ${T.sageSoft}`, borderRadius:T.r20, padding:"44px 24px", textAlign:"center", cursor:"pointer", background:T.sageGhost, transition:"all .2s", marginBottom:12 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🎥</div>
              <div style={{ fontSize:15, fontWeight:600, color:T.text, marginBottom:4 }}>Tap to upload a video</div>
              <div style={{ fontSize:13, color:T.textMuted }}>or drag & drop · MP4, MOV, AVI</div>
            </div>

            <input id="vid-camera" type="file" accept="video/*" capture="environment" style={{ display:"none" }}
              onChange={e => handleFile(e.target.files?.[0])} />
            <label htmlFor="vid-camera" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, width:"100%", padding:"15px", borderRadius:T.r16, border:`1.5px solid ${T.border}`, background:T.warmWhite, cursor:"pointer", fontFamily:T.font, fontSize:14, fontWeight:500, color:T.textSoft, marginBottom:20, boxSizing:"border-box" }}>
              📷 Record a video instead
            </label>
          </Fade>
        )}

        {videoState === "processing" && (
          <Fade delay={0}>
            <div style={{ background:T.warmWhite, borderRadius:T.r20, padding:24, border:`1.5px solid ${T.sageSoft}`, marginBottom:20 }}>
              <div style={{ fontSize:13, color:T.textMuted, marginBottom:18, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                📹 {videoFileName}
              </div>
              {procSteps.map((label, i) => {
                const done = videoProcStep > i, active = videoProcStep === i, pending = videoProcStep < i;
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, opacity:pending?.3:1, transition:"all .5s" }}>
                    <div style={{ width:30, height:30, borderRadius:10, flexShrink:0, background:done?T.sage:active?T.sageSoft:T.borderSoft, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .4s" }}>
                      {done ? <I.Check s={14} c="#fff" /> : active ? <div style={{ width:14, height:14, border:`2px solid ${T.sage}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite" }} /> : <div style={{ width:6, height:6, borderRadius:3, background:T.textMuted, opacity:.4 }} />}
                    </div>
                    <span style={{ fontSize:14, fontWeight:pending?400:600, color:pending?T.textMuted:T.text }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </Fade>
        )}

        {videoState === "done" && (
          <Fade delay={0}>
            <div style={{ background:`linear-gradient(135deg, ${T.sageGhost}, #E6F5F5)`, borderRadius:T.r20, padding:22, border:`1.5px solid ${T.sageSoft}`, marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:14, background:`linear-gradient(135deg, ${T.sage}, ${T.sageDark})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <I.Sparkle s={22} c="#fff" />
                </div>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:T.charcoal }}>Everything's organized!</div>
                  <div style={{ fontSize:13, color:T.textSoft, marginTop:2 }}>Bodie set up your home profile</div>
                </div>
              </div>
              <p style={{ fontSize:14, color:T.textSoft, lineHeight:1.65, marginBottom:14 }}>
                We identified <strong style={{ color:T.text }}>{previewSpaces.length} rooms</strong> and <strong style={{ color:T.text }}>{previewAssets.length} appliances</strong>. Your complete home profile is ready to explore.
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {previewItems.map((item, i) => (
                  <span key={i} style={{ padding:"5px 12px", borderRadius:T.rFull, fontSize:12, fontWeight:600, background:"rgba(56,128,150,0.1)", color:T.sage, border:`1px solid ${T.sageSoft}` }}>✓ {item}</span>
                ))}
              </div>
            </div>
            <button onClick={() => { addBrevo("video_uploaded"); addMilestone("video_tour"); go(goal === "stay-maintained" ? "asset-input" : "challenge"); }} style={primaryBtn}>
              {goal === "stay-maintained" ? "Continue" : "See my plan"} <I.Arrow c="#fff" />
            </button>
          </Fade>
        )}

        {videoState === "idle" && (
          <Fade delay={360}>
            <button onClick={() => go("challenge")} style={{ width:"100%", padding:"14px", background:"none", border:"none", cursor:"pointer", fontFamily:T.font, fontSize:14, color:T.textMuted }}>
              Skip for now
            </button>
          </Fade>
        )}
      </div>
    );
  };

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

  // ── ASSET INPUT ─────────────────────────────────────────────────────────
  const ASSET_OPTIONS = ["HVAC System","Water Heater","Roof","Gutters","Electrical Panel","Smoke Detectors","Windows","Sump Pump","Plumbing","Pool","Fireplace","Solar Panels","Garage Door","Exterior/Siding"];

  const AssetInputScreen = () => {
    const allAssets = [...ASSET_OPTIONS, ...selectedAssets.filter(a => !ASSET_OPTIONS.includes(a))];
    const toggleAsset = (asset) => {
      setSelectedAssets(prev => prev.includes(asset) ? prev.filter(a => a !== asset) : [...prev, asset]);
    };
    const addCustom = () => {
      const val = customAsset.trim();
      if (!val || selectedAssets.includes(val)) return;
      setSelectedAssets(prev => [...prev, val]);
      setCustomAsset("");
    };
    return (
      <div style={{ padding:"20px 24px" }}>
        <Fade><p style={{ fontSize:12, fontWeight:700, color:T.sage, textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>Step 5 of 5</p></Fade>
        <Fade delay={80}><h2 style={{ fontFamily:T.fontDisplay, fontSize:26, fontWeight:600, lineHeight:1.2, color:T.charcoal, marginBottom:6 }}>What systems does your home have?</h2></Fade>
        <Fade delay={150}><p style={{ fontSize:15, color:T.textSoft, lineHeight:1.5, marginBottom:24 }}>Bodie will track and schedule maintenance for each one.</p></Fade>

        <Fade delay={200}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
            {allAssets.map((asset, i) => {
              const selected = selectedAssets.includes(asset);
              return (
                <button key={i} onClick={() => toggleAsset(asset)} style={{
                  padding:"9px 16px", borderRadius:T.rFull, fontSize:13, fontWeight:600, fontFamily:T.font,
                  border:`1.5px solid ${selected ? T.sage : T.border}`,
                  background:selected ? T.sageGhost : T.warmWhite,
                  color:selected ? T.sage : T.textSoft,
                  cursor:"pointer", transition:"all .15s",
                }}>
                  {selected ? "✓ " : ""}{asset}
                </button>
              );
            })}
          </div>
        </Fade>

        <Fade delay={280}>
          <label style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:8, display:"block" }}>Add a custom asset</label>
          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            <input value={customAsset} onChange={e => setCustomAsset(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCustom()}
              placeholder="e.g., Irrigation System" style={{ ...inputStyle, flex:1 }}
              onFocus={e => e.target.style.borderColor=T.sage} onBlur={e => e.target.style.borderColor=T.border} />
            <button onClick={addCustom} style={{ padding:"0 20px", borderRadius:T.r12, border:`1.5px solid ${T.sage}`, background:T.warmWhite, color:T.sage, fontSize:14, fontWeight:600, fontFamily:T.font, cursor:"pointer", flexShrink:0 }}>Add</button>
          </div>
        </Fade>

        {selectedAssets.length > 0 && (
          <Fade delay={0}>
            <div style={{ background:T.sageGhost, border:`1px solid ${T.sageSoft}`, borderRadius:T.r12, padding:"11px 16px", marginBottom:20, fontSize:13, fontWeight:600, color:T.sage }}>
              {selectedAssets.length} asset{selectedAssets.length !== 1 ? "s" : ""} selected — Bodie will create tasks for each
            </div>
          </Fade>
        )}

        <Fade delay={340}>
          <button onClick={() => { addBrevo("assets_selected"); go("ai-insight-cta"); }} style={{ ...primaryBtn, marginBottom:10 }}>
            Continue <I.Arrow c="#fff" />
          </button>
          <button onClick={() => go("ai-insight-cta")} style={{ width:"100%", padding:"14px", background:"none", border:"none", cursor:"pointer", fontFamily:T.font, fontSize:14, color:T.textMuted }}>
            Skip — I'll add these later
          </button>
        </Fade>
      </div>
    );
  };

  // ── AI INSIGHT CTA ───────────────────────────────────────────────────────
  const AiInsightCtaScreen = () => {
    const insightSteps = ["Analysing your home profile…","Reviewing your systems…","Generating your maintenance plan…"];
    const homeSummary = [homeName || "My Home", homeLabel, homeYear ? `Built ${homeYear}` : ""].filter(Boolean).join(" · ");

    if (insightPhase === 1) {
      return (
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:420 }}>
          <Fade>
            <div style={{ width:64, height:64, borderRadius:20, background:`linear-gradient(135deg, ${T.sage}, ${T.sageDark})`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
              <div style={{ width:28, height:28, border:`3px solid rgba(255,255,255,0.4)`, borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite" }} />
            </div>
          </Fade>
          <Fade delay={100}><h2 style={{ fontFamily:T.fontDisplay, fontSize:24, fontWeight:600, color:T.charcoal, marginBottom:24, textAlign:"center" }}>Building your plan…</h2></Fade>
          <div style={{ width:"100%", maxWidth:320 }}>
            {insightSteps.map((label, i) => {
              const done = insightLoadStep > i, active = insightLoadStep === i, pending = insightLoadStep < i;
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, opacity:pending ? .3 : 1, transition:"all .5s" }}>
                  <div style={{ width:30, height:30, borderRadius:10, flexShrink:0, background:done?T.sage:active?T.sageSoft:T.borderSoft, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .4s" }}>
                    {done ? <I.Check s={14} c="#fff" /> : active ? <div style={{ width:14, height:14, border:`2px solid ${T.sage}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite" }} /> : <div style={{ width:6, height:6, borderRadius:3, background:T.textMuted, opacity:.4 }} />}
                  </div>
                  <span style={{ fontSize:14, fontWeight:pending?400:600, color:pending?T.textMuted:T.text }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding:"20px 24px" }}>
        <Fade>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:28 }}>
            <div style={{ width:72, height:72, borderRadius:24, background:`linear-gradient(135deg, ${T.sage}, ${T.sageDark})`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, boxShadow:T.shadowGlow }}>
              <I.Sparkle s={32} c="#fff" />
            </div>
            <h2 style={{ fontFamily:T.fontDisplay, fontSize:26, fontWeight:600, color:T.charcoal, marginBottom:8, textAlign:"center" }}>Your home profile is ready</h2>
            <p style={{ fontSize:15, color:T.textSoft, textAlign:"center", lineHeight:1.55 }}>Bodie has everything needed to build your personalised maintenance plan.</p>
          </div>
        </Fade>

        <Fade delay={150}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
            <div style={{ background:T.warmWhite, border:`1.5px solid ${T.border}`, borderRadius:T.r16, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>🏠</span>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:T.text }}>{homeName || "My Home"}</div>
                <div style={{ fontSize:12, color:T.textMuted }}>{homeLabel}{homeYear ? ` · Built ${homeYear}` : ""}</div>
              </div>
            </div>
            <div style={{ background:T.warmWhite, border:`1.5px solid ${T.border}`, borderRadius:T.r16, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>🎥</span>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:T.text }}>Home video uploaded</div>
                <div style={{ fontSize:12, color:T.textMuted }}>AI scanned your spaces & systems</div>
              </div>
            </div>
            <div style={{ background:T.warmWhite, border:`1.5px solid ${T.border}`, borderRadius:T.r16, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>🔧</span>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:T.text }}>{selectedAssets.length > 0 ? `${selectedAssets.length} systems selected` : "Home systems profiled"}</div>
                <div style={{ fontSize:12, color:T.textMuted }}>{selectedAssets.length > 0 ? selectedAssets.slice(0,3).join(", ") + (selectedAssets.length > 3 ? "…" : "") : "Ready for maintenance planning"}</div>
              </div>
            </div>
          </div>
        </Fade>

        <Fade delay={280}>
          <button onClick={() => setInsightPhase(1)} style={{ ...primaryBtn, padding:"19px", background:`linear-gradient(135deg, ${T.sage}, ${T.sageDark})`, boxShadow:`0 6px 24px ${T.sage}44`, marginBottom:10 }}>
            <I.Sparkle s={20} c="#fff" /> Get My AI Maintenance Plan
          </button>
          <p style={{ textAlign:"center", fontSize:12, color:T.textMuted, marginTop:8 }}>Personalised for your home · Takes 3 seconds</p>
        </Fade>
      </div>
    );
  };

  // ── AI MAINTENANCE PLAN ──────────────────────────────────────────────────
  const AiMaintenancePlanScreen = () => {
    const assetsToShow = selectedAssets.length > 0 ? selectedAssets : (persona?.assets || []);
    const tasksWithAssets = assetsToShow
      .map(asset => ({ asset, tasks: MAINTENANCE_TASKS[asset] || [] }))
      .filter(({ tasks }) => tasks.length > 0);
    const totalTasks = tasksWithAssets.reduce((sum, { tasks }) => sum + tasks.length, 0);
    const urgencyColor = (u) => u === "high" ? T.coral : u === "medium" ? T.gold : T.sage;

    return (
      <div style={{ padding:"20px 24px" }}>
        <Fade>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <I.Sparkle s={22} c={T.sage} />
            <h2 style={{ fontFamily:T.fontDisplay, fontSize:24, fontWeight:600, color:T.charcoal }}>Your Maintenance Plan</h2>
          </div>
          <p style={{ fontSize:14, color:T.textMuted, marginBottom:24 }}>Personalised by Bodie for {homeName || "your home"} · {homeLabel}</p>
        </Fade>

        {tasksWithAssets.map(({ asset, tasks }, ai) => (
          <Fade key={asset} delay={100 + ai * 60}>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.sage, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:10 }}>{asset}</div>
              <div style={{ background:T.warmWhite, border:`1px solid ${T.border}`, borderRadius:T.r16, overflow:"hidden" }}>
                {tasks.map((t, ti) => (
                  <div key={ti} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", borderTop:ti?`1px solid ${T.borderSoft}`:"none" }}>
                    <div style={{ width:8, height:8, borderRadius:4, background:urgencyColor(t.urgency), flexShrink:0 }} />
                    <span style={{ fontSize:18, flexShrink:0 }}>{t.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:500, color:T.text }}>{t.task}</div>
                      <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>{t.period}</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color:urgencyColor(t.urgency), background:t.urgency==="high"?T.coralSoft:t.urgency==="medium"?T.goldSoft:T.sageGhost, padding:"3px 8px", borderRadius:T.rFull }}>
                      {t.urgency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Fade>
        ))}

        <Fade delay={300}>
          <div style={{ background:`linear-gradient(135deg, #E8F5F5, ${T.sageGhost})`, border:`1.5px solid ${T.sageSoft}`, borderRadius:T.r16, padding:"14px 18px", display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <I.Check s={18} c={T.sage} />
            <span style={{ fontSize:14, fontWeight:600, color:T.sage }}>{totalTasks} tasks scheduled · Reminders set</span>
          </div>
          <button onClick={() => { addMilestone("plan_saved"); go("signup"); }} style={primaryBtn}>
            Save My Plan — Create Account <I.Arrow c="#fff" />
          </button>
        </Fade>
      </div>
    );
  };

  // ── DOC UPLOAD ───────────────────────────────────────────────────────────
  const DocUploadScreen = () => {
    const handleDocFile = (file) => {
      if (!file) return;
      setDocUploadFileNames(prev => [...prev, file.name]);
      setDocUploadState("processing");
    };
    const docProcSteps = ["Files received","Scanning documents…","Identifying improvements…","Building your value profile…"];
    const uploadedCount = docUploadFileNames.length;

    return (
      <div style={{ padding:"20px 24px" }}>
        <Fade><p style={{ fontSize:12, fontWeight:700, color:T.sage, textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>Step 4 of 4</p></Fade>
        <Fade delay={80}><h2 style={{ fontFamily:T.fontDisplay, fontSize:26, fontWeight:600, lineHeight:1.2, color:T.charcoal, marginBottom:6 }}>Document your home</h2></Fade>
        <Fade delay={150}><p style={{ fontSize:15, color:T.textSoft, lineHeight:1.5, marginBottom:28 }}>Upload photos, receipts, permits, or inspection reports. Bodie will build your value protection profile.</p></Fade>

        {docUploadState === "idle" && (
          <Fade delay={200}>
            <input ref={docUploadFileRef} type="file" accept="image/*,application/pdf" style={{ display:"none" }}
              onChange={e => handleDocFile(e.target.files?.[0])} />
            <div
              onClick={() => docUploadFileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleDocFile(e.dataTransfer.files?.[0]); }}
              onMouseOver={e => { e.currentTarget.style.borderColor=T.gold; e.currentTarget.style.background=T.goldSoft; }}
              onMouseOut={e => { e.currentTarget.style.borderColor="#E8D5A3"; e.currentTarget.style.background="#FDFAF2"; }}
              style={{ border:"2px dashed #E8D5A3", borderRadius:T.r20, padding:"44px 24px", textAlign:"center", cursor:"pointer", background:"#FDFAF2", transition:"all .2s", marginBottom:12 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📸</div>
              <div style={{ fontSize:15, fontWeight:600, color:T.text, marginBottom:4 }}>Tap to upload photos or documents</div>
              <div style={{ fontSize:13, color:T.textMuted }}>JPG, PDF, PNG · Receipts, permits, inspection reports</div>
            </div>
            <input id="doc-camera" type="file" accept="image/*" capture="environment" style={{ display:"none" }}
              onChange={e => handleDocFile(e.target.files?.[0])} />
            <label htmlFor="doc-camera" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, width:"100%", padding:"15px", borderRadius:T.r16, border:`1.5px solid ${T.border}`, background:T.warmWhite, cursor:"pointer", fontFamily:T.font, fontSize:14, fontWeight:500, color:T.textSoft, marginBottom:20, boxSizing:"border-box" }}>
              📷 Take a photo instead
            </label>
          </Fade>
        )}

        {docUploadState === "processing" && (
          <Fade delay={0}>
            <div style={{ background:T.warmWhite, borderRadius:T.r20, padding:24, border:`1.5px solid #E8D5A3`, marginBottom:20 }}>
              <div style={{ fontSize:13, color:T.textMuted, marginBottom:18 }}>📄 {docUploadFileNames[docUploadFileNames.length-1]}</div>
              {docProcSteps.map((label, i) => {
                const done = docUploadProcStep > i, active = docUploadProcStep === i, pending = docUploadProcStep < i;
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, opacity:pending?.3:1, transition:"all .5s" }}>
                    <div style={{ width:30, height:30, borderRadius:10, flexShrink:0, background:done?T.gold:active?"#F9EDD0":T.borderSoft, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .4s" }}>
                      {done ? <I.Check s={14} c="#fff" /> : active ? <div style={{ width:14, height:14, border:`2px solid ${T.gold}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite" }} /> : <div style={{ width:6, height:6, borderRadius:3, background:T.textMuted, opacity:.4 }} />}
                    </div>
                    <span style={{ fontSize:14, fontWeight:pending?400:600, color:pending?T.textMuted:T.text }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </Fade>
        )}

        {docUploadState === "done" && (
          <Fade delay={0}>
            <div style={{ background:`linear-gradient(135deg, ${T.goldSoft}, #FFFDF5)`, borderRadius:T.r20, padding:22, border:`1.5px solid ${T.gold}44`, marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:14, background:`linear-gradient(135deg, ${T.gold}, #C49840)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <I.Check s={22} c="#fff" />
                </div>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:T.charcoal }}>✓ Value profile created!</div>
                  <div style={{ fontSize:13, color:T.textSoft, marginTop:2 }}>We found {uploadedCount} document{uploadedCount !== 1 ? "s" : ""} covering your home's improvements and condition.</div>
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {["✓ Receipts","✓ Inspection reports","✓ Permits"].map((tag, i) => (
                  <span key={i} style={{ padding:"5px 12px", borderRadius:T.rFull, fontSize:12, fontWeight:600, background:"rgba(212,168,83,0.12)", color:T.gold, border:`1px solid ${T.gold}33` }}>{tag}</span>
                ))}
              </div>
            </div>
            <button onClick={() => { addBrevo("docs_uploaded"); addMilestone("doc_upload"); go("value-report-cta"); }} style={{ ...primaryBtn, background:`linear-gradient(135deg, ${T.gold}, #C49840)`, boxShadow:`0 4px 16px ${T.gold}44` }}>
              Analyse My Home's Value <I.Arrow c="#fff" />
            </button>
          </Fade>
        )}

        {docUploadState === "idle" && (
          <Fade delay={360}>
            <button onClick={() => go("value-report-cta")} style={{ width:"100%", padding:"14px", background:"none", border:"none", cursor:"pointer", fontFamily:T.font, fontSize:14, color:T.textMuted }}>
              Skip for now
            </button>
          </Fade>
        )}
      </div>
    );
  };

  // ── VALUE REPORT CTA ─────────────────────────────────────────────────────
  const ValueReportCtaScreen = () => {
    const vrSteps = ["Analysing your home profile…","Comparing to similar homes…","Generating your value report…"];

    if (valueReportPhase === 1) {
      return (
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:420 }}>
          <Fade>
            <div style={{ width:64, height:64, borderRadius:20, background:`linear-gradient(135deg, ${T.gold}, #C49840)`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
              <div style={{ width:28, height:28, border:"3px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite" }} />
            </div>
          </Fade>
          <Fade delay={100}><h2 style={{ fontFamily:T.fontDisplay, fontSize:24, fontWeight:600, color:T.charcoal, marginBottom:24, textAlign:"center" }}>Generating your report…</h2></Fade>
          <div style={{ width:"100%", maxWidth:320 }}>
            {vrSteps.map((label, i) => {
              const done = valueReportLoadStep > i, active = valueReportLoadStep === i, pending = valueReportLoadStep < i;
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, opacity:pending?.3:1, transition:"all .5s" }}>
                  <div style={{ width:30, height:30, borderRadius:10, flexShrink:0, background:done?T.gold:active?"#F9EDD0":T.borderSoft, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .4s" }}>
                    {done ? <I.Check s={14} c="#fff" /> : active ? <div style={{ width:14, height:14, border:`2px solid ${T.gold}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite" }} /> : <div style={{ width:6, height:6, borderRadius:3, background:T.textMuted, opacity:.4 }} />}
                  </div>
                  <span style={{ fontSize:14, fontWeight:pending?400:600, color:pending?T.textMuted:T.text }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding:"20px 24px" }}>
        <Fade>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:28 }}>
            <div style={{ width:72, height:72, borderRadius:24, background:`linear-gradient(135deg, ${T.gold}, #C49840)`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, boxShadow:`0 0 0 4px ${T.gold}22` }}>
              <I.Sparkle s={32} c="#fff" />
            </div>
            <h2 style={{ fontFamily:T.fontDisplay, fontSize:26, fontWeight:600, color:T.charcoal, marginBottom:8, textAlign:"center" }}>Ready to protect your home's value</h2>
            <p style={{ fontSize:15, color:T.textSoft, textAlign:"center", lineHeight:1.55 }}>Bodie will analyse your home profile and generate a personalised value report.</p>
          </div>
        </Fade>

        <Fade delay={150}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
            <div style={{ background:T.warmWhite, border:`1.5px solid ${T.border}`, borderRadius:T.r16, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>🏠</span>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:T.text }}>{homeName || "My Home"}</div>
                <div style={{ fontSize:12, color:T.textMuted }}>{homeLabel}{homeYear ? ` · Built ${homeYear}` : ""}</div>
              </div>
            </div>
            <div style={{ background:T.warmWhite, border:`1.5px solid ${T.border}`, borderRadius:T.r16, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>📄</span>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:T.text }}>Documents uploaded</div>
                <div style={{ fontSize:12, color:T.textMuted }}>Photos, receipts & reports scanned</div>
              </div>
            </div>
            <div style={{ background:T.warmWhite, border:`1.5px solid ${T.border}`, borderRadius:T.r16, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>✅</span>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:T.text }}>Profile complete</div>
                <div style={{ fontSize:12, color:T.textMuted }}>Ready for value analysis</div>
              </div>
            </div>
          </div>
        </Fade>

        <Fade delay={280}>
          <button onClick={() => setValueReportPhase(1)} style={{ ...primaryBtn, padding:"19px", background:`linear-gradient(135deg, ${T.gold}, #C49840)`, boxShadow:`0 6px 24px ${T.gold}44`, marginBottom:10 }}>
            <I.Sparkle s={20} c="#fff" /> Get My Home Value Report
          </button>
          <p style={{ textAlign:"center", fontSize:12, color:T.textMuted, marginTop:8 }}>Personalised for your home · Takes 3 seconds</p>
        </Fade>
      </div>
    );
  };

  // ── VALUE REPORT ─────────────────────────────────────────────────────────
  const ValueReportScreen = () => (
    <div style={{ padding:"20px 24px" }}>
      <Fade>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <span style={{ fontSize:22 }}>🏠</span>
          <h2 style={{ fontFamily:T.fontDisplay, fontSize:24, fontWeight:600, color:T.charcoal }}>Home Value Report</h2>
        </div>
        <p style={{ fontSize:14, color:T.textMuted, marginBottom:24 }}>{homeName || "Your home"} · {homeLabel}{homeYear ? ` · Built ${homeYear}` : ""}</p>
      </Fade>

      <Fade delay={100}>
        <div style={{ background:T.warmWhite, border:`1px solid ${T.border}`, borderRadius:T.r20, padding:20, marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:15, fontWeight:700, color:T.charcoal }}>Value Health Score</span>
            <span style={{ fontSize:28, fontWeight:700, color:T.gold, fontFamily:T.fontDisplay }}>78<span style={{ fontSize:16, color:T.textMuted, fontWeight:400 }}>/100</span></span>
          </div>
          <div style={{ height:10, background:T.borderSoft, borderRadius:5, overflow:"hidden" }}>
            <div style={{ height:"100%", width:"78%", background:`linear-gradient(90deg, ${T.gold}, #E8BC5C)`, borderRadius:5, transition:"width .8s cubic-bezier(.2,.8,.3,1)" }} />
          </div>
          <p style={{ fontSize:12, color:T.textMuted, marginTop:8 }}>Above average for homes in your area</p>
        </div>
      </Fade>

      <Fade delay={160}>
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:14, fontWeight:700, color:T.charcoal, marginBottom:10 }}>✅ Protecting Your Value</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {["Maintenance records on file","Home profile documented","Regular upkeep logged"].map((item, i) => (
              <div key={i} style={{ background:T.sageGhost, border:`1px solid ${T.sageSoft}`, borderRadius:T.r12, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                <I.Check s={14} c={T.sage} />
                <span style={{ fontSize:14, color:T.text }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Fade>

      <Fade delay={220}>
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:14, fontWeight:700, color:T.charcoal, marginBottom:10 }}>⚠️ Risks to Address</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {["Roof inspection overdue — affects resale","No electrical panel update on record","Improvement receipts not uploaded"].map((item, i) => (
              <div key={i} style={{ background:T.goldSoft, border:`1px solid ${T.gold}33`, borderRadius:T.r12, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:14, color:T.gold, fontWeight:700, flexShrink:0 }}>⚠️</span>
                <span style={{ fontSize:14, color:T.textSoft }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Fade>

      <Fade delay={280}>
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:14, fontWeight:700, color:T.charcoal, marginBottom:10 }}>📋 Top Actions</div>
          <div style={{ background:T.warmWhite, border:`1px solid ${T.border}`, borderRadius:T.r16, overflow:"hidden" }}>
            {[
              "Document recent upgrades with photos & receipts",
              "Schedule a pre-listing inspection",
              "Upload your insurance policy",
              "Store all warranties in your document vault",
              "Log any permits for work done",
            ].map((action, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", borderTop:i?`1px solid ${T.borderSoft}`:"none" }}>
                <div style={{ width:22, height:22, borderRadius:T.rFull, background:T.sageGhost, border:`1px solid ${T.sageSoft}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:T.sage, flexShrink:0 }}>{i+1}</div>
                <span style={{ fontSize:14, color:T.text }}>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </Fade>

      <Fade delay={340}>
        <button onClick={() => { addMilestone("value_report_saved"); go("signup"); }} style={{ ...primaryBtn, background:`linear-gradient(135deg, ${T.gold}, #C49840)`, boxShadow:`0 4px 16px ${T.gold}44`, marginBottom:8 }}>
          Save My Report — Create Free Account <I.Arrow c="#fff" />
        </button>
        <p style={{ textAlign:"center", fontSize:12, color:T.textMuted, marginTop:8 }}>Your report is saved forever · No credit card</p>
      </Fade>
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
          <input type="text" placeholder="Full name" value={signupName} onChange={e => setSignupName(e.target.value)} style={inputStyle}
            onFocus={e => e.target.style.borderColor=T.sage} onBlur={e => e.target.style.borderColor=T.border} />
          <input type="email" placeholder="Email address" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} style={inputStyle}
            onFocus={e => e.target.style.borderColor=T.sage} onBlur={e => e.target.style.borderColor=T.border} />
          <input type="password" placeholder="Create password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} style={inputStyle}
            onFocus={e => e.target.style.borderColor=T.sage} onBlur={e => e.target.style.borderColor=T.border} />
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
{JSON.stringify({ bubble: simState.bubble, brevo_tags: simState.brevo, milestones: simState.milestones, profile: { goal, homeType, homeYear, homeName, challenge, address: homeAddressData } }, null, 2)}
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
  const screens = { splash: Splash, welcome: Welcome, goal: GoalScreen, "home-type": HomeTypeScreen, "home-details": HomeDetailsScreen, "video-upload": VideoUploadScreen, challenge: ChallengeScreen, "bodie-magic": BodieMagic, signup: SignupScreen, dashboard: Dashboard, "asset-input": AssetInputScreen, "ai-insight-cta": AiInsightCtaScreen, "ai-maintenance-plan": AiMaintenancePlanScreen, "doc-upload": DocUploadScreen, "value-report-cta": ValueReportCtaScreen, "value-report": ValueReportScreen };
  const Screen = screens[screen] || Welcome;
  const showNav = !["splash","welcome"].includes(screen);
  const stepScreens =
    goal === "stay-maintained" ? ["goal","home-type","home-details","video-upload","asset-input"] :
    goal === "protect-value"   ? ["goal","home-type","home-details","doc-upload"] :
    goal === "get-organized"   ? ["goal","home-type","home-details","video-upload"] :
                                 ["goal","home-type","home-details","challenge"];
  const showSteps = stepScreens.includes(screen);
  const stepIdx   = stepScreens.indexOf(screen);
  const flowOrder =
    goal === "get-organized"   ? ["splash","welcome","goal","home-type","home-details","video-upload","challenge","bodie-magic","signup","dashboard"] :
    goal === "stay-maintained" ? ["splash","welcome","goal","home-type","home-details","video-upload","asset-input","ai-insight-cta","ai-maintenance-plan","signup","dashboard"] :
    goal === "protect-value"   ? ["splash","welcome","goal","home-type","home-details","doc-upload","value-report-cta","value-report","signup","dashboard"] :
                                 ["splash","welcome","goal","home-type","home-details","challenge","bodie-magic","signup","dashboard"];

  const globalStyles = (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes pulse { 0%{box-shadow:0 6px 24px ${T.sage}44, 0 0 0 0 ${T.sage}33} 70%{box-shadow:0 6px 24px ${T.sage}44, 0 0 0 12px ${T.sage}00} 100%{box-shadow:0 6px 24px ${T.sage}44, 0 0 0 0 ${T.sage}00} }
        @keyframes loadBar { from{width:0%} to{width:100%} }
        @keyframes fadeInDropdown { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        * { margin:0; padding:0; box-sizing:border-box; }
        input::placeholder { color:${T.textMuted}; }
        .gp-input::placeholder { color:#8E9A93; }
        ::-webkit-scrollbar { width:0; height:0; }
      `}</style>
    </>
  );

  // ── DESKTOP SIDEBAR ──────────────────────────────────────────────────────
  const DesktopSidebar = () => (
    <div style={{ width:420, flexShrink:0, background:`linear-gradient(180deg, ${T.sageDeep} 0%, ${T.sageDark} 100%)`, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"52px 48px", position:"sticky", top:0, height:"100vh", overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center" }}>
        <img src="https://eab40cc435b9ef914dc08d4e17748808.cdn.bubble.io/f1743768597669x211028645903217360/Abodio+logo+without+icons+%281%29.png" alt="Abodio" style={{ height:32, width:"auto", filter:"brightness(0) invert(1)" }} />
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
              <div style={{ display:"flex", alignItems:"center" }}>
                <img src="https://eab40cc435b9ef914dc08d4e17748808.cdn.bubble.io/f1743768597669x211028645903217360/Abodio+logo+without+icons+%281%29.png" alt="Abodio" style={{ height:24, width:"auto" }} />
              </div>
              {screen === "dashboard" ? (
                <div style={{ width:36, height:36, borderRadius:11, background:T.sageGhost, border:`1px solid ${T.sageSoft}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:T.sage }}>{(homeName||"H")[0]}</div>
              ) : <div />}
            </div>
          )}
          {showSteps && (
            <div style={{ padding:"16px 48px 0", maxWidth:680, width:"100%" }}>
              <Steps current={stepIdx} total={stepScreens.length} />
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
            <div style={{ display:"flex", alignItems:"center" }}>
              <img src="https://eab40cc435b9ef914dc08d4e17748808.cdn.bubble.io/f1743768597669x211028645903217360/Abodio+logo+without+icons+%281%29.png" alt="Abodio" style={{ height:24, width:"auto" }} />
            </div>
            {screen === "dashboard" ? (
              <div style={{ width:34, height:34, borderRadius:11, background:T.sageGhost, border:`1px solid ${T.sageSoft}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:T.sage }}>{(homeName||"H")[0]}</div>
            ) : <div style={{ width:60 }} />}
          </div>
        )}

        {showSteps && <Steps current={stepIdx} total={stepScreens.length} />}

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
