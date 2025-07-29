"use client";

import { useState } from "react";

export default function TransferPage() {
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = () => {
    alert("Transfer Rp " + amount + " ke " + username);
    setUsername("");
    setAmount("");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Kirim Uang</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border px-4 py-2 w-full mb-4"
        placeholder="Username Penerima"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border px-4 py-2 w-full mb-4"
        placeholder="Jumlah"
      />
      <button onClick={handleTransfer} className="bg-yellow-500 text-white px-4 py-2 rounded">
        Kirim Uang
      </button>
    </div>
  );
}