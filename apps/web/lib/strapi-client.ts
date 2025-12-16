import qs from "qs";

export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function fetchStrapi(
  path: string,
  urlParamsObject: Record<string, any> = {},
  options: FetchOptions = {}
) {
  try {
    const { headers, ...rest } = options;
    const mergedOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        ...headers,
      },
      ...rest,
    };

    const queryString = qs.stringify(urlParamsObject, { encodeValuesOnly: true });
    const requestUrl = `${STRAPI_URL}/api${path}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(requestUrl, mergedOptions);
    
    if (!response.ok) {
       // Handle 404 or 500
       return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching from Strapi: ${path}`, error);
    throw error; // Or return null depending on strategy
  }
}

export async function getGlobalSettings(locale: string) {
  const query = {
    locale,
    populate: {
      navigation: {
        populate: '*',
      },
      footer: {
        populate: '*',
      },
      seo: {
        populate: '*',
      }
    },
  };
  const res = await fetchStrapi("/global-setting", query, { next: { tags: ['global-setting'] } });
  return res?.data;
}

export async function getPageBySlug(slug: string, locale: string) {
  const query = {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    locale,
    populate: {
        sections: {
            populate: '*', 
            on: {
                'component.hero': { populate: '*' },
                'component.features': { populate: '*' },
                'component.cta': { populate: '*' },
                'component.testimonials': { populate: '*' },
                // Add other components here
            }
        },
        seo: {
            populate: '*',
        }
    },
  };
  const res = await fetchStrapi("/pages", query, { next: { tags: [`page-${slug}`] } });
  return res?.data?.[0];
}
