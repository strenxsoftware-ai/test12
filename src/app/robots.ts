import { MetadataRoute } from 'next'

/**
 * @fileOverview robots.txt generation for Viloryi.
 * Configures search engine crawler access and links the sitemap.
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/profile/',
        '/checkout/',
        '/checkout/success',
        '/api/',
      ],
    },
    sitemap: 'https://viloryi.com/sitemap.xml',
  }
}
