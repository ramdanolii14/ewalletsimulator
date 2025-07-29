// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/redeem", label: "Redeem" },
  { href: "/transfer", label: "Transfer" },
  { href: "/history", label: "Riwayat" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<{ username: string; avatar_url: string | null } | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      if (!error && data) setProfile(data);
    };
    fetchProfile();
  }, []);

  const avatar = profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.username ?? "U"}`;

  return (
    <nav className="w-full bg-white shadow px-8 py-3 flex justify-between items-center">
      <Link href="/">
        <h1 className="font-bold text-xl text-blue-600">E-Wallet Simulator</h1>
      </Link>
      <div className="flex space-x-6 items-center">
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition ${
                pathname === item.href ? "text-blue-600 underline" : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {profile && (
          <div className="relative">
            <button onClick={() => setOpenDropdown(!openDropdown)}>
              <Image
                src={avatar}
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full border"
              />
            </button>
            {openDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Profil Saya
                </Link>
                <Link
                  href="/redeem"
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Redeem Kode
                </Link>
                <Link
                  href="/transfer"
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Transfer Saldo
                </Link>
                <Link
                  href="/history"
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Riwayat
                </Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.refresh();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
