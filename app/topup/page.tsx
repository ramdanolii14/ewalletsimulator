"use client";

import { useState } from "react";

export default function TopUpPage() {
  const [amount, setAmount] = useState("");

  const handleTopUp = () => {
    alert("Simulasi Top Up sebesar Rp " + amount);
    setAmount("");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Top Up Saldo</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border px-4 py-2 w-full mb-4"
        placeholder="Jumlah Top Up"
      />
      <button onClick={handleTopUp} className="bg-blue-600 text-white px-4 py-2 rounded">
        Top Up Sekarang
      </button>
    </div>
  );
}