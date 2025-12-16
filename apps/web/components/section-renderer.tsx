import { Hero } from "./sections/hero";
import { Features } from "./sections/features";
import { CTA } from "./sections/cta";
import { Testimonials } from "./sections/testimonials";

const sectionComponents: Record<string, any> = {
  "component.hero": Hero,
  "component.features": Features,
  "component.cta": CTA,
  "component.testimonials": Testimonials,
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
