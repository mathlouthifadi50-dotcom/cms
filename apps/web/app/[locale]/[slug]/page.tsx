import { getPageBySlug } from "../../../lib/strapi-client";
import { SectionRenderer } from "../../../components/section-renderer";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getPageBySlug(slug, locale);
  
  if (!page) return {};

  return {
    title: page.attributes.seo?.metaTitle || page.attributes.title,
    description: page.attributes.seo?.metaDescription,
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
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
