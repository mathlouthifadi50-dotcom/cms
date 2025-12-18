import qs from "qs";

const getStrapi = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
  }
  return process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://strapi:1337";
};

export const STRAPI_URL = getStrapi();
export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function fetchStrapi(
  path: string,
  urlParamsObject: Record<string, unknown> = {},
  options: FetchOptions = {}
) {
  try {
    const { headers, ...rest } = options;
    const mergedOptions = {
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
        ...headers,
      },
      ...rest,
    };

    const queryString = qs.stringify(urlParamsObject, { encodeValuesOnly: true });
    const strapiUrl = getStrapi();
    const requestUrl = `${strapiUrl}/api${path}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(requestUrl, mergedOptions);
    
    if (!response.ok) {
       return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching from Strapi: ${path}`, error);
    return null;
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
        populate: {
          metaImage: {
            populate: '*'
          }
        }
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
            }
        },
        seo: {
            populate: {
                metaImage: {
                    populate: '*'
                }
            }
        }
    },
  };
  const res = await fetchStrapi("/pages", query, { next: { tags: [`page-${slug}`] } });
  return res?.data?.[0];
}
