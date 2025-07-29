// app/page.tsx
'use client'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [saldo, setSaldo] = useState<number | null>(null)

  useEffect(() => {
    // Simulasi fetch saldo
    setTimeout(() => {
      setSaldo(100000)
    }, 1000)
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Saldo Anda</h1>
      <p className="text-xl font-medium text-green-600">
        Rp {saldo !== null ? saldo.toLocaleString() : 'Loading...'}
      </p>

      <div>
        <h2 className="text-lg font-semibold mb-2">Top Up / Tarik</h2>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Kirim Uang
          </button>
          <button className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
            Riwayat
          </button>
        </div>
      </div>
    </div>
  )
}
