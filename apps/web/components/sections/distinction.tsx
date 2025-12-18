'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

interface DistinctionProps {
  data: {
    title?: string;
    highlightedText?: string;
    description?: string;
    features?: Array<{
      title: string;
      description?: string;
    }>;
    ctaButton?: {
      text: string;
      url: string;
    };
  };
}

export function Distinction({ data }: DistinctionProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {data.title || 'What makes us'}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent/50">
                {data.highlightedText || 'different?'}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {data.description || 'We combine our business expertise with our technological mastery and data in order to bring you sustainable and innovative solutions.'}
            </p>
            
            <ul className="space-y-4 mb-8">
              {(data.features && data.features.length > 0) ? (
                data.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle2 className="text-primary w-5 h-5 flex-shrink-0" />
                    {feature.title}
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle2 className="text-primary w-5 h-5" /> Strategic Integration
                  </li>
                  <li className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle2 className="text-primary w-5 h-5" /> Operational Excellence
                  </li>
                  <li className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle2 className="text-primary w-5 h-5" /> Technological Mastery
                  </li>
                </>
              )}
            </ul>

            {data.ctaButton ? (
              <Link href={data.ctaButton.url} className="btn-outline">
                {data.ctaButton.text}
              </Link>
            ) : (
              <button className="btn-outline">
                Discover our values
              </button>
            )}
          </div>
          
          <div className="relative reveal">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 p-1">
              <div className="w-full h-full bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden relative flex items-center justify-center">
                <div className="w-3/4 h-3/4 border-2 border-primary/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '10s' }}>
                  <div className="w-3/4 h-3/4 border-2 border-accent/30 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                    <div className="w-1/2 h-1/2 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
