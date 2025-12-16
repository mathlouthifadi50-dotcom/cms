import { Link } from "../../../i18n/routing";

export function CTA({ data }: { data: any }) {
  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground text-center">
      <h2 className="text-3xl font-bold mb-4">{data.title}</h2>
      <p className="mb-8 text-lg">{data.description}</p>
      {data.link && (
        <Link 
            href={data.link.href || '#'} 
            className="inline-block bg-background text-foreground px-6 py-3 rounded font-bold hover:opacity-90 transition-opacity"
        >
            {data.link.label}
        </Link>
      )}
    </section>
  );
}
