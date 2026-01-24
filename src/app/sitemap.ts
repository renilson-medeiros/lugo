import { MetadataRoute } from 'next';

const BASE_URL = 'https://lugogestaodeimoveis.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/como-funciona`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/precos`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/contato`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/registro`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];
}
