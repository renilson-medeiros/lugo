import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const BASE_URL = 'https://alugo.vercel.app';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/api/', '/checkout/'],
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
