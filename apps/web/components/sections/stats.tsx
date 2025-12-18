'use client';

interface StatsProps {
  data: {
    title?: string;
    stats?: Array<{
      value: string;
      label: string;
      suffix?: string;
    }>;
  };
}

export function Stats({ data }: StatsProps) {
  const defaultStats = [
    { value: '500', suffix: '+', label: 'Projects Delivered' },
    { value: '50', suffix: '+', label: 'Industry Experts' },
    { value: '25', suffix: '+', label: 'Years Experience' },
    { value: '15', suffix: '+', label: 'Countries Served' },
  ];

  const stats = data.stats && data.stats.length > 0 ? data.stats : defaultStats;

  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 reveal">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-white/5 hover:border-primary/30 transition-all hover:scale-105"
            >
              <div className="text-4xl font-bold text-primary mb-2">
                {stat.value}{stat.suffix}
              </div>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
