export function Hero({ data }: { data: any }) {
  return (
    <section className="py-20 px-4 text-center bg-gray-100 dark:bg-gray-800">
      <h1 className="text-4xl font-bold">{data.title}</h1>
      <p className="mt-4 text-xl">{data.description || data.subtitle}</p>
      {/* Add CTA button if present */}
    </section>
  );
}
