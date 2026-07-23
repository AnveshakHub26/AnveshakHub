import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AnveshakHub Enterprise SaaS',
    short_name: 'AnveshakHub',
    description: 'Enterprise Collaboration & Research Innovation Platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0284c7',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
