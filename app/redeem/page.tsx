"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRedeem = async () => {
    setLoading(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("Kamu belum login.");
      setLoading(false);
      return;
    }

    const { data: gift, error } = await supabase
      .from("gift_codes")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !gift) {
      setMessage("Kode tidak ditemukan.");
      setLoading(false);
      return;
    }

    if (gift.is_redeemed) {
      setMessage("Kode ini sudah digunakan.");
      setLoading(false);
      return;
    }

    // Update gift code as redeemed
    const { error: updateError } = await supabase
      .from("gift_codes")
      .update({
        is_redeemed: true,
        redeemed_by: user.id,
        redeemed_at: new Date(),
      })
      .eq("id", gift.id);

    if (updateError) {
      setMessage("Gagal menukarkan kode.");
      setLoading(false);
      return;
    }

    // Tambahkan saldo user
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({
        balance: supabase.rpc('add_balance', { uid: user.id, amount: gift.amount }) // opsional: pakai function
      })
      .eq("id", user.id);

    if (updateProfileError) {
      setMessage("Gagal menambahkan saldo.");
      setLoading(false);
      return;
    }

    setMessage(`Berhasil menukarkan kode. Saldo kamu bertambah Rp${gift.amount.toLocaleString()}`);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Tukarkan Gift Code</h1>
      <input
        type="text"
        className="w-full border p-2 rounded mb-4"
        placeholder="Masukkan kode..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={handleRedeem}
        disabled={loading}
      >
        {loading ? "Menukarkan..." : "Tukarkan"}
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
