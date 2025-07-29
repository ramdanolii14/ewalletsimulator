import "./globals.css";

export const metadata = {
  title: "E-Wallet Simulator",
  description: "Simulasi dompet digital by Ramdan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
