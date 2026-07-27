import type { MetadataRoute } from "next"

const siteUrl = "https://portfolio-pedromourabarros.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
