'use client';

import { Zap } from 'lucide-react';

interface PartnersProps {
  data: {
    title?: string;
    partners?: Array<{
      name: string;
      logo?: {
        data?: {
          attributes?: {
            url: string;
          };
        };
      };
      url?: string;
    }>;
  };
}

export function Partners({ data }: PartnersProps) {
  const defaultPartners = [
    { name: 'Airbus' },
    { name: 'Renault' },
    { name: 'Toyota' },
    { name: 'Stellantis' },
    { name: 'OCP' },
    { name: 'Al Barid Bank' },
  ];

  const partners = data.partners && data.partners.length > 0 ? data.partners : defaultPartners;
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-20 border-y border-white/5 bg-background/50 overflow-hidden">
      <div className="container mx-auto px-6 mb-10 text-center">
        <h3 className="text-xl text-gray-500 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          {data.title || 'Trusted by Industry Leaders'}
        </h3>
      </div>
      <div className="flex overflow-hidden relative w-full">
        <div className="flex animate-scroll gap-16 px-8 min-w-full">
          {duplicatedPartners.map((partner, index) => (
            <span 
              key={index}
              className="text-2xl font-bold text-white/20 whitespace-nowrap hover:text-primary/60 transition-colors"
            >
              {partner.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
