import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://painboard.site'
  const langs = ['en', 'es']
  const routes = ['', '/pro', '/map', '/trending']

  return langs.flatMap(lang =>
    routes.map(route => ({
      url: `${baseUrl}/${lang}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )
}
