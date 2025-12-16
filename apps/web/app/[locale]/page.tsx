import { getPageBySlug } from "../../lib/strapi-client";
import { SectionRenderer } from "../../components/section-renderer";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageBySlug('home', locale);
  
  if (!page) return {};

  return {
    title: page.attributes.seo?.metaTitle || page.attributes.title,
    description: page.attributes.seo?.metaDescription,
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await getPageBySlug('home', locale);

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background text-foreground">
        <h1 className="text-4xl font-bold mb-4">Welcome to Menaps</h1>
        <p className="text-xl mb-8">The CMS content is being set up.</p>
        <div className="p-4 border rounded bg-card text-card-foreground shadow-sm">
            <p><strong>Dev Note:</strong> Create a Page in Strapi with slug "home" to populate this page.</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <SectionRenderer sections={page.attributes.sections} />
    </main>
  );
}
