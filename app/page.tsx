// app/page.tsx
"use client";

import { useState } from "react";

export default function Home() {
  const [balance, setBalance] = useState(2500000); // contoh saldo awal

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">E-Wallet Simulator</h1>

        <div className="bg-blue-100 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-gray-500">Saldo Anda</p>
          <h2 className="text-3xl font-bold text-blue-600">
            Rp {balance.toLocaleString("id-ID")}
          </h2>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setBalance((prev) => prev + 50000)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Top Up Rp 50.000
          </button>
          <button
            onClick={() => setBalance((prev) => prev - 25000)}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Bayar Rp 25.000
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">Simulasi sederhana e-wallet</p>
      </div>
    </main>
  );
}
