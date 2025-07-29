// app/components/Navbar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/redeem", label: "Redeem" },
  { href: "/transfer", label: "Transfer" },
  { href: "/history", label: "Riwayat" },
];

interface Profile {
  username: string;
  avatar_url: string | null;
}

export default function Navbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
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

    getProfile();
  }, []);

  return (
    <nav className="w-full bg-white shadow-md px-4 py-2 flex justify-between items-center">
      <h1 className="font-bold text-xl text-blue-600">E-Wallet Simulator</h1>
      <div className="flex items-center space-x-6">
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

        {profile && (
          <Link href="/profile" className="flex items-center space-x-2">
            <Image
              src={
                profile.avatar_url ??
                `https://ui-avatars.com/api/?name=${profile.username}`
              }
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-sm font-medium text-gray-800">
              {profile.username}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
