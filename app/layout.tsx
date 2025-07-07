import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Money Management Tool',
  description: 'Managing ur money....',
  generator: 'Aman',
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
