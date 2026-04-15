import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/hub', '/api', '/auth'],
    },
    sitemap: 'https://cosynq.ryne.dev/sitemap.xml',
  };
}
