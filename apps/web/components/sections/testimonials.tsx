export function Testimonials({ data }: { data: any }) {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-12">{data.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {data.testimonials?.map((item: any, i: number) => (
          <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded shadow">
            <p className="italic mb-4">"{item.quote}"</p>
            <div className="font-bold">{item.author}</div>
            <div className="text-sm text-gray-500">{item.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
