// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSaldo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (error) console.error("Error:", error);
      else setSaldo(data?.balance ?? 0);

      setLoading(false);
    };

    fetchSaldo();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10">Memuat saldo...</p>;
  }

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md text-center space-y-4">
        <h1 className="text-xl font-bold">E-Wallet Simulator</h1>

        <div className="bg-blue-100 py-4 rounded-lg">
          <p className="text-gray-500 text-sm">Saldo Anda</p>
          <p className="text-3xl font-bold text-blue-700">
            Rp {saldo?.toLocaleString("id-ID")}
          </p>
        </div>

        <button
          onClick={() => router.push("/redeem")}
          className="w-full py-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold transition"
        >
          Top Up via Gift Code
        </button>

        <button
          onClick={() => router.push("/transfer")}
          className="w-full py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold transition"
        >
          Bayar User Lain
        </button>

        <p className="text-sm text-gray-400">Simulasi sederhana e-wallet</p>
      </div>
    </div>
  );
}
