"use client";

import { useState } from "react";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");

  const handleWithdraw = () => {
    alert("Simulasi penarikan sebesar Rp " + amount);
    setAmount("");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Tarik Saldo</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border px-4 py-2 w-full mb-4"
        placeholder="Jumlah Penarikan"
      />
      <button onClick={handleWithdraw} className="bg-red-600 text-white px-4 py-2 rounded">
        Tarik Sekarang
      </button>
    </div>
  );
}