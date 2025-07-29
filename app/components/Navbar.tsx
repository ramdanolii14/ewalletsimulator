"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

export default function Navbar() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    };

    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const avatarSrc = profile?.avatar_url
    ? profile.avatar_url
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile?.username ?? "U"
      )}&background=0D8ABC&color=fff&size=128`;

  return (
    <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">
        E-Wallet Sim
      </Link>

      <div className="relative">
        {profile && (
          <button onClick={toggleDropdown} className="focus:outline-none">
            <Image
              src={avatarSrc}
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full border-2 border-blue-500"
            />
          </button>
        )}

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
            <Link
              href={`/profile/${profile?.id}`}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Profil
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
