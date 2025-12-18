'use client';

import Link from 'next/link';
import { Monitor, Briefcase, ShieldCheck, Zap, Database, Globe } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  monitor: Monitor,
  briefcase: Briefcase,
  'shield-check': ShieldCheck,
  zap: Zap,
  database: Database,
  globe: Globe,
};

interface ServicesGridProps {
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
    services?: Array<{
      title: string;
      description?: string;
      icon?: string;
      link?: string;
    }>;
    ctaButton?: {
      text: string;
      url: string;
    };
  };
}

export function ServicesGrid({ data }: ServicesGridProps) {
  const defaultServices = [
    { title: 'Digital Solutions', description: 'Advanced solutions tailored to your business needs.', icon: 'monitor' },
    { title: 'Consulting', description: 'Strategic guidance to optimize your operations.', icon: 'briefcase' },
    { title: 'Cybersecurity', description: 'Protecting your assets with cutting-edge security.', icon: 'shield-check' },
  ];

  const services = data.services && data.services.length > 0 ? data.services : defaultServices;

  return (
    <section id="expertise" className="py-24 bg-secondary/20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto reveal">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            {data.title || 'Make us your'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent/50">
              {data.subtitle || 'preferred ally'}
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            {data.description || 'As each company is unique, we are ready to intervene at any stage of the construction process.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon || 'briefcase'] || Briefcase;
            
            return (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 relative overflow-hidden cursor-pointer hover:-translate-y-2 reveal"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-4 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                    Learn more →
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center reveal">
          {data.ctaButton ? (
            <Link 
              href={data.ctaButton.url}
              className="rounded-full px-8 py-3 bg-white text-black hover:bg-white/90 shadow-lg shadow-white/30 font-bold transition-transform hover:scale-105 inline-block"
            >
              {data.ctaButton.text}
            </Link>
          ) : (
            <button className="rounded-full px-8 py-3 bg-white text-black hover:bg-white/90 shadow-lg shadow-white/30 font-bold transition-transform hover:scale-105">
              Learn more
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
