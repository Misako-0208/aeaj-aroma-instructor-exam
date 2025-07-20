import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AEAJアロマテラピーインストラクター試験対策',
  description: 'AEAJアロマテラピーインストラクター資格試験の問題演習アプリ。公式テキストに基づく45問の問題で効率的に学習できます。',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['AEAJ', 'アロマテラピー', 'インストラクター', '試験', '資格', '問題', '学習'],
  authors: [
    { name: 'Misako Shigeta' }
  ],
  themeColor: '#16a34a',
  colorScheme: 'light',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AEAJ試験対策',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AEAJ試験対策" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  )
}
