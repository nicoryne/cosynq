/**
 * Navigation links for the cosynq platform
 * Centralized for reusability across Navbar, Mobile Drawer, and Footer
 */

export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export const LANDING_NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#journey" },
  { label: "Community", href: "#community" },
  { label: "FAQ", href: "#faq" },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact Us", href: "/contact" },
];

export const SOCIAL_LINKS = [
  { label: "Twitter", href: "https://twitter.com/cosynq", icon: "twitter" },
  { label: "GitHub", href: "https://github.com/nicoryne/cosynq", icon: "github" },
];

export interface DashboardNavLink extends NavLink {
  icon: string; // Lucide icon name or type
}

export const DASHBOARD_NAV_LINKS: DashboardNavLink[] = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Cosplans", href: "/dashboard/cosplans", icon: "Zap" },
  { label: "Groups", href: "/dashboard/groups", icon: "Users" },
  { label: "Events", href: "/dashboard/events", icon: "Calendar" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
];
