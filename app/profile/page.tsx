// app/profile/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectToUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.replace(`/profile/${user.id}`);
      } else {
        router.replace("/"); // atau arahkan ke halaman login jika belum login
      }
    };

    redirectToUserProfile();
  }, [router]);

  return <p className="text-center mt-10">Mengalihkan ke halaman profil...</p>;
}
