import { MetadataRoute } from 'next'
import { fetchStrapi } from '../lib/strapi-client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  
  try {
    const pages = await fetchStrapi('/pages');
    
    if (!pages || !pages.data) {
        return [{
             url: baseUrl,
             lastModified: new Date(),
        }];
    }

    const sitemapEntries = pages.data.map((page: any) => ({
      url: `${baseUrl}/en/${page.attributes.slug === 'home' ? '' : page.attributes.slug}`, // Assuming 'en' for now, ideally iterate locales
      lastModified: new Date(page.attributes.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: page.attributes.slug === 'home' ? 1 : 0.8,
    }));

    return sitemapEntries;
  } catch (error) {
      console.error('Sitemap generation error', error);
      return [{
          url: baseUrl,
          lastModified: new Date(),
      }];
  }
}
