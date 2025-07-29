import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 font-sans">
        <header className="bg-white shadow p-4 mb-4 text-center text-xl font-semibold">E-Wallet Sim</header>
        {children}
      </body>
    </html>
  );
}