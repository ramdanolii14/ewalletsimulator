"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

interface Profile {
  username: string;
  email: string;
  avatar_url: string | null;
  balance: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("username, email, avatar_url, balance")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile({ ...data, email: user.email ?? "" });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!profile) return <p className="p-6 text-center">Kamu belum login.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow text-center">
      <Image
        src={
          profile.avatar_url ??
          `https://ui-avatars.com/api/?name=${profile.username}`
        }
        alt="Avatar"
        width={100}
        height={100}
        className="rounded-full mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold">{profile.username}</h2>
      <p className="text-gray-600 mb-2">{profile.email}</p>
      <p className="font-semibold text-lg">
        Saldo: Rp{profile.balance.toLocaleString()}
      </p>
    </div>
  );
}
