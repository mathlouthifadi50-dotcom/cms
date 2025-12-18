import { getTranslations } from "next-intl/server";
import { getPageBySlug } from "../../lib/strapi-client";
import { SectionRenderer } from "../../components/section-renderer";
import { Hero } from "../../components/sections/hero";
import { Distinction } from "../../components/sections/distinction";
import { ServicesGrid } from "../../components/sections/services-grid";
import { Stats } from "../../components/sections/stats";
import { Partners } from "../../components/sections/partners";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  
  let page = null;
  try {
    page = await getPageBySlug('home', locale);
  } catch {
    // Strapi not available
  }
  
  if (!page) {
    return {
      title: 'MENAPS - ' + t('titleHighlight'),
      description: t('subtitle'),
    };
  }

  return {
    title: page.attributes.seo?.metaTitle || page.attributes.title,
    description: page.attributes.seo?.metaDescription,
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  const tDistinction = await getTranslations({ locale, namespace: 'distinction' });
  const tServices = await getTranslations({ locale, namespace: 'services' });
  const tStats = await getTranslations({ locale, namespace: 'stats' });
  const tPartners = await getTranslations({ locale, namespace: 'partners' });
  
  let page = null;
  try {
    page = await getPageBySlug('home', locale);
  } catch (error) {
    // Strapi not available, use fallback content
  }

  if (page && page.attributes.sections && page.attributes.sections.length > 0) {
    return (
      <main>
        <SectionRenderer sections={page.attributes.sections} />
      </main>
    );
  }

  return (
    <main>
      <Hero 
        data={{
          title: t('title'),
          titleHighlight: t('titleHighlight'),
          subtitle: t('subtitle'),
          ctaButtons: [{ text: t('cta'), url: '/contact' }],
          floatingCard: {
            icon: t('floatingCard.icon'),
            title: t('floatingCard.title'),
            subtitle: t('floatingCard.subtitle'),
          },
          showScrollIndicator: true,
        }} 
      />
      <Distinction 
        data={{
          title: tDistinction('title'),
          highlightedText: tDistinction('highlightedText'),
          description: tDistinction('description'),
          features: [
            { title: tDistinction('features.strategic') },
            { title: tDistinction('features.operational') },
            { title: tDistinction('features.technological') },
          ],
          ctaButton: { text: tDistinction('cta'), url: '/about' },
        }} 
      />
      <ServicesGrid 
        data={{
          title: tServices('title'),
          subtitle: tServices('subtitle'),
          description: tServices('description'),
          services: [
            { title: tServices('digital.title'), description: tServices('digital.description'), icon: 'monitor' },
            { title: tServices('consulting.title'), description: tServices('consulting.description'), icon: 'briefcase' },
            { title: tServices('cybersecurity.title'), description: tServices('cybersecurity.description'), icon: 'shield-check' },
          ],
          ctaButton: { text: tServices('cta'), url: '/services' },
        }} 
      />
      <Stats 
        data={{
          stats: [
            { value: tStats('projects.value'), suffix: tStats('projects.suffix'), label: tStats('projects.label') },
            { value: tStats('experts.value'), suffix: tStats('experts.suffix'), label: tStats('experts.label') },
            { value: tStats('experience.value'), suffix: tStats('experience.suffix'), label: tStats('experience.label') },
            { value: tStats('countries.value'), suffix: tStats('countries.suffix'), label: tStats('countries.label') },
          ],
        }} 
      />
      <Partners 
        data={{
          title: tPartners('title'),
          partners: [
            { name: 'Airbus' },
            { name: 'Renault' },
            { name: 'Toyota' },
            { name: 'Stellantis' },
            { name: 'OCP' },
            { name: 'Al Barid Bank' },
          ],
        }} 
      />
    </main>
  );
}
