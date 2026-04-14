import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'cosynq | Your Cosplay Sanctuary & Planner',
    short_name: 'cosynq',
    description: 'Weave your dreams and sync your universe. cosynq is the aesthetic hub to manage your cosplans, connect with creatives, and organize your convention schedules.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0C10', // Our dark mode Midnight Void
    theme_color: '#7CD4FA', // Our primary Starlight Cyan
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