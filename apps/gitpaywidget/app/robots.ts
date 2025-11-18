import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/widget-demo'],
        disallow: ['/dashboard', '/projects', '/login', '/api'],
      },
    ],
    sitemap: 'https://gitpaywidget.com/sitemap.xml',
  };
}
