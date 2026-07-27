import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { personal } from '@/lib/data'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const siteUrl = 'https://portfolio-pedromourabarros.vercel.app'
const description =
  'Portfólio de Pedro Moura Barros — Analista de Dados e Business Intelligence. SQL, Power BI, DAX, Databricks e ETL transformando dados em decisão estratégica.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${personal.nome} — ${personal.cargo}`,
    template: `%s — ${personal.nome}`,
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
    title: `${personal.nome} — ${personal.cargo}`,
    description,
    siteName: `${personal.nome} · Portfólio`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${personal.nome} — ${personal.cargo}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0e14',
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
    <html lang="pt-BR" className={`dark bg-background ${geistSans.variable} ${geistMono.variable}`}>
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
