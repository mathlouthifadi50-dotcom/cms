'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { STRAPI_URL } from '@/lib/strapi-client';

interface HeroProps {
  data: {
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    description?: string;
    heroImage?: {
      data?: {
        attributes?: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    ctaButtons?: Array<{
      text: string;
      url: string;
      variant?: string;
    }>;
    floatingCard?: {
      icon?: string;
      title?: string;
      subtitle?: string;
    };
    showScrollIndicator?: boolean;
  };
}

export function Hero({ data }: HeroProps) {
  const heroImageUrl = data.heroImage?.data?.attributes?.url 
    ? `${STRAPI_URL}${data.heroImage.data.attributes.url}`
    : 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070';

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-background z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="reveal active">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white mb-6">
            {data.title || 'MENAPS,'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
              {data.titleHighlight || 'is an integrated'}
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
            {data.subtitle || 'Strategic and operational consulting group, with a strong dimension of technological and digital innovation.'}
          </p>

          {data.ctaButtons && data.ctaButtons.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {data.ctaButtons.map((btn, index) => (
                <Link
                  key={index}
                  href={btn.url || '#'}
                  className={index === 0 
                    ? "group bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-lg px-8 py-4 font-bold shadow-lg shadow-primary/40 inline-flex items-center transition-transform hover:scale-105"
                    : "btn-outline"
                  }
                >
                  {btn.text}
                  {index === 0 && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              href="#contact"
              className="group bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-lg px-8 py-4 font-bold shadow-lg shadow-primary/40 inline-flex items-center transition-transform hover:scale-105"
            >
              Let&apos;s talk about it
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <div className="relative hidden md:block reveal active">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-background/40 to-transparent z-10"></div>
            <div className="w-full h-[500px] relative overflow-hidden">
              <Image
                src={heroImageUrl}
                alt={data.heroImage?.data?.attributes?.alternativeText || "Tech Consulting"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
            </div>
          </div>
          
          {data.floatingCard && (
            <div className="absolute -bottom-10 -left-10 glass-card p-6 rounded-xl shadow-xl z-20 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {data.floatingCard.icon || 'AI'}
                </div>
                <div>
                  <h3 className="font-bold text-white">{data.floatingCard.title || 'Innovation First'}</h3>
                  <p className="text-sm text-gray-400">{data.floatingCard.subtitle || 'Leading the future'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {(data.showScrollIndicator !== false) && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
