'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface FooterProps {
  footer?: {
    description?: string;
    columns?: Array<{
      title: string;
      links: Array<{
        text: string;
        url: string;
      }>;
    }>;
  };
}

export function Footer({ footer }: FooterProps) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const defaultColumns = [
    {
      title: t('quickLinks'),
      links: [
        { text: tNav('home'), url: '/' },
        { text: tNav('about'), url: '/about' },
        { text: tNav('services'), url: '/services' },
        { text: tNav('contact'), url: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: t('privacy'), url: '/privacy' },
        { text: t('terms'), url: '/terms' },
      ],
    },
  ];

  const columns = footer?.columns && footer.columns.length > 0 ? footer.columns : defaultColumns;

  return (
    <footer className="bg-card border-t border-white/10 py-16 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-6">MENAPS</h2>
            <p className="text-gray-400 max-w-sm">
              {footer?.description || t('description')}
            </p>
          </div>
          {columns.map((column, index) => (
            <div key={index}>
              <h4 className="text-white font-bold mb-4">{column.title}</h4>
              <ul className="space-y-2 text-gray-400">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.url as any} className="hover:text-primary transition-colors">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} MENAPS Group. {t('rights')}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Made with innovation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
