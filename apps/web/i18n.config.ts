import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export default getRequestConfig(async ({ locale }) => {
  // Validate locale
  const validLocale = routing.locales.includes(locale as any) ? locale : routing.defaultLocale;
  
  try {
    // Try to fetch messages from Strapi via the i18n/request.ts configuration
    // For now, return empty object - messages will be fetched at request time
    return {
      locale: validLocale,
      messages: {},
    };
  } catch (error) {
    // Fallback to empty messages if fetch fails
    return {
      locale: validLocale,
      messages: {},
    };
  }
});
