import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'cosynq | Simplify your craft',
    short_name: 'cosynq',
    description: 'Simplify your craft. Sync your universe. cosynq is the aesthetic celestial sanctuary designed to organize your cosmic cosplay journey, projects, and community orbit.',
    start_url: '/hub',
    display: 'standalone',
    background_color: '#0B0C10', // Our dark mode Midnight Void
    theme_color: '#B794F4', // Updated to celestial lavender for theme prominence
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}