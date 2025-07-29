"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";

export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const checkProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        return router.replace("/");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        return router.replace("/profile/setup");
      }

      // Jika username kosong/null, arahkan ke halaman setup
      if (!profile.username || profile.username.trim() === "") {
        return router.replace("/profile/setup");
      }

      // Kalau semua aman, redirect ke halaman profile lengkap
      router.replace(`/profile/${user.id}`);
    };

    checkProfile();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-600">Memuat data profil...</p>
    </div>
  );
}
