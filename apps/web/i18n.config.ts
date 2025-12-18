import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export default getRequestConfig(async ({ locale }) => {
  // Validate locale - ensure it's always a string
  let validLocale: string = routing.defaultLocale;
  if (locale && routing.locales.includes(locale as any)) {
    validLocale = locale;
  }
  
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
