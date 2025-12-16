export function Features({ data }: { data: any }) {
  return (
    <section className="py-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">{data.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {data.features?.map((feature: any, i: number) => (
          <div key={i} className="p-4 border rounded shadow-sm">
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
