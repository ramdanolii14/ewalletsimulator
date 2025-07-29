"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (data) setBalance(data.balance);
    };

    fetchBalance();
  }, []);

  return (
    <main className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Saldo Anda</h1>
      <p className="text-4xl font-mono text-green-600 mb-6">
        Rp {balance !== null ? balance.toLocaleString() : "Loading..."}
      </p>

      <div className="flex gap-4 justify-center mb-8">
        <Link href="/topup" className="bg-blue-500 px-4 py-2 rounded text-white">Top Up</Link>
        <Link href="/withdraw" className="bg-red-500 px-4 py-2 rounded text-white">Tarik</Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/transfer" className="bg-yellow-400 p-4 rounded">📤 Kirim Uang</Link>
        <Link href="/history" className="bg-gray-300 p-4 rounded">🧾 Riwayat</Link>
      </div>
    </main>
  );
}