import { Hero } from "./sections/hero";
import { Features } from "./sections/features";
import { CTA } from "./sections/cta";
import { Testimonials } from "./sections/testimonials";
import { Distinction } from "./sections/distinction";
import { ServicesGrid } from "./sections/services-grid";
import { Stats } from "./sections/stats";
import { Partners } from "./sections/partners";

const sectionComponents: Record<string, React.ComponentType<{ data: any }>> = {
  "sections.hero": Hero,
  "sections.features": Features,
  "sections.cta": CTA,
  "sections.testimonials": Testimonials,
  "sections.distinction": Distinction,
  "sections.services-grid": ServicesGrid,
  "sections.stats": Stats,
  "sections.partners": Partners,
};

export function SectionRenderer({ sections }: { sections: any[] }) {
  if (!sections || !Array.isArray(sections)) return null;

  return (
    <>
      {sections.map((section: any, index: number) => {
        const Component = sectionComponents[section.__component];
        if (!Component) {
          console.warn(`Component not found for: ${section.__component}`);
          return null; 
        }
        return <Component key={`${section.__component}-${index}`} data={section} />;
      })}
    </>
  );
}
