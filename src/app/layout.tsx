// app/layout.tsx — tambahkan Navbar di sini

import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import Navbar from '@/components/Navbar'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display'
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-body'
})

export const metadata: Metadata = {
  title: 'Kopi Nusantara — Premium Ground Coffee',
  description: 'Kopi bubuk pilihan terbaik dari seluruh Nusantara',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${playfair.variable} ${lato.variable}`}>
      <body className="bg-amber-50 font-body">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}