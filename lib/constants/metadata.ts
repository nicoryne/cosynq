import type { Metadata } from "next"

export const siteMetadata: Metadata = {
  // metadataBase is crucial! It allows Next.js to automatically resolve relative URLs for images.
  metadataBase: new URL("https://cosynq.ryne.dev"),
  
  title: {
    default: "cosynq | Your Cosplay Sanctuary & Planner",
    template: "%s | cosynq"
  },
  description: "Weave your dreams and sync your universe. cosynq is the aesthetic hub to manage your cosplans, connect with creatives, and organize your convention schedules.",
  applicationName: "cosynq",
  category: "Lifestyle & Community",
  keywords: [
    "cosplay planner",
    "convention schedule",
    "cosplay groups",
    "prop making tracker",
    "wig styling",
    "cosplay community",
    "cosplay budgeting",
    "cosplay recruitment",
    "Philippines cosplay",
    "Cebu cosplay"
  ],
  authors: [{ name: "RYNE.DEV", url: "https://ryne.dev" }],
  creator: "RYNE.DEV",
  publisher: "RYNE.DEV",
  
  // This ensures iOS users don't see random numbers turn into ugly blue phone links
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },

  // OpenGraph handles how your link looks in Discord, iMessage, Facebook, etc.
  openGraph: {
    type: "website",
    locale: "en_PH", // Set to Philippines locale since that's your primary base!
    alternateLocale: "en_US",
    url: "https://cosynq.ryne.dev",
    title: "cosynq | Your Cosplay Sanctuary & Planner",
    description: "Weave your dreams and sync your universe. cosynq is the aesthetic hub to manage your cosplans, connect with creatives, and organize your convention schedules.",
    siteName: "cosynq",
    images: [
      {
        url: "/og-image.png", // Make sure to design a cute 1200x630px image for this!
        width: 1200,
        height: 630,
        alt: "cosynq dashboard preview showing celestial styling",
      },
    ],
  },

  // Twitter specific card styling
  twitter: {
    card: "summary_large_image",
    title: "cosynq | Your Cosplay Sanctuary & Planner",
    description: "Weave your dreams and sync your universe. cosynq is the aesthetic hub to manage your cosplans, connect with creatives, and organize your convention schedules.",
    creator: "@your_twitter_handle", // Put dev or project twitter here
    images: ["/og-image.png"],
  },

  // Tells Google how to crawl your site
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Perfect for making the site look native on mobile devices
  appleWebApp: {
    title: "cosynq",
    statusBarStyle: "black-translucent", // Blends the top notch into your dark mode UI
    startupImage: [
      "/apple-touch-icon.png"
    ],
  },
  
  // Basic icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  
  // Prevents duplicate content penalties from Google
  alternates: {
    canonical: "https://cosynq.ryne.dev",
  },
}