# 🎀 cosynq Brand Guidelines v2: Celestial Nebula

> **navigate the nebula. command your orbit.** (Dark Mode)
> **dream in pastel. stitch the stars.** (Light Mode)

`cosynq` has evolved into a high-fidelity, celestial experience. We've moved from "Soft" to "Vibrant," embracing a **Nebula Core** aesthetic that feels like a professional streamer setup mixed with ethereal anime vibes. Everything is larger, bolder, and more luminous.

---

## 📱 Layout Strategy: "Bento Core" Precision

We utilize a **Bento Core** layout strategy to organize complex information into digestible, beautiful modules.
- **Grids & Compartments**: Use CSS Grid to create "Bento boxes" where each feature or metric has its own distinct, softly rounded container.
- **Pill UI Components**: Use elongated pill shapes (`rounded-full`) for timelines, status indicators, and badges rather than sharp rectangles.
- **Large-Scale UI**: Ensure the platform feels tactile. Buttons and inputs are "chunky" and satisfying to interact with. Favors central, focused layouts (Glassmorphic Cards) for complex tasks.

---

## 🔤 Typography: "Nebula Bold"

* **Primary Font (Headings):** `Quicksand`
  * *Vibe:* Now used with tighter tracking and bolder weights to command attention.
* **Secondary Font (Body & UI):** `DM Sans`
  * *Vibe:* The anchor. Precise and modern.

---

## 🎨 Palette v2: The Nebula Spectrum

### ☀️ Light Mode: The Pastel Nebula
*Backgrounds feel like a soft, iridescent sunrise.*

* **Background:** Cloudy Lavender `#F9F7FD`
* **Primary:** Saturated Lavender (via HSL)
* **Secondary:** Saturated Pink (via HSL)
* **Accent:** Saturated Cyan (via HSL)
* **Visuals:** Use horizontal pastel gradients and "puff" transitions.

### 🌙 Dark Mode: The Nebula Void
*Backgrounds are deep, saturated purples; UI elements glow with neon light.*

* **Background:** Deep Nebula Purple `#0a0a12`
* **Primary:** Vibrant Nebula Purple `#CE9BFF` (Glowing)
* **Secondary:** Electric Cyan `#66E0FF` (Glowing)
* **Accent:** Cyber Magenta `#FF8AE0` (Glowing)
* **Visuals:** Glowing borders, neon shadows, and glassmorphic panes.

---

## ✨ Component Sizing (The "Don't Be Shy" Rule)

- **Input Height:** `h-14` to `h-16` (56px - 64px)
- **Button Height:** `h-14` to `h-16` (56px - 64px)
- **Border Radius:** `2rem` (32px) as the standard for cards and main buttons.
- **Glassmorphism:** High backdrop-blur (`20px`+) and semi-transparent borders.

---

## 🛠️ Immutable Rules for Developers

To maintain the sanctuary's integrity and visual excellence, all code MUST follow these rules:

1.  **NO ITALICS**: We have moved to a clean, architectural aesthetic. Never use `italic` or `font-italic` classes. Prefer `bold` (leading-tight) and `uppercase` with tracking for emphasis.
2.  **SMART TIME ONLY**: All time-related operations (storage, formatting, display) MUST use the helpers in `lib/utils/time.utils.ts`. 
    - Store as ISO (UTC) via `toISOFormat()`.
    - Display localized via `toLocalTime()` or `toLocalTimeWithOptions()`.
3.  **NO HARDCODED COLORS**: Never use hex codes, RGB, or Tailwind color utilities (like `text-white` or `bg-slate-500`) directly in components.
    - Always use theme variables: `hsl(var(--primary))`, `text-foreground`, `bg-background`, etc.
    - This ensures perfect parity between "Angel Core" (Light) and "Space Core" (Dark) themes.

---

## 💻 Developer implementation

```css
/* Update your globals.css with the v2 HSL values */
:root {
  --background: 280 40% 98%;
  --primary: 280 75% 65%; /* Saturated for Light Mode visibility */
  --radius: 1.5rem;
}
.dark {
  --background: 240 25% 6%;
  --primary: 280 80% 75%;
}
```