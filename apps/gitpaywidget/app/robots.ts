import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://gitpaywidget.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/projects/',
          '/admin/',
          '/api/',
          '/auth/',
          '/login',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: [
          '/',
          '/docs/',
          '/blog/',
          '/pricing',
          '/about',
          '/faq',
          '/security',
          '/changelog',
        ],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: [
          '/',
          '/docs/',
          '/blog/',
          '/pricing',
          '/changelog',
        ],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'Anthropic-AI',
        allow: [
          '/',
          '/docs/',
          '/blog/',
          '/pricing',
          '/faq',
        ],
      },
      {
        userAgent: 'Claude-Web',
        allow: [
          '/',
          '/docs/',
          '/blog/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
