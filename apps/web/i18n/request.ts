import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import {getGlobalSettings} from '../lib/strapi-client';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const globalSettings = await getGlobalSettings(locale);
  
  // Assuming the dictionary is stored in a JSON field named 'dictionary' or similar
  // If not found, fall back to empty object
  const messages = globalSettings?.attributes?.dictionary || {};

  return {
    locale,
    messages
  };
});
