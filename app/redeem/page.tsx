"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleRedeem = async () => {
    setStatus("Mengecek...");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setStatus("Kamu belum login.");
      return;
    }

    const { data, error } = await supabase
      .from("gift_codes")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !data) {
      setStatus("Kode tidak ditemukan.");
      return;
    }

    if (data.is_redeemed) {
      setStatus("Kode sudah dipakai.");
      return;
    }

    const { error: balanceError } = await supabase.rpc("increment_balance", {
      user_id_input: user.id,
      amount_input: data.amount
    });

    if (balanceError) {
      setStatus("Gagal menambah saldo.");
      return;
    }

    await supabase
      .from("gift_codes")
      .update({
        is_redeemed: true,
        redeemed_by: user.id,
        redeemed_at: new Date().toISOString()
      })
      .eq("id", data.id);

    setStatus(`Berhasil! Saldo bertambah Rp ${data.amount.toLocaleString()}`);
    setCode("");
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-xl shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-4">Tukar Gift Code</h1>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Masukkan kode"
        className="w-full px-4 py-2 border rounded mb-4"
      />
      <button
        onClick={handleRedeem}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Redeem
      </button>
      <p className="mt-4 text-center text-gray-700">{status}</p>
    </div>
  );
}
