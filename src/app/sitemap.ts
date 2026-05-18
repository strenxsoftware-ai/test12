import { MetadataRoute } from 'next'

/**
 * @fileOverview Sitemap generation for Viloryi.
 * This file generates the sitemap.xml dynamically for search engines.
 * 
 * Note: Due to architectural constraints, categories are listed statically 
 * based on the core collection structure.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://viloryi.com'
  const lastModified = new Date()

  // Main navigational and legal pages
  const routes = [
    '',
    '/about',
    '/contact',
    '/shipping-policy',
    '/returns-policy',
    '/refund-policy',
    '/privacy-policy',
    '/terms-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Core product categories
  const categories = [
    'kurti-sets',
    'coord-sets',
    'luxe-kurtis',
    'occasion-wear',
    'daily-essentials',
    'winter-velvet',
  ].map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...categories]
}
