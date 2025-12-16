import { ContactForm } from "../../../components/contact-form";
import { getPageBySlug } from "../../../lib/strapi-client";
import { SectionRenderer } from "../../../components/section-renderer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us.",
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await getPageBySlug('contact', locale);

  return (
    <main className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {page ? (
          <SectionRenderer sections={page.attributes.sections} />
        ) : (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">We'd love to hear from you.</p>
          </div>
        )}
        
        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
