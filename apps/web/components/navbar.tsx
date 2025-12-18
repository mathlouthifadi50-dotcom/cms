'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Menu, Globe, X } from 'lucide-react';

interface NavLink {
  text: string;
  url: string;
}

interface NavbarProps {
  navigation?: {
    links?: NavLink[];
    ctaButton?: {
      text: string;
      url: string;
    };
  };
  locale?: string;
}

export function Navbar({ navigation, locale = 'en' }: NavbarProps) {
  const t = useTranslations('nav');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultLinks = [
    { text: t('home'), url: '/' },
    { text: t('services'), url: '/services' },
    { text: t('about'), url: '/about' },
    { text: t('contact'), url: '/contact' },
  ];

  const links = navigation?.links && navigation.links.length > 0 ? navigation.links : defaultLinks;

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md border-b border-white/10 py-4' 
          : 'py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-widest text-white hover:text-primary transition-colors">
          MENAPS
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link, index) => (
            <Link 
              key={index}
              href={link.url as any} 
              className="text-sm font-medium text-white/80 hover:text-primary transition-colors relative group"
            >
              {link.text}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
          
          <div className="h-6 w-px bg-white/10"></div>
          
          <div className="relative group">
            <button className="flex items-center gap-2 bg-card/80 border border-white/20 text-white rounded-full px-4 py-2 text-sm hover:border-primary/50 transition-all">
              <Globe className="w-4 h-4" />
              <span>{locale.toUpperCase()}</span>
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-card border border-white/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
              <div className="py-1">
                {languages.map((lang) => (
                  <Link
                    key={lang.code}
                    href={pathname as any}
                    locale={lang.code as 'en' | 'fr'}
                    className={`block px-4 py-2 text-sm hover:bg-primary/20 ${
                      locale === lang.code ? 'text-primary' : 'text-white'
                    }`}
                  >
                    {lang.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <Link
            href={navigation?.ctaButton?.url as any || '/contact'}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-full px-6 py-2 shadow-lg shadow-primary/30 transition-transform hover:scale-105"
          >
            {navigation?.ctaButton?.text || t('contact')}
          </Link>
        </nav>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white z-50"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div 
        className={`fixed inset-0 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden transition-opacity duration-300 z-40 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {links.map((link, index) => (
          <Link 
            key={index}
            href={link.url as any} 
            className="text-2xl font-bold text-white hover:text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.text}
          </Link>
        ))}
        <div className="flex gap-4 mt-4">
          {languages.map((lang) => (
            <Link
              key={lang.code}
              href={pathname as any}
              locale={lang.code as 'en' | 'fr'}
              className={`px-4 py-2 rounded-full border ${
                locale === lang.code 
                  ? 'bg-primary text-white border-primary' 
                  : 'border-white/20 text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {lang.label}
            </Link>
          ))}
        </div>
        <Link
          href={navigation?.ctaButton?.url as any || '/contact'}
          className="bg-primary text-primary-foreground text-lg px-8 py-4 rounded-full font-bold"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {navigation?.ctaButton?.text || t('contact')}
        </Link>
      </div>
    </header>
  );
}
