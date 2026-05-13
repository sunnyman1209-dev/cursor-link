import type { Metadata } from 'next'
import { Noto_Sans_KR, Source_Serif_4 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const notoSansKR = Noto_Sans_KR({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans"
});

const sourceSerif = Source_Serif_4({ 
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: '창의적 발상 기법',
  description: '창의적 발상 기법 5가지 - 수업 자료',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
