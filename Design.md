# Univa — Design System

A modern, minimalist visual language for the Univa journey-planning app.

---

## 1. Color Palette

| Role | Color | Hex | Usage |
|---|---|---|---|
| Primary | Deep Navy | `#192841` | Primary buttons, active states, route accents, focus rings |
| Base Dark | Slate Charcoal / Black | `#0F172A` / `#000000` | Headings, primary text on light backgrounds, high-contrast elements |
| Base Light | White | `#FFFFFF` | Backgrounds, cards, elevated surfaces |

### Supporting shades (derived, for depth without adding new hues)

| Name | Hex | Usage |
|---|---|---|
| Navy Hover | `#111C2E` | Hover state on primary buttons |
| Navy Soft Tint | `#192841`/10 | Active pill badges, subtle highlights |
| Secondary Text | `#64748B` | Secondary text, inactive icons |
| Border Slate | `#E2E8F0` | Dividers, input borders, disabled states |
| Off-White | `#F7F9FC` | Page background (clean and soft, reducing eye strain) |
| Success Green | `#22C55E` | On-time / arrived states (used sparingly) |
| Alert Amber | `#F59E0B` | Delays / warnings (used sparingly) |

**Rule of thumb:** Deep Navy is applied with minimalist restraint for active states, primary CTA buttons, and telemetry lines. All headings and body text remain crisp neutral slate/charcoal (`#0F172A`). Accent colors (green/amber) are functional only — never decorative. Avoid overusing blue across card surfaces.

---

## 2. Typography

- **Typeface:** A clean geometric or grotesque sans-serif (e.g. Inter, Manrope, or SF Pro).
- **Hierarchy:**
  - H1 (screen titles): 28–32px, Bold, Navy or Black
  - H2 (section headers): 20–22px, Semibold
  - Body: 15–16px, Regular, Black / Navy 90%
  - Caption / meta (times, distances): 12–13px, Medium, Navy 60%
- **Line height:** 1.4–1.5x for readability on transit/mobile use.

---

## 3. Layout & Spacing

- **Grid:** 8px base spacing unit (8 / 16 / 24 / 32).
- **Corner radius:** 12–16px on cards and buttons — soft, modern, not sharp.
- **Whitespace:** Generous padding around content blocks; avoid clutter — minimalism means one clear action per screen.
- **Shadows:** Soft, low-opacity (e.g. `0 4px 12px rgba(25,40,65,0.08)`) instead of hard borders, to separate cards from background.

---

## 4. Components

- **Buttons:** Solid Navy fill, white text, 12–16px radius. Secondary buttons: white fill, Navy border and text.
- **Inputs:** White background, Navy 20% border, Navy focus ring, black text.
- **Cards** (journey summary, saved places): White on Off-White background, subtle shadow, Navy accents for icons/labels.
- **Icons:** Simple line icons, Black or Navy, consistent stroke width (1.5–2px).
- **Navigation bar / bottom tabs:** White background, active icon/label in Navy, inactive in Navy 60%.

---

## 5. Screen-by-Screen Notes

### 1. Login Page
- NEXA logo in Navy, centered top.
- Off-white background, white input fields with Navy 20% borders.
- Primary "Login" button: solid Navy.
- "Forgot password" and "Register" links in Navy, underlined or medium-weight text.

### 2. Registration Page
- Same input/button styling as Login for consistency.
- Optional profile photo: circular placeholder with Navy 20% outline, camera icon in Navy.
- Terms & Privacy checkbox: Navy check on white.

### 3. Home Page
- Top bar: white background, logo left, avatar + notification bell right (Navy icons).
- Location pill: light Navy-tinted background, black text.
- Destination search: prominent white search bar with soft shadow, sits just below the top bar.
- Recent destinations (University / Home / Work / Airport): horizontal chips, white fill, Navy icon + label.
- Voice button ("Tell NEXA"): circular, solid Navy, white mic icon — the single most visually prominent element on the page.

### 4. Destination / Route Preferences
- "From" / "To" fields: stacked white inputs with a Navy connecting line/dot between them.
- Map preview: full-width card, rounded corners, Navy route line on white/light map style.
- "Change location" as a small Navy text link.

### 5. Journey Plan
- Journey summary card: white card on off-white background.
- Key stats (Arrival, Journey time, Transfers, Walking) laid out as a clean 2x2 or horizontal row, Navy icons above black numerals, Navy 60% labels.

### 6. Live Journey
- Map-first layout with minimal Navy UI overlays (current location dot, route line).
- Bottom sheet: white, rounded top corners, showing vehicle, next stop, and transfer points in a compact list.

### 7. Journey Complete
- Celebratory but minimal: "You've arrived 🎉" in bold Navy/Black, centered.
- Summary stats in a clean list or grid, same style as Journey Plan card.
- Star rating: outline stars in Navy 20%, filled stars in Navy or Alert Amber-adjacent gold if you want warmth (optional accent).
- "Done" button: solid Navy, full-width.

---

## 6. Design Principles

1. **One accent color.** Navy is the only brand color — everything else is black, white, or neutral grays derived from navy.
2. **Function over decoration.** Green/amber only appear when conveying status (on-time, delay) — never as design flourishes.
3. **Breathing room.** Minimalism is enforced through spacing and hierarchy, not through removing useful information.
4. **Consistency across screens.** Buttons, inputs, and cards behave identically everywhere so the app feels predictable during transit (when users are moving, distracted, or in a hurry).