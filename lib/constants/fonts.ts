import { Quicksand, DM_Sans } from "next/font/google"

// Heading font - Quicksand with weights 400, 700
// Note: Quicksand only supports weights 300-700, not 900
export const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-quicksand',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

// Body font - DM Sans with weights 400, 500, 700
export const dmsans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dmsans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})