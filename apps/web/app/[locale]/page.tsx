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
  const page = await getPageBySlug('home', locale);
  
  if (!page) {
    return {
      title: 'MENAPS - Integrated Strategic Consulting',
      description: 'Strategic and operational consulting group, with a strong dimension of technological and digital innovation.',
    };
  }

  return {
    title: page.attributes.seo?.metaTitle || page.attributes.title,
    description: page.attributes.seo?.metaDescription,
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  let page = null;
  try {
    page = await getPageBySlug('home', locale);
  } catch (error) {
    console.error('Failed to fetch page:', error);
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
          title: 'MENAPS,',
          titleHighlight: 'is an integrated',
          subtitle: 'Strategic and operational consulting group, with a strong dimension of technological and digital innovation.',
          ctaButtons: [{ text: "Let's talk about it", url: '/contact' }],
          floatingCard: {
            icon: 'AI',
            title: 'Innovation First',
            subtitle: 'Leading the future',
          },
          showScrollIndicator: true,
        }} 
      />
      <Distinction 
        data={{
          title: 'What makes us',
          highlightedText: 'different?',
          description: 'We combine our business expertise with our technological mastery and data in order to bring you sustainable and innovative solutions.',
          features: [
            { title: 'Strategic Integration' },
            { title: 'Operational Excellence' },
            { title: 'Technological Mastery' },
          ],
          ctaButton: { text: 'Discover our values', url: '/about' },
        }} 
      />
      <ServicesGrid 
        data={{
          title: 'Make us your',
          subtitle: 'preferred ally',
          description: 'As each company is unique, we are ready to intervene at any stage of the construction process.',
          services: [
            { title: 'Digital Solutions', description: 'Advanced solutions tailored to your business needs.', icon: 'monitor' },
            { title: 'Consulting', description: 'Strategic guidance to optimize your operations.', icon: 'briefcase' },
            { title: 'Cybersecurity', description: 'Protecting your assets with cutting-edge security.', icon: 'shield-check' },
          ],
          ctaButton: { text: 'Learn more', url: '/services' },
        }} 
      />
      <Stats 
        data={{
          stats: [
            { value: '500', suffix: '+', label: 'Projects Delivered' },
            { value: '50', suffix: '+', label: 'Industry Experts' },
            { value: '25', suffix: '+', label: 'Years Experience' },
            { value: '15', suffix: '+', label: 'Countries Served' },
          ],
        }} 
      />
      <Partners 
        data={{
          title: 'Trusted by Industry Leaders',
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
