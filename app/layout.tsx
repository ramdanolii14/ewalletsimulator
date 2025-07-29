// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'E-Wallet Sim',
  description: 'Simulator e-wallet dengan Supabase dan Next.js',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-100 text-gray-900 font-sans">
        <main className="max-w-xl mx-auto p-6">{children}</main>
      </body>
    </html>
  )
}
