# 🌌 cosynq

> **align your orbit. sync your universe.**
> 
> 🔗 **Live Orbit:** [cosynq.ryne.dev](https://cosynq.ryne.dev)

Welcome to **cosynq**, the celestial command center designed exclusively for the cosplay community. Built to eliminate the chaos of scattered group chats, messy spreadsheets, and con-crunch panic, `cosynq` provides a sleek, highly-organized, dark-mode sanctuary for cosplayers, prop makers, and photographers to manage their craft.

Designed and developed by **[RYNE.DEV](https://ryne.dev)**.

---

## ✨ Features

`cosynq` consolidates everything a creator needs into one unified, ethereal dashboard:

* **👩‍🚀 Astral Profiles:** A highly customizable user profile where you can showcase your portfolio, display your current aesthetic, and manage your public presence.
* **🪐 Cosplan Constellations:** Your dedicated workspace for managing "cosplans" (cosplay plans). Track your progress, break down material budgets (EVA foam, fabrics, wigs), and organize reference images in one clean view.
* **🗓️ The Celestial Calendar:** A fully integrated calendar view for managing local and international conventions, tracking photoshoot dates, and setting personal crafting deadlines.
* **✨ Cosplay Groups (CGs):** The ultimate recruitment and management hub for group cosplays. Cast characters, coordinate lineups, and keep your entire squad perfectly synced for the next big con.
* **🚀 Discussion Forums:** A community space to share wig-styling tutorials, drop links to the best local fabric suppliers, or just vent about your sewing machine breaking at 3 AM. 

---

## 🛠️ Tech Stack

`cosynq` is engineered for hyper-speed and scalability, built on a modern, robust stack:

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Database & Auth:** [Supabase](https://supabase.com/)
* **State & Data Fetching:** [TanStack React Query](https://tanstack.com/query/latest)
* **Validation:** [Zod](https://zod.dev/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
* **Theming:** `next-themes` (Strictly dark-mode / midnight aesthetic)
* **Media Storage:** [Cloudinary](https://cloudinary.com/)

---

## 🔒 Security & Architecture Standards

This project strictly adheres to a **6-Layer Architecture** (View, Component, Hook, Action, Service, and Data Access). To ensure the absolute safety of our community's data, the platform implements:

* **"Do Not Trust The Client":** Strict data sanitization. All API responses use Data Transfer Objects (DTOs) to ensure only essential data is exposed to the client.
* **Strict Validation:** Every single input payload is validated via Zod schemas before hitting the Service layer.
* **Row Level Security (RLS):** All Supabase tables are locked down with precise RLS policies. No public unauthorized mutations are allowed.
* **Optimized Rendering:** Implementation of cursor-based infinite scroll and pagination for all dashboard feeds and forum threads to maintain lightning-fast load times.

### Role-Based Access Control (RBAC)

cosynq implements a zero-lookup, cryptographically secure RBAC system using Supabase's custom JWT access token hooks. User roles are stamped directly into authentication tokens, eliminating database JOINs while maintaining absolute security.

#### Available Roles

| Role | Celestial Name | Permissions |
|------|----------------|-------------|
| `user` | **Dreamer** | Full access to personal content (profiles, cosplans, budgets) |
| `moderator` | **Oracle** | Community moderation (hide/lock posts, manage recruitment listings) |
| `admin` | **Weaver** | Full system access (user management, role assignment, configuration) |

#### Security Guarantees

* **Zero Client Trust:** Roles are never sent by the client; they're cryptographically stamped into JWTs at authentication time
* **Tamper-Proof:** JWT signatures prevent role escalation attacks
* **Zero-Lookup Performance:** Role checks execute without database queries (sub-200ms response times)
* **Audit Trail:** All role changes are automatically logged with timestamps and actor information
* **Last Admin Protection:** System prevents removing or demoting the last admin user

For detailed RBAC implementation, see:
* [RBAC Architecture Guide](./supabase/roles.md) - Complete implementation details
* [Security Policy](./SECURITY.md) - Security model and guarantees

---

## 🚀 Getting Started (Local Orbit)

Want to run `cosynq` locally? Follow these steps:

**1. Clone the repository:**
```bash
git clone [https://github.com/nicoryne/cosynq.git](https://github.com/nicoryne/cosynq.git)
cd cosynq
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up environment variables:**
```bash
cp .env.example .env
```

**4. Sync Database Types**
```bash
npx supabase gen types typescript --project-id euhfhbpcqsfkfhmyvrzw > database.types.ts
```

**5. Run the development server:**
```bash
npm run dev
```

💌 Developer

Built with 🩵 by [RYNE.DEV](https://ryne.dev).