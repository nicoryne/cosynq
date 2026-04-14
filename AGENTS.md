<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# .AGENT

## Title
cosynq

## Description
`cosynq` is a celestial-themed web platform designed to be the ultimate sanctuary and organizational command center for the cosplay community. Built to eliminate the chaos of scattered group chats and messy spreadsheets, it consolidates **precision convention scheduling**, **community-driven forums**, **Cosplay Group (CG) recruitment**, and **complex project-based budgeting** into one sleek, ethereal space. Leveraging Next.js, Supabase, and React Query, `cosynq` delivers a premium, fast, and highly organized user experience wrapped in a dark-mode, space-minimalist aesthetic. 

## Target Audience
Chronically online cosplayers, prop makers, wig stylists, photographers, and convention organizers. While deeply rooted in the vibrant Cebu City and Philippine cosplay scene, `cosynq` is built for a global orbit of creatives who need a dedicated, aesthetic, and functional hub for their craft.

---

## Visual Identity & Aesthetics (Celestial Nebula Core v2)

The `cosynq` aesthetic is a fusion of space-minimalism and high-fidelity "glassmorphism." All UI elements should adhere to these principles:

1. **Space Minimalism**: Dark, deep backgrounds (`#0a0a12`) contrasted with vibrant lavender and cyan accents. Use significant whitespace to create a sense of vastness.
2. **Glassmorphism**: Use translucent surfaces with high blur (`backdrop-blur-xl`) and subtle white borders (`border-white/10`) to simulate frosted glass floating in space.
3. **Ethereal Motion**: Animations should be slow, organic, and gentle (e.g., slow drifting clouds, twinkling stars, soft pulsatile glows). Avoid jarring transitions.
4. **Organic Shapes**: Use large border-radii (`var(--radius)`) and organic "wave" or "landscape" clipped containers to break the rigidity of standard grid layouts.


## Architecture

# 6-Layer Architecture Overview
This project follows a structured 6-layer architecture designed for scalability, maintainability, and clear separation of concerns. All business logic and data fetching have been centralized into the `lib/` directory to maintain a clean root structure.

## File Naming Convention
**All files in the codebase MUST use kebab-case naming convention.**
- ✅ Correct: `role.service.ts`, `user-profile.component.tsx`, `cosplay-group.types.ts`
- ❌ Incorrect: `roleService.ts`, `UserProfile.component.tsx`, `CosplayGroup.types.ts`
- This applies to all TypeScript/JavaScript files, including services, actions, hooks, components, utilities, and validation schemas.
- Exception: React component files may use PascalCase if they export a default component, but kebab-case is still preferred for consistency.

## 1. View Layer (`app/`)
**Responsibility:** Routing, Layouts, and Page-level Data Fetching.
- Handles the entry points of the application using the Next.js App Router.
- Uses **Server Components** by default to fetch initial data or manage SEO metadata.

## 2. Component Layer (`components/`)
**Responsibility:** UI Presentation and Client-side Interactivity.
- Contains modular, reusable React components heavily utilizing **shadcn** and **next-themes**.
- Remains in the root directory, separate from the core business logic.

## 3. Hook Layer (`lib/hooks/`)
**Responsibility:** "The Glue" — State Management and Data Interface.
- Bridges the UI (Components) and the logic (Actions).
- Uses **TanStack Query** (`useQuery`, `useMutation`) to wrap Server Actions.
- Manages caching, status states (`isLoading`), and query invalidations.

## 4. Action Layer (`lib/actions/`)
**Responsibility:** Entry Points for Mutations (Server Actions).
- Acts as the "Controller" between the UI/Hooks and the Services.
- Defined with `'use server'` to be called directly from Client Components.
- Handles routing validations, `revalidatePath`, and passes sanitized data to the Service layer.

## 5. Service Layer (`lib/services/`)
**Responsibility:** Core Business Logic and Complex Data Operations.
- Contains the "Heavy Lifting" of the application.
- Handles complex Supabase queries, data transformations, and multi-step database transactions.
- Examples: `UserService`, `CosplayGroupService`.

## 6. Data Access, Types & Persistence Layer (`lib/` core & `supabase/`)
**Responsibility:** Infrastructure, Security, and Database Interface.
- **`lib/` core**: Contains shared types, smart utilities (e.g., time formatting), DTO definitions, and **Zod** validation schemas.
- **`supabase/`**: Contains SQL migrations, seed data, and schema definitions.

---

## Security Standards & Compliance

To maintain a secure sanctuary for our users, `cosynq` strictly adheres to standard data privacy compliances (such as GDPR and local Philippine Data Privacy Act standards) and follows these immutable security rules:

1. **"Do Not Trust The Client" Paradigm:**
   - The user must be strictly guarded regarding what they can edit and what payload they receive.
   - **Data Transfer Objects (DTOs):** Only strictly necessary data is sent to the client. No exposing hidden database fields.
   - **Role-Based Access Control (RBAC):** Strict checks must be performed at the Service layer to ensure the user has the authority to view or mutate the requested data.
2. **Strict Row Level Security (RLS):**
   - **ALL** tables in Supabase must have strict, detailed RLS policies applied. No table should ever be left open to public unauthenticated mutations.
3. **Absolute Input Validation:**
   - Every single piece of input coming from the client must pass through strict **Zod** schema validation before ever touching the Action or Service layers.
4. **Supabase Migration Workflow:**
   - Database schemas and types must remain perfectly synced.
   - To push schema changes to the remote database, use: 
     `npx supabase db push`
   - To pull the generated TypeScript types into the application, strictly use:
     `npx supabase gen types typescript --project-id euhfhbpcqsfkfhmyvrzw > database.types.ts`

---

## Performance & Optimizations

To ensure the platform runs as smoothly as jumping through hyperspace, all features must adhere to the following optimization guidelines:

1. **Chunked Data Retrieval (Pagination & Infinite Scroll):**
   - Any dashboard, directory, or list data overview (e.g., Cosplay Group recruitments, user directories, forum posts) must implement either structured pagination or infinite scroll based on the UX context to ensure the database only serves small, manageable chunks of data.
2. **Smart Time Management:**
   - **Mandatory Time Utility Usage:** All time-related operations MUST use the functions in `lib/utils/time.utils.ts`.
   - **Upload/Storage Flow:** 
     - Before storing ANY time-related data to Supabase, it MUST be converted to ISO format (UTC) using `toISOFormat()`.
     - This applies to all timestamps: creation dates, update dates, event dates, deadlines, etc.
   - **Retrieval/Display Flow:**
     - After fetching time-related data from Supabase and before rendering to the UI, it MUST be converted to the user's local browser time using `toLocalTime()` or `toLocalTimeWithOptions()`.
   - **Smart Relative Time Display:**
     - For user-facing content with timestamps (blog posts, comments, forum posts, CG recruitment dates, event dates, "updated_at" fields in admin panels, etc.), use `getRelativeTime()` or `formatWithToday()` to display user-friendly relative times.
     - Examples: "Just now", "5 minutes ago", "2 hours ago", "Yesterday", "3 days ago"
     - This creates a more engaging, social-media-like experience for the community.
3. **List Overview DTOs:**
   - For list overviews (such as data management tables or feed cards), create specific List DTOs that only query the exact columns needed for the overview card. 
   - The complete, heavy object should **only** be fetched when the user navigates to the specific detail page.
<!-- END:nextjs-agent-rules -->
