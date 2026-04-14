# 🎀 cosynq Brand Guidelines v2: Celestial Nebula

> **navigate the nebula. command your orbit.** (Dark Mode)
> **dream in pastel. stitch the stars.** (Light Mode)

`cosynq` has evolved into a high-fidelity, celestial experience. We've moved from "Soft" to "Vibrant," embracing a **Nebula Core** aesthetic that feels like a professional streamer setup mixed with ethereal anime vibes. Everything is larger, bolder, and more luminous.

---

## 📱 Layout Strategy: Bold & Immersive

We utilize **Large-Scale UI** to ensure the platform feels tactile and premium. Buttons and inputs are "chunky" and satisfying to interact with, especially on high-resolution mobile devices. We favor central, focused layouts (Glassmorphic Cards) for complex tasks like Sign-Up.

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
* **Primary:** Pastel Lavender `#E8D5FF`
* **Secondary:** Pastel Pink `#FCE6F0`
* **Accent:** Pastel Sky Cyan `#E0F7FA`
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

## 💻 Developer implementation

```css
/* Update your globals.css with the v2 HSL values */
:root {
  --background: 280 40% 98%;
  --primary: 280 70% 85%;
  --radius: 1.5rem;
}
.dark {
  --background: 240 25% 6%;
  --primary: 280 80% 75%;
}
```