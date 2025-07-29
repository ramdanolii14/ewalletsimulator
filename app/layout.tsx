import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "E-Wallet Simulator",
  description: "Simulasi e-wallet sederhana",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-100 text-gray-800">
        <Navbar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
