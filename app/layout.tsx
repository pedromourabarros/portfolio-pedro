import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Sora, Manrope, JetBrains_Mono } from 'next/font/google'
import { personal } from '@/lib/data'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const siteUrl = 'https://portfolio-pedromourabarros.vercel.app'
const description =
  'Portfólio de Pedro Moura Barros - Analista de Dados e Business Intelligence. SQL, Power BI, DAX, Databricks e ETL transformando dados em decisão estratégica.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${personal.nome} - ${personal.cargo}`,
    template: `%s - ${personal.nome}`,
  },
  description,
  keywords: [
    'Pedro Moura Barros',
    'Analista de Dados',
    'Business Intelligence',
    'Power BI',
    'SQL',
    'DAX',
    'Databricks',
    'ETL',
    'Data Analytics',
    'Portfólio',
  ],
  authors: [{ name: personal.nome, url: personal.linkedin }],
  creator: personal.nome,
  generator: 'v0.app',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    title: `${personal.nome} - ${personal.cargo}`,
    description,
    siteName: `${personal.nome} · Portfólio`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${personal.nome} - ${personal.cargo}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${personal.nome} - ${personal.cargo}`,
    description,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0f1420',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personal.nome,
    jobTitle: personal.cargo,
    email: `mailto:${personal.email}`,
    telephone: personal.telefone,
    address: { '@type': 'PostalAddress', addressLocality: 'São Paulo', addressRegion: 'SP', addressCountry: 'BR' },
    url: siteUrl,
    sameAs: [personal.linkedin, personal.github],
    knowsAbout: ['SQL', 'Power BI', 'DAX', 'Databricks', 'ETL', 'Data Analytics', 'Business Intelligence'],
  }

  return (
    <html
      lang="pt-BR"
      className={`dark bg-background ${sora.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
