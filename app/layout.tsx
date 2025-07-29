import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'E-Wallet Sim',
  description: 'Simulator e-wallet dengan Supabase dan Next.js',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 font-sans">{children}</body>
    </html>
  )
}
