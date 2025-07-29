// app/components/Navbar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/redeem", label: "Redeem" },
  { href: "/transfer", label: "Transfer" },
  { href: "/history", label: "Riwayat" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white shadow-md px-4 py-2 flex justify-between items-center">
      <h1 className="font-bold text-xl text-blue-600">E-Wallet Simulator</h1>
      <div className="flex space-x-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium ${
              pathname === item.href
                ? "text-blue-600 underline"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
