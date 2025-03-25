import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ezys',
  description: 'Created by Aditya',
  generator: 'Aditya',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
