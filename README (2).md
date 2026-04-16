# Abodio Onboarding Prototype — README

## What This Is
A high-fidelity, mobile-first interactive prototype showing how Abodio's onboarding could be redesigned for maximum activation and subscription conversion. Built as a presentation-quality demo for client sign-off.

---

## What Changed & Why

### Current Flow (abodio.com)
Static onboarding → account creation → empty dashboard → user figures it out

### Proposed Flow
**Goal profiling → home type → quick details → pain point → AI "wow moment" → lightweight signup → guided dashboard**

The key strategic shift: **value before commitment**. Users see Bodie build their home setup before they create an account. Signup becomes "save what was created for me" rather than "give us your info to see what we do."

---

## Flow Map

```
SPLASH → WELCOME → GOAL → HOME TYPE → DETAILS → PAIN POINT → BODIE MAGIC → SIGNUP → DASHBOARD
                     │         │          │          │              │                      │
               Persona set  Profiled   Optional   Challenge    AI builds home         Activation
               CRM tagged   Bubble     collected  identified   WOW MOMENT             continues
                                                                Value shown            Premium trigger
```

---

## Key Value Moments

| # | Moment | Where | What Happens |
|---|--------|-------|-------------|
| 1 | "This is for me" | Goal screen | User self-identifies; everything adapts |
| 2 | "AI just did that" | Bodie Magic | Spaces created, manuals found, plan built — in 6 seconds |
| 3 | "My home is ready" | Result card | Tangible output before signup |
| 4 | "I know what to do" | Dashboard checklist | Clear next steps, not a blank state |
| 5 | "I want more" | Premium trigger | Appears after 2+ completed actions |

---

## How Personalization Works

4 personas, each changing: copy, spaces, assets, checklist, Bodie messaging, CRM tags, Bubble state.

| Persona | Copy Tone | First Win | Bodie Focus |
|---------|-----------|-----------|-------------|
| New Homeowner | Congratulatory, guided | 12 maintenance tasks scheduled | Full home setup |
| Get Organized | Empathetic, practical | 8 manuals auto-found | Document cataloging |
| Stay Maintained | Preventive, urgent | 6 seasonal tasks scheduled | Maintenance planning |
| Protect Value | Strategic, reassuring | 35% profile complete | Documentation |

### Simulated Data Points (visible in debug panel)
- **Bubble**: persona, home_type, year, name, activation_stage
- **Brevo CRM**: goal tags, home type, pain point, engagement milestones
- **Milestones**: goal_set, profile_complete, magic_seen, account_created, first_action, bodie_chat

---

## How Bodie Helps

### During Onboarding (Bodie Magic Screen)
Animated, step-by-step AI setup:
1. Analyzes home type
2. Creates personalized spaces
3. Finds appliance manuals
4. Builds maintenance plan

### Inside Dashboard
- Contextual intro card with persona-specific guidance
- Full chat with suggested quick actions
- Responds to: "set up my home", "maintenance schedule", "find my manuals"
- Actions are concrete — Bodie *does things*, doesn't just answer questions

---

## Premium Trigger

**Where**: Dashboard, after completing 2+ checklist items
**Why here**: User has experienced value at 3 points already (magic, result, dashboard actions)
**What it says**: "You're already seeing the value" — frames upgrade as continuation, not new commitment
**Design**: Gold accent, dismissible, 30-day guarantee, $89/yr matching current pricing

---

## UX Principles Applied (from DesignerUp research)

1. **Know thy user** — Goal selection creates persona before anything else
2. **Work backward from success** — Each persona has a defined "first win"
3. **Align with business model** — Premium appears after value, not before
4. **Progressive disclosure** — Only 4 steps, each collecting minimum data
5. **Show don't tell** — Bodie Magic screen demonstrates AI doing real work
6. **Smart defaults** — Spaces/assets pre-populated based on home type
7. **Continuous onboarding** — Dashboard continues activation, not separate phase

---

## Design Details

- **Typography**: DM Sans (body) + Fraunces (headings) — premium, calm
- **Palette**: Sage green (#4A8B6E) with warm neutrals — matches Abodio brand
- **Frame**: iOS phone simulation with status bar and home indicator
- **Animations**: Staggered fade-ins, loading phases, pulsing FAB
- **Mobile-first**: 400px max-width, touch-friendly 44px+ tap targets
