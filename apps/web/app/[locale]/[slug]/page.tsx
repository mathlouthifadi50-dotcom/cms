import { getPageBySlug, getGlobalSettings, STRAPI_URL } from "../../../lib/strapi-client";
import { SectionRenderer } from "../../../components/section-renderer";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  
  if (slug === 'home') return {};

  let page = null;
  let globalSettings = null;

  try {
    [page, globalSettings] = await Promise.all([
      getPageBySlug(slug, locale),
      getGlobalSettings(locale)
    ]);
  } catch {
    // Strapi not available
  }
  
  if (!page) return {};

  const seo = page.attributes?.seo || globalSettings?.attributes?.seo;
  const siteName = globalSettings?.attributes?.siteName || 'MENAPS';
  
  const metaImage = seo?.metaImage?.data?.attributes;
  const imageUrl = metaImage ? (metaImage.url.startsWith('http') ? metaImage.url : `${STRAPI_URL}${metaImage.url}`) : null;

  return {
    title: seo?.metaTitle || page.attributes.title || siteName,
    description: seo?.metaDescription,
    keywords: seo?.keywords,
    robots: seo?.metaRobots || 'index, follow',
    alternates: {
      canonical: seo?.canonicalURL,
    },
    openGraph: {
      title: seo?.metaTitle || page.attributes.title,
      description: seo?.metaDescription,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;

  if (slug === 'home') {
    notFound();
  }

  const page = await getPageBySlug(slug, locale);

  if (!page) {
    notFound();
  }

  return (
    <main>
      <SectionRenderer sections={page.attributes.sections} />
    </main>
  );
}
