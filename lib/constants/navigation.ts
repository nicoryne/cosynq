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

export interface HubNavLink extends NavLink {
  icon: string; // Lucide icon name or type
}

export const HUB_NAV_LINKS: HubNavLink[] = [
  { label: "Hub", href: "/hub", icon: "LayoutDashboard" },
  { label: "Cosplans", href: "/hub/cosplans", icon: "Zap" },
  { label: "Groups", href: "/hub/groups", icon: "Users" },
  { label: "Events", href: "/hub/events", icon: "Calendar" },
  { label: "Settings", href: "/hub/settings", icon: "Settings" },
];
