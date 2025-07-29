export default function HistoryPage() {
  const dummyTransactions = [
    { type: "Kirim", name: "Budi", amount: -50000 },
    { type: "Terima", name: "Andi", amount: 100000 },
    { type: "Tarik", name: "Bank Mandiri", amount: -1000000 },
  ];

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Riwayat Transaksi</h2>
      <ul>
        {dummyTransactions.map((t, i) => (
          <li key={i} className="mb-2 p-2 border rounded">
            {t.type} ke/dari {t.name} -{" "}
            <span className={t.amount > 0 ? "text-green-600" : "text-red-600"}>
              Rp {Math.abs(t.amount).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}